import json
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

CORPUS_FILE = "model2_corpus.json"
INDEX_FILE = "model2_rag_faiss.index"
MODEL_NAME = "all-MiniLM-L6-v2"

print(f"Loading local embedding model: {MODEL_NAME}...")
encoder = SentenceTransformer(MODEL_NAME)

with open(CORPUS_FILE, "r") as f:
    corpus = json.load(f)

texts = [doc["text"] for doc in corpus]
print(f"Encoding {len(texts)} documents into dense vectors...")

# Encode and normalize for Cosine Similarity
embeddings = encoder.encode(texts, batch_size=32, show_progress_bar=True, convert_to_numpy=True)
faiss.normalize_L2(embeddings)

dimension = embeddings.shape[1]
index = faiss.IndexFlatIP(dimension)
index.add(embeddings)

faiss.write_index(index, INDEX_FILE)
print(f"Index successfully written: {index.ntotal} vectors indexed into {INDEX_FILE}")
