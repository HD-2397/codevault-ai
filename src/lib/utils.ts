/** @format */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FileMetaData } from "./interfaces";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getUploadedFiles(): Promise<FileMetaData[]> {
  const res = await fetch("/api/fetchFiles", { method: "GET" });
  return await res.json();
}

export async function handleUpload(
  file: File
): Promise<{
  fileName: string;
  fileSizeKB: number;
  chunks: { index: number; content: string }[];
}> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return {
    fileName: data.fileName,
    fileSizeKB: data.fileSizeKB,
    chunks: data.chunks,
  };
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
  fileName: string,
  fileSizeKB: number
): Promise<{ success: boolean; inserted: number }> {
  const res = await fetch("/api/storeChunks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chunks, embeddings, fileName, fileSizeKB }),
  });

  if (!res.ok) {
    throw new Error("Failed to store chunks");
  }

  return res.json();
}
