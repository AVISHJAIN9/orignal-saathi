import { Injectable } from '@nestjs/common';

@Injectable()
export class PiiSanitizer {
  // Mobile numbers (Indian format with or without +91 / 0)
  private readonly phoneRegex = /(?:\+91[\-\s]?)?[6-9]\d{9}\b/g;

  // Landline numbers (STD code + 6-8 digits)
  private readonly landlineRegex = /\b0\d{2,4}[\-\s]?\d{6,8}\b/g;

  // Email addresses
  private readonly emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

  // Indian PAN (Permanent Account Number: 5 letters + 4 digits + 1 letter)
  private readonly panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g;

  // GSTIN (15 characters: 2 digits state + 10 PAN + 1 entity + 1 'Z' + 1 check digit)
  private readonly gstinRegex = /\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/g;

  // Aadhaar (12 digits, often spaced in groups of 4)
  private readonly aadhaarRegex = /\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/g;

  // Commercial / Private Company Entity Names
  private readonly companySuffixRegex = /\b[A-Z][a-zA-Z0-9\s&]+(?:Pvt\.?\s*Ltd\.?|Private\s*Limited|Limited|LLP|Inc\.?|Corp\.?|Industries|Enterprises|Traders)\b/gi;

  /**
   * Sanitizes all PII and sensitive identifiers before logging or analytics storage
   */
  public sanitize(rawText: string): string {
    if (!rawText || typeof rawText !== 'string') {
      return '';
    }

    let sanitized = rawText
      .replace(this.gstinRegex, '[REDACTED_GSTIN]')
      .replace(this.panRegex, '[REDACTED_PAN]')
      .replace(this.aadhaarRegex, '[REDACTED_AADHAAR]')
      .replace(this.emailRegex, '[REDACTED_EMAIL]')
      .replace(this.phoneRegex, '[REDACTED_PHONE]')
      .replace(this.landlineRegex, '[REDACTED_PHONE]')
      .replace(this.companySuffixRegex, '[REDACTED_COMPANY]');

    return sanitized.replace(/\s+/g, ' ').trim();
  }

  public containsPii(rawText: string): boolean {
    if (!rawText) return false;
    return (
      this.phoneRegex.test(rawText) ||
      this.emailRegex.test(rawText) ||
      this.panRegex.test(rawText) ||
      this.gstinRegex.test(rawText) ||
      this.aadhaarRegex.test(rawText) ||
      this.companySuffixRegex.test(rawText)
    );
  }
}
