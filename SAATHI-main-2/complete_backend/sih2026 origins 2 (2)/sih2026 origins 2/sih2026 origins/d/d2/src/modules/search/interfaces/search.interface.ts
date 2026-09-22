export interface M3RetrievalFilter {
  doc_type?: string;
  category?: string;
  standard_number?: string;
  start_date?: string;
  end_date?: string;
  custom_filters?: Record<string, any>;
}

export interface M3HybridSearchRequest {
  query: string;
  top_k: number;
  filters?: M3RetrievalFilter;
  query_embedding?: number[];
  enable_is_boost: boolean;
  rrf_k?: number;
  include_metadata?: boolean;
}

export interface ChunkResult {
  id: string;
  document_id: string;
  standard_number?: string | null;
  doc_type?: string | null;
  category?: string | null;
  section_title?: string | null;
  section_number?: string | null;
  content: string;
  source_url?: string | null;
  publication_date?: string | null;
  metadata?: Record<string, any>;
  rrf_score: number;
  dense_rank?: number | null;
  sparse_rank?: number | null;
  cosine_similarity?: number | null;
  bm25_score?: number | null;
  is_exact_match: boolean;
}

export interface M3HybridSearchResponse {
  query: string;
  detected_is_standards: string[];
  total_results: number;
  results: ChunkResult[];
  execution_time_ms: number;
}

export interface SearchApiResponse {
  query: string;
  detectedIsStandards: string[];
  page: number;
  limit: number;
  totalResults: number;
  totalPages: number;
  results: ChunkResult[];
  fromCache: boolean;
  executionTimeMs: number;
  timestamp: string;
}
