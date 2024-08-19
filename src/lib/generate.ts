import axios from "axios";
import { validateSosResponse } from "./validation";
import config from "../config";
import generateThreadPrompt from "./prompts/generateThread";
import generateReplyPrompt from "./prompts/generateReply";

/** Constants */
const apiKey = config.OPENAI_API_KEY;

const url = "https://api.openai.com/v1/chat/completions";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${apiKey}`,
};

/** Helpers */
function handleError(err: Error) {
  if (axios.isAxiosError(err)) {
    if (err.response?.data?.error?.message) {
      throw new Error("OpenAI error: " + err.response.data.error.message);
    } else {
      throw new Error("Axios error: " + err.message);
    }
  } else {
    throw new Error("Unexpected error: " + err.message);
  }
}

function buildThreadRequestOptions(question: string) {
  const messages = [
    { role: "system", content: generateThreadPrompt },
    { role: "user", content: question },
  ];
  return {
    model: config.OPENAI_MODEL,
    max_tokens: 4090,
    n: 1,
    temperature: 1,
    messages,
  };
}

function buildReplyRequestOptions(messages: Message[]) {
  const messagesWtihSystemPrompt = [
    { role: "system", content: generateReplyPrompt },
    ...messages,
  ];
  return {
    model: config.OPENAI_MODEL,
    max_tokens: 4090,
    n: 1,
    temperature: 1,
    messages: messagesWtihSystemPrompt,
  };
}

async function askWithRetries(
  question: string,
  retries: number = 3
): Promise<GenerateThreadResponse | undefined> {
  /** build query */

  const opts = buildThreadRequestOptions(question);

  /** start attempts until valid JSON is returned */
  let attempt = 0;

  while (attempt < retries) {
    try {
      const response = await axios.post(url, opts, { headers });

      const content = response.data.choices[0].message.content;

      validateSosResponse(content);

      return JSON.parse(content);
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error(`Invalid JSON response on attempt ${attempt + 1}`);
      } else if (axios.isAxiosError(error)) {
        console.error(
          `Axios error on attempt ${attempt + 1}: ${error.message}`
        );
      } else {
        console.error(`Unknown error on attempt ${attempt + 1}: ${error}`);
      }
      attempt++;
      console.log("starting attempt " + (attempt + 1));
      if (attempt === retries) {
        console.error("Max retries reached. Giving up.");
        throw new Error("Max retries reached. Giving up.");
      }
    }
  }
  return undefined;
}

/** Exports */
async function generateThread(
  question: string
): Promise<GenerateThreadResponse | undefined> {
  try {
    const content = await askWithRetries(question);

    return content;
  } catch (err: any) {
    handleError(err);
  }
}

async function generateReply(
  messages: Message[]
): Promise<GenerateReplyResponse | undefined> {
  try {
    const opts = buildReplyRequestOptions(messages);

    const response = await axios.post(url, opts, { headers });
    const reply = response.data.choices[0].message.content;

    return { reply };
  } catch (err: any) {
    handleError(err);
  }
}

export { generateThread, generateReply };
