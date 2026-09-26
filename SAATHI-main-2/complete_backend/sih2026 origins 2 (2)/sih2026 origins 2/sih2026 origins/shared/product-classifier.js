/**
 * Shared Model 2 Interface — Product -> Standard Classifier
 * Phase 5.2 Implementation
 *
 * Consolidates the product-to-standard classification call site so:
 * - D9 (smart wizard)
 * - C1 (qco applicability engine)
 * - C21 (product classification assistant)
 * all point to this unified interface function.
 *
 * Flags:
 * - PRODUCT_MATCH_MODE: 'rules' | 'model' (defaults to 'rules')
 * - ML_MODEL2_ENDPOINT: URL to teammate's fine-tuned embedding/classifier model
 */

/**
 * Curated statutory BIS mappings (interim fallback rule-base)
 */
const STATUTORY_STANDARDS = [
  { keywords: ['drinking water', 'potable water', 'mineral water', 'packaged water'], standard: 'IS 10500:2012', title: 'Drinking Water Specification', scheme: 'ISI_SCHEME_1', qco: true },
  { keywords: ['hdpe', 'polyethylene pipe', 'water pipe', 'plastic pipe'], standard: 'IS 4984:2016', title: 'High Density Polyethylene Pipes for Water Supply', scheme: 'ISI_SCHEME_1', qco: true },
  { keywords: ['plug', 'socket', '250v', 'pin', 'outlet'], standard: 'IS 1293:2019', title: 'Plugs and Socket-Outlets', scheme: 'ISI_SCHEME_1', qco: true },
  { keywords: ['laptop', 'computer', 'server', 'adapter', 'smps', 'printer'], standard: 'IS 13252 (Part 1):2010', title: 'Information Technology Equipment Safety', scheme: 'CRS_SCHEME_2', qco: true },
  { keywords: ['led', 'lamp', 'driver', 'lighting', 'controlgear'], standard: 'IS 15885 (Part 2/Sec 13):2012', title: 'Lamp Controlgear for LED Modules', scheme: 'CRS_SCHEME_2', qco: true },
  { keywords: ['steel', 'tmt', 'rebar', 'reinforcement', 'concrete bar'], standard: 'IS 1786:2008', title: 'High Strength Deformed Steel Bars', scheme: 'ISI_SCHEME_1', qco: true },
  { keywords: ['cement', 'portland', 'opc', 'concrete'], standard: 'IS 269:2015', title: 'Ordinary Portland Cement Specification', scheme: 'ISI_SCHEME_1', qco: true },
  { keywords: ['battery', 'lithium', 'cell', 'power bank'], standard: 'IS 16046 (Part 2):2018', title: 'Secondary Cells and Batteries (Lithium)', scheme: 'CRS_SCHEME_2', qco: true },
  { keywords: ['helmet', 'protective helmet', 'two wheeler'], standard: 'IS 4151:2015', title: 'Protective Helmets for Two Wheeler Riders', scheme: 'ISI_SCHEME_1', qco: true },
  { keywords: ['toy', 'children toy', 'play equipment'], standard: 'IS 9873 (Part 1):2019', title: 'Safety of Toys', scheme: 'ISI_SCHEME_1', qco: true }
];

/**
 * Phase 5.2 Model 2 Interface Function
 * AWAITING_TRAINED_MODEL: Model 2 (product-to-standard classifier).
 * Swap the rule evaluation block below when the trained artifact/endpoint is ready.
 */
async function matchProductToStandard(productDescription = '', specifications = {}) {
  const mode = process.env.PRODUCT_MATCH_MODE || 'rules';

  if (mode === 'model') {
    // AWAITING_TRAINED_MODEL: Delegate to teammate's Model 2 endpoint if active
    const endpoint = process.env.ML_MODEL2_ENDPOINT || 'http://localhost:8007/api/v1/classify';
    try {
      if (typeof fetch === 'function') {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_description: productDescription, specifications })
        });
        if (res.ok) {
          const data = await res.json();
          return {
            ...data,
            mode: 'model',
            classified_at: new Date().toISOString()
          };
        }
      }
    } catch (err) {
      console.warn(`[Model 2] Endpoint ${endpoint} failed (${err.message}). Falling back to statutory rules.`);
    }
  }

  // Interim Rule-Based Implementation
  const text = (productDescription + ' ' + JSON.stringify(specifications)).toLowerCase();
  let bestMatch = null;
  let highestScore = 0;

  for (const item of STATUTORY_STANDARDS) {
    let matchedKeywords = 0;
    for (const kw of item.keywords) {
      if (text.includes(kw)) {
        // Multi-word phrase match gives higher weight
        matchedKeywords += kw.includes(' ') ? 2 : 1;
      }
    }
    const maxPossible = item.keywords.reduce((acc, kw) => acc + (kw.includes(' ') ? 2 : 1), 0);
    const score = maxPossible > 0 ? (matchedKeywords / maxPossible) : 0;
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  // If a key statutory match is found, assign calibrated confidence
  if (bestMatch && highestScore > 0) {
    const calibratedConfidence = Math.min(0.95, Math.max(0.65, parseFloat(highestScore.toFixed(2)) * 1.8));
    return {
      classified: true,
      standard_id: bestMatch.standard,
      title: bestMatch.title,
      confidence: parseFloat(calibratedConfidence.toFixed(2)),
      scheme: bestMatch.scheme,
      is_mandatory_qco: bestMatch.qco,
      mode: 'rules',
      classified_at: new Date().toISOString()
    };
  }

  return {
    classified: false,
    standard_id: null,
    title: 'No matching BIS standard identified with sufficient confidence',
    confidence: 0.0,
    scheme: 'ISI_SCHEME_1',
    is_mandatory_qco: false,
    mode: 'rules',
    classified_at: new Date().toISOString()
  };
}

module.exports = {
  matchProductToStandard,
  STATUTORY_STANDARDS
};
