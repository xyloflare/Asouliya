import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "";
import { api_key as API_KEY } from "../config.js";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 1024,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

async function run(message, text, channel, client) {
  const parts = [{ text: text }];

  const chatHistory = client.chatHistory;
  const channelHistory = chatHistory.get(channel.id);

  if (channelHistory) {
    try {
      const chat = model.startChat({
        history: channelHistory.history,
        generationConfig: {
          maxOutputTokens: 250,
        },
        safetySettings,
      });

      const result = await chat.sendMessage(text);
      const response = await result.response;
      const responsetext = response.text();

      if (!responsetext) return message.reply("*Something went wrong*");

      await message.reply(responsetext);

      channelHistory.history.push({
        role: "user",
        parts: [{ text: text }],
      });
      channelHistory.history.push({
        role: "model",
        parts: [{ text: responsetext || "*model did not respond*" }],
      });
      channelHistory.lastMsg = Date.now();
    } catch (e) {
      console.log("error in ai_model in chat mode", e);
      channel.send(e);
    }

    return;
  }

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    const response = result.response;
    let textResponse = response.text();
    if (!textResponse) return; //console.log("Log from ai_model textresponse ", textResponse);

    if (textResponse.length < 2000) return await channel.send(textResponse);

    const chunks = splitMessage(textResponse);

    for (const chunk of chunks) {
      await channel.send(chunk);
    }
  } catch (e) {
    //console.log("Error in ai_model in generate content", e);
    channel.send(`Error: ${e}`);
  }
}

export default run;

function splitMessage(message) {
  const maxLength = 2000;
  const numChunks = Math.ceil(message.length / maxLength);
  const chunks = [];

  for (let i = 0; i < numChunks; i++) {
    const start = i * maxLength;
    const end = (i + 1) * maxLength;
    chunks.push(message.substring(start, end));
  }

  return chunks;
}
