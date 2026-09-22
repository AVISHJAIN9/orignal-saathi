import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

INDEX_FILE = "model2_rag_faiss.index"
CORPUS_FILE = "model2_corpus.json"

encoder = SentenceTransformer("all-MiniLM-L6-v2")
index = faiss.read_index(INDEX_FILE)

with open(CORPUS_FILE, "r") as f:
    corpus = json.load(f)

test_queries = [
    "Ordinary Portland Cement grade 53",
    "Structural steel tubes for infrastructure",
    "Flame retardant electrical wiring cables",
    "100% Cotton drill fabrics for industrial uniforms"
]

print("Executing Sanity Retrieval Tests...\n" + "="*50)

for q in test_queries:
    q_vec = encoder.encode([q], convert_to_numpy=True)
    faiss.normalize_L2(q_vec)
    
    scores, indices = index.search(q_vec, k=1)
    best_idx = indices[0][0]
    best_score = float(scores[0][0])
    
    print(f"Query: '{q}'")
    print(f"  Top Match : {corpus[best_idx]['text']}")
    print(f"  IS Number : {corpus[best_idx].get('is_number', 'N/A')}")
    print(f"  Sim Score : {best_score:.4f}")
    print("-" * 50)
