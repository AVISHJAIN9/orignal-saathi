import {
  Test
} from '@nestjs/testing';
import {
  getRepositoryToken
} from '@nestjs/typeorm';
import {
  NotFoundException
} from '@nestjs/common';
import {
  TestimonialsService
} from './testimonials.service';
import {
  Testimonial
} from './testimonial.entity';

describe(
  'TestimonialsService',
  (
  ) => {

    let testimonialsServiceInstance: TestimonialsService;

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
            id: 'fixed-id',
            ...entityValues
          }
        )
      ),
      findAndCount: jest.fn(
      ),
      findOne: jest.fn(
      ),
      delete: jest.fn(
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
              TestimonialsService,
              {
                provide: getRepositoryToken(
                  Testimonial
                ),
                useValue: repositoryMock
              }
            ]
          }
        ).compile(
        );

        testimonialsServiceInstance = testingModuleRef.get<
          TestimonialsService
        >(
          TestimonialsService
        );

      }
    );

    it(
      'creates unapproved by default',
      async (
      ) => {

        const createdResult = await testimonialsServiceInstance.create(
          {
            name: 'Acme MSME',
            quote: 'SAATHI saved us weeks.'
          }
        );

        expect(
          createdResult.approved
        ).toBe(
          false
        );

      }
    );

    it(
      'public list forces approved=true filter',
      async (
      ) => {

        repositoryMock.findAndCount.mockResolvedValue(
          [
            [
            ],
            0
          ]
        );

        await testimonialsServiceInstance.list(
          {
            limit: 20,
            offset: 0,
            status: 'approved'
          }
        );

        expect(
          repositoryMock.findAndCount
        ).toHaveBeenCalledWith(
          expect.objectContaining(
            {
              where: {
                approved: true
              }
            }
          )
        );

      }
    );

    it(
      'throws NotFoundException when updating a missing testimonial',
      async (
      ) => {

        repositoryMock.findOne.mockResolvedValue(
          null
        );

        await expect(
          testimonialsServiceInstance.update(
            'missing-id',
            {
              approved: true
            }
          )
        ).rejects.toThrow(
          NotFoundException
        );

      }
    );

  }
);
