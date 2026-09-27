"""
SAATHI — BIS Intelligent Assistant AIML / RAG Service
Definitive Production Microservice embedding Aditi's Complete RAG Pipeline
(116,597 corpus documents, 384-dim FAISS IndexFlatIP, BAAI/bge-small-en-v1.5)
"""

import os
import re
import json
import time
from collections import defaultdict
from pathlib import Path
from typing import List, Dict, Any, Optional
from contextlib import asynccontextmanager

import requests
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import faiss
import numpy as np

# Optional HuggingFace / SentenceTransformers
try:
    from sentence_transformers import SentenceTransformer
    HAS_SENTENCE_TRANSFORMERS = True
except ImportError:
    HAS_SENTENCE_TRANSFORMERS = False

# Google Generative AI
try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False

# Sarvam AI Client
try:
    from sarvamai import SarvamAI
    HAS_SARVAM = True
except ImportError:
    HAS_SARVAM = False

BASE_DIR = Path(__file__).resolve().parent
ARTIFACTS_DIR = BASE_DIR / "artifacts"
FAISS_PATH = ARTIFACTS_DIR / "bis_faiss.index"
CORPUS_PATH = ARTIFACTS_DIR / "bis_rag_corpus.jsonl"

# Runtime state
faiss_index = None
corpus = []
standards_by_identifier = defaultdict(list)
standard_core_indices = []
cross_by_internal_id = defaultdict(list)
international_by_internal_id = defaultdict(list)
referred_by_internal_id = defaultdict(list)
embedding_model = None

# API Keys
GEMINI_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyAPB4T6Kq9P8VHWudziZ5bjmq_OP2fVGrA")
SARVAM_KEY = os.getenv("SARVAM_API_KEY", "sk_krcpnwir_L5wQZIIDqsCJ4kegSE6LEP6a")

if HAS_GEMINI and GEMINI_KEY:
    try:
        genai.configure(api_key=GEMINI_KEY)
    except Exception as e:
        print("Gemini configure warning:", e)


# ================================================================
# IDENTIFIER NORMALIZATION & EXTRACTION
# ================================================================

def normalize_identifier(value: str) -> str:
    if not value:
        return ""
    value = str(value).strip()
    value = re.sub(r"(IS(?:/IEC)?\s+[^|]+?:\s*\d{4})IEC\s+", r"\1 — IEC ", value, flags=re.IGNORECASE)
    value = re.sub(r"^IS\s*/\s*IEC\s*", "IS/IEC ", value, flags=re.IGNORECASE)
    value = re.sub(r"^IS\s*/\s*ISO\s*", "IS/ISO ", value, flags=re.IGNORECASE)
    value = re.sub(r"\s*:\s*", ":", value)
    value = re.sub(r"\s*/\s*", "/", value)
    value = re.sub(r"\s*-\s*", "-", value)
    value = re.sub(r"\s*—\s*", " — ", value)
    value = re.sub(r"\s+", " ", value).strip()
    
    m = re.match(r"^IS/IEC\s*:\d{4}\s*IEC\s+(.+)$", value, flags=re.IGNORECASE)
    if m:
        value = "IS/IEC " + m.group(1).strip()
        
    value = re.sub(r"^(.+?\d{4})IEC\s+(.+)$", r"\1 — IEC \2", value, flags=re.IGNORECASE)
    return value.strip()


def extract_doc_identifier(doc: Dict[str, Any]) -> str:
    text = str(doc.get("text", "") or "")
    m = re.search(r"BIS Standard:\s*(.*?)\n", text)
    if m:
        return normalize_identifier(m.group(1))
    ident = doc.get("is_number") or doc.get("catalogue_is_no") or ""
    return normalize_identifier(ident)


def extract_doc_title(doc: Dict[str, Any]) -> str:
    text = str(doc.get("text", "") or "")
    m = re.search(r"Title:\s*(.*?)\n", text)
    if m:
        return m.group(1).strip()
    return str(doc.get("title", "") or doc.get("is_title", "") or "").strip()


