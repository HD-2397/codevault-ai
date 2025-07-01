/** @format */

import { connectToDatabase } from "@/lib/connect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await connectToDatabase();
    const filesCollection = db.collection(
      process.env.ASTRA_DB_FILE_COLLECTION || "files"
    );

    const files = await filesCollection
      .find({}, { projection: { _id: 0 } }) // hide internal Mongo IDs
      .sort({ uploadedAt: -1 })
      .toArray();

    return NextResponse.json(files);
  } catch (error) {
    console.error("Failed to fetch files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}
