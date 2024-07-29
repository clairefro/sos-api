import axios from "axios";
import { validateSosResponse } from "./validation";
import config from "../config";
import systemPrompt from "./systemPrompt";

const apiKey = config.OPENAI_API_KEY;

const url = "https://api.openai.com/v1/chat/completions";

const askWithRetries = async (
  question: string,
  retries: number = 3
): Promise<GenerateResponseBody | undefined> => {
  /** build query */
  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: question,
    },
  ];

  const opts = {
    model: config.OPENAI_MODEL,
    max_tokens: 4090,
    n: 1,
    temperature: 1,
    messages,
    stream: false,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  /** start attempts until valid JSON is returned */
  let attempt = 0;

  while (attempt < retries) {
    console.log({ attempt });
    try {
      const response = await axios.post(url, opts, { headers });

      const content = response.data.choices[0].message.content;

      validateSosResponse(content);

      return JSON.parse(content);
    } catch (error) {
      console.log("entered CATCH");
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
      if (attempt === retries) {
        console.error("Max retries reached. Giving up.");
        throw new Error("Max retries reached. Giving up.");
      }
    }
  }
  return undefined;
};

async function generateSoAnswers(
  question: string
): Promise<GenerateResponseBody | undefined> {
  try {
    const content = await askWithRetries(question);

    return content;
  } catch (err: any) {
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
}

export { generateSoAnswers };
