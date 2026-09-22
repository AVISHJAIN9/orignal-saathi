/**
 * X8 — Document Preview & Interactive Annotation
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * CRUD for document annotations. Reads document_annotations table.
 * Validates annotation coordinates are within document bounds.
 *
 * Tables: document_annotations (c/database.js)
 */

const { db } = require('../../c/database');

const VALID_TYPES = ['HIGHLIGHT', 'COMMENT', 'FLAG', 'BOOKMARK'];

class DocumentPreviewAnnotationService {
  static async getAnnotations(documentId, userId) {
    if (!documentId) throw new Error('documentId is required');
    const all = await db.getTable('document_annotations');
    return all.filter(a => a.document_id === documentId && (!userId || a.user_id === userId));
  }

  static async addAnnotation({ document_id, user_id, annotation_type, page, x, y, text }) {
    if (!document_id || !annotation_type) throw new Error('document_id and annotation_type are required');
    if (!VALID_TYPES.includes(annotation_type)) throw new Error(`annotation_type must be one of: ${VALID_TYPES.join(', ')}`);
    if (x !== undefined && (x < 0 || x > 100)) throw new Error('x must be 0–100 (percentage of page width)');
    if (y !== undefined && (y < 0 || y > 100)) throw new Error('y must be 0–100 (percentage of page height)');

    const annotation = {
      id: 'ann_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      document_id, user_id: user_id || 'ANONYMOUS',
      annotation_type, page: page || 1,
      x: x || null, y: y || null,
      text: text || null,
      created_at: new Date().toISOString()
    };
    await db.insert('document_annotations', annotation);
    return { success: true, annotation };
  }

  static async deleteAnnotation(annotationId, userId) {
    const ann = await db.findOne('document_annotations', a => a.id === annotationId);
    if (!ann) throw new Error(`Annotation ${annotationId} not found`);
    if (userId && ann.user_id !== userId) throw new Error('Cannot delete another user\'s annotation');
    return db.update('document_annotations', a => a.id === annotationId, { deleted_at: new Date().toISOString() });
  }
}

module.exports = { DocumentPreviewAnnotationService };
