import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import type {
  Request,
  Response
} from 'express';

// Interface defining standardized error response contract across the API
export interface ErrorResponseBody {

  statusCode: number;
  path: string;
  timestamp: string;
  message: string | string[];
  error?: string;
  [
    key: string
  ]: unknown;

}

// Global Exception Filter capturing all thrown exceptions
@Catch(
)
export class AllExceptionsFilter implements ExceptionFilter {

  private readonly logger = new Logger(
    AllExceptionsFilter.name
  );

  catch(
    exception: unknown,
    host: ArgumentsHost
  ): void {

    const executionContext = host.switchToHttp(
    );
    const httpResponse = executionContext.getResponse<
      Response
    >(
    );
    const httpRequest = executionContext.getRequest<
      Request
    >(
    );

    let httpStatusCode: number;
    let rawErrorResponse: string | object;

    if (
      exception instanceof HttpException
    ) {
      httpStatusCode = exception.getStatus(
      );
      rawErrorResponse = exception.getResponse(
      );

      let serializedErrorPayload = '';
      if (
        typeof rawErrorResponse === 'string'
      ) {
        serializedErrorPayload = rawErrorResponse;
      } else {
        serializedErrorPayload = JSON.stringify(
          rawErrorResponse
        );
      }

      if (
        httpStatusCode >= 400 && httpStatusCode < 500
      ) {
        this.logger.warn(
          `[${httpRequest.method}] ${httpRequest.originalUrl} -> ${httpStatusCode} (${serializedErrorPayload})`
        );
      }

      if (
        httpStatusCode >= 500
      ) {
        this.logger.error(
          `[${httpRequest.method}] ${httpRequest.originalUrl} -> ${httpStatusCode}`,
          exception.stack
        );
      }
    } else {
      httpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      rawErrorResponse = 'Internal server error';

      let capturedErrorDetail = '';
      if (
        exception instanceof Error
      ) {
        if (
          exception.stack
        ) {
          capturedErrorDetail = exception.stack;
        } else {
          capturedErrorDetail = exception.message;
        }
      } else {
        capturedErrorDetail = String(
          exception
        );
      }

      this.logger.error(
        `Unhandled Exception on [${httpRequest.method}] ${httpRequest.originalUrl}`,
        capturedErrorDetail
      );
    }

    let parsedBodyObject: Record<
      string,
      unknown
    >;

    if (
      typeof rawErrorResponse === 'string'
    ) {
      parsedBodyObject = {
        message: rawErrorResponse
      };
    } else if (
      typeof rawErrorResponse === 'object' && rawErrorResponse !== null
    ) {
      parsedBodyObject = rawErrorResponse as Record<
        string,
        unknown
      >;
    } else {
      parsedBodyObject = {
        message: 'An unexpected error occurred'
      };
    }

    let resolvedErrorMessage: string | string[] = 'Internal server error';
    if (
      parsedBodyObject.message
    ) {
      resolvedErrorMessage = parsedBodyObject.message as string | string[];
    } else {
      resolvedErrorMessage = 'Internal server error';
    }

    const finalResponseBodyPayload: ErrorResponseBody = {
      statusCode: httpStatusCode,
      path: httpRequest.originalUrl,
      timestamp: new Date(
      ).toISOString(
      ),
      message: resolvedErrorMessage,
      ...parsedBodyObject
    };

    httpResponse.status(
      httpStatusCode
    ).json(
      finalResponseBodyPayload
    );

  }

}