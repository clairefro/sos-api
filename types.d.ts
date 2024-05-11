interface GenerateRequestInput {
  question: string;
}

interface Answer {
  content: string;
  username: string;
  isBest: boolean;
}

interface GenerateResponseBody {
  answers: Answer[];
}

interface SosError {
  message: string;
}
