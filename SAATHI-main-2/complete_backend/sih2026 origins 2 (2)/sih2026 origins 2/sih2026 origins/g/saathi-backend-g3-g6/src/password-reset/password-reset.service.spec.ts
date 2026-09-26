import {
  Test
} from '@nestjs/testing';
import {
  getRepositoryToken
} from '@nestjs/typeorm';
import {
  ConfigService
} from '@nestjs/config';
import {
  BadRequestException
} from '@nestjs/common';
import {
  PasswordResetService
} from './password-reset.service';
import {
  PasswordResetToken
} from './password-reset-token.entity';
import {
  USERS_PORT
} from '../common/ports/users.port';
import {
  EmailService
} from '../email/email.service';

describe(
  'PasswordResetService',
  (
  ) => {

    let passwordResetServiceInstance: PasswordResetService;

    const tokenRepositoryMock = {
      createQueryBuilder: jest.fn(
        (
        ) => (
          {
            update: jest.fn(
            ).mockReturnThis(
            ),
            set: jest.fn(
            ).mockReturnThis(
            ),
            where: jest.fn(
            ).mockReturnThis(
            ),
            execute: jest.fn(
            ).mockResolvedValue(
              {
              }
            )
          }
        )
      ),
      create: jest.fn(
        (
          entityValues
        ) => entityValues
      ),
      save: jest.fn(
        (
          entityValues
        ) => Promise.resolve(
          {
            id: 'token-id',
            ...entityValues
          }
        )
      ),
      findOne: jest.fn(
      ),
      delete: jest.fn(
      )
    };

    const usersPortMock = {
      findByEmail: jest.fn(
      ),
      findById: jest.fn(
      ),
      updatePasswordHash: jest.fn(
        async (
        ) => undefined
      )
    };

    const emailServiceMock = {
      enqueue: jest.fn(
        async (
        ) => (
          {
            id: 'mock-log-id'
          } as any
        )
      )
    };

    beforeEach(
      async (
      ) => {

        jest.clearAllMocks(
        );

        const testingModuleRef = await Test.createTestingModule(
          {
            providers: [
              PasswordResetService,
              {
                provide: getRepositoryToken(
                  PasswordResetToken
                ),
                useValue: tokenRepositoryMock
              },
              {
                provide: USERS_PORT,
                useValue: usersPortMock
              },
              {
                provide: EmailService,
                useValue: emailServiceMock
              },
              {
                provide: ConfigService,
                useValue: {
                  get: (
                  ) => 'https://saathi.example.gov.in'
                }
              }
            ]
          }
        ).compile(
        );

        passwordResetServiceInstance = testingModuleRef.get<
          PasswordResetService
        >(
          PasswordResetService
        );

      }
    );

    it(
      'does not reveal whether the email exists',
      async (
      ) => {

        usersPortMock.findByEmail.mockResolvedValue(
          null
        );

        const resetResult = await passwordResetServiceInstance.requestReset(
          'nobody@example.com'
        );

        expect(
          resetResult.message
        ).toMatch(
          /if an account exists/i
        );
        expect(
          emailServiceMock.enqueue
        ).not.toHaveBeenCalled(
        );

      }
    );

    it(
      'issues a token and enqueues an email when the user exists',
      async (
      ) => {

        usersPortMock.findByEmail.mockResolvedValue(
          {
            id: 'user-1',
            email: 'a@b.com'
          }
        );

        await passwordResetServiceInstance.requestReset(
          'a@b.com'
        );

        expect(
          tokenRepositoryMock.save
        ).toHaveBeenCalled(
        );
        expect(
          emailServiceMock.enqueue
        ).toHaveBeenCalledWith(
          'a@b.com',
          expect.objectContaining(
            {
              template: 'password_reset'
            }
          )
        );

      }
    );

    it(
      'rejects an expired token',
      async (
      ) => {

        tokenRepositoryMock.findOne.mockResolvedValue(
          {
            userId: 'user-1',
            usedAt: null,
            expiresAt: new Date(
              Date.now(
              ) - 1000
            )
          }
        );

        await expect(
          passwordResetServiceInstance.confirmReset(
            'raw-token',
            'NewPassw0rd'
          )
        ).rejects.toThrow(
          BadRequestException
        );

      }
    );

    it(
      'rejects an already-used token',
      async (
      ) => {

        tokenRepositoryMock.findOne.mockResolvedValue(
          {
            userId: 'user-1',
            usedAt: new Date(
            ),
            expiresAt: new Date(
              Date.now(
              ) + 60000
            )
          }
        );

        await expect(
          passwordResetServiceInstance.confirmReset(
            'raw-token',
            'NewPassw0rd'
          )
        ).rejects.toThrow(
          BadRequestException
        );

      }
    );

    it(
      'updates the password hash and marks the token used on success',
      async (
      ) => {

        const tokenRecord = {
          userId: 'user-1',
          usedAt: null,
          expiresAt: new Date(
            Date.now(
            ) + 60000
          )
        };

        tokenRepositoryMock.findOne.mockResolvedValue(
          tokenRecord
        );

        await passwordResetServiceInstance.confirmReset(
          'raw-token',
          'NewPassw0rd'
        );

        expect(
          usersPortMock.updatePasswordHash
        ).toHaveBeenCalledWith(
          'user-1',
          expect.any(
            String
          )
        );
        expect(
          tokenRecord.usedAt
        ).not.toBeNull(
        );

      }
    );

  }
);