def extract_identifiers(query: str) -> List[str]:
    query_str = str(query or "")
    identifiers = []
    
    bis_patterns = [
        r"\bIS\s*/\s*IEC\s+\d+(?:\s*-\s*\d+)?(?:\s*:\s*|\s+)\d{4}\b",
        r"\bIS\s+\d+(?:\s*\([^)]+\))?(?:\s*:\s*|\s+)\d{4}\b",
        r"\bIS\s*/\s*IEC\s+\d+\s*:\s*PART\b.{0,100}?\d{4}\b",
        r"\bIS\s+\d+(?:\s*-\s*\d+)?\b",
    ]
    
    for pattern in bis_patterns:
        for match in re.finditer(pattern, query_str, flags=re.IGNORECASE):
            norm = normalize_identifier(match.group(0))
            if norm and norm not in identifiers:
                identifiers.append(norm)
                
    malformed_patterns = [
        r"IS/IEC\s*:\s*\d{4}\s*IEC\s+\d+\s*:\s*\d{4}",
        r"IS/IEC\s*:\s*\d{4}\s*IEC\s+\d+",
    ]
    for pattern in malformed_patterns:
        for match in re.finditer(pattern, query_str, flags=re.IGNORECASE):
            norm = normalize_identifier(match.group(0))
            if norm and norm not in identifiers:
                identifiers.append(norm)
                
    cleaned = []
    for ident in identifiers:
        if ident not in cleaned:
            cleaned.append(ident)
            
    if not cleaned:
        for match in re.finditer(r"\bIEC\s+\d+(?:-\d+)?\s*:\s*\d{4}\b", query_str, flags=re.IGNORECASE):
            norm = normalize_identifier(match.group(0))
            if norm and norm not in cleaned:
                cleaned.append(norm)
                
    return cleaned


def detect_relationship_direction(query: str) -> Optional[str]:
    q = query.lower()
    if any(k in q for k in ["refer to", "referred by", "which standards refer", "which standards use", "which bis standards refer"]):
        return "reverse"
    if any(k in q for k in ["references", "referenced by", "what does it reference", "cross references", "outgoing"]):
        return "outgoing"
    return None


def detect_compound_query(query: str, identifiers: List[str] = None) -> bool:
    q = query.lower()
    return any(k in q for k in ["and its references", "along with references", "with all references", "summary and references"])


# ================================================================
# RESOLVER & RELATIONSHIP EVIDENCE
# ================================================================

def resolve_standard_fixed(identifier: str, preferred_direction: Optional[str] = None) -> Optional[Dict[str, Any]]:
    identifier = normalize_identifier(identifier)
    candidates = standards_by_identifier.get(identifier, [])
    if not candidates:
        # Fuzzy fallback
        ident_upper = identifier.upper()
        for k, v in standards_by_identifier.items():
            if k.upper() == ident_upper or ident_upper in k.upper():
                candidates = v
                break
    if not candidates:
        return None
    if len(candidates) == 1:
        return candidates[0]
        
    scored = []
    for doc in candidates:
        int_id = str(doc.get("internal_id", ""))
        out_count = len(cross_by_internal_id.get(int_id, [])) + len(international_by_internal_id.get(int_id, []))
        rev_count = len(referred_by_internal_id.get(int_id, []))
        score = 0
        if preferred_direction == "outgoing":
            score += out_count * 100
        elif preferred_direction == "reverse":
            score += rev_count * 100
        else:
            score += (out_count + rev_count)
        scored.append((score, out_count, rev_count, doc))
        
    scored.sort(key=lambda x: (x[0], x[1] + x[2]), reverse=True)
    return scored[0][3]


def standard_to_evidence(doc: Dict[str, Any], source: str = "exact") -> Dict[str, Any]:
    ident = extract_doc_identifier(doc)
    title = extract_doc_title(doc)
    text = str(doc.get("text", "") or "")
    return {
        "evidence_type": "standard",
        "source": source,
        "internal_id": str(doc.get("internal_id", "")),
        "identifier": ident,
        "title": title,
        "text": text[:1500],
    }


