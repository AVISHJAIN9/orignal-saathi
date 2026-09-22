import re
import hashlib
import logging
from typing import List, Tuple, Set, Optional
from m2.config import get_settings
from m2.schemas import RawDocumentInput, ChunkItem

logger = logging.getLogger("m2.chunker")

# Regex to detect standard clauses, tables, and section headings
CLAUSE_HEADING_REGEX = re.compile(
    r"(?m)^(?:(?:Clause|Section|Table|Annex|Annexure)\s+[\dA-Za-z\.\-]+(?:\s*[:\-]\s*[^\n]+)?|[\d]+\.[\d]+(?:\.[\d]+)?\s+[A-Z][^\n]+)"
)


class ClauseAwareTextSplitter:
    """
    Structure-aware chunker for Indian Standards and BIS regulatory documents.
    Preserves clause boundaries, table definitions, and section headings.
    """

    def __init__(
        self,
        chunk_size: Optional[int] = None,
        chunk_overlap: Optional[int] = None,
        dedup_threshold: Optional[float] = None,
    ):
        settings = get_settings()
        self.chunk_size = chunk_size or settings.DEFAULT_CHUNK_SIZE
        self.chunk_overlap = chunk_overlap or settings.DEFAULT_CHUNK_OVERLAP
        self.dedup_threshold = dedup_threshold or settings.DEDUPLICATION_SIMILARITY_THRESHOLD

    def split_document(self, doc: RawDocumentInput) -> Tuple[List[ChunkItem], int]:
        """
        Split a RawDocumentInput into structured, deduplicated ChunkItems.
        Returns: (List[ChunkItem], duplicates_removed_count)
        """
        raw_text = doc.content or ""
        if not raw_text.strip():
            return [], 0

        # 1. Break down by structural sections/clauses
        sections = self._split_into_structural_sections(raw_text)

        raw_chunks: List[Tuple[str, Optional[str], Optional[str]]] = []
        for sec_num, sec_title, sec_content in sections:
            # 2. Further split long sections using recursive sliding window with overlap
            sub_chunks = self._recursive_split(sec_content, self.chunk_size, self.chunk_overlap)
            for sub_text in sub_chunks:
                if len(sub_text.strip().split()) >= 10:  # Minimum 10 words
                    raw_chunks.append((sub_text.strip(), sec_num, sec_title))

        # 3. Deduplicate near-identical chunks
        unique_chunks, dups_count = self._deduplicate_chunks(doc, raw_chunks)
        return unique_chunks, dups_count

    def _split_into_structural_sections(
        self, text: str
    ) -> List[Tuple[Optional[str], Optional[str], str]]:
        """Split text by detected clause/table headings."""
        matches = list(CLAUSE_HEADING_REGEX.finditer(text))
        if not matches:
            return [(None, None, text)]

        sections: List[Tuple[Optional[str], Optional[str], str]] = []
        last_pos = 0
        current_num = None
        current_title = "General Scope"

        for match in matches:
            start_pos = match.start()
            if start_pos > last_pos:
                content = text[last_pos:start_pos].strip()
                if content:
                    sections.append((current_num, current_title, content))

            heading_text = match.group(0).strip()
            # Parse clause number vs title
            parts = heading_text.split(":", 1)
            if len(parts) == 2:
                current_num = parts[0].strip()
                current_title = parts[1].strip()
            else:
                current_num = heading_text
                current_title = heading_text

            last_pos = match.end()

        # Add remaining text
        remaining = text[last_pos:].strip()
        if remaining:
            sections.append((current_num, current_title, remaining))

        return sections

    def _recursive_split(self, text: str, chunk_size: int, overlap: int) -> List[str]:
        """Recursive sliding window splitting text into bounded chunks."""
        words = text.split()
        if len(words) <= chunk_size:
            return [text]

        chunks = []
        start = 0
        while start < len(words):
            end = min(start + chunk_size, len(words))
            chunk_words = words[start:end]
            chunks.append(" ".join(chunk_words))
            if end == len(words):
                break
            start += max(1, chunk_size - overlap)

        return chunks

    def _deduplicate_chunks(
        self, doc: RawDocumentInput, raw_chunks: List[Tuple[str, Optional[str], Optional[str]]]
    ) -> Tuple[List[ChunkItem], int]:
        """Filter out near-identical duplicate chunks based on SHA-256 and content similarity."""
        seen_checksums: Set[str] = set()
        seen_word_sets: List[Set[str]] = []
        unique_items: List[ChunkItem] = []
        dups_count = 0

        for idx, (content, sec_num, sec_title) in enumerate(raw_chunks):
            # Compute canonical SHA-256 checksum
            normalized = re.sub(r"\s+", " ", content.strip().lower())
            checksum = hashlib.sha256(normalized.encode("utf-8")).hexdigest()

            if checksum in seen_checksums:
                dups_count += 1
                continue

            # Check Jaccard similarity against existing chunks
            current_words = set(normalized.split())
            is_near_dup = False
            for prev_words in seen_word_sets:
                intersection = len(current_words.intersection(prev_words))
                union = len(current_words.union(prev_words))
                if union > 0 and (intersection / union) >= self.dedup_threshold:
                    is_near_dup = True
                    break

            if is_near_dup:
                dups_count += 1
                continue

            seen_checksums.add(checksum)
            seen_word_sets.append(current_words)

            clean_std = (doc.standard_number or doc.document_id).replace(" ", "_").replace(":", "_")
            chunk_id = f"chunk-{clean_std}-{idx + 1}"

            item = ChunkItem(
                chunk_id=chunk_id,
                document_id=doc.document_id,
                standard_number=doc.standard_number or doc.document_id,
                doc_type=doc.doc_type,
                category=doc.category,
                section_title=sec_title,
                section_number=sec_num,
                content=content,
                source_url=doc.source_url,
                publication_date=doc.publication_date,
                metadata=doc.metadata or {},
                word_count=len(content.split()),
                checksum=checksum,
            )
            unique_items.append(item)

        return unique_items, dups_count
