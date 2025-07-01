# 🧠 CodeVault AI – Context-Aware Codebase Chat Assistant

CodeVault AI is a powerful Generative AI project that allows developers to upload codebases and ask intelligent, context-aware questions about them. Whether you're exploring legacy code, debugging, or learning from example projects, CodeVault helps you interact with your code like never before.

This project showcases full-stack engineering and GenAI integration skills using cutting-edge technologies:

* **Next.js (App Router)**
* **TailwindCSS + shadcn/ui**
* **OpenAI GPT-4 + text-embedding-3-small**
* **AstraDB Vector Store (MongoDB-style)**
* **LangChain (optional)**

---

## 🔍 Features

* 📁 Upload and chunk code files intelligently
* 🧠 Store 1536-dim OpenAI embeddings into a vector DB
* 🗂️ Search using vector similarity with metadata filtering (e.g., by filename)
* 💬 Ask questions about the code and get high-quality GPT-4 answers with retrieved context
* 🚀 Built with full streaming support for live answer generation
* 🧩 Optional LangChain-based fallback mode

---

## 🧠 RAG Design: Custom vs LangChain Chain

| Feature                                    | Custom RAG (Used Here)                            | LangChain Chain (`RetrievalQAChain`)            |
| ------------------------------------------ | ------------------------------------------------- | ----------------------------------------------- |
| 🔧 Control Over Pipeline                   | ✅ Full control over each step                     | 🚫 Abstracted, limited control                  |
| 🧠 Prompt Customization                    | ✅ Manual injection of context and templating      | ⚠️ Limited flexibility unless extended manually |
| 📦 External Dependencies                   | ✅ Minimal (OpenAI SDK + DB driver)                | ⚠️ Heavy dependency on LangChain                |
| 🛠 Debuggability & Transparency            | ✅ Easy to inspect each component                  | 🚫 Internals often abstracted                   |
| 🧪 Better for Learning / Interviews        | ✅ Shows low-level understanding and design skills | ⚠️ More black-box style integration             |
| 🧩 Extensibility (e.g. metadata filtering) | ✅ Fine-grained filters (like file name, chunking) | ⚠️ Requires custom retriever logic              |

---

## 🔀 Optional LangChain Support

The codebase is modular, allowing an optional switch to LangChain's `RetrievalQAChain` for quicker prototyping or integration in LangChain-native workflows.

```ts
// Example flag
const useLangChain = process.env.USE_LANGCHAIN === "true";

if (useLangChain) {
  const retriever = new AstraDBVectorStore(...).asRetriever();
  const chain = RetrievalQAChain.fromLLM(llm, retriever);
  const result = await chain.call({ query: userQuestion });
} else {
  // Use custom embedding + vector search + prompt
}
```

This makes the project suitable for both custom low-level use cases and rapid chain-based applications.

---

## 📁 Upcoming Feature: File-Based Question Filtering

The next milestone is building a `/search` page where users can:

1. Select a file from a dropdown list of uploaded files
2. Ask a question specific to that file
3. See answers **streamed live** as GPT-4 generates them

This improves context precision, reducing unrelated chunk retrieval.

---

## 🧑‍💻 Who Should Check This Out?

* Engineers preparing for **SDE II / AI-focused roles**
* Developers interested in **custom RAG architecture**
* Recruiters evaluating **hands-on GenAI projects**

---

## ⚙️ Tech Stack Summary

* **Frontend**: Next.js 14 (App Router), TailwindCSS, shadcn/ui
* **Backend**: Node.js API routes, Mongo-style AstraDB driver
* **AI/Embedding**: OpenAI GPT-4 & text-embedding-3-small
* **Vector DB**: AstraDB with \$vector search, metadata filters
* **Optional**: LangChain.js for chain-based fallback

---

## 💬 Contact

Built with ❤️ by Hardik.

If you're hiring or collaborating on GenAI tools, [let's connect](mailto:your.email@example.com)!
