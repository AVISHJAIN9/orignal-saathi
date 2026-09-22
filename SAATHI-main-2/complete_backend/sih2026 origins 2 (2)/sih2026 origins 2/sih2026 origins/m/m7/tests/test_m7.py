"""
Unit tests for M7 Product-to-Standard Recommendation Service
"""
import pytest
from fastapi.testclient import TestClient
from m7.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_m7_health(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "HEALTHY"
    assert res.json()["service"] == "M7_PRODUCT_RECOMMENDATION"


def test_classify_d9_wizard_payload(client):
    # Payload matching D9 IClassificationClient interface
    payload = {
        "sessionId": "wizard-session-abc",
        "locale": "en",
        "answers": {
            "root_category": "electronics",
            "electronics_type": "led_lighting",
            "description": "3-pin wall plug with 250V rating"
        },
        "structuredQuery": {
            "category": "electronics",
            "subType": "lighting"
        }
    }
    res = client.post("/api/v1/recommend/classify", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["matches"]) > 0
    top_match = data["matches"][0]
    assert "IS 1293" in top_match["id"]
    assert top_match["scheme"] == "ISI_SCHEME_1"
    assert top_match["score"] >= 0.70


def test_classify_cement_product(client):
    payload = {
        "query": "Ordinary Portland cement 53 grade for structural construction"
    }
    res = client.post("/api/v1/recommend/classify", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["matches"]) > 0
    top_match = data["matches"][0]
    assert top_match["id"] == "IS 269:2015"
    assert top_match["mandatory_qco"] is True


def test_classify_battery_product(client):
    payload = {
        "query": "Rechargeable lithium ion battery pack for portable laptop"
    }
    res = client.post("/api/v1/recommend/classify", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["matches"]) > 0
    top_match = data["matches"][0]
    assert "IS 16046" in top_match["id"]
    assert top_match["scheme"] == "CRS_SCHEME_2"


def test_classify_water_product(client):
    payload = {
        "query": "Packaged natural mineral drinking water in 1-litre bottles",
        "category": "food-processing"
    }
    res = client.post("/api/v1/recommend/classify", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["matches"]) > 0
    top_match = data["matches"][0]
    assert top_match["id"] == "IS 10500:2012"
