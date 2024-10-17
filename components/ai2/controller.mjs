// import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
dotenv.config();

// const llm = new ChatOpenAI({
//   model: "gpt-3.5-turbo",
//   temperature: 0.7
// });

import LlamaAI from "llamaai";

const apiToken = process.env.LLAMA_API_KEY;
const llamaAPI = new LlamaAI(apiToken);

// const apiRequestJson = {
//   messages: [{ role: "user", content: "What is the weather like in Boston?" }],
//   functions: [
//     {
//       name: "get_current_weather",
//       description: "Get the current weather in a given location",
//       parameters: {
//         type: "object",
//         properties: {
//           location: {
//             type: "string",
//             description: "The city and state, e.g. San Francisco, CA",
//           },
//           days: {
//             type: "number",
//             description: "for how many days ahead you wants the forecast",
//           },
//           unit: { type: "string", enum: ["celsius", "fahrenheit"] },
//         },
//       },
//       required: ["location", "days"],
//     },
//   ],
//   stream: false,
//   function_call: "get_current_weather",
// };

const queryAIModel = async (req, res) => {
    const {input} = req.body;
    try {
        const apiRequestJson = {
            messages: [{ role: "user", content: input }]
        };
        
        llamaAPI
        .run(apiRequestJson)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.message;
        });
        
    } catch (error) {
        return new Error(`Error querying AI model: ${error.message}`);
    }
};

export { queryAIModel };