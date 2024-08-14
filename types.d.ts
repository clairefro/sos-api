/** Thread */

interface GenerateThreadInput {
  question: string;
}

interface Answer {
  content: string;
  username: string;
  isBest: boolean;
}

interface GenerateThreadResponse {
  questionTitle: string;
  answers: Answer[];
}

/** Replies */
interface Message {
  content: string;
  role: string;
}

interface GenerateReplyInput {
  messages: Message[];
}

interface GenerateReplyResponse {
  reply: string;
}

/** Prompts */

interface GetPromptResponse {
  prompt: string;
}

/** Other */
interface SosError {
  message: string;
}

// escape third party library wiht no types
declare module "dirty-json" {
  export function parse(input: string): any;
}
