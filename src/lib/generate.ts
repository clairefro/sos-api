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
    model: "gpt-3.5-turbo",
    max_tokens: 1600,
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
  } catch (error) {
    console.error("Error:", error);
  }
}

export { generateSoAnswers };
