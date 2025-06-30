/** @format */

import { NextApiRequest, NextApiResponse } from "next";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import formidable from "formidable";
import fs from "fs";

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

  const data = await new Promise<{ content: string }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file || !file.filepath) {
        return reject(new Error("No file uploaded or file is invalid."));
      }
      const content = fs.readFileSync(file.filepath, "utf-8");
      resolve({ content });
    });
  });

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const chunks = await splitter.createDocuments([data.content]);

  return res.status(200).json({
    chunks: chunks.map((c) => c.pageContent),
  });
}
