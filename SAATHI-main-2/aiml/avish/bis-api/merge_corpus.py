import json
import os
import re

CORPUS_FILE = "model2_corpus.json"
STAGING_FILE = "raw_standards_scraped.json"

# Load existing corpus if present
existing_entries = []
if os.path.exists(CORPUS_FILE):
    with open(CORPUS_FILE, "r") as f:
        try:
            existing_entries = json.load(f)
        except Exception:
            existing_entries = []

print(f"Existing corpus size: {len(existing_entries)} entries")

# Extract existing IS numbers for deduplication
seen_standards = set()
merged_corpus = []

for entry in existing_entries:
    is_num = entry.get("is_number", "").strip().upper()
    if is_num and is_num not in seen_standards:
        seen_standards.add(is_num)
        merged_corpus.append(entry)

# Load scraped staging data
if os.path.exists(STAGING_FILE):
    with open(STAGING_FILE, "r") as f:
        staged = json.load(f)
        for item in staged:
            is_num = item.get("is_number", "").strip().upper()
            if is_num not in seen_standards:
                seen_standards.add(is_num)
                merged_corpus.append(item)

# Save deduplicated master corpus
with open(CORPUS_FILE, "w") as f:
    json.dump(merged_corpus, f, indent=2)

print(f"Consolidated corpus successfully written: {len(merged_corpus)} unique standards saved in {CORPUS_FILE}")
