import {
  Test
} from '@nestjs/testing';
import {
  getRepositoryToken
} from '@nestjs/typeorm';
import {
  NotificationsService
} from './notifications.service';
import {
  Notification,
  NotificationType
} from './notification.entity';

describe(
  'NotificationsService',
  (
  ) => {

    let notificationsServiceInstance: NotificationsService;

    const repositoryMock = {
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
            id: 'n1',
            ...entityValues
          }
        )
      ),
      find: jest.fn(
      ),
      count: jest.fn(
      ),
      findOne: jest.fn(
      ),
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
                affected: 3
              }
            )
          }
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
              NotificationsService,
              {
                provide: getRepositoryToken(
                  Notification
                ),
                useValue: repositoryMock
              }
            ]
          }
        ).compile(
        );

        notificationsServiceInstance = testingModuleRef.get<
          NotificationsService
        >(
          NotificationsService
        );

      }
    );

    it(
      'signals nextCursor only when more rows exist than the page limit',
      async (
      ) => {

        const currentTimestamp = new Date(
        );

        repositoryMock.find.mockResolvedValue(
          Array.from(
            {
              length: 3
            },
            (
              _,
              itemIndex
            ) => (
              {
                id: `n${itemIndex}`,
                createdAt: new Date(
                  currentTimestamp.getTime(
                  ) - itemIndex * 1000
                )
              }
            )
          )
        );

        const listResult = await notificationsServiceInstance.listForUser(
          'user-1',
          {
            limit: 2
          }
        );

        expect(
          listResult.items
        ).toHaveLength(
          2
        );
        expect(
          listResult.nextCursor
        ).not.toBeNull(
        );

      }
    );

    it(
      'marks all unread notifications read for a user',
      async (
      ) => {

        const updateResult = await notificationsServiceInstance.markAllRead(
          'user-1'
        );

        expect(
          updateResult.updated
        ).toBe(
          3
        );

      }
    );

    it(
      'creates a notification with the given type',
      async (
      ) => {

        const creationResult = await notificationsServiceInstance.create(
          {
            userId: 'user-1',
            type: NotificationType.SESSION_ACTIVITY,
            message: 'Resumed conversation'
          }
        );

        expect(
          creationResult.type
        ).toBe(
          NotificationType.SESSION_ACTIVITY
        );

      }
    );

  }
);