def make_relationship_evidence_fixed(item: Dict[str, Any], direction: str, queried_identifier: str) -> Dict[str, Any]:
    doc = item["doc"]
    ref = item["reference"]
    int_id = str(doc.get("internal_id", ""))
    dtype = str(doc.get("document_type", ""))
    
    if direction == "outgoing":
        return {
            "evidence_type": "relationship",
            "source": dtype,
            "internal_id": int_id,
            "identifier": queried_identifier,
            "relationship_type": dtype,
            "relationship_direction": "outgoing",
            "source_identifier": queried_identifier,
            "referenced_identifier": normalize_identifier(ref),
            "text": str(doc.get("text", "") or "")[:1000],
        }
    else:
        return {
            "evidence_type": "relationship",
            "source": dtype,
            "internal_id": int_id,
            "identifier": queried_identifier,
            "relationship_type": dtype,
            "relationship_direction": "reverse",
            "referring_identifier": normalize_identifier(ref),
            "target_identifier": queried_identifier,
            "text": str(doc.get("text", "") or "")[:1000],
        }


def build_relationship_evidence(identifier: str, direction: str, max_results: int = 100) -> List[Dict[str, Any]]:
    identifier = normalize_identifier(identifier)
    std_doc = resolve_standard_fixed(identifier, preferred_direction=direction)
    if std_doc is None:
        return []
        
    internal_id = str(std_doc.get("internal_id", ""))
    results = []
    
    if direction == "outgoing":
        cross_items = cross_by_internal_id.get(internal_id, [])
        intl_items = international_by_internal_id.get(internal_id, [])
        for item in cross_items:
            results.append(make_relationship_evidence_fixed(item, "outgoing", identifier))
        for item in intl_items:
            results.append(make_relationship_evidence_fixed(item, "outgoing", identifier))
        return results[:max_results]
        
    if direction == "reverse":
        rev_items = referred_by_internal_id.get(internal_id, [])
        for item in rev_items:
            results.append(make_relationship_evidence_fixed(item, "reverse", identifier))
        return results[:max_results]
        
    return []


def semantic_search(query: str, top_k: int = 5) -> List[Dict[str, Any]]:
    if faiss_index is None or embedding_model is None:
        return []
    try:
        q_emb = embedding_model.encode([query], normalize_embeddings=True)
        q_emb = np.array(q_emb, dtype=np.float32)
        faiss.normalize_L2(q_emb)
        distances, indices = faiss_index.search(q_emb, top_k * 8)
        evidence = []
        for idx in indices[0]:
            if 0 <= idx < len(corpus):
                doc = corpus[idx]
                dtype = str(doc.get("document_type", ""))
                if dtype == "standard_core":
                    evidence.append(standard_to_evidence(doc, source="semantic"))
                elif dtype in ("referred_by", "cross_references", "international_references"):
                    ident = extract_doc_identifier(doc)
                    title = extract_doc_title(doc)
                    if not ident:
                        m = re.search(r"Referenc(?:ing|ed|ing)?\s*IS:\s*(.+?)(?=\s*\||\s*\n|$)", doc.get("text", ""))
                        if m:
                            ident = normalize_identifier(m.group(1))
                    evidence.append({
                        "evidence_type": "standard",
                        "source": f"semantic_{dtype}",
                        "internal_id": str(doc.get("internal_id", "")),
                        "identifier": ident or f"Standard-{doc.get('internal_id', '')}",
                        "title": title or str(doc.get("text", "")).splitlines()[0][:120],
                        "text": str(doc.get("text", "") or "")[:1500],
                    })
                if len(evidence) >= top_k:
                    break
        return evidence
    except Exception as e:
        print("Semantic search error:", e)
        return []


def lexical_search(query: str, top_k: int = 5) -> List[Dict[str, Any]]:
    stopwords = {"how", "what", "which", "where", "apply", "for", "with", "the", "and", "under", "can", "does", "about", "indian", "standards", "standard", "licence", "license"}
    tokens = [w for w in re.findall(r"\b[A-Za-z0-9]+\b", query.lower()) if len(w) > 2 and w not in stopwords]
    if not tokens:
        return []
    scored = []
    seen = set()
    for idx in standard_core_indices:
        if idx < len(corpus):
            doc = corpus[idx]
            text_lower = str(doc.get("text", "")).lower()
            score = sum(1 for t in tokens if t in text_lower)
            if score > 0:
                ident = extract_doc_identifier(doc)
                if ident and ident not in seen:
                    seen.add(ident)
                    scored.append((score, standard_to_evidence(doc, source="lexical")))
                    if len(scored) >= 200:
                        break
    scored.sort(key=lambda x: x[0], reverse=True)
    return [s[1] for s in scored[:top_k]]


