/** @format */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { chunks, embeddings, fileName, fileSizeKB } = body;

    if (!chunks || !embeddings || chunks.length !== embeddings.length) {
      return NextResponse.json(
        { error: "Mismatched or missing chunks and embeddings." },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const totalChunks = chunks.length;
    const uploadedAt = new Date().toISOString();

    // ─────────────────────────────────────────────────────────────
    // 1️⃣ Insert file metadata if not already uploaded
    // ─────────────────────────────────────────────────────────────

    const fileMetaCollection =
      process.env.SUPABASE_FILE_META_COLLECTION || "file_metadata";
    const { data: existingFile, error: fetchError } = await supabase
      .from(fileMetaCollection)
      .select("id")
      .eq("file_name", fileName)
      .maybeSingle();

    if (fetchError) {
      console.error("Failed to check existing file metadata:", fetchError);
      return NextResponse.json(
        {
          error: "Failed to check existing file metadata",
          detail: fetchError.message,
        },
        { status: 500 }
      );
    }

    if (!existingFile) {
      const { error: insertMetaError } = await supabase
        .from(fileMetaCollection)
        .insert([
          {
            file_name: fileName,
            uploaded_at: uploadedAt,
            file_size_kb: fileSizeKB,
            total_chunks: totalChunks,
          },
        ]);

      if (insertMetaError) {
        console.error("Failed to insert file metadata:", insertMetaError);
        return NextResponse.json(
          {
            error: "Failed to insert file metadata",
            detail: insertMetaError.message,
          },
          { status: 500 }
        );
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 2️⃣ Insert code chunks
    // ─────────────────────────────────────────────────────────────
    const chunkDocs = chunks.map((chunk: string, i: number) => ({
      id: uuidv4(),
      content: chunk,
      embedding: embeddings[i],
      file_name: fileName,
      chunk_index: i,
      uploaded_at: uploadedAt,
    }));

    const codeChunkCollection =
      process.env.SUPABASE_FILE_CHUNK_COLLECTION || "code_chunks";

    const { error: insertChunkError } = await supabase
      .from(codeChunkCollection)
      .insert(chunkDocs);

    if (insertChunkError) {
      console.error("Failed to insert code chunks:", insertChunkError);
      return NextResponse.json(
        {
          error: "Failed to insert code chunks",
          detail: insertChunkError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "File and chunks stored successfully.",
      insertedChunks: chunkDocs.length,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Unexpected error during POST: storeChunks ", error);
    return NextResponse.json(
      { error: "Unexpected error", detail: error?.message || error },
      { status: 500 }
    );
  }
}
