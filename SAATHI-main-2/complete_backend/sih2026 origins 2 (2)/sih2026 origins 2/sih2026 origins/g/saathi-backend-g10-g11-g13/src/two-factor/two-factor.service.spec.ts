import {
  Test
} from '@nestjs/testing';
import {
  BadRequestException
} from '@nestjs/common';
import * as otplib from 'otplib';
import {
  TwoFactorService
} from './two-factor.service';
import {
  TWO_FACTOR_PORT
} from '../common/ports/two-factor.port';

describe(
  'TwoFactorService',
  (
  ) => {

    let twoFactorServiceInstance: TwoFactorService;

    const twoFactorPortMock = {
      getState: jest.fn(
      ),
      setPendingSecret: jest.fn(
        async (
        ) => undefined
      ),
      enable: jest.fn(
        async (
        ) => undefined
      ),
      disable: jest.fn(
        async (
        ) => undefined
      ),
      consumeBackupCode: jest.fn(
        async (
        ) => undefined
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
              TwoFactorService,
              {
                provide: TWO_FACTOR_PORT,
                useValue: twoFactorPortMock
              }
            ]
          }
        ).compile(
        );

        twoFactorServiceInstance = testingModuleRef.get<
          TwoFactorService
        >(
          TwoFactorService
        );

      }
    );

    it(
      'returns setup secrets and valid otpauth URI',
      async (
      ) => {

        const setupResult = await twoFactorServiceInstance.setup(
          'user-1',
          'admin@saathi.gov.in'
        );

        expect(
          setupResult.secret
        ).toBeDefined(
        );
        expect(
          setupResult.otpauthUri
        ).toContain(
          'otpauth://totp/'
        );
        expect(
          twoFactorPortMock.setPendingSecret
        ).toHaveBeenCalledWith(
          'user-1',
          setupResult.secret
        );

      }
    );

    it(
      'rejects enable when no pending setup exists',
      async (
      ) => {

        twoFactorPortMock.getState.mockResolvedValue(
          {
            enabled: false,
            pendingSecret: null,
            confirmedSecret: null,
            backupCodeHashes: [
            ]
          }
        );

        await expect(
          twoFactorServiceInstance.enable(
            'user-1',
            '123456'
          )
        ).rejects.toThrow(
          BadRequestException
        );

      }
    );

    it(
      'enables 2FA and returns 10 backup codes when code is valid',
      async (
      ) => {

        const generatedSecret = otplib.generateSecret(
        );
        const validToken = otplib.generateSync(
          {
            secret: generatedSecret
          }
        );

        twoFactorPortMock.getState.mockResolvedValue(
          {
            enabled: false,
            pendingSecret: generatedSecret,
            confirmedSecret: null,
            backupCodeHashes: [
            ]
          }
        );

        const enableResult = await twoFactorServiceInstance.enable(
          'user-1',
          validToken
        );

        expect(
          enableResult.backupCodes
        ).toHaveLength(
          10
        );
        expect(
          twoFactorPortMock.enable
        ).toHaveBeenCalled(
        );

      }
    );

    it(
      'verifies login code via TOTP or valid backup code',
      async (
      ) => {

        const generatedSecret = otplib.generateSecret(
        );
        const validToken = otplib.generateSync(
          {
            secret: generatedSecret
          }
        );

        twoFactorPortMock.getState.mockResolvedValue(
          {
            enabled: true,
            pendingSecret: null,
            confirmedSecret: generatedSecret,
            backupCodeHashes: [
            ]
          }
        );

        const isValid = await twoFactorServiceInstance.verifyLoginCode(
          'user-1',
          validToken
        );

        expect(
          isValid
        ).toBe(
          true
        );

      }
    );

  }
);
