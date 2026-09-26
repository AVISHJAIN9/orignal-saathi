import {
  ArgumentsHost,
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  UnauthorizedException
} from '@nestjs/common';
import {
  AllExceptionsFilter
} from './all-exceptions.filter';

// Helper utility function to construct mock ArgumentsHost
function makeHost(
  overrides?: {
    method?: string;
    originalUrl?: string;
  }
) {

  const jsonMockFunction = jest.fn(
  );
  const statusMockFunction = jest.fn(
  ).mockReturnValue(
    {
      json: jsonMockFunction
    }
  );

  const responseMockObject = {
    status: statusMockFunction
  };

  let resolvedMethod = 'GET';
  if (
    overrides && overrides.method
  ) {
    resolvedMethod = overrides.method;
  } else {
    resolvedMethod = 'GET';
  }

  let resolvedOriginalUrl = '/conversations';
  if (
    overrides && overrides.originalUrl
  ) {
    resolvedOriginalUrl = overrides.originalUrl;
  } else {
    resolvedOriginalUrl = '/conversations';
  }

  const requestMockObject = {
    method: resolvedMethod,
    originalUrl: resolvedOriginalUrl
  };

  const hostMockInstance = {
    switchToHttp: (
    ) => (
      {
        getResponse: (
        ) => responseMockObject,
        getRequest: (
        ) => requestMockObject
      }
    )
  } as unknown as ArgumentsHost;

  return {
    host: hostMockInstance,
    status: statusMockFunction,
    json: jsonMockFunction
  };

}

describe(
  'AllExceptionsFilter',
  (
  ) => {

    let filterInstance: AllExceptionsFilter;

    beforeEach(
      (
      ) => {

        jest.clearAllMocks(
        );
        filterInstance = new AllExceptionsFilter(
        );

      }
    );

    it(
      'uses the HttpException status code and message verbatim',
      (
      ) => {

        const {
          host,
          status,
          json
        } = makeHost(
        );

        filterInstance.catch(
          new BadRequestException(
            'Invalid or expired cursor'
          ),
          host
        );

        expect(
          status
        ).toHaveBeenCalledWith(
          HttpStatus.BAD_REQUEST
        );

        expect(
          json
        ).toHaveBeenCalledWith(
          expect.objectContaining(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Invalid or expired cursor',
              path: '/conversations'
            }
          )
        );

      }
    );

    it(
      'handles 401 Unauthorized exceptions cleanly',
      (
      ) => {

        const {
          host,
          status,
          json
        } = makeHost(
        );

        filterInstance.catch(
          new UnauthorizedException(
            'Invalid token'
          ),
          host
        );

        expect(
          status
        ).toHaveBeenCalledWith(
          HttpStatus.UNAUTHORIZED
        );

        expect(
          json
        ).toHaveBeenCalledWith(
          expect.objectContaining(
            {
              statusCode: HttpStatus.UNAUTHORIZED,
              message: 'Invalid token',
              path: '/conversations'
            }
          )
        );

      }
    );

    it(
      'handles 403 Forbidden exceptions cleanly',
      (
      ) => {

        const {
          host,
          status,
          json
        } = makeHost(
        );

        filterInstance.catch(
          new ForbiddenException(
            'Access denied'
          ),
          host
        );

        expect(
          status
        ).toHaveBeenCalledWith(
          HttpStatus.FORBIDDEN
        );

        expect(
          json
        ).toHaveBeenCalledWith(
          expect.objectContaining(
            {
              statusCode: HttpStatus.FORBIDDEN,
              message: 'Access denied',
              path: '/conversations'
            }
          )
        );

      }
    );

    it(
      'formats unhandled non-HttpException errors as a safe 500 without leaking raw details',
      (
      ) => {

        const {
          host,
          status,
          json
        } = makeHost(
        );

        filterInstance.catch(
          new Error(
            'raw internal detail that must not reach the client'
          ),
          host
        );

        expect(
          status
        ).toHaveBeenCalledWith(
          HttpStatus.INTERNAL_SERVER_ERROR
        );

        expect(
          json
        ).toHaveBeenCalledWith(
          expect.objectContaining(
            {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              message: 'Internal server error',
              path: '/conversations'
            }
          )
        );

      }
    );

  }
);