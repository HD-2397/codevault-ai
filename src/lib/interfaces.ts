/** @format */

export interface FileMetaData {
  id: string;
  file_name: string;
  uploaded_at: Date;
  file_size_kb: number;
  total_chunks: number;
}

export interface MatchedCodeChunk {
  id: string;
  content: string;
  file_name: string;
  chunk_index: number;
  uploaded_at: Date;
}
