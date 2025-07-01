/** @format */

"use client";

import { FileMetaData } from "@/lib/interfaces";
import { ColumnDef } from "@tanstack/react-table";


export const columns: ColumnDef<FileMetaData>[] = [
  {
    accessorKey: "fileName",
    header: "Name",
  },
  {
    accessorKey: "uploadedAt",
    header: "Uploaded at",
  },
  {
    accessorKey: "fileSizeKB",
    header: "File Size (KB)",
  },
  {
    accessorKey: "totalChunks",
    header: "Total Chunks",
  },
];
