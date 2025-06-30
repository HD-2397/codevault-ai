/** @format */

import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { connectToDatabase } from "@/lib/connect";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { chunks, embeddings, fileName } = body;
    // embeddings should be array of float arrays (1536-dim)
    // chunks should be an array of strings

    if (!chunks || !embeddings || chunks.length !== embeddings.length) {
      return NextResponse.json(
        { error: "Mismatched chunks and embeddings" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const collection = db.collection("code_chunks");

    const docs = chunks.map((chunk: string, i: number) => ({
      id: uuidv4(),
      content: chunk,
      $vector: embeddings[i],
      metadata: {
        fileName,
        chunkIndex: i,
      },
    }));

    await collection.insertMany(docs);

    return NextResponse.json({ success: true, inserted: docs.length });
  } catch (error) {
    console.error("Failed to store chunks in Astra:", error);
    return NextResponse.json(
      { error: "Failed to store chunks", detail: error },
      { status: 500 }
    );
  }
}
