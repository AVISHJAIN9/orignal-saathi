import urllib.request
import json
import time

BASE_URL = "http://127.0.0.1:8000"

print("--- BIS Engine Pre-Flight Verification ---")

# 1. API Health Check
try:
    with urllib.request.urlopen(f"{BASE_URL}/", timeout=3) as resp:
        data = json.loads(resp.read().decode())
        print(f"[OK] Root Endpoint Alive: {data}")
except Exception as e:
    print(f"[FAIL] Backend API not responding at {BASE_URL}: {e}")
    exit(1)

# 2. Audit Endpoint & Latency Benchmark
sample_payload = json.dumps({
    "text": "Ordinary Portland Cement grade 53",
    "documents": ["factory_layout", "test_equipment", "calibration_certs"]
}).encode()

req = urllib.request.Request(
    f"{BASE_URL}/audit",
    data=sample_payload,
    headers={"Content-Type": "application/json"}
)

start = time.time()
try:
    with urllib.request.urlopen(req, timeout=5) as resp:
        latency = (time.time() - start) * 1000
        result = json.loads(resp.read().decode())
        
        dept = result["classification"]["predicted_department"]
        conf = result["classification"]["confidence"]
        std = result["audit_pack"]["governance"]["standard"]
        score = result["audit_pack"]["gap_and_readiness"]["readiness_score"]
        
        print(f"[OK] Inference Latency: {latency:.1f}ms")
        print(f"[OK] Target Standard: {std}")
        print(f"[OK] Department: {dept} ({conf})")
        print(f"[OK] Computed Readiness: {score}")
except Exception as e:
    print(f"[FAIL] Audit endpoint evaluation failed: {e}")
    exit(1)

print("--- System 100% Ready for Presentation ---")
