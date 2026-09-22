/**
 * G16: Schema Markup — JSON-LD Structured Data Generator
 *
 * Generates valid Schema.org JSON-LD for SAATHI pages so search engines
 * can display rich results (GIGW 3.0 requirement + SEO).
 *
 * Schema types:
 * - WebSite: for the main landing page
 * - FAQPage: for FAQ pages (standards/certification questions)
 * - GovernmentService: for BIS compliance service pages
 * - BreadcrumbList: for navigation context
 *
 * Usage:
 *   const { generateWebSiteSchema, generateFAQSchema } = require('./g/G16_schema_markup');
 *   // Inject the output into <script type="application/ld+json"> in your HTML
 */
'use strict';

const BASE_URL = process.env.FRONTEND_URL || 'https://saathi.bis.gov.in';
const ORG_NAME = 'Bureau of Indian Standards (BIS) — SAATHI';

/**
 * WebSite schema for the main landing page.
 */
function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SAATHI — BIS Compliance Assistant',
    alternateName: 'SAATHI',
    url: BASE_URL,
    description:
      'AI-powered BIS compliance intelligence platform for Indian manufacturers and importers. ' +
      'Standards lookup, QCO applicability, certification guidance, and hallmarking information.',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'GovernmentOrganization',
      name: 'Bureau of Indian Standards',
      url: 'https://www.bis.gov.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.bis.gov.in/wp-content/themes/bis/images/bis-logo.png',
      },
    },
    inLanguage: ['en-IN', 'hi-IN', 'mr-IN', 'ta-IN', 'te-IN'],
  };
}

/**
 * GovernmentService schema for compliance assistance pages.
 */
function generateGovernmentServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: 'BIS Certification & Compliance Guidance',
    serviceType: 'Product Certification Assistance',
    description:
      'SAATHI helps Indian manufacturers and importers understand BIS certification requirements, ' +
      'QCO applicability, ISI licensing, hallmarking, and CRS scheme procedures.',
    provider: {
      '@type': 'GovernmentOrganization',
      name: 'Bureau of Indian Standards',
      url: 'https://www.bis.gov.in',
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    url: BASE_URL,
    availableLanguage: [
      { '@type': 'Language', name: 'English' },
      { '@type': 'Language', name: 'Hindi' },
    ],
    termsOfService: `${BASE_URL}/terms`,
    audience: {
      '@type': 'BusinessAudience',
      audienceType: 'Manufacturers, Importers, MSMEs',
    },
  };
}

/**
 * FAQPage schema for FAQ content.
 * @param {Array<{question: string, answer: string}>} faqs
 */
function generateFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}

/**
 * BreadcrumbList for sub-pages.
 * @param {Array<{name: string, url: string}>} items
 */
function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Serialize schema to an HTML <script> tag string for server-side rendering.
 * @param {object} schema
 */
function toScriptTag(schema) {
  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

/**
 * Get all schemas for the homepage.
 */
function getHomepageSchemas() {
  return [generateWebSiteSchema(), generateGovernmentServiceSchema()];
}

module.exports = {
  generateWebSiteSchema,
  generateGovernmentServiceSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  toScriptTag,
  getHomepageSchemas,
};
