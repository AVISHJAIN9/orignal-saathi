/**
 * M1: Document Ingestion & Regulatory Preprocessor (MERN Stack)
 */
class DocumentIngestionService {
  static processDocument(docMeta = {}) {
    const { title = 'BIS Gazette QCO 2024', fileType = 'PDF', rawText = '' } = docMeta;
    const cleanText = (rawText || 'Government of India Ministry of Commerce and Industry QCO Notification')
      .replace(/\s+/g, ' ')
      .trim();
    return {
      status: 'PROCESSED',
      docId: 'doc_' + Math.random().toString(36).substring(2, 8),
      title,
      fileType,
      characterCount: cleanText.length,
      extractedSections: [
        { heading: 'Short Title and Commencement', content: cleanText.substring(0, 100) },
        { heading: 'Compulsory Use of Standard Mark', content: 'Goods must conform to Indian Standard.' }
      ],
      processedAt: new Date().toISOString()
    };
  }
}

const processDocument = (meta) => DocumentIngestionService.processDocument(meta);

module.exports = { DocumentIngestionService, processDocument };
