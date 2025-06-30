"use client";

import { useState } from "react";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [chunks, setChunks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setChunks([]);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setChunks(data.chunks);
    setLoading(false);
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
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Uploading..." : "Upload & Chunk"}
      </button>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">🧩 Chunks</h2>
        {chunks.length === 0 && !loading && <p>No chunks yet</p>}
        {chunks.map((chunk, i) => (
          <pre
            key={i}
            className="bg-gray-100 p-2 rounded mb-2 whitespace-pre-wrap text-sm"
          >
            {chunk}
          </pre>
        ))}
      </div>
    </main>
  );
}
