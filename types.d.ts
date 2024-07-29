interface GenerateRequestInput {
  question: string;
}

interface Answer {
  content: string;
  username: string;
  isBest: boolean;
}

interface GenerateResponseBody {
  questionTitle: string;
  answers: Answer[];
}

interface SosError {
  message: string;
}

// escape third party library wiht no types
declare module "dirty-json" {
  export function parse(input: string): any;
}
