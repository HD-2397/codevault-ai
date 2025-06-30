/** @format */

"use client";

import { embedChunks, handleUpload } from "@/lib/utils";
import { useState } from "react";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [chunks, setChunks] = useState<{ index: number; content: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onUpload = async () => {
    if (!file) return;
    setLoading(true);
    setChunks([]);
    try {
      const { chunks: newChunks } = await handleUpload(file);
      setChunks(newChunks);
      const chunkContents = newChunks.map((chunk) => chunk.content);
      const { embeddings } = await embedChunks(chunkContents);
      console.log("Embeddings:", embeddings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">📄 Upload Code File</h1>

      <input
        type="file"
        accept=".ts,.js,.jsx,.tsx,.py,.txt"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={onUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Uploading..." : "Upload & Chunk"}
      </button>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">🧩 Chunks</h2>
        {chunks.length === 0 && !loading && <p>No chunks yet</p>}
        {chunks.map((chunk) => (
          <div
            key={chunk.index}
            className="mb-4 p-2 border rounded bg-gray-100"
          >
            <h3 className="font-bold">Chunk {chunk.index + 1}</h3>
            <pre className="whitespace-pre-wrap">{chunk.content}</pre>
          </div>
        ))}
      </div>
    </main>
  );
}
