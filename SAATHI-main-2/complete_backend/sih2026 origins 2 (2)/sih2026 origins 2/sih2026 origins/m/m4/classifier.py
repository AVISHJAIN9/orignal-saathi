"""
M4: Rule-based & Lexical Intent Classifier + Entity Extractor
Intent classes:
  1. standard_lookup: Queries looking for specific IS numbers, test specs, parameters.
  2. certification_process: Queries asking how to apply, get ISI/CRS, lab test requirements, stages.
  3. licensing: Queries about license renewal, transfer, cancellation, fees, factory verification.
  4. general_query: Greetings, what is BIS, public directory, complaints, offices.
"""
import re
from typing import List, Tuple, Dict
from m4.schemas import EntityItem


INTENT_KEYWORDS: Dict[str, List[str]] = {
    "certification_process": [
        "how to apply", "application process", "certification procedure",
        "step by step", "get isi mark", "get bis mark", "crs registration",
        "how to get certified", "process for certification", "how do i get",
        "factory audit requirement", "inspection requirement", "audit checklist",
        "grant of license", "application form"
    ],
    "licensing": [
        "renew", "renewal", "expiry", "expire", "validity", "extend license",
        "annual fee", "marking fee", "license fee", "surrender license",
        "stop license", "endorsement", "change in scope", "factory relocation",
        "suspension", "cancellation", "dispute"
    ],
    "standard_lookup": [
        "standard for", "specification for", "specifications",
        "requirement for", "permissible limit", "acceptable limit", "test method",
        "qco mandatory", "qco order", "clinker", "clause", "conformance",
        "what is the standard", "which is the standard", "applicable standard", "test parameters"
    ]
}

KNOWN_PRODUCT_CATEGORIES: Dict[str, List[str]] = {
    "CEMENT": ["cement", "portland", "pozzolana", "clinker"],
    "ELECTRICAL": ["plug", "plugs", "socket", "sockets", "switch", "switches", "wire", "wires", "cable", "cables", "transformer", "circuit breaker", "led", "lamp", "appliance", "appliances", "electrical"],
    "ELECTRONICS": ["lithium", "battery", "batteries", "cell", "cells", "mobile", "laptop", "inverter", "charger", "adapter"],
    "STEEL": ["steel", "tmt bar", "rebar", "structural steel", "pipe", "pipes"],
    "WATER_FOOD": ["drinking water", "packaged water", "mineral water", "milk powder", "infant food", "water"],
    "CHEMICALS": ["fertilizer", "caustic soda", "acid", "paints"]
}

REGULATORY_TERMS = [
    "QCO", "ISI", "CRS", "FMCS", "HALLMARKING", "NABL", "BIS", "SCHEME-I", "SCHEME-II"
]

# Robust regex for Indian Standards: IS 1293:2019, IS 16046 (Part 1):2018, IS/IEC 60950
IS_PATTERN = re.compile(r'\bIS(?:/IEC)?\s*\d+(?:\s*(?:\(Part\s*\d+\)|Part\s*\d+|Pt\s*\d+))?(?:\s*:\s*\d{4})?\b', re.IGNORECASE)


class QueryUnderstandingEngine:
    @staticmethod
    def extract_entities(query: str) -> Tuple[List[EntityItem], List[str], List[str]]:
        entities: List[EntityItem] = []
        standard_numbers: List[str] = []
        product_categories: List[str] = []

        # 1. Match IS numbers
        for match in IS_PATTERN.finditer(query):
            raw_text = match.group(0).strip()
            norm_text = re.sub(r'\s+', ' ', raw_text.upper())
            standard_numbers.append(norm_text)
            entities.append(EntityItem(
                entity_type="IS_NUMBER",
                text=raw_text,
                normalized_value=norm_text,
                confidence=0.99
            ))

        # 2. Match Product Categories
        lower_query = query.lower()
        for cat_name, kw_list in KNOWN_PRODUCT_CATEGORIES.items():
            for kw in kw_list:
                if re.search(rf'\b{re.escape(kw)}\b', lower_query):
                    product_categories.append(cat_name)
                    entities.append(EntityItem(
                        entity_type="PRODUCT_CATEGORY",
                        text=kw,
                        normalized_value=cat_name,
                        confidence=0.92
                    ))
                    break

        # 3. Match Regulatory Terms
        for reg in REGULATORY_TERMS:
            if re.search(rf'\b{re.escape(reg)}\b', query, re.IGNORECASE):
                entities.append(EntityItem(
                    entity_type="REGULATORY_TERM",
                    text=reg,
                    normalized_value=reg.upper(),
                    confidence=0.95
                ))

        return entities, list(set(standard_numbers)), list(set(product_categories))

    @classmethod
    def classify_intent(cls, query: str, standard_numbers: List[str]) -> Tuple[str, float]:
        lower = query.lower().strip()

        # Specific standard lookup boost if standard number detected and not asking about process/renewal
        if standard_numbers and not any(kw in lower for kw in ["how to apply", "renew", "fee", "procedure"]):
            return "standard_lookup", 0.95

        # Check intent keyword matches
        scores: Dict[str, float] = {
            "certification_process": 0.0,
            "licensing": 0.0,
            "standard_lookup": 0.0,
            "general_query": 0.1
        }

        for intent, kw_list in INTENT_KEYWORDS.items():
            for kw in kw_list:
                if kw in lower:
                    scores[intent] += 1.0

        best_intent = max(scores, key=scores.get)
        max_score = scores[best_intent]
        if max_score == 0.1:
            # Fallback based on question markers
            if any(w in lower for w in ["permissible limit", "acceptable limit", "test method", "specification"]):
                return "standard_lookup", 0.70
            return "general_query", 0.65

        confidence = min(0.98, 0.75 + (max_score * 0.1))
        return best_intent, confidence


# ==============================================================================
# Phase 5.1 — Model 1 Interface: Query Intent Classifier
# ==============================================================================
# AWAITING_TRAINED_MODEL: Model 1 (intent classifier) — swap classify_intent implementation here
# Config flag: INTENT_CLASSIFIER_MODE=rules|trained-model (defaults to 'rules')
def classify_intent_interface(query: str, lang: str = "en") -> Dict[str, any]:
    """
    Stable interface point for Model 1 (Query Intent Classifier).
    Backed by rule-based and lexical entity extraction in interim mode.
    """
    import os
    mode = os.getenv("INTENT_CLASSIFIER_MODE", "rules")
    
    if mode == "trained-model":
        # AWAITING_TRAINED_MODEL: Human teammate will plug in weights / endpoint here
        # Return format contract: { intent: str, confidence: float, standard_numbers: list, product_categories: list, mode: str }
        pass

    entities, stds, cats = QueryUnderstandingEngine.extract_entities(query)
    intent, conf = QueryUnderstandingEngine.classify_intent(query, stds)
    return {
        "intent": intent,
        "confidence": conf,
        "entities": entities,
        "standard_numbers": stds,
        "product_categories": cats,
        "mode": mode,
        "lang": lang,
    }
