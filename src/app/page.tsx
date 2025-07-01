/** @format */

"use client";

import { columns } from "@/components/shared/data-table/columns";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileMetaData } from "@/lib/interfaces";
import {
  embedChunks,
  getUploadedFiles,
  handleUpload,
  storeChunks,
} from "@/lib/utils";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [chunks, setChunks] = useState<{ index: number; content: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileMetaData[]>([]); // Store fetched file metadata

  async function fetchFiles() {
    const files = await getUploadedFiles();
    console.log("Fetched files:", files);
    setUploadedFiles(files);
  }

  useEffect(() => {
    fetchFiles(); // Fetch files on component mount
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else setFile(null);
  };

  const onUpload = async () => {
    if (!file) return;
    setLoading(true);
    setChunks([]);
    try {
      const {
        fileName,
        fileSizeKB,
        chunks: newChunks,
      } = await handleUpload(file);
      setChunks(newChunks);
      const chunkContents = newChunks.map((chunk) => chunk.content);
      const { embeddings } = await embedChunks(chunkContents);
      const embeddingVectors = embeddings.map(
        (embedding) => embedding.vector as number[]
      );
      await storeChunks(chunkContents, embeddingVectors, fileName, fileSizeKB);
      await fetchFiles(); // Refresh the file list after upload
      setFile(null); // Clear the file input after upload
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6 sm:p-10 space-y-10">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          📄 Upload Code File
        </h1>
        <Input
          id="uploadFile"
          type="file"
          accept=".ts,.js,.jsx,.tsx,.py,.txt,.cpp,.java,.go,.rb"
          onChange={handleFileChange}
        />
        <Button
          onClick={onUpload}
          disabled={!file || loading}
          className="w-full sm:w-fit"
        >
          {loading ? "Uploading..." : "Upload & Chunk"}
        </Button>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">🧩 Preview Chunks</h2>
        {chunks.length === 0 && !loading ? (
          <p className="text-muted-foreground">No chunks yet</p>
        ) : (
          <div className="space-y-4">
            {chunks.map((chunk) => (
              <div
                key={chunk.index}
                className="rounded-lg border p-4 bg-muted text-sm overflow-auto"
              >
                <h3 className="font-semibold mb-2">Chunk {chunk.index + 1}</h3>
                <pre className="whitespace-pre-wrap font-mono">
                  {chunk.content}
                </pre>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">📂 Uploaded Files</h2>
        <DataTable columns={columns} data={uploadedFiles} />
      </section>
    </main>
  );
}
