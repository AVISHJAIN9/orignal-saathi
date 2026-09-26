import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AuthService } from '../src/modules/auth/auth.service';
import { User, UserRole } from '../src/modules/auth/entities/user.entity';

describe('AuthService (Unit Tests)', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<Repository<User>>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    username: 'admin_test',
    password_hash: '',
    role: UserRole.ADMIN,
    email: 'admin@bis.gov.in',
    metadata: {},
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeAll(async () => {
    // Generate actual bcrypt hash for testing comparison
    mockUser.password_hash = await bcrypt.hash('validSecretPass123', 10);
  });

  beforeEach(async () => {
    const mockUserRepositoryFactory = () => ({
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    });

    const mockJwtServiceFactory = () => ({
      sign: jest.fn().mockReturnValue('mock.jwt.token'),
      verify: jest.fn(),
    });

    const mockConfigServiceFactory = () => ({
      get: jest.fn((key: string, defaultValue?: any) => {
        const configMap: Record<string, any> = {
          JWT_SECRET: 'test_jwt_secret_key',
          JWT_EXPIRES_IN: '7d',
          JWT_ANON_EXPIRES_IN: '24h',
        };
        return configMap[key] ?? defaultValue;
      }),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepositoryFactory,
        },
        {
          provide: JwtService,
          useFactory: mockJwtServiceFactory,
        },
        {
          provide: ConfigService,
          useFactory: mockConfigServiceFactory,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Password Hashing & Verification', () => {
    it('should hash a password and produce a valid bcrypt hash', async () => {
      const rawPassword = 'mySecurePassword456';
      const hash = await service.hashPassword(rawPassword);

      expect(hash).toBeDefined();
      expect(hash).not.toEqual(rawPassword);
      expect(hash.startsWith('$2b$') || hash.startsWith('$2a$')).toBe(true);

      const isValid = await bcrypt.compare(rawPassword, hash);
      expect(isValid).toBe(true);
    });

    it('should compare valid password with hash correctly', async () => {
      const rawPassword = 'validSecretPass123';
      const isMatch = await service.comparePassword(
        rawPassword,
        mockUser.password_hash,
      );
      expect(isMatch).toBe(true);
    });

    it('should return false when comparing incorrect password', async () => {
      const isMatch = await service.comparePassword(
        'wrongPassword999',
        mockUser.password_hash,
      );
      expect(isMatch).toBe(false);
    });
  });

  describe('validateUser', () => {
    it('should return user when credentials match', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser(
        'admin_test',
        'validSecretPass123',
      );

      expect(result).toBeDefined();
      expect(result.id).toEqual(mockUser.id);
      expect(result.username).toEqual(mockUser.username);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'admin_test' },
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.validateUser('nonexistent', 'somePassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.validateUser('admin_test', 'wrongPass'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should issue a signed JWT access token for registered users', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.login({
        username: 'admin_test',
        password: 'validSecretPass123',
      });

      expect(result).toBeDefined();
      expect(result.access_token).toEqual('mock.jwt.token');
      expect(result.token_type).toEqual('Bearer');
      expect(result.user.id).toEqual(mockUser.id);
      expect(result.user.role).toEqual(UserRole.ADMIN);
      expect(result.user.isAnonymous).toBe(false);

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: mockUser.id,
          username: mockUser.username,
          role: UserRole.ADMIN,
          isAnonymous: false,
        }),
        expect.objectContaining({ expiresIn: '7d' }),
      );
    });
  });

  describe('loginAnonymous', () => {
    it('should issue a scoped JWT access token for anonymous users', async () => {
      const result = await service.loginAnonymous({
        device_id: 'client-browser-uuid-123',
      });

      expect(result).toBeDefined();
      expect(result.access_token).toEqual('mock.jwt.token');
      expect(result.token_type).toEqual('Bearer');
      expect(result.user.role).toEqual(UserRole.PUBLIC);
      expect(result.user.isAnonymous).toBe(true);
      expect(result.user.username.startsWith('anon_')).toBe(true);

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          role: UserRole.PUBLIC,
          isAnonymous: true,
        }),
        expect.objectContaining({ expiresIn: '24h' }),
      );
    });
  });

  describe('register', () => {
    it('should register a new user and return auth token', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const newUser: User = {
        id: 'new-uuid-9876',
        username: 'industry_officer',
        password_hash: 'hashed_pwd',
        role: UserRole.INDUSTRY,
        email: 'officer@steel.in',
        created_at: new Date(),
        updated_at: new Date(),
      };

      userRepository.create.mockReturnValue(newUser);
      userRepository.save.mockResolvedValue(newUser);

      const result = await service.register({
        username: 'industry_officer',
        password: 'Password123!',
        role: UserRole.INDUSTRY,
        email: 'officer@steel.in',
      });

      expect(result).toBeDefined();
      expect(result.access_token).toEqual('mock.jwt.token');
      expect(result.user.username).toEqual('industry_officer');
      expect(result.user.role).toEqual(UserRole.INDUSTRY);
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if username already exists', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.register({
          username: 'admin_test',
          password: 'Password123!',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
