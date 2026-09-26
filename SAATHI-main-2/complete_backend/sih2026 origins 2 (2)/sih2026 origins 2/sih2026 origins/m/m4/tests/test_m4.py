"""
Unit tests for M4 Query Understanding Service
"""
import pytest
from fastapi.testclient import TestClient
from m4.main import app
from m4.classifier import QueryUnderstandingEngine


@pytest.fixture
def client():
    return TestClient(app)


def test_m4_health(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "HEALTHY"
    assert res.json()["service"] == "M4_QUERY_UNDERSTANDING"


def test_standard_lookup_intent(client):
    payload = {"query": "What are the permissible limits in IS 1293:2019 for plugs?"}
    res = client.post("/api/v1/query/understand", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["intent"] == "standard_lookup"
    assert "IS 1293:2019" in data["standard_numbers"]
    assert "ELECTRICAL" in data["product_categories"]
    assert data["confidence"] >= 0.85


def test_certification_process_intent(client):
    payload = {"query": "How to apply for ISI mark certification step by step for cement?"}
    res = client.post("/api/v1/query/understand", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["intent"] == "certification_process"
    assert "CEMENT" in data["product_categories"]
    assert data["confidence"] >= 0.80


def test_licensing_intent(client):
    payload = {"query": "What is the annual marking fee and procedure to renew license CM/L-1234567?"}
    res = client.post("/api/v1/query/understand", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["intent"] == "licensing"
    assert data["confidence"] >= 0.80


def test_general_query_intent(client):
    payload = {"query": "Hello, can you help me find contact details of the BIS Delhi regional office?"}
    res = client.post("/api/v1/query/understand", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["intent"] == "general_query"


def test_regex_is_extraction():
    entities, stds, cats = QueryUnderstandingEngine.extract_entities(
        "Refer to IS 16046 (Part 1):2018 and IS 302 for domestic electrical appliances"
    )
    assert len(stds) >= 1
    assert any("16046" in s for s in stds)
    assert "ELECTRICAL" in cats
