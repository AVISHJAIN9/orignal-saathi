
import re
import pickle
import faiss
import torch

from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForCausalLM


# ============================================================
# CONFIGURATION
# ============================================================

EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
LLM_MODEL = "Qwen/Qwen2.5-3B-Instruct"

INDEX_FILE = "bis_index_final.faiss"
METADATA_FILE = "bis_metadata_final.pkl"


# ============================================================
# LOAD MODELS
# ============================================================

embedding_model = SentenceTransformer(
    EMBEDDING_MODEL
)

qwen_tokenizer = AutoTokenizer.from_pretrained(
    LLM_MODEL
)

qwen_model = AutoModelForCausalLM.from_pretrained(
    LLM_MODEL,
    torch_dtype=torch.float16,
    device_map="auto"
)


# ============================================================
# LOAD BIS DATA
# ============================================================

bis_index = faiss.read_index(
    INDEX_FILE
)

with open(METADATA_FILE, "rb") as f:
    metadata = pickle.load(f)

chunks = metadata["chunks"]
structured_requirements = metadata["structured_requirements"]


# ============================================================
# STRUCTURED REQUIREMENT LOOKUP
# ============================================================

def lookup_structured_requirement(
    requirement_name,
    level=None
):
    requirement_name = (
        requirement_name.lower().strip()
    )

    for item in structured_requirements:

        if requirement_name in item["requirement"].lower():

            result = {
                "standard": item["standard"],
                "requirement": item["requirement"],
                "source_page": item["source_page"],
                "test_method": item["test_method"],
                "condition": item["condition"]
            }

            if level:

                level = level.strip().title()

                if level in item["levels"]:
                    result["level"] = level
                    result["value"] = item["levels"][level]
                else:
                    result["level"] = level
                    result["value"] = (
                        "Not specified in the structured table."
                    )

            else:
                result["levels"] = item["levels"]

            return result

    return None


# ============================================================
# STRUCTURED ANSWER
# ============================================================

def answer_structured_requirement(
    requirement_name,
    level=None
):

    result = lookup_structured_requirement(
        requirement_name,
        level
    )

    if result is None:
        return (
            "The requested BIS requirement "
            "was not found."
        )

    answer = (
        "### BIS Verified Requirement\n\n"
        f"**Standard:** {result['standard']}\n\n"
        f"**Requirement:** {result['requirement']}\n"
    )

    if level:

        answer += (
            f"\n**Applicable level:** {result['level']}\n"
            f"**Requirement value:** {result['value']}\n"
        )

    else:

        answer += "\n**Values by level:**\n"

        for lvl, value in result["levels"].items():
            answer += (
                f"- **{lvl}:** {value}\n"
            )

    if result["condition"]:
        answer += (
            f"\n**Condition:** "
            f"{result['condition']}\n"
        )

    answer += (
        f"\n**Test method:** "
        f"{result['test_method']}\n"
        f"\n**Source:** "
        f"BIS Page {result['source_page']}"
    )

    return answer


# ============================================================
# SEMANTIC RETRIEVAL
# ============================================================

def retrieve_bis(question, k=3):

    query_embedding = embedding_model.encode(
        [question],
        convert_to_numpy=True
    ).astype("float32")

    distances, indices = bis_index.search(
        query_embedding,
        min(10, len(chunks))
    )

    question_lower = question.lower()

    requirement_terms = [
        "requirement",
        "minimum",
        "maximum",
        "strength",
        "bursting",
        "tensile",
        "seam",
        "breathability",
        "viral penetration",
        "blood penetration",
        "performance level",
        "level 1",
        "level 2",
        "level 3",
        "level 4",
        "test method"
    ]

    is_requirement_question = any(
        term in question_lower
        for term in requirement_terms
    )

    candidates = []

    for rank, idx in enumerate(indices[0]):

        distance = float(
            distances[0][rank]
        )

        if (
            is_requirement_question
            and chunks[idx]["chunk"]
            == "structured_performance_table"
        ):
            adjusted_distance = (
                distance - 0.20
            )
        else:
            adjusted_distance = distance

        candidates.append({
            "idx": int(idx),
            "original_distance": distance,
            "adjusted_distance": adjusted_distance,
            "page": chunks[idx]["page"],
            "chunk_type": chunks[idx]["chunk"]
        })

    candidates.sort(
        key=lambda x: x["adjusted_distance"]
    )

    return candidates[:k]


# ============================================================
# PRODUCTION RAG
# ============================================================

