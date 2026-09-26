import {
  Test,
  TestingModule
} from '@nestjs/testing';
import {
  CitationController
} from '../src/modules/citation/citation.controller';
import {
  CitationService
} from '../src/modules/citation/citation.service';
import {
  ChunkDetailDto,
  DeepLinkResolutionDto,
  DocumentSummaryDto
} from '../src/modules/citation/dto/citation-response.dto';

describe(
  'CitationController',
  (
  ) => {

    let citationControllerInstance: CitationController;
    let citationServiceMock: {
      getChunkById: jest.Mock;
      getChunksByDocumentId: jest.Mock;
      resolveDeepLink: jest.Mock;
    };

    const mockChunkDetail: ChunkDetailDto = {
      id: 'c1111111-1111-1111-1111-111111111111',
      documentId: 'doc-1',
      standardNumber: 'IS 10500:2012',
      docType: 'standard',
      category: 'Food & Agriculture',
      sectionTitle: 'Clause 1',
      sectionNumber: '1.0',
      clauseAnchor: 'clause-1-0',
      deepLinkUrl: '/standards/view/doc-1?chunkId=c1111111-1111-1111-1111-111111111111#clause-1-0',
      content: 'Standard scope text',
      sourceUrl: 'https://standardsbis.bsbedge.com',
      publicationDate: '2012-05-01',
      isLicensedFallback: false,
      metadata: {
      },
      createdAt: new Date(
      ),
      updatedAt: new Date(
      ),
      surroundingContext: null
    };

    const mockDocumentSummary: DocumentSummaryDto = {
      documentId: 'doc-1',
      standardNumber: 'IS 10500:2012',
      docType: 'standard',
      category: 'Food & Agriculture',
      publicationDate: '2012-05-01',
      sourceUrl: 'https://standardsbis.bsbedge.com',
      totalChunks: 1,
      sections: [
        {
          sectionNumber: '1.0',
          sectionTitle: 'Clause 1',
          chunkId: 'c1111111-1111-1111-1111-111111111111',
          clauseAnchor: 'clause-1-0',
          deepLinkUrl: '/standards/view/doc-1?chunkId=c1111111-1111-1111-1111-111111111111#clause-1-0'
        }
      ],
      chunks: [
        mockChunkDetail
      ]
    };

    const mockDeepLinkResolution: DeepLinkResolutionDto = {
      standardNumber: 'IS 10500',
      requestedClause: '1.0',
      clauseAnchor: '#clause-1-0',
      deepLinkUrl: '/standards/view/doc-1?chunkId=c1111111-1111-1111-1111-111111111111#clause-1-0',
      chunk: mockChunkDetail
    };

    beforeEach(
      async (
      ) => {

        citationServiceMock = {
          getChunkById: jest.fn(
          ).mockResolvedValue(
            mockChunkDetail
          ),
          getChunksByDocumentId: jest.fn(
          ).mockResolvedValue(
            mockDocumentSummary
          ),
          resolveDeepLink: jest.fn(
          ).mockResolvedValue(
            mockDeepLinkResolution
          )
        };

        const testingModuleRef: TestingModule = await Test.createTestingModule(
          {
            controllers: [
              CitationController
            ],
            providers: [
              {
                provide: CitationService,
                useValue: citationServiceMock
              }
            ]
          }
        ).compile(
        );

        citationControllerInstance = testingModuleRef.get<
          CitationController
        >(
          CitationController
        );

      }
    );

    it(
      'should be defined',
      (
      ) => {

        expect(
          citationControllerInstance
        ).toBeDefined(
        );

      }
    );

    describe(
      'GET /api/v1/citations/chunk/:chunkId',
      (
      ) => {

        it(
          'should call CitationService.getChunkById with chunkId and includeSurrounding',
          async (
          ) => {

            const result = await citationControllerInstance.getChunkById(
              'c1111111-1111-1111-1111-111111111111',
              true
            );

            expect(
              citationServiceMock.getChunkById
            ).toHaveBeenCalledWith(
              'c1111111-1111-1111-1111-111111111111',
              true
            );
            expect(
              result
            ).toEqual(
              mockChunkDetail
            );

          }
        );

      }
    );

    describe(
      'GET /api/v1/citations/document/:documentId',
      (
      ) => {

        it(
          'should call CitationService.getChunksByDocumentId with documentId',
          async (
          ) => {

            const result = await citationControllerInstance.getChunksByDocumentId(
              'doc-1'
            );

            expect(
              citationServiceMock.getChunksByDocumentId
            ).toHaveBeenCalledWith(
              'doc-1'
            );
            expect(
              result
            ).toEqual(
              mockDocumentSummary
            );

          }
        );

      }
    );

    describe(
      'GET /api/v1/citations/deep-link and clause/:std/:clause',
      (
      ) => {

        it(
          'should resolve deep link with standardNumber and clause query',
          async (
          ) => {

            const result = await citationControllerInstance.resolveDeepLink(
              'IS 10500',
              '1.0'
            );

            expect(
              citationServiceMock.resolveDeepLink
            ).toHaveBeenCalledWith(
              'IS 10500',
              '1.0'
            );
            expect(
              result.clauseAnchor
            ).toBe(
              '#clause-1-0'
            );

          }
        );

        it(
          'should resolve parameterized clause route',
          async (
          ) => {

            const result = await citationControllerInstance.getClauseByParams(
              'IS 10500',
              '1.0'
            );

            expect(
              citationServiceMock.resolveDeepLink
            ).toHaveBeenCalledWith(
              'IS 10500',
              '1.0'
            );
            expect(
              result
            ).toEqual(
              mockDeepLinkResolution
            );

          }
        );

      }
    );

    describe(
      'GET /api/v1/citations/health',
      (
      ) => {

        it(
          'should return health status',
          (
          ) => {

            const res = citationControllerInstance.health(
            );
            expect(
              res.status
            ).toBe(
              'healthy'
            );
            expect(
              res.module
            ).toBe(
              'd3-citation-backend'
            );

          }
        );

      }
    );

  }
);
