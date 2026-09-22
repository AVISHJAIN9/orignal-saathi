from typing import List, Dict

MANDATORY_CRITERIA = {
    "factory_layout": {
        "label": "Factory Layout & Machinery List",
        "weight": 15,
        "critical": True,
        "recommendation": "Provide official plant blueprint and active machinery inventory."
    },
    "test_equipment": {
        "label": "Clause-Specific In-House Testing Equipment",
        "weight": 20,
        "critical": True,
        "recommendation": "Procure or calibrate test benches matching standard mandatory clauses."
    },
    "calibration_certs": {
        "label": "Valid NABL Calibration Certificates (<1 yr old)",
        "weight": 10,
        "critical": True,
        "recommendation": "Renew calibration through an accredited NABL calibration laboratory."
    },
    "qc_personnel": {
        "label": "Qualified QC Personnel & Testing Undertaking",
        "weight": 15,
        "critical": False,
        "recommendation": "Appoint certified quality control engineer with testing SOP sign-off."
    },
    "raw_material_certs": {
        "label": "Raw Material Test Certificates & Traceability",
        "weight": 10,
        "critical": False,
        "recommendation": "Establish supplier traceability logs and material batch inspection."
    },
    "test_log_register": {
        "label": "Routine Testing & Production Log Register",
        "weight": 10,
        "critical": False,
        "recommendation": "Implement standard Scheme of Inspection and Testing (SIT) register."
    },
    "homologation_drawings": {
        "label": "Homologation Prototype Spec & CMVR Form 22 Drawings",
        "weight": 10,
        "critical": False,
        "recommendation": "Draft technical specification annexures matching Rule 126 prototype criteria."
    },
    "cop_plan": {
        "label": "Conformity of Production (COP) Quality Plan (AIS-037)",
        "weight": 10,
        "critical": False,
        "recommendation": "Document internal COP control procedures for regular agency batch testing."
    }
}

def evaluate_readiness(uploaded_documents: List[str], is_automotive: bool = False) -> Dict:
    normalized_docs = {doc.lower().strip() for doc in uploaded_documents}
    score = 0
    missing_items = []
    fulfilled_items = []
    critical_missing = False

    for key, rule in MANDATORY_CRITERIA.items():
        if key in normalized_docs:
            score += rule["weight"]
            fulfilled_items.append(rule["label"])
        else:
            missing_items.append({
                "item": rule["label"],
                "weight_loss": rule["weight"],
                "critical": rule["critical"],
                "action_required": rule["recommendation"]
            })
            if rule["critical"]:
                critical_missing = True

    if score >= 85 and not critical_missing:
        status = "Audit Ready"
        next_step = "Submit CMVR Type Approval application on ARAI/ICAT portal." if is_automotive else "Proceed to Manakonline / e-BIS Form V filing and sample dispatch."
    elif score >= 60:
        status = "Conditionally Ready"
        next_step = "Complete prototype test bench calibration before laboratory witness audit."
    else:
        status = "Significant Compliance Deficit"
        next_step = "Setup mandatory testing infrastructure and COP verification plan."

    return {
        "readiness_score": f"{score}%",
        "status": status,
        "critical_gap_flag": critical_missing,
        "fulfilled_criteria": fulfilled_items,
        "gaps_identified": missing_items,
        "actionable_next_step": next_step
    }
