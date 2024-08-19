import express, { Request, Response } from "express";
import cors from "cors";
import { corsOptions, handleCorsError } from "./middleware/cors";
import { limiter } from "./middleware/limiter";
import { generateThread, generateReply } from "./lib/generate";
import generateThreadPrompt from "./lib/prompts/generateThread";
import generateReplyPrompt from "./lib/prompts/generateReply";
import { isValidGenerateReplyInput } from "./util/isValidGenerateReplyInput";

const app = express();
const port = process.env.PORT || 3000;

/** MIDDLEWARE */
app.use(express.json());

app.use(cors(corsOptions));
app.use(handleCorsError);

app.use(limiter);

/** ROUTES */
app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

app.post(
  "/generate/thread",
  async (
    req: Request<GenerateThreadInput>,
    res: Response<GenerateThreadResponse | SosError>
  ) => {
    // TODO: request validation -> middleware
    if (!req.body || !req.body.question) {
      return res
        .status(400)
        .send({ message: "Missing question in request body" });
    }

    const question = req.body.question;

    try {
      const answers = await generateThread(question);

      res.status(200).send(answers);
    } catch (e: any) {
      console.error(e.message);
      res.status(500).send({ message: e.message });
    }
  }
);

app.post(
  "/generate/reply",
  async (
    req: Request<GenerateReplyInput>,
    res: Response<GenerateReplyResponse | SosError>
  ) => {
    // TODO: request validation -> middleware
    if (!isValidGenerateReplyInput(req.body)) {
      return res
        .status(400)
        .send({ message: "Missing valid 'messages' array in request body" });
    }

    const messages = req.body.messages;

    try {
      const reply = await generateReply(messages);

      res.status(200).send(reply);
    } catch (e: any) {
      console.error(e.message);
      res.status(500).send({ message: e.message });
    }
  }
);

app.get("/prompts/generateThread", (_req, res: Response<GetPromptResponse>) => {
  res.status(200).send({ prompt: generateThreadPrompt });
});

app.get("/prompts/generateReply", (_req, res: Response<GetPromptResponse>) => {
  res.status(200).send({ prompt: generateReplyPrompt });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
