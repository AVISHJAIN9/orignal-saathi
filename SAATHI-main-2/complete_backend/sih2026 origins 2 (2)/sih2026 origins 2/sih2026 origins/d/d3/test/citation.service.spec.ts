import {
  Test,
  TestingModule
} from '@nestjs/testing';
import {
  getRepositoryToken
} from '@nestjs/typeorm';
import {
  NotFoundException
} from '@nestjs/common';
import {
  CitationService
} from '../src/modules/citation/citation.service';
import {
  DocumentChunk
} from '../src/modules/citation/entities/chunk.entity';

describe(
  'CitationService',
  (
  ) => {

    let citationServiceInstance: CitationService;
    let chunkRepositoryMock: {
      findOne: jest.Mock;
      find: jest.Mock;
    };

    const createMockChunk = (
      chunkIdString: string,
      docIdString: string,
      secNumString: string,
      secTitleString: string,
      contentTextString: string
    ): DocumentChunk => (
      {
        id: chunkIdString,
        documentId: docIdString,
        standardNumber: 'IS 10500:2012',
        docType: 'standard',
        category: 'Food & Agriculture',
        sectionNumber: secNumString,
        sectionTitle: secTitleString,
        content: contentTextString,
        sourceUrl: 'https://standardsbis.bsbedge.com/is10500',
        publicationDate: '2012-05-01',
        metadata: {
          edition: 'Second'
        },
        createdAt: new Date(
          '2026-08-30T10:00:00.000Z'
        ),
        updatedAt: new Date(
          '2026-08-30T10:00:00.000Z'
        )
      }
    );

    const chunk1 = createMockChunk(
      'c1111111-1111-1111-1111-111111111111',
      'doc-10500',
      '1.0',
      'Scope',
      'This standard prescribes the requirements.'
    );
    const chunk2 = createMockChunk(
      'c2222222-2222-2222-2222-222222222222',
      'doc-10500',
      '2.0',
      'References',
      'The standards listed in Annex A are referred.'
    );
    const chunk3 = createMockChunk(
      'c3333333-3333-3333-3333-333333333333',
      'doc-10500',
      '3.0',
      'Requirements',
      'Drinking water shall be free from contaminants.'
    );

    beforeEach(
      async (
      ) => {

        chunkRepositoryMock = {
          findOne: jest.fn(
          ),
          find: jest.fn(
          )
        };

        const testingModuleRef: TestingModule = await Test.createTestingModule(
          {
            providers: [
              CitationService,
              {
                provide: getRepositoryToken(
                  DocumentChunk
                ),
                useValue: chunkRepositoryMock
              }
            ]
          }
        ).compile(
        );

        citationServiceInstance = testingModuleRef.get<
          CitationService
        >(
          CitationService
        );

      }
    );

    afterEach(
      (
      ) => {

        jest.clearAllMocks(
        );

      }
    );

    it(
      'should be defined',
      (
      ) => {

        expect(
          citationServiceInstance
        ).toBeDefined(
        );

      }
    );

    describe(
      'getChunkById',
      (
      ) => {

        it(
          'should retrieve a chunk and calculate previous/next surrounding context',
          async (
          ) => {

            chunkRepositoryMock.findOne.mockResolvedValue(
              chunk2
            );
            chunkRepositoryMock.find.mockResolvedValue(
              [
                chunk1,
                chunk2,
                chunk3
              ]
            );

            const result = await citationServiceInstance.getChunkById(
              'c2222222-2222-2222-2222-222222222222',
              true
            );

            expect(
              result.id
            ).toBe(
              chunk2.id
            );
            expect(
              result.sectionTitle
            ).toBe(
              'References'
            );
            expect(
              result.surroundingContext
            ).toBeDefined(
            );
            expect(
              result.surroundingContext?.previousChunk?.id
            ).toBe(
              chunk1.id
            );
            expect(
              result.surroundingContext?.nextChunk?.id
            ).toBe(
              chunk3.id
            );
            expect(
              result.surroundingContext?.totalDocumentChunks
            ).toBe(
              3
            );
            expect(
              result.surroundingContext?.currentChunkIndex
            ).toBe(
              2
            );

          }
        );

        it(
          'should retrieve a chunk without surrounding context when includeSurrounding=false',
          async (
          ) => {

            chunkRepositoryMock.findOne.mockResolvedValue(
              chunk1
            );

            const result = await citationServiceInstance.getChunkById(
              'c1111111-1111-1111-1111-111111111111',
              false
            );

            expect(
              result.id
            ).toBe(
              chunk1.id
            );
            expect(
              result.surroundingContext
            ).toBeNull(
            );

          }
        );

        it(
          'should handle edge cases where chunk is the first chunk in document',
          async (
          ) => {

            chunkRepositoryMock.findOne.mockResolvedValue(
              chunk1
            );
            chunkRepositoryMock.find.mockResolvedValue(
              [
                chunk1,
                chunk2
              ]
            );

            const result = await citationServiceInstance.getChunkById(
              'c1111111-1111-1111-1111-111111111111',
              true
            );

            expect(
              result.surroundingContext?.previousChunk
            ).toBeNull(
            );
            expect(
              result.surroundingContext?.nextChunk?.id
            ).toBe(
              chunk2.id
            );
            expect(
              result.surroundingContext?.currentChunkIndex
            ).toBe(
              1
            );

          }
        );

        it(
          'should throw NotFoundException if chunk does not exist',
          async (
          ) => {

            chunkRepositoryMock.findOne.mockResolvedValue(
              null
            );

            await expect(
              citationServiceInstance.getChunkById(
                '00000000-0000-0000-0000-000000000000',
                true
              )
            ).rejects.toThrow(
              NotFoundException
            );

          }
        );

      }
    );

    describe(
      'getChunksByDocumentId',
      (
      ) => {

        it(
          'should return all chunks and aggregate section outline for a document',
          async (
          ) => {

            chunkRepositoryMock.find.mockResolvedValue(
              [
                chunk1,
                chunk2,
                chunk3
              ]
            );

            const result = await citationServiceInstance.getChunksByDocumentId(
              'doc-10500'
            );

            expect(
              result.documentId
            ).toBe(
              'doc-10500'
            );
            expect(
              result.totalChunks
            ).toBe(
              3
            );
            expect(
              result.sections
            ).toHaveLength(
              3
            );
            expect(
              result.sections[
                0
              ].sectionTitle
            ).toBe(
              'Scope'
            );
            expect(
              result.chunks
            ).toHaveLength(
              3
            );

          }
        );

        it(
          'should throw NotFoundException if no chunks exist for document ID',
          async (
          ) => {

            chunkRepositoryMock.find.mockResolvedValue(
              [
              ]
            );

            await expect(
              citationServiceInstance.getChunksByDocumentId(
                'non-existent-doc'
              )
            ).rejects.toThrow(
              NotFoundException
            );

          }
        );

      }
    );

    describe(
      'X1 resolveDeepLink',
      (
      ) => {

        it(
          'should resolve clause deep link with URL and anchor tag',
          async (
          ) => {

            chunkRepositoryMock.findOne.mockResolvedValue(
              chunk3
            );

            const resolution = await citationServiceInstance.resolveDeepLink(
              'IS 10500',
              '3.0'
            );

            expect(
              resolution.standardNumber
            ).toBe(
              'IS 10500'
            );
            expect(
              resolution.clauseAnchor
            ).toBe(
              '#clause-3-0'
            );
            expect(
              resolution.deepLinkUrl
            ).toContain(
              '/standards/view/doc-10500'
            );
            expect(
              resolution.chunk.id
            ).toBe(
              chunk3.id
            );

          }
        );

      }
    );

  }
);
