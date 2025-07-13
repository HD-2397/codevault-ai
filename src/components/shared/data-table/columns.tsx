/** @format */

import { FileMetaData } from "@/lib/interfaces";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<FileMetaData>[] = [
  {
    accessorKey: "file_name",
    header: "Name",
  },
  {
    accessorKey: "uploaded_at",
    header: "Uploaded at",
    cell: ({ row }) => {
      const date: string = row.getValue("uploaded_at");
      return format(new Date(date), "dd MMM yyyy, HH:mm");
    },
  },
  {
    accessorKey: "file_size_kb",
    header: "File Size (KB)",
  },
  {
    accessorKey: "total_chunks",
    header: "Total Chunks",
  },
];
