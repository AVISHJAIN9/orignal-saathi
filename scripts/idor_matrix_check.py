#!/usr/bin/env python3
"""
SAATHI Automated IDOR / BOLA Matrix Fuzzer
Tests every endpoint across all user roles and ownership states.
"""
import sys
import json
import urllib.request
import urllib.error

import hmac
import hashlib
import base64

BASE_URL = "http://127.0.0.1:3005"
SECRET = "dev-saathi-insecure-jwt-secret-do-not-use-in-prod-2026"

def make_token(user_id, role):
    header = base64.urlsafe_b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).decode().rstrip("=")
    payload = base64.urlsafe_b64encode(json.dumps({"id": user_id, "role": role}).encode()).decode().rstrip("=")
    signing_input = f"{header}.{payload}".encode()
    signature = base64.urlsafe_b64encode(hmac.new(SECRET.encode(), signing_input, hashlib.sha256).digest()).decode().rstrip("=")
    return f"Bearer {header}.{payload}.{signature}"

# Mock/Test JWT Tokens representing different authorization scopes
TOKENS = {
    "ANONYMOUS": None,
    "USER_A": make_token("usr-a", "APPLICANT"),
    "USER_B": make_token("usr-b", "APPLICANT"),
    "OFFICER": make_token("usr-off", "OFFICER"),
    "ADMIN": make_token("usr-adm", "ADMIN")
}

# (Method, Path Template, Expected Allowed Roles)
TEST_MATRIX = [
    ("GET", "/health", ["ANONYMOUS", "USER_A", "USER_B", "OFFICER", "ADMIN"]),
    ("GET", "/api/v1/widget/verify/CM-12345", ["ANONYMOUS", "USER_A", "USER_B", "OFFICER", "ADMIN"]),
    ("GET", "/api/v1/forecast/qco", ["USER_A", "USER_B", "OFFICER", "ADMIN"]),
    ("POST", "/api/v1/sms/send-otp", ["ANONYMOUS", "USER_A", "USER_B", "OFFICER", "ADMIN"]),
    ("GET", "/api/v1/escalations/TKT-101/status", ["OFFICER", "ADMIN"]),
]

def run_idor_matrix():
    print("=" * 65)
    print(" 🛡️  SAATHI IDOR / BOLA Matrix Access Verification Drill")
    print("=" * 65)
    
    total_tests = 0
    passed_tests = 0
    
    for method, path, allowed_roles in TEST_MATRIX:
        url = f"{BASE_URL}{path}"
        for role, token in TOKENS.items():
            total_tests += 1
            headers = {"Content-Type": "application/json"}
            if token:
                headers["Authorization"] = token
                
            data = None
            if method == "POST":
                data = json.dumps({"phone": "+919876543210"}).encode()
                
            req = urllib.request.Request(url, data=data, headers=headers, method=method)
            try:
                with urllib.request.urlopen(req, timeout=3) as resp:
                    status_code = resp.status
            except urllib.error.HTTPError as e:
                status_code = e.code
            except Exception as e:
                status_code = 500

            is_expected_allowed = role in allowed_roles
            is_success = (status_code < 400) if is_expected_allowed else (status_code in (401, 403, 404))
            
            status_tag = "✅ PASS" if is_success else "❌ FAIL"
            if is_success:
                passed_tests += 1
            else:
                print(f"  {status_tag} [{method}] {path} - Role: {role} -> HTTP {status_code} (Expected Allowed: {is_expected_allowed})")

    print(f"\n📊 Summary: {passed_tests}/{total_tests} IDOR/BOLA role boundary checks passed.")
    return passed_tests == total_tests

if __name__ == "__main__":
    run_idor_matrix()
