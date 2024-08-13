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
      const answers = await generateSoAnswers(question);

      res.status(200).send(answers);
    } catch (e: any) {
      console.error(e.message);
      res.status(500).send({ message: e.message });
    }
  }
);

// app.post(
//   "/generate/reply",
//   async (
//     req: Request<GenerateReplyInput>,
//     res: Response<GenerateReplyResponse>
//   ) => {
//     // TODO
//     res
//       .status(200)
//       .json({ message: "User created successfully", data: { name, email } });
//   }
// );

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
