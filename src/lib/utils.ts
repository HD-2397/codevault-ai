/** @format */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function handleUpload(
  file: File
): Promise<{ fileName: string; chunks: { index: number; content: string }[] }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return { fileName: data.fileName, chunks: data.chunks };
}

export async function embedChunks(
  chunks: string[]
): Promise<{ embeddings: { chunk: string; vector: number[] }[] }> {
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

export async function storeChunks(
  chunks: string[],
  embeddings: number[][],
  fileName: string
): Promise<{ success: boolean; inserted: number }> {
  const res = await fetch("/api/storeChunks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chunks, embeddings, fileName }),
  });

  if (!res.ok) {
    throw new Error("Failed to store chunks");
  }

  return res.json();
}
