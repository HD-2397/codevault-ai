/** @format */

// /app/api/search/route.ts

import { NextResponse } from "next/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { connectToDatabase } from "@/lib/connect";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { query, topK = 5 } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "Missing query text." },
        { status: 400 }
      );
    }
    // ─────────────────────────────────────────────────────────────
    // Step 1: Generate embedding for the input query
    // ─────────────────────────────────────────────────────────────
    const embedder = new OpenAIEmbeddings({
      modelName: "text-embedding-3-small",
    });
    const [queryEmbedding] = await embedder.embedDocuments([query]);

    // ─────────────────────────────────────────────────────────────
    // Step 2: Perform vector similarity search in Astra DB
    // ─────────────────────────────────────────────────────────────
    const db = await connectToDatabase();
    const collection = db.collection("code_chunks");

    const results = await collection.find(
      {}, // no filtering
      {
        sort: { $vector: queryEmbedding },
        limit: topK,
      }
    );

    const chunks = await results.toArray();
    if (!chunks.length) {
      return NextResponse.json({
        answer: "No relevant code found to answer your question.",
        chunks: [],
      });
    }

    // ─────────────────────────────────────────────────────────────
    // Step 3: Format context from retrieved chunks
    // ─────────────────────────────────────────────────────────────
    const context = chunks
      .map(
        (doc, idx) =>
          `Chunk ${idx + 1} (File: ${doc.metadata?.fileName || "unknown"}):\n${
            doc.content
          }`
      )
      .join("\n\n");

    // ─────────────────────────────────────────────────────────────
    // Step 4: Ask GPT model to generate a contextual answer
    // ─────────────────────────────────────────────────────────────

    const prompt =
      "You are a senior software engineer. Answer user questions using only the provided code context. If the context is insufficient, respond back politely. Be concise, accurate, and helpful.";
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // Or "gpt-3.5-turbo" for lower cost
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: `Code context:\n${context}\n\nQuestion: ${query}`,
        },
      ],
    });

    const answer = completion.choices[0].message.content;

    // ─────────────────────────────────────────────────────────────
    // Step 5: Return the AI answer along with reference chunks
    // ─────────────────────────────────────────────────────────────
    return NextResponse.json({
      answer,
      chunks,
    });
  } catch (error) {
    console.error("Search & Answer Error:", error);
    return NextResponse.json(
      {
        error: "Failed to perform search and generate answer",
        detail: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