def deduplicate_evidence(evidence: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    result = []
    seen_standards = set()
    for item in evidence:
        if item.get("evidence_type") == "standard":
            key = item.get("internal_id") or item.get("identifier")
            if key in seen_standards:
                continue
            seen_standards.add(key)
            result.append(item)
        else:
            # Relationship evidence is intentionally preserved
            result.append(item)
    return result


def retrieve_evidence_api(query: str, semantic_top_k: int = 5) -> Dict[str, Any]:
    identifiers = extract_identifiers(query)
    rel_direction = detect_relationship_direction(query)
    compound = detect_compound_query(query, identifiers)
    
    evidence = []
    plan = []
    
    for identifier in identifiers:
        std_doc = resolve_standard_fixed(identifier, preferred_direction=rel_direction)
        if std_doc is not None:
            evidence.append(standard_to_evidence(std_doc, source="exact"))
            plan.append(f"standard:{identifier}")
            
        if rel_direction:
            rel_ev = build_relationship_evidence(identifier, rel_direction, max_results=100)
            evidence.extend(rel_ev)
            if rel_ev:
                plan.append(f"{'reverse_references' if rel_direction == 'reverse' else 'outgoing_references'}:{identifier}")
        elif compound:
            rel_ev = build_relationship_evidence(identifier, "outgoing", max_results=100)
            evidence.extend(rel_ev)
            if rel_ev:
                plan.append(f"outgoing_references:{identifier}")
                
    if not identifiers:
        sem_ev = semantic_search(query, top_k=semantic_top_k)
        evidence.extend(sem_ev)
        if sem_ev:
            plan.append("semantic")
        if len(evidence) < semantic_top_k:
            lex_ev = lexical_search(query, top_k=semantic_top_k)
            evidence.extend(lex_ev)
            if lex_ev:
                plan.append("lexical")
            
    evidence = deduplicate_evidence(evidence)
    return {
        "query": query,
        "identifiers": identifiers,
        "relationship_direction": rel_direction,
        "compound": compound,
        "retrieval_plan": plan,
        "evidence": evidence,
        "evidence_count": len(evidence),
    }


# ================================================================
# GROUNDED LLM GENERATION & CITATION VALIDATION
# ================================================================

def generate_grounded_answer(query: str, evidence: List[Dict[str, Any]], language: Optional[str] = "en") -> Dict[str, Any]:
    evidence_text = json.dumps(evidence[:15], indent=2, ensure_ascii=False)
    
    lang_names = {
        "en": "English", "hi": "Hindi", "gu": "Gujarati", "ta": "Tamil",
        "te": "Telugu", "kn": "Kannada", "ml": "Malayalam", "mr": "Marathi",
        "bn": "Bengali", "pa": "Punjabi", "or": "Odia", "as": "Assamese", "ur": "Urdu"
    }
    target_lang = lang_names.get(language, "English")
    lang_instruction = ""
    if language and language != "en":
        lang_instruction = f"\n5. IMPORTANT: Reply fluently and naturally in {target_lang}. Keep all Indian Standard numbers (such as [IS 16102], [IS 302]) intact in English bracket notation."

    prompt = f"""You are SAATHI, the official AI Compliance and Standards Navigator for the Bureau of Indian Standards (BIS).
Answer the citizen/MSME inquiry with strict adherence to the provided BIS Evidence.

Query: {query}

BIS Evidence:
{evidence_text}

Instructions:
1. Provide a professional, concise, and technically accurate explanation.
2. ALWAYS cite the standard numbers (e.g. [IS 302-1], [IS/IEC 60691:2023], [IS 16102]) where applicable.
3. If specific clauses, committees, or references are in the evidence, list them clearly.
4. If asked about references or which standards refer to a given standard, list the referring standards clearly.{lang_instruction}
"""
    
    # 1. Try Sarvam 105B (Production Indic Conversational LLM)
    if SARVAM_KEY:
        try:
            headers = {
                "api-subscription-key": SARVAM_KEY,
                "Content-Type": "application/json",
            }
            payload = {
                "model": "sarvam-105b-conversations",
                "messages": [{"role": "user", "content": prompt}],
            }
            resp = requests.post("https://api.sarvam.ai/v1/chat/completions", headers=headers, json=payload, timeout=25)
            if resp.status_code == 200:
                data = resp.json()
                content = data["choices"][0]["message"]["content"]
                return {"answer": content.strip(), "model": "sarvam-105b-conversations", "success": True}
        except Exception as e:
            print("Sarvam generation fallback:", e)

    # 2. Try Gemini 1.5 Flash if available
    if HAS_GEMINI and GEMINI_KEY:
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            resp = model.generate_content(prompt)
            if resp and resp.text:
                return {"answer": resp.text.strip(), "model": "gemini-1.5-flash", "success": True}
        except Exception as e:
            print("Gemini generation fallback:", e)
            
    # 3. Extractive structured fallback
    lines = [f"Official BIS Standards Navigator Report for '{query}':\n"]
    for item in evidence:
        if item.get("evidence_type") == "standard":
            lines.append(f"• Standard [{item.get('identifier')}]: {item.get('title')}")
        elif item.get("evidence_type") == "relationship":
            ref = item.get("referring_identifier") or item.get("referenced_identifier")
            lines.append(f"• Reference [{ref}]")
    return {"answer": "\n".join(lines), "model": "rule-grounding", "success": True}


def validate_citations(answer: str, evidence: List[Dict[str, Any]]) -> List[Dict[str, str]]:
    raw_citations = re.findall(r"\[(?:IS[A-Za-z0-9/:\-\s—]+)\]", answer)
    citations = []
    seen = set()
    for c in raw_citations:
        clean = c.strip("[]").strip()
        if clean and clean not in seen:
            seen.add(clean)
            citations.append({
                "standardNumber": clean,
                "title": f"Official BIS Standard {clean}",
                "url": f"https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/knowyourstandards/issearch?isno={clean}",
            })
    if not citations and evidence:
        for e in evidence[:5]:
            ident = e.get("identifier") or e.get("referring_identifier") or e.get("referenced_identifier")
            if ident and ident not in seen:
                seen.add(ident)
                citations.append({
                    "standardNumber": ident,
                    "title": e.get("title") or f"BIS Standard {ident}",
                    "url": f"https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/knowyourstandards/issearch?isno={ident}",
                })
    return citations


# ================================================================
# FASTAPI LIFESPAN & APP DEFINITION
# ================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    global faiss_index, corpus, standards_by_identifier, standard_core_indices
    global cross_by_internal_id, international_by_internal_id, referred_by_internal_id, embedding_model
    
    print("================================================================")
    print("SAATHI — INITIALIZING ADITI'S DEFINITIVE AIML RAG PIPELINE")
    print("================================================================")
    start_time = time.time()
    
    # 1. Load FAISS Index
    if FAISS_PATH.exists():
        faiss_index = faiss.read_index(str(FAISS_PATH))
        print(f"Loaded FAISS Index: {faiss_index.ntotal:,} vectors in {time.time() - start_time:.2f}s")
        
    # 2. Load Corpus JSONL
    if CORPUS_PATH.exists():
        print("Loading bis_rag_corpus.jsonl...")
        with open(CORPUS_PATH, "r", encoding="utf-8") as f:
            for idx, line in enumerate(f):
                if line.strip():
                    doc = json.loads(line)
                    corpus.append(doc)
                    dtype = str(doc.get("document_type", "")).strip()
                    int_id = str(doc.get("internal_id", "")).strip()
                    text = str(doc.get("text", "") or "")
                    
                    if dtype == "standard_core":
                        standard_core_indices.append(idx)
                        ident = extract_doc_identifier(doc)
                        if ident:
                            standards_by_identifier[ident].append(doc)
                    elif dtype == "cross_references" and int_id:
                        for match in re.finditer(r"Referenced IS:\s*(.+?)(?=\s*\||\s*\n|$)", text, flags=re.I):
                            ref = match.group(1).strip()
                            if ref:
                                cross_by_internal_id[int_id].append({"doc": doc, "reference": ref})
                    elif dtype == "international_references" and int_id:
                        for match in re.finditer(r"International Standard:\s*(.+?)(?=\s*\||\s*\n|$)", text, flags=re.I):
                            ref = match.group(1).strip()
                            if ref:
                                international_by_internal_id[int_id].append({"doc": doc, "reference": ref})
                    elif dtype == "referred_by" and int_id:
                        for match in re.finditer(r"Referenc(?:ing|ed|ing)?\s*IS:\s*(.+?)(?=\s*\||\s*\n|$)", text, flags=re.I):
                            ref = match.group(1).strip()
                            if ref:
                                referred_by_internal_id[int_id].append({"doc": doc, "reference": ref})
                                
        print(f"Loaded {len(corpus):,} corpus documents")
        print(f"Unique Standard Identifiers: {len(standards_by_identifier):,}")
        print(f"Cross-reference source standards: {len(cross_by_internal_id):,}")
        print(f"International-reference source standards: {len(international_by_internal_id):,}")
        print(f"Reverse-reference target standards: {len(referred_by_internal_id):,}")
        
    # 3. Load Embedding Model asynchronously
    def load_embed():
        global embedding_model
        if HAS_SENTENCE_TRANSFORMERS:
            try:
                embedding_model = SentenceTransformer("BAAI/bge-small-en-v1.5")
                print("Loaded BAAI/bge-small-en-v1.5 embedding model")
            except Exception as e:
                print("Embedding model warning:", e)

    import threading
    threading.Thread(target=load_embed, daemon=True).start()

    print(f"RAG Runtime ready in {time.time() - start_time:.2f}s")
    yield
    print("Shutting down AIML service")

app = FastAPI(
    title="SAATHI BIS Intelligent Assistant — AIML RAG Microservice",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str
    language: Optional[str] = "en"
    conversation_id: Optional[str] = None

class RetrieveRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5

@app.get("/api/v1/rag/health")
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SAATHI AIML RAG Pipeline (Aditi Latest)",
        "vectors_indexed": faiss_index.ntotal if faiss_index else 0,
        "corpus_documents": len(corpus),
        "unique_identifiers": len(standards_by_identifier),
        "embedding_model": "BAAI/bge-small-en-v1.5",
        "llm_engines": ["gemini-1.5-flash", "sarvam-105b-conversations"],
    }

@app.post("/api/v1/rag/retrieve")
def retrieve_endpoint(req: RetrieveRequest):
    return retrieve_evidence_api(req.query, semantic_top_k=req.top_k or 5)

@app.post("/api/v1/chat")
@app.post("/api/v1/rag/ask")
@app.post("/api/v1/chat/message")
def chat_endpoint(req: ChatRequest):
    if not req.query or not req.query.strip():
        raise HTTPException(status_code=400, detail="Query is required")
        
    # 1. Retrieve Evidence with full relationship resolution
    retrieval = retrieve_evidence_api(req.query)
    evidence = retrieval.get("evidence", [])
    
    # 2. Grounded LLM Generation
    gen_res = generate_grounded_answer(req.query, evidence, language=req.language or "en")
    
    # 3. Citation Extraction & Verification
    citations = validate_citations(gen_res["answer"], evidence)
    
    return {
        "reply": gen_res["answer"],
        "answer": gen_res["answer"],
        "text": gen_res["answer"],
        "citations": citations,
        "model": gen_res.get("model", "sarvam-105b-conversations"),
        "evidence_count": len(evidence),
        "retrieval_plan": retrieval.get("retrieval_plan", []),
    }

class TranslateRequest(BaseModel):
    text: str
    target_language_code: Optional[str] = "hi-IN"
    source_language_code: Optional[str] = "en-IN"

class TTSRequest(BaseModel):
    text: str
    target_language_code: Optional[str] = "hi-IN"
    speaker: Optional[str] = "ritu"

@app.post("/indic/translate")
@app.post("/api/v1/indic/translate")
def translate_endpoint(req: TranslateRequest):
    if not req.text or not req.text.strip():
        return {"translatedText": "", "translated_text": ""}
    
    lang_names = {
        "hi-IN": "Hindi", "ta-IN": "Tamil", "te-IN": "Telugu", "mr-IN": "Marathi",
        "bn-IN": "Bengali", "gu-IN": "Gujarati", "kn-IN": "Kannada", "ml-IN": "Malayalam",
        "pa-IN": "Punjabi", "od-IN": "Odia", "or-IN": "Odia", "ur-IN": "Urdu",
        "as-IN": "Assamese", "hi": "Hindi", "gu": "Gujarati", "ta": "Tamil", "te": "Telugu",
        "mr": "Marathi", "bn": "Bengali", "kn": "Kannada", "ml": "Malayalam", "pa": "Punjabi",
    }
    target_lang = lang_names.get(req.target_language_code, "Hindi")

    if SARVAM_KEY:
        # 1. Use Sarvam 105B (Handles full-length responses without 1000 char restriction)
        try:
            headers = {
                "api-subscription-key": SARVAM_KEY,
                "Content-Type": "application/json",
            }
            prompt = (
                f"Translate the following Indian Standards compliance text accurately and fluently into {target_lang}. "
                "Keep all Indian Standard numbers (such as [IS 16102], [IS 17803:2022], [IS 302]) intact in English bracket notation. "
                "Maintain all paragraphs, bullet points, and numbered lists. "
                "Return ONLY the direct translation without introductory or meta commentary:\n\n"
                f"{req.text}"
            )
            payload = {
                "model": "sarvam-105b-conversations",
                "messages": [{"role": "user", "content": prompt}],
            }
            resp = requests.post("https://api.sarvam.ai/v1/chat/completions", headers=headers, json=payload, timeout=30)
            if resp.status_code == 200:
                data = resp.json()
                t_text = data["choices"][0]["message"]["content"].strip()
                if t_text:
                    return {"translatedText": t_text, "translated_text": t_text}
            else:
                print("Sarvam 105B translate error:", resp.status_code, resp.text)
        except Exception as e:
            print("Sarvam 105B translate exception:", e)

        # 2. Fallback to Sarvam Mayura for short texts (< 900 chars)
        if len(req.text) <= 900:
            try:
                payload = {
                    "input": req.text,
                    "source_language_code": req.source_language_code or "en-IN",
                    "target_language_code": req.target_language_code or "hi-IN",
                    "speaker_gender": "Female",
                    "mode": "formal",
                }
                resp = requests.post("https://api.sarvam.ai/translate", headers=headers, json=payload, timeout=20)
                if resp.status_code == 200:
                    data = resp.json()
                    t_text = data.get("translated_text", "")
                    if t_text:
                        return {"translatedText": t_text, "translated_text": t_text}
            except Exception as e:
                print("Sarvam mayura translate exception:", e)

    return {"translatedText": req.text, "translated_text": req.text}

@app.post("/indic/text-to-speech")
@app.post("/api/v1/indic/text-to-speech")
def tts_endpoint(req: TTSRequest):
    if not req.text or not req.text.strip():
        raise HTTPException(status_code=400, detail="Text is required")
    if SARVAM_KEY:
        try:
            headers = {
                "api-subscription-key": SARVAM_KEY,
                "Content-Type": "application/json",
            }
            clean_text = re.sub(r"\[.*?\]", "", req.text)
            clean_text = re.sub(r"https?://\S+", "", clean_text)
            clean_text = re.sub(r"[*#_`•]", " ", clean_text)
            clean_text = re.sub(r"\s+", " ", clean_text).strip()
            if len(clean_text) > 450:
                clean_text = clean_text[:450]
                last_punc = max(clean_text.rfind("."), clean_text.rfind("।"), clean_text.rfind(","))
                if last_punc > 200:
                    clean_text = clean_text[:last_punc + 1]

            payload = {
                "inputs": [clean_text],
                "target_language_code": req.target_language_code or "hi-IN",
                "speaker": req.speaker or "ritu",
            }
            resp = requests.post("https://api.sarvam.ai/text-to-speech", headers=headers, json=payload, timeout=25)
            if resp.status_code == 200:
                data = resp.json()
                audios = data.get("audios", [])
                if audios:
                    return {"audioBase64": audios[0], "speaker": req.speaker or "ritu"}
            else:
                print("Sarvam TTS status:", resp.status_code, resp.text)
        except Exception as e:
            print("Sarvam TTS exception:", e)
    raise HTTPException(status_code=500, detail="Speech synthesis unavailable")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5001)
