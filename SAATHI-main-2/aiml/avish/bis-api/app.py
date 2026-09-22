from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import joblib
import re
import json
from guardrail import BISGuardrail
from gap_engine import evaluate_readiness

app = FastAPI(title="BIS & AIS Regulatory Compliance Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("bis_product_department_model_v3.pkl")
spine_df = pd.read_csv("complete_12_node_bis_spine.csv").fillna("")
guard = BISGuardrail()

with open("model2_corpus.json", "r") as f:
    corpus = json.load(f)
corpus_map = {doc["is_number"].strip().upper(): doc for doc in corpus}

class AuditRequest(BaseModel):
    text: str
    documents: Optional[List[str]] = None

class ChatRequest(BaseModel):
    message: str
    documents: Optional[List[str]] = None

STATUTORY_FAQS = {
    "greetings": {
        "patterns": [r"\b(hi|hello|hey|namaste|good morning|good evening)\b"],
        "reply": "Hello! I am your automated BIS & AIS Regulatory Compliance Assistant. You can ask me to evaluate industrial products (e.g., 'Cement 53 Grade', 'Electrical Iron') or Automotive AIS standards (e.g., 'EV Traction Battery AIS 038', 'AIS 156', 'AIS 140 tracker')."
    },
    "ais_explained": {
        "patterns": [r"\b(what is ais|ais vs bis|homologation|arai|icat)\b"],
        "reply": "Automotive Industry Standards (AIS) are mandated under CMVR Rule 126 by MoRTH. Unlike BIS Scheme-I (ISI Mark), pure automotive components obtain a Type Approval Certificate (TAC) through testing agencies like ARAI, ICAT, or CIRT, followed by periodic Conformity of Production (COP) audits."
    },
    "scheme_one": {
        "patterns": [r"\b(scheme 1|scheme-i|isi mark|what is isi)\b"],
        "reply": "Scheme-I (ISI Mark) is the product certification scheme under BIS Act 2016. It requires in-house test benches, factory layout approvals, and compliance with the Scheme of Inspection and Testing (SIT)."
    },
    "manakonline": {
        "patterns": [r"\b(manakonline|e-bis|portal|apply online)\b"],
        "reply": "To apply for BIS certification, register on www.manakonline.in and submit Form V with factory layout, calibration certs, and test reports. For pure AIS automotive components, file via portal.araiindia.com or icat.in."
    }
}

@app.get("/")
def root():
    return {"status": "live", "service": "BIS & AIS Compliance Engine"}

@app.post("/chat")
def chat_interaction(req: ChatRequest):
    msg = req.message.strip().lower()

    for intent, data in STATUTORY_FAQS.items():
        for pat in data["patterns"]:
            if re.search(pat, msg):
                return {"type": "conversation", "reply": data["reply"], "audit_pack": None}

    audit_res = generate_audit_pack(AuditRequest(text=req.message, documents=req.documents))
    
    if audit_res["status"] == "unverified":
        return {
            "type": "clarification",
            "reply": f"I recognized '{req.message}', but it is not currently indexed in our mandatory BIS/AIS QCO spine. Try standard categories like 'EV Battery AIS 156', 'IS 12269 Cement', 'TMT Rebars', or 'Electrical Appliances'.",
            "audit_pack": None
        }

    return {
        "type": "audit",
        "reply": f"Statutory standard identified: {audit_res['grounding']['matched_standard']} ({audit_res['classification']['predicted_department']}). Full audit pack and laboratory allocation generated below.",
        "audit_data": audit_res
    }

@app.post("/audit")
def generate_audit_pack(req: AuditRequest):
    guard_res = guard.verify(req.text)
    
    if not guard_res["passed"]:
        return {
            "status": "unverified",
            "query": req.text,
            "classification": {
                "predicted_department": "Out of Scope",
                "confidence": "0.00%",
                "needs_manual_review": True
            },
            "grounding": {
                "matched": False,
                "best_score": guard_res["best_score"],
                "token_overlap": guard_res["token_overlap"],
                "message": guard_res["reason"]
            },
            "audit_pack": None
        }

    matched_is = guard_res["matched_standard"].strip().upper()
    corpus_entry = corpus_map.get(matched_is, {})
    is_auto = "AIS" in matched_is or "MoRTH" in corpus_entry.get("department", "")

    if is_auto:
        dept = corpus_entry.get("department", "MoRTH / CMVR")
        conf_str = "95.00%"
        needs_review = False
    else:
        probs = model.predict_proba([req.text])[0]
        top_idx = probs.argmax()
        conf = float(probs[top_idx])
        dept = model.classes_[top_idx]
        conf_str = f"{conf * 100:.2f}%"
        needs_review = conf < 0.75

    governance = {
        "standard": corpus_entry.get("is_number", matched_is),
        "qco_order": corpus_entry.get("qco_order", "Mandatory Statutory QCO"),
        "scheme": corpus_entry.get("scheme", "Type Approval Certificate (TAC)" if is_auto else "Scheme-I (ISI Mark)"),
        "filing_portal": corpus_entry.get("portal", "ARAI/ICAT Homologation Portal" if is_auto else "Manakonline (e-BIS) Portal")
    }

    testing_labs = {
        "mandatory_tests": corpus_entry.get("mandatory_tests", "Standard physical, safety, and durability clauses"),
        "authorized_lab": corpus_entry.get("authorized_lab", "ARAI (Pune) / ICAT (Manesar)" if is_auto else "NABL / BIS Recognized Laboratory")
    }

    surveillance = {
        "cycle": corpus_entry.get("surveillance", "Conformity of Production (COP) Annual" if is_auto else "Annual surveillance inspection & factory sampling")
    }

    doc_list = req.documents if req.documents else ["factory_layout", "test_equipment", "qc_personnel"]
    gap_results = evaluate_readiness(doc_list, is_automotive=is_auto)

    return {
        "status": "verified" if not needs_review else "needs_manual_review",
        "query": req.text,
        "classification": {
            "predicted_department": dept,
            "confidence": conf_str,
            "needs_manual_review": needs_review
        },
        "grounding": {
            "matched": True,
            "matched_standard": matched_is,
            "matched_text": guard_res["matched_text"],
            "semantic_score": guard_res["best_score"],
            "token_overlap": guard_res["token_overlap"]
        },
        "audit_pack": {
            "governance": governance,
            "testing_and_labs": testing_labs,
            "gap_and_readiness": gap_results,
            "surveillance": surveillance
        }
    }

from fastapi.responses import Response
import io
import csv

@app.post("/audit/export")
def export_audit_csv(req: AuditRequest):
    audit_res = generate_audit_pack(req)
    if audit_res["status"] == "unverified":
        return Response(content="Query unverified or out of scope.", media_type="text/plain")

    pack = audit_res["audit_pack"]
    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(["COMPLIANCE AUDIT PACK SUMMARY"])
    writer.writerow(["Evaluated Product / Query", req.text])
    writer.writerow(["Target Standard", pack["governance"]["standard"]])
    writer.writerow(["Statutory QCO Order", pack["governance"]["qco_order"]])
    writer.writerow(["Certification Scheme", pack["governance"]["scheme"]])
    writer.writerow(["Assigned Homologation / Test Lab", pack["testing_and_labs"]["authorized_lab"]])
    writer.writerow(["Filing Portal", pack["governance"]["filing_portal"]])
    writer.writerow(["Readiness Score", pack["gap_and_readiness"]["readiness_score"]])
    writer.writerow(["Readiness Status", pack["gap_and_readiness"]["status"]])
    writer.writerow(["Critical Blocker Flag", pack["gap_and_readiness"]["critical_gap_flag"]])
    writer.writerow([])
    writer.writerow(["IDENTIFIED GAPS & STATUTORY REMEDIATION"])
    writer.writerow(["Item", "Weight Loss", "Critical Blocker", "Action Required"])
    for gap in pack["gap_and_readiness"]["gaps_identified"]:
        writer.writerow([gap["item"], f"-{gap['weight_loss']}%", gap["critical"], gap["action_required"]])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=audit_report_{pack['governance']['standard'].replace(' ', '_')}.csv"}
    )
