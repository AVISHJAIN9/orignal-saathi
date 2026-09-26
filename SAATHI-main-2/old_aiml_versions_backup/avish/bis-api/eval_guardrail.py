from guardrail import BISGuardrail

guard = BISGuardrail()

TEST_SUITE = [
    # --- In-Domain (Expected: PASS) ---
    ("Portland Pozzolana Cement for structural brickwork", True),
    ("Thermo mechanically treated TMT rebars 16mm", True),
    ("Hot rolled medium tensile steel plates IS 2062", True),
    ("Domestic liquid heating electric kettle", True),
    ("Cylindrical secondary lithium battery packs", True),
    ("Industrial grade pure Methanol chemical", True),
    ("Geotextiles synthetic fabric for pavement subgrade", True),
    ("Plastic toys for toddlers choking hazards", True),
    ("Packaged drinking water 1 litre bottles", True),
    ("Mild steel tubular pipes for water supply", True),

    # --- Out-of-Domain / Adversarial Noise (Expected: BLOCKED) ---
    ("Streaming video subscription for laptop", False),
    ("Organic avocado and fresh bananas delivery", False),
    ("Handmade ceramic tea cup without electrical parts", False),
    ("Crypto token trading bot platform", False),
    ("Second-hand wooden office furniture", False),
    ("Leather wallet with RFID protection pocket", False),
    ("Dog food grain-free salmon formula", False),
    ("Aerospace jet engine turbine blade alloy", False),
    ("Custom cotton hoodie with graphic print", False),
    ("Generic smart home app backend source code", False),
]

passed_tests = 0
failed_tests = []

print("\n" + "="*70)
print(f"{'QUERY':<50} | {'EXPECT':<6} | {'RESULT':<7} | {'SCORE':<5}")
print("="*70)

for query, expected in TEST_SUITE:
    res = guard.verify(query)
    actual = res["passed"]
    
    is_correct = (actual == expected)
    if is_correct:
        passed_tests += 1
    else:
        failed_tests.append((query, expected, actual, res))
        
    expect_str = "PASS" if expected else "BLOCK"
    actual_str = "PASS" if actual else "BLOCK"
    print(f"{query[:48]:<50} | {expect_str:<6} | {actual_str:<7} | {res['best_score']:<5.2f}")

print("="*70)
accuracy = (passed_tests / len(TEST_SUITE)) * 100
print(f"Test Suite Accuracy: {accuracy:.1f}% ({passed_tests}/{len(TEST_SUITE)} passed)")

if failed_tests:
    print("\nRegressions / Boundary Edge Cases to Tune:")
    for query, exp, act, r in failed_tests:
        print(f"  Query: '{query}' -> Expected {exp}, got {act}. Score: {r['best_score']}, Overlap: {r['token_overlap']}")
else:
    print("SUCCESS: 0 regressions across both positive and adversarial domains.")
