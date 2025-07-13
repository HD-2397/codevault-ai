create or replace function match_code_chunks (
  query_embedding vector,
  match_count integer default 5,
  target_file_name text default null
)
returns table (
  id uuid,
  content text,
  file_name text,
  chunk_index integer,
  uploaded_at timestamp,
  similarity float
)
language sql
as $$
  select
    id,
    content,
    file_name,
    chunk_index,
    uploaded_at,
    (embedding <-> query_embedding) as similarity
  from code_chunks
  where target_file_name is null or file_name = target_file_name
  order by embedding <-> query_embedding
  limit match_count;
$$;