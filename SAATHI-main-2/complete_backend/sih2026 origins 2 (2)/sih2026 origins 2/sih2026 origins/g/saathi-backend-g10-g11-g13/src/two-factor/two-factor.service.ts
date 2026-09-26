import {
  BadRequestException,
  Inject,
  Injectable,
  Logger
} from '@nestjs/common';
import {
  generateSecret,
  generateURI,
  verifySync
} from 'otplib';
import {
  randomBytes,
  createHash
} from 'crypto';
import to from 'await-to-js';
import {
  TWO_FACTOR_PORT,
  TwoFactorPort
} from '../common/ports/two-factor.port';

const BACKUP_CODE_COUNT = 10;
const BACKUP_CODE_LENGTH = 8;
const ISSUER = 'SAATHI';

@Injectable(
)
export class TwoFactorService {

  private readonly logger = new Logger(
    TwoFactorService.name
  );

  constructor(
    @Inject(
      TWO_FACTOR_PORT
    )
    private readonly twoFactorPort: TwoFactorPort
  ) {

  }

  async status(
    userIdString: string
  ): Promise<
    {
      enabled: boolean;
    }
  > {

    const [
      fetchError,
      twoFactorStateRecord
    ] = await to(
      this.twoFactorPort.getState(
        userIdString
      )
    );

    if (
      fetchError || !twoFactorStateRecord
    ) {
      throw fetchError;
    }

    return {
      enabled: twoFactorStateRecord.enabled
    };

  }

  // Step 1: generate secret and return otpauth URI for QR code
  async setup(
    userIdString: string,
    accountLabelString: string
  ): Promise<
    {
      secret: string;
      otpauthUri: string;
    }
  > {

    const generatedSecret = generateSecret(
    );

    const [
      setError
    ] = await to(
      this.twoFactorPort.setPendingSecret(
        userIdString,
        generatedSecret
      )
    );

    if (
      setError
    ) {
      this.logger.error(
        `Failed to set pending secret for user ${userIdString}`
      );
      throw setError;
    }

    const generatedOtpauthUri = generateURI(
      {
        issuer: ISSUER,
        label: accountLabelString,
        secret: generatedSecret
      }
    );

    return {
      secret: generatedSecret,
      otpauthUri: generatedOtpauthUri
    };

  }

  // Step 2: confirm code, enable 2FA and return one-time backup codes
  async enable(
    userIdString: string,
    verificationCodeString: string
  ): Promise<
    {
      backupCodes: string[];
    }
  > {

    const [
      fetchError,
      twoFactorStateRecord
    ] = await to(
      this.twoFactorPort.getState(
        userIdString
      )
    );

    if (
      fetchError || !twoFactorStateRecord
    ) {
      throw fetchError;
    }

    if (
      !twoFactorStateRecord.pendingSecret
    ) {
      throw new BadRequestException(
        'No pending 2FA setup found — call setup first.'
      );
    }

    const verificationResult = verifySync(
      {
        token: verificationCodeString,
        secret: twoFactorStateRecord.pendingSecret
      }
    );

    if (
      !verificationResult?.valid
    ) {
      throw new BadRequestException(
        'Invalid code.'
      );
    }

    const generatedBackupCodesList = this.generateBackupCodes(
    );
    const backupCodeHashesList = generatedBackupCodesList.map(
      (
        codeItem
      ) => this.hashCode(
        codeItem
      )
    );

    const [
      enableError
    ] = await to(
      this.twoFactorPort.enable(
        userIdString,
        twoFactorStateRecord.pendingSecret,
        backupCodeHashesList
      )
    );

    if (
      enableError
    ) {
      this.logger.error(
        `Failed to enable 2FA for user ${userIdString}`
      );
      throw enableError;
    }

    return {
      backupCodes: generatedBackupCodesList
    };

  }

  async disable(
    userIdString: string,
    verificationCodeString: string
  ): Promise<
    {
      message: string;
    }
  > {

    const [
      fetchError,
      twoFactorStateRecord
    ] = await to(
      this.twoFactorPort.getState(
        userIdString
      )
    );

    if (
      fetchError || !twoFactorStateRecord
    ) {
      throw fetchError;
    }

    if (
      !twoFactorStateRecord.enabled || !twoFactorStateRecord.confirmedSecret
    ) {
      throw new BadRequestException(
        '2FA is not enabled.'
      );
    }

    const totpVerificationResult = verifySync(
      {
        token: verificationCodeString,
        secret: twoFactorStateRecord.confirmedSecret
      }
    );
    const isValidTotp = Boolean(
      totpVerificationResult?.valid
    );

    const computedCodeHash = this.hashCode(
      verificationCodeString
    );
    const isValidBackupCode = twoFactorStateRecord.backupCodeHashes.includes(
      computedCodeHash
    );

    if (
      !isValidTotp && !isValidBackupCode
    ) {
      throw new BadRequestException(
        'Invalid code.'
      );
    }

    const [
      disableError
    ] = await to(
      this.twoFactorPort.disable(
        userIdString
      )
    );

    if (
      disableError
    ) {
      this.logger.error(
        `Failed disabling 2FA for user ${userIdString}`
      );
      throw disableError;
    }

    return {
      message: '2FA disabled.'
    };

  }

  async verifyLoginCode(
    userIdString: string,
    verificationCodeString: string
  ): Promise<
    boolean
  > {

    const [
      fetchError,
      twoFactorStateRecord
    ] = await to(
      this.twoFactorPort.getState(
        userIdString
      )
    );

    if (
      fetchError || !twoFactorStateRecord
    ) {
      return false;
    }

    if (
      !twoFactorStateRecord.enabled || !twoFactorStateRecord.confirmedSecret
    ) {
      return true;
    }

    const totpVerificationResult = verifySync(
      {
        token: verificationCodeString,
        secret: twoFactorStateRecord.confirmedSecret
      }
    );

    if (
      totpVerificationResult?.valid
    ) {
      return true;
    }

    const computedCodeHash = this.hashCode(
      verificationCodeString
    );

    if (
      twoFactorStateRecord.backupCodeHashes.includes(
        computedCodeHash
      )
    ) {
      await to(
        this.twoFactorPort.consumeBackupCode(
          userIdString,
          computedCodeHash
        )
      );
      return true;
    }

    return false;

  }

  private generateBackupCodes(
  ): string[] {

    return Array.from(
      {
        length: BACKUP_CODE_COUNT
      },
      (
      ) => randomBytes(
        BACKUP_CODE_LENGTH
      ).toString(
        'hex'
      ).slice(
        0,
        BACKUP_CODE_LENGTH
      ).toUpperCase(
      )
    );

  }

  private hashCode(
    rawCodeString: string
  ): string {

    return createHash(
      'sha256'
    ).update(
      rawCodeString
    ).digest(
      'hex'
    );

  }

}
