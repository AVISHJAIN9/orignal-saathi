import {
  BadRequestException
} from '@nestjs/common';
import {
  Test
} from '@nestjs/testing';
import {
  ConversationsController
} from './conversations.controller';
import {
  ConversationsService
} from './conversations.service';
import {
  encodeCursor
} from './cursor.util';

describe(
  'ConversationsController',
  (
  ) => {

    let controllerInstance: ConversationsController;
    let serviceMock: {
      listForUser: jest.Mock;
      resume: jest.Mock;
    };

    beforeEach(
      async (
      ) => {

        serviceMock = {
          listForUser: jest.fn(
          ),
          resume: jest.fn(
          )
        };

        const testingModuleRef = await Test.createTestingModule(
          {
            controllers: [
              ConversationsController
            ],
            providers: [
              {
                provide: ConversationsService,
                useValue: serviceMock
              }
            ]
          }
        ).compile(
        );

        controllerInstance = testingModuleRef.get<
          ConversationsController
        >(
          ConversationsController
        );

      }
    );

    describe(
      'list',
      (
      ) => {

        it(
          'forwards userId and limit straight through when there is no cursor',
          async (
          ) => {

            serviceMock.listForUser.mockResolvedValue(
              {
                conversations: [
                ],
                nextCursor: null,
                hasMore: false
              }
            );

            await controllerInstance.list(
              {
                userId: 'user-demo-1',
                limit: 20
              }
            );

            expect(
              serviceMock.listForUser
            ).toHaveBeenCalledWith(
              'user-demo-1',
              undefined,
              20
            );

          }
        );

        it(
          'decodes a well-formed cursor before calling the service',
          async (
          ) => {

            serviceMock.listForUser.mockResolvedValue(
              {
                conversations: [
                ],
                nextCursor: null,
                hasMore: false
              }
            );
            const cursorPoint = {
              updatedAt: new Date(
                '2026-08-20T00:00:00.000Z'
              ),
              id: 'conv-id'
            };
            const cursorString = encodeCursor(
              cursorPoint
            );

            await controllerInstance.list(
              {
                userId: 'user-demo-1',
                limit: 20,
                cursor: cursorString
              }
            );

            expect(
              serviceMock.listForUser
            ).toHaveBeenCalledWith(
              'user-demo-1',
              {
                updatedAt: cursorPoint.updatedAt,
                id: cursorPoint.id
              },
              20
            );

          }
        );

        it(
          'turns a malformed cursor into a 400 without ever calling the service',
          async (
          ) => {

            await expect(
              controllerInstance.list(
                {
                  userId: 'user-demo-1',
                  limit: 20,
                  cursor: 'not-valid'
                }
              )
            ).rejects.toThrow(
              BadRequestException
            );
            expect(
              serviceMock.listForUser
            ).not.toHaveBeenCalled(
            );

          }
        );

        it(
          'returns exactly what the service returns',
          async (
          ) => {

            const payloadResult = {
              conversations: [
                {
                  id: 'a',
                  title: 'A',
                  createdAt: new Date(
                  ),
                  updatedAt: new Date(
                  )
                }
              ],
              nextCursor: 'xyz',
              hasMore: true
            };
            serviceMock.listForUser.mockResolvedValue(
              payloadResult
            );

            const executionResult = await controllerInstance.list(
              {
                userId: 'user-demo-1',
                limit: 20
              }
            );

            expect(
              executionResult
            ).toBe(
              payloadResult
            );

          }
        );

      }
    );

  }
);
