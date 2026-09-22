/**
 * C21 — Product Classification Assistant
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Classifies products against product_taxonomy_examples. If confidence below
 * threshold, returns a clarifying_question rather than a wrong answer.
 *
 * Tables: product_taxonomy_examples (c/database.js)
 */

const { db } = require('../database');
const { matchProductToStandard } = require('../../shared/product-classifier');
const CONFIDENCE_THRESHOLD = 0.40;

class ProductClassificationAssistant {
  /**
   * Phase 5.2 Model 2 Interface:
   * Unified call site for product-to-standard classification.
   */
  async classify(productDescription, specifications) {
    if (!productDescription) throw new Error('productDescription is required');

    // Call unified Model 2 interface
    const unifiedResult = await matchProductToStandard(productDescription, specifications);
    if (unifiedResult.classified && unifiedResult.confidence >= CONFIDENCE_THRESHOLD) {
      return {
        classified: true,
        product_category: unifiedResult.scheme,
        applicable_standard: unifiedResult.standard_id,
        title: unifiedResult.title,
        confidence: unifiedResult.confidence,
        is_qco_mandatory: unifiedResult.is_mandatory_qco || false,
        scheme_recommendation: unifiedResult.scheme || 'ISI_SCHEME_I',
        model_mode: unifiedResult.mode,
        classified_at: unifiedResult.classified_at
      };
    }

    const examples = await db.getTable('product_taxonomy_examples');
    const descLower = productDescription.toLowerCase();
    const specText = specifications ? JSON.stringify(specifications).toLowerCase() : '';

    // Score each taxonomy example
    const scored = examples.map(ex => {
      let score = 0;
      const keywords = (ex.keywords || []).map(k => k.toLowerCase());
      for (const kw of keywords) {
        if (descLower.includes(kw)) score += 1;
        if (specText.includes(kw)) score += 0.5;
      }
      return { ...ex, match_score: keywords.length > 0 ? score / keywords.length : 0 };
    });

    scored.sort((a, b) => b.match_score - a.match_score);
    const best = scored[0];
    const secondBest = scored[1];
    const confident = best && best.match_score >= CONFIDENCE_THRESHOLD;

    if (!confident || !best) {
      return {
        classified: false,
        confidence: best ? best.match_score : 0,
        threshold: CONFIDENCE_THRESHOLD,
        clarifying_question: 'Could not classify this product with sufficient confidence. Please provide: (1) the product material composition, (2) primary use-case, and (3) whether the product is covered by any mandatory BIS QCO notification.',
        top_candidates: scored.slice(0, 3).map(s => ({ category: s.product_category, standard: s.standard_id, score: s.match_score }))
      };
    }

    return {
      classified: true,
      product_category: best.product_category,
      applicable_standard: best.standard_id,
      confidence: best.match_score,
      is_qco_mandatory: best.is_mandatory_qco || false,
      scheme_recommendation: best.recommended_scheme || 'ISI_SCHEME_I',
      alternative_category: secondBest && secondBest.match_score > 0 ? { category: secondBest.product_category, standard: secondBest.standard_id } : null,
      classified_at: new Date().toISOString()
    };
  }
}

module.exports = { ProductClassificationAssistant };