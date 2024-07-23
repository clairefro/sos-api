import axios from "axios";
import config from "../config";
import systemPrompt from "./systemPrompt";

const apiKey = config.OPENAI_API_KEY;

const url = "https://api.openai.com/v1/chat/completions";

async function generateSoAnswers(
  question: string
): Promise<RawSoAnswers | undefined> {
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

  try {
    const response = await axios.post(url, opts, { headers });
    const content = response.data.choices[0].message.content;
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
