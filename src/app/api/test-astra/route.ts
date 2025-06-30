// app/api/test-astra/route.ts
//testing AstraDB connection and inserting documents
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connect";

export async function GET() {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("code_chunks");

    // Insert documents into the collection

    const result = await collection.insertMany([
      {
        name: "Jane Doe",
        age: 42,
        $vector: Array(1536).fill(0.123),
      },
      {
        nickname: "Bobby",
        $vector: Array(1536).fill(0.125),
      },
    ]);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Astra connection failed", detail: error },
      { status: 500 }
    );
  }
}
