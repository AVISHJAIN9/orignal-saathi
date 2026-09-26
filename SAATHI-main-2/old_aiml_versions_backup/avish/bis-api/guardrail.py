import re
import numpy as np
import faiss
import json
from sentence_transformers import SentenceTransformer

STOPWORDS = {
    "for", "and", "the", "a", "an", "in", "of", "to", "with", "under",
    "grade", "part", "sec", "is", "standard", "order", "quality", "control"
}

class BISGuardrail:
    def __init__(self, index_path="model2_rag_faiss.index", corpus_path="model2_corpus.json"):
        self.encoder = SentenceTransformer("all-MiniLM-L6-v2")
        self.index = faiss.read_index(index_path)
        with open(corpus_path, "r") as f:
            self.corpus = json.load(f)

    def _clean_tokens(self, text: str) -> set:
        tokens = re.findall(r"\b[a-zA-Z0-9]{3,}\b", text.lower())
        return {t for t in tokens if t not in STOPWORDS}

    def verify(self, query: str):
        q_vec = self.encoder.encode([query], convert_to_numpy=True)
        faiss.normalize_L2(q_vec)
        scores, indices = self.index.search(q_vec, k=1)

        best_score = float(scores[0][0])
        best_idx = int(indices[0][0])
        matched_doc = self.corpus[best_idx]

        q_tokens = self._clean_tokens(query)
        doc_tokens = self._clean_tokens(matched_doc["text"])
        overlap = len(q_tokens & doc_tokens) / max(len(q_tokens), 1)

        if overlap >= 0.35:
            passed = best_score >= 0.38
        else:
            passed = (best_score >= 0.50) and (overlap >= 0.20)

        return {
            "passed": passed,
            "best_score": round(best_score, 4),
            "token_overlap": round(overlap, 4),
            "matched_standard": matched_doc["is_number"],
            "matched_text": matched_doc["text"],
            "reason": "Direct Statutory Grounding" if passed else "Low Semantic Grounding Confidence"
        }
