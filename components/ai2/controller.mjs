// import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
dotenv.config();
// import { HumanMessage } from "@langchain/core/messages";
import { ChatOllama } from "@langchain/ollama";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OllamaEmbeddings } from "@langchain/ollama";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
const loader = new JSONLoader("components/ai2/ProyectosU.users.json");

const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 20,
});

const splitDocs = await splitter.splitDocuments(docs);

const embeddings = new OllamaEmbeddings({
    model: "mxbai-embed-large", // Default value
    baseUrl: "http://localhost:11434", // Default value
    timeout: 5000, // Default value
});

const vectorStore = await MemoryVectorStore.fromDocuments(
  splitDocs,
  embeddings
);

const retriever = vectorStore.asRetriever({
  k: 2,
});

const llm = new ChatOllama({
  model: "llama3", // Default value.
  temperature: 0.7, // Default value.
});

const retrieverPrompt = ChatPromptTemplate.fromMessages([
    ["user", "{input}"],
    [
      "user",
      "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
    ],
  ]);
  
  // This chain will return a list of documents from the vector store
  const retrieverChain = await createHistoryAwareRetriever({
    llm,
    retriever,
    rephrasePrompt: retrieverPrompt,
  });

const queryAIModel = async (req, res) => {
  const { input } = req.body;
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the user's questions based on the following context: {context}.",
    ],
    ["user", "{input}"],
  ]);
  
  // Since we need to pass the docs from the retriever, we will use
  // the createStuffDocumentsChain
  const chain = await createStuffDocumentsChain({
    llm,
    prompt: prompt,
  });
  
  // Create the conversation chain, which will combine the retrieverChain
  // and combineStuffChain in order to get an answer
  const conversationChain = await createRetrievalChain({
    combineDocsChain: chain,
    retriever: retrieverChain,
  });
  
  try {
    const result = await conversationChain.invoke({
        input: input,
      });
    console.log(result);
    return res.status(404).json(result.content);
  } catch (error) {
    return new Error(`Error querying AI model: ${error.message}`);
  }
};

export { queryAIModel };
