/** @format */

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const fileMetaCollection =
      process.env.SUPABASE_FILE_META_COLLECTION || "file_metadata";

    const response = await supabase
      .from(fileMetaCollection)
      .select("id, file_name, uploaded_at, file_size_kb, total_chunks");

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to fetch files from supabase:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}
