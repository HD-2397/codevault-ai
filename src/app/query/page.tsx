/** @format */

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { askQuestion, getUploadedFiles } from "@/lib/utils";
import { FileMetaData } from "@/lib/interfaces";
import ReactMarkdown from "react-markdown";

export default function SearchPage() {
  const [uploadedFiles, setUploadedFiles] = useState<FileMetaData[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch list of uploaded files
  async function fetchFiles() {
    const files = await getUploadedFiles();
    console.log("FILES***********************88", files);
    setUploadedFiles(files || []);
  }

  useEffect(() => {
    fetchFiles(); // Fetch files on component mount
  }, []);

  // Stream query answer
  const handleQuery = async () => {
    if (!selectedFile || !query.trim()) return;
    setAnswer("");
    setLoading(true);

    const res = await askQuestion(query, selectedFile);
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader!.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      setAnswer((prev) => prev + chunk);
    }
    setLoading(false);
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        🔍 Ask Questions About Your Code/PDF
      </h1>

      {/* File Selector */}
      <div className="space-y-2">
        <label className="font-medium">Select a file</label>
        <Select onValueChange={setSelectedFile}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a file" />
          </SelectTrigger>
          <SelectContent>
            {!!!uploadedFiles || uploadedFiles.length === 0 ? (
              <SelectItem disabled value="no-files">
                No files uploaded yet
              </SelectItem>
            ) : (
              uploadedFiles.map((file) => (
                <SelectItem key={file.file_name} value={file.file_name}>
                  {file.file_name} ({file.total_chunks} chunks)
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Question Input */}
      <div className="space-y-2">
        <label className="font-medium">Ask a question</label>
        <Textarea
          placeholder="E.g. What does the Dijkstra function do?"
          rows={3}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          onClick={handleQuery}
          disabled={loading || !query || !selectedFile}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Ask
        </Button>
      </div>

      {/* Streaming Answer Output */}
      <div className="space-y-2">
        <label className="font-medium text-gray-800 dark:text-gray-200">
          Answer
        </label>
        <Card className="bg-gray-100 dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 shadow-sm">
          <CardContent className="p-4 min-h-[150px] overflow-auto rounded-md">
            <div className="prose dark:prose-invert max-w-none font-mono text-sm whitespace-pre-wrap">
              <ReactMarkdown>
                {answer || (loading ? "Generating answer..." : "No answer yet")}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
