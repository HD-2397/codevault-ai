import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function handleUpload(
  file: File
): Promise<{ chunks: { index: number; content: string }[] }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return { chunks: data.chunks };
}

export async function embedChunks(
  chunks: string[]
): Promise<{ embeddings: {chunk: string, vector: number[]}[] }> {
  const res = await fetch("/api/embedding", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chunks }),
  });

  const { embeddings } = await res.json();
  return { embeddings };
}