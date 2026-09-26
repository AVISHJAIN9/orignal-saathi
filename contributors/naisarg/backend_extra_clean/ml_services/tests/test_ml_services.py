import pytest
from fastapi.testclient import TestClient
from ml_services.main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"

def test_strict_qa_pass_grounded():
    res = client.post("/api/v1/ml/qa/strict", json={"question": "What is the pH limit in IS 10500 drinking water?"})
    assert res.status_code == 200
    data = res.json()
    assert data["declined"] is False
    assert "6.5" in data["answer"]
    assert len(data["citations"]) > 0

def test_strict_qa_decline_out_of_corpus():
    res = client.post("/api/v1/ml/qa/strict", json={"question": "What are the rules for rocket fuel in space missions?"})
    assert res.status_code == 200
    data = res.json()
    assert data["declined"] is True
    assert data["answer"] is None
    assert "Declined by SAATHI Grounding Guardrail" in data["reason"]

def test_adaptive_explain_simple():
    res = client.post("/api/v1/ml/explain", json={
        "clauseId": "IS10500-4.1",
        "clauseText": "pH value shall be between 6.5 and 8.5",
        "level": "simple"
    })
    assert res.status_code == 200
    assert "MSME Plain-Language Summary" in res.json()["explanation"]

def test_adaptive_explain_technical():
    res = client.post("/api/v1/ml/explain", json={
        "clauseId": "IS10500-4.1",
        "clauseText": "pH value shall be between 6.5 and 8.5",
        "level": "technical"
    })
    assert res.status_code == 200
    assert "Technical Engineering Compliance Analysis" in res.json()["explanation"]

def test_appeal_letter_generation():
    res = client.post("/api/v1/ml/letters/appeal", json={
        "rejectionReasonIds": ["ERR-01", "ERR-02"],
        "applicantDetails": {
            "applicantName": "Rajesh Sharma",
            "companyName": "Acme Industries Ltd",
            "applicationNumber": "BIS/APP/2026/1049"
        },
        "standardNumber": "IS 10500:2012"
    })
    assert res.status_code == 200
    data = res.json()
    assert "Acme Industries Ltd" in data["letterText"]
    assert "Regulation 11" in data["letterText"]
    assert len(data["statutoryCitations"]) >= 2

def test_qco_forecast_historical():
    res = client.get("/api/v1/ml/forecast/qco?category=Electrical")
    assert res.status_code == 200
    data = res.json()
    assert data["basis"] == "historical"
    assert data["confidenceScore"] > 0.5

def test_qco_forecast_seeded():
    res = client.get("/api/v1/ml/forecast/qco?category=RareNovelChemicalCompound")
    assert res.status_code == 200
    data = res.json()
    assert data["basis"] == "seeded"
