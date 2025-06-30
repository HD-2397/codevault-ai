/** @format */

import { OpenAIEmbeddings } from "@langchain/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { chunks } = await req.json(); // expect { chunks: ["code chunk 1", "code chunk 2", ...] }

    if (!chunks || !Array.isArray(chunks)) {
      return NextResponse.json(
        { error: "Chunks must be an array" },
        { status: 400 }
      );
    }
    //This will automatically use process.env.OPENAI_API_KEY if it's defined, need not pass it explicitly.
    const embedder = new OpenAIEmbeddings({
      modelName: "text-embedding-ada-002",
    });

    const embeddings = await embedder.embedDocuments(chunks);

    // Return embeddings mapped to original chunks
    const result = chunks.map((chunk, i) => ({
      chunk,
      vector: embeddings[i],
    }));

    return NextResponse.json({ embeddings: result });
  } catch (err) {
    console.error("Embedding error:", err);
    return NextResponse.json({ error: "Embedding failed" }, { status: 500 });
  }
}
