import {
  BadRequestException,
  Inject,
  Injectable,
  Logger
} from '@nestjs/common';
import {
  InjectRepository
} from '@nestjs/typeorm';
import {
  LessThan,
  Repository
} from 'typeorm';
import {
  randomBytes,
  createHash
} from 'crypto';
import * as bcrypt from 'bcrypt';
import {
  ConfigService
} from '@nestjs/config';
import to from 'await-to-js';
import {
  PasswordResetToken
} from './password-reset-token.entity';
import {
  USERS_PORT,
  UsersPort
} from '../common/ports/users.port';
import {
  EmailService
} from '../email/email.service';
import {
  EmailTemplateName
} from '../email/email-log.entity';

const RESET_TOKEN_TTL_MINUTES = 30;
const BCRYPT_ROUNDS = 12;

@Injectable(
)
export class PasswordResetService {

  private readonly logger = new Logger(
    PasswordResetService.name
  );

  constructor(
    @InjectRepository(
      PasswordResetToken
    )
    private readonly tokenRepository: Repository<
      PasswordResetToken
    >,
    @Inject(
      USERS_PORT
    )
    private readonly usersPort: UsersPort,
    private readonly emailService: EmailService,
    private readonly configurationService: ConfigService
  ) {

  }

  // Generates password reset token and dispatches reset instructions
  async requestReset(
    emailAddressString: string
  ): Promise<
    {
      message: string;
    }
  > {

    const [
      userLookupError,
      foundUserRecord
    ] = await to(
      this.usersPort.findByEmail(
        emailAddressString
      )
    );

    if (
      userLookupError
    ) {
      this.logger.error(
        `Error looking up user by email ${emailAddressString}`
      );
    }

    if (
      foundUserRecord
    ) {
      await to(
        this.tokenRepository.createQueryBuilder(
        ).update(
          PasswordResetToken
        ).set(
          {
            usedAt: (
            ) => 'now()'
          }
        ).where(
          'user_id = :userId AND used_at IS NULL',
          {
            userId: foundUserRecord.id
          }
        ).execute(
        )
      );

      const generatedRawToken = randomBytes(
        32
      ).toString(
        'hex'
      );
      const generatedTokenHash = this.hashToken(
        generatedRawToken
      );
      const calculatedExpiresAt = new Date(
        Date.now(
        ) + RESET_TOKEN_TTL_MINUTES * 60000
      );

      const newTokenEntity = this.tokenRepository.create(
        {
          userId: foundUserRecord.id,
          tokenHash: generatedTokenHash,
          expiresAt: calculatedExpiresAt
        }
      );

      const [
        saveTokenError
      ] = await to(
        this.tokenRepository.save(
          newTokenEntity
        )
      );

      if (
        saveTokenError
      ) {
        this.logger.error(
          `Failed saving reset token for user ${foundUserRecord.id}`
        );
      }

      const applicationBaseUrl = this.configurationService.get<
        string
      >(
        'APP_BASE_URL',
        'https://saathi.example.gov.in'
      );
      const fullResetLinkUrl = `${applicationBaseUrl}/reset-password?token=${generatedRawToken}`;

      await to(
        this.emailService.enqueue(
          foundUserRecord.email,
          {
            template: EmailTemplateName.PASSWORD_RESET,
            data: {
              resetLink: fullResetLinkUrl,
              expiresInMinutes: RESET_TOKEN_TTL_MINUTES
            }
          }
        )
      );
    }

    return {
      message: 'If an account exists for that email, a reset link has been sent.'
    };

  }

  // Confirms password reset token and updates password hash
  async confirmReset(
    rawTokenString: string,
    newPasswordPlaintext: string
  ): Promise<
    {
      message: string;
    }
  > {

    const computedTokenHash = this.hashToken(
      rawTokenString
    );

    const [
      lookupError,
      tokenRecord
    ] = await to(
      this.tokenRepository.findOne(
        {
          where: {
            tokenHash: computedTokenHash
          }
        }
      )
    );

    if (
      lookupError
    ) {
      throw lookupError;
    }

    if (
      !tokenRecord || tokenRecord.usedAt || tokenRecord.expiresAt < new Date(
      )
    ) {
      throw new BadRequestException(
        'Reset link is invalid or has expired.'
      );
    }

    const [
      hashError,
      hashedPasswordString
    ] = await to(
      bcrypt.hash(
        newPasswordPlaintext,
        BCRYPT_ROUNDS
      )
    );

    if (
      hashError || !hashedPasswordString
    ) {
      this.logger.error(
        'Failed to hash new password'
      );
      throw hashError;
    }

    const [
      updateUserError
    ] = await to(
      this.usersPort.updatePasswordHash(
        tokenRecord.userId,
        hashedPasswordString
      )
    );

    if (
      updateUserError
    ) {
      this.logger.error(
        `Failed updating password for user ${tokenRecord.userId}`
      );
      throw updateUserError;
    }

    tokenRecord.usedAt = new Date(
    );

    await to(
      this.tokenRepository.save(
        tokenRecord
      )
    );

    return {
      message: 'Password updated. You can now log in with your new password.'
    };

  }

  // Purges expired reset tokens from database
  async purgeExpired(
  ): Promise<
    number
  > {

    const [
      deleteError,
      deleteResultRecord
    ] = await to(
      this.tokenRepository.delete(
        {
          expiresAt: LessThan(
            new Date(
            )
          )
        }
      )
    );

    if (
      deleteError || !deleteResultRecord
    ) {
      this.logger.error(
        'Failed purging expired reset tokens'
      );
      throw deleteError;
    }

    let affectedDeletedCount = 0;
    if (
      deleteResultRecord.affected
    ) {
      affectedDeletedCount = deleteResultRecord.affected;
    } else {
      affectedDeletedCount = 0;
    }

    return affectedDeletedCount;

  }

  private hashToken(
    rawTokenString: string
  ): string {

    return createHash(
      'sha256'
    ).update(
      rawTokenString
    ).digest(
      'hex'
    );

  }

}
