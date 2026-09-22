import {
  Provider
} from '@nestjs/common';
import {
  ConfigService
} from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export const MAIL_TRANSPORT = Symbol(
  'MAIL_TRANSPORT'
);

// SMTP transport configuration provider
export const mailTransportProvider: Provider = {
  provide: MAIL_TRANSPORT,
  inject: [
    ConfigService
  ],
  useFactory: (
    configurationService: ConfigService
  ) => {

    const smtpHost = configurationService.get<
      string
    >(
      'SMTP_HOST'
    );
    const smtpPort = configurationService.get<
      number
    >(
      'SMTP_PORT',
      587
    );
    const smtpSecureString = configurationService.get<
      string
    >(
      'SMTP_SECURE',
      'false'
    );

    return nodemailer.createTransport(
      {
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecureString === 'true',
        auth: {
          user: configurationService.get<
            string
          >(
            'SMTP_USER'
          ),
          pass: configurationService.get<
            string
          >(
            'SMTP_PASS'
          )
        }
      }
    );

  }
};
