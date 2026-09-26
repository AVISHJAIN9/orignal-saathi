/**
 * G7: Terms of Service — Real Implementation
 *
 * Serves the SAATHI Terms of Service as both:
 *   - Structured JSON (for machine consumption / frontend rendering)
 *   - Plain text (for /tos.txt accessibility)
 *
 * These terms must be reviewed by BIS/Ministry legal counsel before launch.
 * All [PLACEHOLDER] fields require legal input.
 *
 * Version: 1.0 (Draft — pending legal review)
 */
'use strict';

const TOS_VERSION = '1.0';
const EFFECTIVE_DATE = '2026-10-01'; // Target launch date

const TERMS_SECTIONS = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content:
      'By accessing or using the SAATHI BIS Compliance Assistant ("Service"), you agree to be bound by ' +
      'these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service. ' +
      'The Service is operated by the Bureau of Indian Standards (BIS), Ministry of Consumer Affairs, ' +
      'Food and Public Distribution, Government of India.',
  },
  {
    id: 'service-description',
    title: '2. Service Description',
    content:
      'SAATHI is an AI-powered compliance intelligence platform. It provides general information about ' +
      'BIS standards, Quality Control Orders (QCOs), certification schemes, hallmarking, and testing ' +
      'laboratories based on publicly available BIS documents. ' +
      'SAATHI does NOT constitute legal advice, official BIS certification, or a regulatory determination.',
  },
  {
    id: 'accuracy',
    title: '3. Accuracy and Limitations',
    content:
      'SAATHI uses retrieval-augmented generation (RAG) technology. While we strive for accuracy, ' +
      'AI-generated responses may contain errors. Always verify critical compliance decisions against ' +
      'official BIS publications at www.bis.gov.in. BIS is not liable for decisions made based solely ' +
      'on SAATHI responses.',
  },
  {
    id: 'acceptable-use',
    title: '4. Acceptable Use',
    content:
      'You may use the Service only for lawful compliance research. You may not: ' +
      '(a) use the Service to generate misleading compliance certificates; ' +
      '(b) attempt to extract, scrape, or reproduce the underlying BIS document corpus; ' +
      '(c) use the Service to circumvent BIS inspection or certification requirements; ' +
      '(d) submit queries containing personal data of third parties.',
  },
  {
    id: 'data-protection',
    title: '5. Data Protection',
    content:
      'Your use of the Service is governed by the SAATHI Privacy Policy and the Digital Personal ' +
      'Data Protection Act, 2023. Chat queries are processed by AI systems and may be reviewed ' +
      'for quality improvement. Queries are not used for advertising. See our Privacy Policy for details.',
  },
  {
    id: 'intellectual-property',
    title: '6. Intellectual Property',
    content:
      'BIS standards and QCOs are published by and remain the intellectual property of the Bureau of ' +
      'Indian Standards. The SAATHI software and underlying AI models are owned by the Government of India. ' +
      'Summaries provided by SAATHI are derivative works under Section 52(1)(a) of the Copyright Act, 1957.',
  },
  {
    id: 'limitation-of-liability',
    title: '7. Limitation of Liability',
    content:
      'To the maximum extent permitted by applicable law, BIS and the Government of India shall not be ' +
      'liable for any indirect, incidental, or consequential damages arising from your use of or reliance ' +
      'on the Service. Total liability shall not exceed INR 1,000.',
  },
  {
    id: 'governing-law',
    title: '8. Governing Law',
    content:
      'These Terms are governed by the laws of India. Disputes shall be subject to the exclusive ' +
      'jurisdiction of courts in New Delhi.',
  },
  {
    id: 'changes',
    title: '9. Changes to Terms',
    content:
      'We may update these Terms from time to time. Material changes will be notified in-app at least ' +
      '30 days in advance. Continued use of the Service after changes constitutes acceptance.',
  },
  {
    id: 'contact',
    title: '10. Contact',
    content:
      'For questions about these Terms, contact: helpdesk@bis.gov.in | Bureau of Indian Standards, ' +
      'Manak Bhavan, 9 Bahadur Shah Zafar Marg, New Delhi 110002.',
  },
];

/**
 * Get structured Terms of Service data.
 * @returns {{ version: string, effectiveDate: string, sections: object[] }}
 */
function getTermsOfService() {
  return {
    version: TOS_VERSION,
    effectiveDate: EFFECTIVE_DATE,
    lastUpdated: '2026-09-13',
    legalStatus: 'DRAFT — Pending legal review before launch',
    language: 'en-IN',
    sections: TERMS_SECTIONS,
  };
}

/**
 * Get Terms as plain text.
 */
function getTermsAsText() {
  const header = `SAATHI BIS COMPLIANCE ASSISTANT — TERMS OF SERVICE\nVersion ${TOS_VERSION} | Effective: ${EFFECTIVE_DATE}\n${'='.repeat(60)}\n\n`;
  const body = TERMS_SECTIONS.map(s => `${s.title}\n${'-'.repeat(s.title.length)}\n${s.content}\n`).join('\n');
  return header + body;
}

module.exports = { getTermsOfService, getTermsAsText, TERMS_SECTIONS, TOS_VERSION };
