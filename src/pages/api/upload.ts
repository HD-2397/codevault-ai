/** @format */

import { NextApiRequest, NextApiResponse } from "next";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";

//Formidable requires raw access to the request body, so we disable Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = formidable({ multiples: false });

  const data = await new Promise<{
    fileName: string;
    fileSizeKB: number;
    content: string;
  }>((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) return reject(err);

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file || !file.filepath) {
        return reject(new Error("No file uploaded or file is invalid."));
      }
      const fileName = file.originalFilename || "unknown_file";
      const fileSizeKB = Math.round(file.size / 1024);
      const buffer = fs.readFileSync(file.filepath);

      let content = "";

      if (
        file.mimetype === "application/pdf" ||
        fileName.toLowerCase().endsWith(".pdf")
      ) {
        const pdfData = await pdfParse(buffer); // 🔍 Extract text from PDF
        content = pdfData.text;
      } else {
        content = buffer.toString("utf-8"); // for .txt or other plain text files
      }

      resolve({ fileName, fileSizeKB, content });
    });
  });

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 50,
  });

  const chunks = await splitter.createDocuments([data.content]);

  return res.status(200).json({
    fileName: data.fileName,
    fileSizeKB: data.fileSizeKB, 
    chunks: chunks.map((chunk, index) => ({
      index,
      content: chunk.pageContent,
    })),
  });
}
