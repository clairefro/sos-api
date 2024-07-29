import express, { Request, Response } from "express";
import cors from "cors";
import { corsOptions, handleCorsError } from "./middleware/cors";
import { limiter } from "./middleware/limiter";
import { generateSoAnswers } from "./lib/generate";

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
  "/generate",
  async (
    req: Request<GenerateRequestInput>,
    res: Response<GenerateResponseBody | SosError>
  ) => {
    // TODO: request validation -> middleware
    if (!req.body || !req.body.question) {
      return res
        .status(400)
        .send({ message: "Missing question in request body" });
    }

    const question = req.body.question;

    try {
      const answers = await generateSoAnswers(question);

      res.status(200).send(answers);
    } catch (e: any) {
      console.error(e.message);
      res.status(500).send({ message: e.message });
    }
  }
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
