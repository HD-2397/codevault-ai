/** @format */

"use client";

import { useState, useEffect, useRef } from "react";
import { columns } from "@/components/shared/data-table/columns";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { FileMetaData } from "@/lib/interfaces";
import {
  embedChunks,
  getUploadedFiles,
  handleUpload,
  storeChunks,
} from "@/lib/utils";
import toast, { Toaster } from "react-hot-toast";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [chunks, setChunks] = useState<{ index: number; content: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileMetaData[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  async function fetchFiles() {
    const files = await getUploadedFiles();
    setUploadedFiles(files);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else setFile(null);
  };

  const onUpload = async () => {
    if (!file) return;
    setLoading(true);
    setChunks([]);
    toast.loading("Uploading and processing file...", { id: "upload-toast" });

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
      await fetchFiles();
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      toast.success("✅ File uploaded and processed!", { id: "upload-toast" });
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to upload/process file.", { id: "upload-toast" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6 sm:p-10 space-y-10">
      <Toaster position="top-right" />

      {/* Upload section */}
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          📄 Upload Code/PDF File
        </h1>

        <Input
          id="uploadFile"
          ref={fileInputRef}
          type="file"
          accept=".ts,.js,.jsx,.tsx,.py,.txt,.cpp,.java,.go,.rb,.pdf"
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

      {/* Chunks section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">🧩 Preview Chunks</h2>

        {chunks.length === 0 && !loading ? (
          <p className="text-muted-foreground">No chunks yet</p>
        ) : (
          <Accordion type="multiple" className="w-full">
            {chunks.map((chunk) => (
              <AccordionItem key={chunk.index} value={`chunk-${chunk.index}`}>
                <AccordionTrigger className="text-left font-semibold">
                  Chunk {chunk.index + 1}
                </AccordionTrigger>
                <AccordionContent className="bg-muted rounded-md p-4 text-sm font-mono whitespace-pre-wrap overflow-auto">
                  {chunk.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </section>

      {/* Uploaded files section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">📂 Uploaded Files</h2>
        <DataTable columns={columns} data={uploadedFiles} />
      </section>
    </main>
  );
}