def ask_bis_production(
    question,
    k=3,
    threshold=1.25
):

    aliases = {

        "bursting strength":
            "Bursting strength",

        "tensile strength":
            "Tensile strength",

        "seam strength":
            "Seam strength",

        "breathability":
            "Breathability",

        "water vapour transmission":
            "Breathability",

        "synthetic blood":
            "Synthetic blood penetration resistance",

        "blood penetration":
            "Synthetic blood penetration resistance",

        "viral penetration":
            "Resistance to viral penetration"
    }

    question_lower = question.lower()

    detected_requirement = None

    for alias, requirement in aliases.items():

        if alias in question_lower:
            detected_requirement = requirement
            break

    level = None

    level_match = re.search(
        r'\\blevel\\s*([1-4])\\b',
        question_lower
    )

    if level_match:
        level = (
            f"Level {level_match.group(1)}"
        )

    # Structured route
    if detected_requirement:

        result = lookup_structured_requirement(
            detected_requirement,
            level
        )

        if result:

            return answer_structured_requirement(
                detected_requirement,
                level
            )

    # Semantic route
    retrieved = retrieve_bis(
        question,
        k=k
    )

    if not retrieved:

        return (
            "The provided BIS document does not "
            "contain enough relevant information "
            "to answer this question."
        )

    best_distance = (
        retrieved[0]["adjusted_distance"]
    )

    if best_distance > threshold:

        return (
            "The provided BIS document does not "
            "contain enough relevant information "
            "to answer this question."
        )

    context_parts = []

    for item in retrieved:

        chunk = chunks[item["idx"]]

        context_parts.append(
            f"[BIS Page {chunk['page']}]\\n"
            f"{chunk['text']}"
        )

    context = "\\n\\n".join(
        context_parts
    )

    system_prompt = """
You are a BIS standards document assistant.

Answer ONLY using facts explicitly stated
in the provided BIS context.

Rules:
- Do not use outside knowledge.
- Do not guess.
- Do not infer missing values.
- Do not extrapolate.
- Do not invent requirements.
- If the exact answer is not explicitly supported,
  say:
  "The provided BIS document does not explicitly
  specify this information."
- Preserve numerical values, units, symbols,
  levels, and conditions exactly.
- Mention the relevant BIS page when possible.
"""

    user_prompt = f"""
BIS CONTEXT:

{context}

QUESTION:
{question}
"""

    messages = [
        {
            "role": "system",
            "content": system_prompt
        },
        {
            "role": "user",
            "content": user_prompt
        }
    ]

    prompt = qwen_tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
    )

    inputs = qwen_tokenizer(
        prompt,
        return_tensors="pt"
    ).to(qwen_model.device)

    with torch.no_grad():

        outputs = qwen_model.generate(
            **inputs,
            max_new_tokens=300,
            do_sample=False
        )

    generated_tokens = outputs[0][
        inputs["input_ids"].shape[1]:
    ]

    answer = qwen_tokenizer.decode(
        generated_tokens,
        skip_special_tokens=True
    ).strip()

    source_lines = [

        f"BIS Page {item['page']} | "
        f"Distance: "
        f"{item['adjusted_distance']:.4f}"

        for item in retrieved
    ]

    return (
        f"{answer}\n\n"
        f"**Sources:**\n"
        +
        "\n".join(
            f"- {source}"
            for source in source_lines
        )
    )


# ============================================================
# COMPLIANCE TABLE
# ============================================================

def get_compliance_table(level):

    level = level.strip().title()

    valid_levels = [
        "Level 1",
        "Level 2",
        "Level 3",
        "Level 4"
    ]

    if level not in valid_levels:

        return (
            "Invalid level. Please use: "
            + ", ".join(valid_levels)
        )

    table = (
        "| Requirement | "
        + level
        + " | Test Method |\\n"
    )

    table += (
        "|---|---:|---|\\n"
    )

    for item in structured_requirements:

        value = item["levels"].get(
            level,
            "Not specified"
        )

        table += (
            f"| {item['requirement']} "
            f"| {value} "
            f"| {item['test_method']} |\\n"
        )

    return (
        f"### BIS Compliance Requirements — "
        f"{level}\\n\\n"
        f"**Standard:** IS 17423:2021\\n\\n"
        f"{table}\\n\\n"
        f"**Source:** BIS Page 16"
    )


# ============================================================
# LEVEL DETECTION
# ============================================================

def detect_compliance_level(question):

    question_lower = question.lower()

    compliance_terms = [
        "compliance",
        "requirements",
        "requirement",
        "standards",
        "specification",
        "specifications"
    ]

    has_compliance_term = any(
        term in question_lower
        for term in compliance_terms
    )

    level_match = re.search(
        r'\\blevel\\s*([1-4])\\b',
        question_lower
    )

    if (
        has_compliance_term
        and level_match
    ):

        return (
            f"Level {level_match.group(1)}"
        ).title()

    return None


# ============================================================
# SMART ROUTER
# ============================================================

def smart_bis_answer(question):

    level = detect_compliance_level(
        question
    )

    full_table_terms = [
        "compliance",
        "all requirements",
        "all specifications",
        "complete requirements",
        "requirements table",
        "compliance table"
    ]

    question_lower = question.lower()

    is_full_table_request = (
        level is not None
        and any(
            term in question_lower
            for term in full_table_terms
        )
    )

    if is_full_table_request:

        answer = get_compliance_table(
            level
        )

        source = (
            "BIS Page 16 — IS 17423:2021"
        )

        return answer, source

    answer = ask_bis_production(
        question
    )

    if (
        "does not contain enough relevant"
        in answer
    ):

        source = (
            "No sufficiently relevant BIS "
            "source found."
        )

    elif (
        "does not explicitly specify"
        in answer
    ):

        source = (
            "BIS document — information not "
            "explicitly specified."
        )

    else:

        source = (
            "IS 17423:2021 — BIS source "
            "pages shown in the answer."
        )

    return answer, source
