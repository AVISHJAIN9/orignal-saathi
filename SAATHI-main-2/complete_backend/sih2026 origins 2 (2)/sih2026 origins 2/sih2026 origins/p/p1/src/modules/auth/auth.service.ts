import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

import { User, UserRole } from './entities/user.entity';
import {
  LoginDto,
  AnonymousLoginDto,
  RegisterUserDto,
  AuthResponseDto,
  SanitizedUser,
} from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Securely hash a plain text password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compare a plain text password with a bcrypt hash
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    if (!password || !hash) return false;
    return bcrypt.compare(password, hash);
  }

  /**
   * Validate user credentials against the database
   */
  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username: username.trim().toLowerCase() },
    });

    if (!user || !user.password_hash) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isMatch = await this.comparePassword(pass, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return user;
  }

  /**
   * Authenticate registered user (Admin / Industry / Public) and issue JWT
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      isAnonymous: false,
    };

    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '7d');
    const token = this.jwtService.sign(payload, { expiresIn });

    const sanitizedUser: SanitizedUser = {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      isAnonymous: false,
    };

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: expiresIn,
      user: sanitizedUser,
    };
  }

  /**
   * Issue a scoped lightweight JWT for anonymous public chat users
   */
  async loginAnonymous(dto?: AnonymousLoginDto): Promise<AuthResponseDto> {
    const anonymousId = randomUUID();
    const shortId = anonymousId.substring(0, 8);
    const username = `anon_${shortId}`;

    const payload: JwtPayload = {
      sub: anonymousId,
      username,
      role: UserRole.PUBLIC,
      isAnonymous: true,
    };

    const expiresIn = this.configService.get<string>(
      'JWT_ANON_EXPIRES_IN',
      '24h',
    );
    const token = this.jwtService.sign(payload, { expiresIn });

    const sanitizedUser: SanitizedUser = {
      id: anonymousId,
      username,
      role: UserRole.PUBLIC,
      isAnonymous: true,
    };

    this.logger.log(
      `Issued anonymous session for user [${anonymousId}] - Device: ${dto?.device_id || 'unspecified'}`,
    );

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: expiresIn,
      user: sanitizedUser,
    };
  }

  /**
   * Register a new user account (Industry / Admin / Public)
   */
  async register(registerDto: RegisterUserDto): Promise<AuthResponseDto> {
    const normalizedUsername = registerDto.username.trim().toLowerCase();

    const existingUser = await this.userRepository.findOne({
      where: { username: normalizedUsername },
    });

    if (existingUser) {
      throw new ConflictException(`Username '${registerDto.username}' is already taken`);
    }

    const hashedPassword = await this.hashPassword(registerDto.password);

    const user = this.userRepository.create({
      username: normalizedUsername,
      password_hash: hashedPassword,
      role: registerDto.role || UserRole.PUBLIC,
      email: registerDto.email,
    });

    const savedUser = await this.userRepository.save(user);

    const payload: JwtPayload = {
      sub: savedUser.id,
      username: savedUser.username,
      role: savedUser.role,
      isAnonymous: false,
    };

    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '7d');
    const token = this.jwtService.sign(payload, { expiresIn });

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: expiresIn,
      user: {
        id: savedUser.id,
        username: savedUser.username,
        role: savedUser.role,
        email: savedUser.email,
        isAnonymous: false,
      },
    };
  }

  /**
   * Get user profile by ID
   */
  async findById(id: string): Promise<SanitizedUser> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      isAnonymous: false,
    };
  }
}
