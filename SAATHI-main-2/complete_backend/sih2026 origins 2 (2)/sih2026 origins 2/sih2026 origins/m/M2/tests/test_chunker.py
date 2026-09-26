import pytest
from m2.chunker import ClauseAwareTextSplitter
from m2.schemas import RawDocumentInput


def test_clause_aware_splitter_basic():
    doc = RawDocumentInput(
        document_id="IS 10500:2012",
        standard_number="IS 10500:2012",
        title="Drinking Water Specification",
        content="""
Clause 4.1: Essential Quality Requirements
The pH value of drinking water shall be between 6.5 and 8.5 without relaxation.
The acceptable limit for Total Dissolved Solids is 500 mg/l, permissible up to 2000 mg/l.

Clause 4.2: Bacteriological Quality
All water intended for drinking shall be free from E. coli in any 100 ml sample.
Testing must be performed in NABL accredited laboratories.
        """,
    )

    splitter = ClauseAwareTextSplitter(chunk_size=100, chunk_overlap=20)
    chunks, dups = splitter.split_document(doc)

    assert len(chunks) >= 2
    assert dups == 0
    assert chunks[0].document_id == "IS 10500:2012"
    assert "Clause 4.1" in (chunks[0].section_number or "")
    assert "pH value" in chunks[0].content


def test_chunker_deduplication():
    doc = RawDocumentInput(
        document_id="IS 4984:2016",
        content="""
Clause 5.1: Raw Material
HDPE pipes must be made from virgin PE-80 or PE-100 polymers containing carbon black.

Clause 5.1: Raw Material
HDPE pipes must be made from virgin PE-80 or PE-100 polymers containing carbon black.
        """,
    )

    splitter = ClauseAwareTextSplitter(chunk_size=100, chunk_overlap=20)
    chunks, dups = splitter.split_document(doc)

    # The exact duplicate clause should be removed
    assert len(chunks) == 1
    assert dups >= 1
