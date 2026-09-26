import to from 'await-to-js';
import {
  decodeCursor,
  encodeCursor
} from './cursor.util';

describe(
  'cursor.util',
  (
  ) => {

    describe(
      'encodeCursor / decodeCursor round trip',
      (
      ) => {

        it(
          'recovers the exact updatedAt and id that were encoded',
          async (
          ) => {

            const originalCursorData = {
              updatedAt: new Date(
                '2026-08-20T12:34:56.789Z'
              ),
              id: 'a1111111-1111-4111-8111-111111111111'
            };

            const encodedCursorString = encodeCursor(
              originalCursorData
            );
            const [
              decodeError,
              decodedCursorResult
            ] = await to(
              decodeCursor(
                encodedCursorString
              )
            );

            expect(
              decodeError
            ).toBeNull(
            );
            expect(
              decodedCursorResult?.id
            ).toBe(
              originalCursorData.id
            );
            expect(
              decodedCursorResult?.updatedAt.getTime(
              )
            ).toBe(
              originalCursorData.updatedAt.getTime(
              )
            );

          }
        );

        it(
          'produces a URL-safe string with no padding characters',
          (
          ) => {

            const encodedCursorString = encodeCursor(
              {
                updatedAt: new Date(
                ),
                id: 'some-id'
              }
            );

            expect(
              encodedCursorString
            ).not.toMatch(
              /[+/=]/
            );

          }
        );

        it(
          'produces a different cursor for a different id at the same instant',
          (
          ) => {

            const targetTimestamp = new Date(
              '2026-08-20T00:00:00.000Z'
            );
            const firstCursorString = encodeCursor(
              {
                updatedAt: targetTimestamp,
                id: 'id-a'
              }
            );
            const secondCursorString = encodeCursor(
              {
                updatedAt: targetTimestamp,
                id: 'id-b'
              }
            );

            expect(
              firstCursorString
            ).not.toBe(
              secondCursorString
            );

          }
        );

      }
    );

    describe(
      'decodeCursor validation',
      (
      ) => {

        it(
          'rejects a string that is not valid base64/JSON at all',
          async (
          ) => {

            const [
              decodeError
            ] = await to(
              decodeCursor(
                'not-a-real-cursor-!!!'
              )
            );

            expect(
              decodeError
            ).toBeInstanceOf(
              Error
            );
            expect(
              (
                decodeError as Error
              ).message
            ).toBe(
              'Malformed cursor encoding'
            );

          }
        );

        it(
          'rejects valid base64 that decodes to something other than JSON',
          async (
          ) => {

            const nonJsonBase64 = Buffer.from(
              'just some plain text',
              'utf8'
            ).toString(
              'base64url'
            );

            const [
              decodeError
            ] = await to(
              decodeCursor(
                nonJsonBase64
              )
            );

            expect(
              decodeError
            ).toBeInstanceOf(
              Error
            );
            expect(
              (
                decodeError as Error
              ).message
            ).toBe(
              'Malformed cursor encoding'
            );

          }
        );

        it(
          'rejects an object missing the id field',
          async (
          ) => {

            const missingIdPayload = Buffer.from(
              JSON.stringify(
                {
                  u: new Date(
                  ).toISOString(
                  )
                }
              ),
              'utf8'
            ).toString(
              'base64url'
            );

            const [
              decodeError
            ] = await to(
              decodeCursor(
                missingIdPayload
              )
            );

            expect(
              decodeError
            ).toBeInstanceOf(
              Error
            );
            expect(
              (
                decodeError as Error
              ).message
            ).toBe(
              'Malformed cursor fields'
            );

          }
        );

        it(
          'rejects an object missing the u (updatedAt) field',
          async (
          ) => {

            const missingUpdatedPayload = Buffer.from(
              JSON.stringify(
                {
                  id: 'abc'
                }
              ),
              'utf8'
            ).toString(
              'base64url'
            );

            const [
              decodeError
            ] = await to(
              decodeCursor(
                missingUpdatedPayload
              )
            );

            expect(
              decodeError
            ).toBeInstanceOf(
              Error
            );
            expect(
              (
                decodeError as Error
              ).message
            ).toBe(
              'Malformed cursor fields'
            );

          }
        );

        it(
          'rejects an empty-string id',
          async (
          ) => {

            const emptyIdPayload = Buffer.from(
              JSON.stringify(
                {
                  u: new Date(
                  ).toISOString(
                  ),
                  id: ''
                }
              ),
              'utf8'
            ).toString(
              'base64url'
            );

            const [
              decodeError
            ] = await to(
              decodeCursor(
                emptyIdPayload
              )
            );

            expect(
              decodeError
            ).toBeInstanceOf(
              Error
            );
            expect(
              (
                decodeError as Error
              ).message
            ).toBe(
              'Malformed cursor fields'
            );

          }
        );

        it(
          'rejects an unparsable date string',
          async (
          ) => {

            const invalidDatePayload = Buffer.from(
              JSON.stringify(
                {
                  u: 'definitely-not-a-date',
                  id: 'abc'
                }
              ),
              'utf8'
            ).toString(
              'base64url'
            );

            const [
              decodeError
            ] = await to(
              decodeCursor(
                invalidDatePayload
              )
            );

            expect(
              decodeError
            ).toBeInstanceOf(
              Error
            );
            expect(
              (
                decodeError as Error
              ).message
            ).toBe(
              'Malformed cursor date'
            );

          }
        );

        it(
          'throws a plain Error, not any framework-specific exception type',
          async (
          ) => {

            const [
              decodeError
            ] = await to(
              decodeCursor(
                'garbage'
              )
            );

            expect(
              decodeError
            ).toBeInstanceOf(
              Error
            );
            expect(
              decodeError
            ).not.toHaveProperty(
              'getStatus'
            );

          }
        );

      }
    );

  }
);
