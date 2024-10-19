// import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
dotenv.config();
// import { HumanMessage } from "@langchain/core/messages";
import { ChatOllama } from "@langchain/ollama";
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

import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { JSONLoader } from "langchain/document_loaders/fs/json";


const loader = new DirectoryLoader(
  "./components/ai2/jsons", {
    ".json": (p) => new JSONLoader(p),
  }
);

const docs = await loader.load();
//console.log(docs.filter(doc => doc.metadata.source === 'C:\\Users\\braya\\OneDrive\\Escritorio\\PI2BACKEND\\components\\ai2\\jsons\\users.json'));
// Función de preprocesamiento

function preprocessJsonDocs(jsonDocs, type) {
  //console.log(jsonDocs.map(doc => doc.pageContent));
  return jsonDocs.map(doc => {
    switch (type) {
      case 'announcements':
        const announcements = {
          pageContent: `Información anuncios: ${doc.pageContent}`,
          metadata: { source: 'announcements' }
        };
        return announcements;
      case 'users':
        const users = {
          pageContent: `Información usuarios: ${doc.pageContent}`,
          metadata: { source: 'users' }
        };
        return users;
      case 'complexes':
        const complexes = {
          pageContent: `Información del conjunto: ${doc.pageContent}`,
          metadata: { source: 'complexes' }
        };
        return complexes;
      case 'pqrs':
          const pqrs = {
          pageContent: `Informacion de las PQRS: ${doc.pageContent}`,
          metadata: { source: 'pqrs' }
        };
        return pqrs;
      default:
        return { pageContent: JSON.stringify(doc), metadata: { source: 'unknown' } };
    }
  });
}

// Preprocesar documentos
const announcementDocs = preprocessJsonDocs(docs.filter(doc => doc.metadata.source === 'C:\\Users\\braya\\OneDrive\\Escritorio\\PI2BACKEND\\components\\ai2\\jsons\\announcements.json'), 'announcements');
const userDocs = preprocessJsonDocs(docs.filter(doc => doc.metadata.source === 'C:\\Users\\braya\\OneDrive\\Escritorio\\PI2BACKEND\\components\\ai2\\jsons\\users.json'), 'users');
const complexDocs = preprocessJsonDocs(docs.filter(doc => doc.metadata.source === 'C:\\Users\\braya\\OneDrive\\Escritorio\\PI2BACKEND\\components\\ai2\\jsons\\complexes.json'), 'complexes');
const pqrsDocs = preprocessJsonDocs(docs.filter(doc => doc.metadata.source === 'C:\\Users\\braya\\OneDrive\\Escritorio\\PI2BACKEND\\components\\ai2\\jsons\\pqrs.json'), 'pqrs');
// Unir todos los documentos procesados
const allDocs = [...announcementDocs, ...userDocs, ...complexDocs, ...pqrsDocs];
// Dividir documentos
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 20,
});
//console.log(allDocs);
const splitDocs = await splitter.splitDocuments(allDocs);
//console.log(splitDocs);
const embeddings = new OllamaEmbeddings({
    model: "mxbai-embed-large", // Default value
    baseUrl: "http://localhost:11434", // Default value
    timeout: 5000,
});

const vectorStore = await MemoryVectorStore.fromDocuments(
  splitDocs,
  embeddings
);

const retriever = vectorStore.asRetriever({
  k: 2,
});

const llm = new ChatOllama({
  model: "llama3",
  temperature: 0.7,
});

const retrieverPrompt = ChatPromptTemplate.fromMessages([
    ["user", "{input}"],
    [
      "user",
      "Responde de manera amable con el contexto que fue proporcionado",
    ],
  ]);
  
  // This chain will return a list of documents from the vector store
  const retrieverChain = await createHistoryAwareRetriever({
    llm,
    retriever,
    rephrasePrompt: retrieverPrompt,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `Responde amablemente con la información que te proporciona el contexto. Si no encuentras la información en el contexto, responde "No tengo esa información".
      
      Responde en español. Asegurate de refinar la respuesta. NUNCA menciones que la informacion fue extraida de un contexto.
      Contexto: {context}.`,
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
const chat_history = [];

const queryAIModel = async (req, res) => {
  const { input } = req.body;
  try {
    const result = await conversationChain.invoke({
        chat_history: chat_history,
        input: input,
      });
    console.log(result);
    chat_history.push({
      user: result.input,
      ai: result.answer,
    });
    return res.status(200).send(chat_history);
  } catch (error) {
    return res.status(500).json({message: `Error querying AI model: ${error.message}`});
  }
};

export { queryAIModel };
