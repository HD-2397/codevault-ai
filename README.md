# 🧠 CodeVault AI – Context-Aware Codebase Chat Assistant

CodeVault AI is a powerful Generative AI project that enables developers to upload codebases and ask intelligent, **context-aware questions** about them. Whether you're exploring legacy systems, debugging, or learning from open-source projects, CodeVault helps you interact with your code like never before.

This project showcases **full-stack engineering** and **GenAI integration** skills using cutting-edge technologies:

- **Next.js (App Router)**
- **TailwindCSS + shadcn/ui**
- **OpenAI GPT-4 + text-embedding-3-small**
- **AstraDB Vector Store (MongoDB-style interface)**
- **Streaming Answers with React + Edge APIs**
- **Optional LangChain RAG Chain**

---

## 🔍 Features

- 📁 Upload and chunk code files with intelligent logic
- 🧠 Store 1536-dim OpenAI embeddings into a vector DB
- 🗂️ Perform vector similarity search with metadata filtering (e.g., by file name)
- 💬 Ask questions about the code and get GPT-4 answers using relevant chunks
- ⚡ Full streaming support for live answer generation
- 🧩 Optional fallback mode using LangChain's `RetrievalQAChain`

---

## 🧠 RAG Design: Custom vs LangChain Chain

| Feature                                    | Custom RAG (Used in App)                          | LangChain Chain (`RetrievalQAChain`)            |
|-------------------------------------------|--------------------------------------------------|-------------------------------------------------|
| 🔧 Control Over Pipeline                   | ✅ Full control over each step                    | 🚫 Abstracted, limited control                  |
| 🧠 Prompt Customization                    | ✅ Manual context injection and templating        | ⚠️ Limited without customization                |
| 📦 External Dependencies                   | ✅ Minimal (OpenAI SDK + DB driver)               | ⚠️ Requires LangChain dependencies              |
| 🛠 Debuggability & Transparency            | ✅ Transparent and debuggable                     | 🚫 Internals often hidden                       |
| 🧪 Better for Learning / Interviews        | ✅ Demonstrates low-level design skills           | ⚠️ High-level abstraction                       |
| 🧩 Extensibility (e.g. metadata filtering) | ✅ Fine-grained control over chunk retrieval      | ⚠️ Needs custom retriever logic                 |

---

## ✅ Completed Feature: File-Based Question Filtering

Users can now:

1. Select a file from a dropdown list of uploaded files
2. Ask a question based on the selected file
3. See answers **streamed live** in the UI via GPT-4

This improves accuracy by narrowing context and reducing irrelevant chunk matches.

---

## 🚀 How It Works (Simplified)

```ts
// Server route
POST /api/query {
  // 1. Vector search
  const similarChunks = await vectorStore.similaritySearch(query, { filter: { fileName } });

  // 2. Construct prompt with chunks
  const prompt = buildPrompt(similarChunks, query);

  // 3. Stream GPT-4 completion
  return OpenAI.stream({ model: "gpt-4", prompt });
}
```

## 🧑‍💻 Who Should Check This Out?

- Engineers preparing for **SDE II / AI-focused roles**
- Developers interested in **custom RAG architecture**
- Recruiters evaluating **hands-on GenAI projects**

---

## ⚙️ Tech Stack Summary

- **Frontend**: Next.js 14 (App Router), TailwindCSS, shadcn/ui
- **Backend**: Edge-compatible Node.js API routes, AstraDB vector search
- **file uploads**: `Formidable` library
- **File chunking**: `RecursiveCharacterTextSplitter` from langchain
- **AI/Embedding**: OpenAI GPT-4 + `text-embedding-3-small`
- **Vector DB**: AstraDB using `$vector` search and metadata filtering
- **Streaming**: Fetch-based reader with live answer rendering
- **Optional**: LangChain.js for `RetrievalQAChain` fallback

---


## 💬 Contact

Built with ❤️ by Hardik.

If you're hiring or collaborating on GenAI tools, [let's connect](mailto:hardik.dalmia@gmail.com)!
