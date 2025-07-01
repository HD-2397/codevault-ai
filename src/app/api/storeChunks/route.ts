/** @format */

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connect";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { chunks, embeddings, fileName, fileSizeKB } = body;

    if (!chunks || !embeddings || chunks.length !== embeddings.length) {
      return NextResponse.json(
        { error: "Mismatched chunks and embeddings" },
        { status: 400 }
      );
    }

    const totalChunks = chunks.length;
    const uploadedAt = new Date();

    const db = await connectToDatabase();
    const chunkCollection = db.collection(process.env.ASTRA_DB_CHUNK_COLLECTION || "code_chunks");
    const fileCollection = db.collection(process.env.ASTRA_DB_FILE_COLLECTION || "files");

    // 1️⃣ Store file metadata in `files` collection
    const existing = await fileCollection.findOne({ fileName });
    if (!existing) {
      await fileCollection.insertOne({
        fileName,
        uploadedAt,
        fileSizeKB,
        totalChunks,
      });
    }

    // 2️⃣ Store chunks in `code_chunks` collection
    const docs = chunks.map((chunk: string, i: number) => ({
      id: uuidv4(),
      content: chunk,
      $vector: embeddings[i],
      metadata: {
        fileName,
        chunkIndex: i,
        uploadedAt,
      },
    }));

    await chunkCollection.insertMany(docs);

    return NextResponse.json({ success: true, inserted: docs.length });
  } catch (error) {
    console.error("Failed to store chunks in Astra:", error);
    return NextResponse.json(
      { error: "Failed to store chunks", detail: error },
      { status: 500 }
    );
  }
}
