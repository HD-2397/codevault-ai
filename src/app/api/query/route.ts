/** @format */

import { NextResponse } from "next/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { OpenAI } from "openai";
import { createClient } from "@supabase/supabase-js";
import { MatchedCodeChunk } from "@/lib/interfaces";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { query, topK = 5, fileName } = await req.json();

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
    // Step 2: Perform vector similarity search in Supabase
    // ─────────────────────────────────────────────────────────────
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const supabaseRPC =
      process.env.SUPABASE_RPC_FUNCTION || "match_code_chunks";

    const { data: chunks, error } = await supabase.rpc(supabaseRPC, {
      query_embedding: queryEmbedding,
      match_count: topK,
      target_file_name: fileName ?? null, // Send null if no filename filter
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      return NextResponse.json(
        { error: "Failed to perform vector search" },
        { status: 500 }
      );
    }

    // ─────────────────────────────────────────────────────────────
    // Step 3: Format context from retrieved chunks
    // ─────────────────────────────────────────────────────────────
    const context = chunks
      .map(
        (doc: MatchedCodeChunk, idx: number) =>
          `Chunk ${idx + 1} (File: ${doc.file_name || "unknown"}):\n${
            doc.content
          }`
      )
      .join("\n\n");

    // ─────────────────────────────────────────────────────────────
    // Step 4: Ask GPT model to generate a contextual answer
    // ─────────────────────────────────────────────────────────────

    const prompt =
      "You are a senior software engineer. Answer user questions using only the provided code context. If the context is insufficient, respond back politely. Be concise, accurate, and helpful.";
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.2,
      stream: true,
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

    // ─────────────────────────────────────────────────────────────
    // Step 5: Stream the response in a text/plain format
    // ─────────────────────────────────────────────────────────────

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices?.[0]?.delta?.content;
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain",
      },
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
