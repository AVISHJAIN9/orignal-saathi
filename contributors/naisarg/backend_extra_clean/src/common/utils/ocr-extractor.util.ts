import Tesseract from 'tesseract.js';

// pdf-parse is a commonjs library
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse');

/**
 * Robust OCR and text extractor.
 * 1. If buffer looks like a PDF (mimetype or header), attempt pdf-parse first.
 * 2. If pdf-parse extracts text (>10 chars), return it.
 * 3. Otherwise or if mimetype is image, fall back to real Tesseract.js OCR.
 */
export async function extractTextFromBuffer(
  buffer: Buffer,
  mimeType?: string,
  fileName?: string
): Promise<string> {
  if (!buffer || buffer.length === 0) {
    return '';
  }

  const isPdf =
    (mimeType && mimeType.toLowerCase().includes('pdf')) ||
    (fileName && fileName.toLowerCase().endsWith('.pdf')) ||
    buffer.slice(0, 5).toString('ascii').startsWith('%PDF-');

  if (isPdf) {
    try {
      const pdfData = await pdfParse(buffer);
      if (pdfData && pdfData.text && pdfData.text.trim().length > 10) {
        return pdfData.text.trim();
      }
    } catch {
      // PDF parse failed or scanned image PDF - proceed to Tesseract fallback
    }
  }

  // If plain text (not binary image/pdf)
  const isPlainText =
    (mimeType && mimeType.includes('text')) ||
    (fileName && fileName.endsWith('.txt')) ||
    (fileName && fileName.endsWith('.csv'));

  if (isPlainText) {
    return buffer.toString('utf-8');
  }

  // Use Tesseract.js for real OCR extraction over images / scanned documents
  try {
    const result = await Tesseract.recognize(buffer, 'eng');
    return result?.data?.text?.trim() || '';
  } catch (err: any) {
    // If OCR fails for any reason (e.g. invalid image format), return utf-8 buffer fallback
    return buffer.toString('utf-8');
  }
}
