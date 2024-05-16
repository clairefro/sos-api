import express, { Request, Response } from "express";
import cors from "cors";

import { generateSoAnswers } from "./lib/generate";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

/** CORS CONFIG */

let allowedOrigins;
if (process.env.NODE_ENV === "development") {
  allowedOrigins = ["http://local:3000"];
} else {
  // TODO: HARD CODE PROD CLIENT ONCE HOSTED
  allowedOrigins = [""]; // Example for local development
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is allowed
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

/** END CORS CONFIG */

app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

app.post(
  "/generate",
  async (
    req: Request<GenerateRequestInput>,
    res: Response<GenerateResponseBody | SosError>
  ) => {
    // TODO: validation -> middleware
    if (!req.body || !req.body.question) {
      return res
        .status(400)
        .send({ message: "Missing question in request body" });
    }

    const question = req.body.question;

    try {
      const raw = await generateSoAnswers(question);
      // TODO: JSON VALIDATION + REFETCH

      if (raw === undefined) throw new Error("malformatted JSON response");

      const parsed = JSON.parse(raw);

      res.status(200).send({ answers: parsed });
    } catch (e: any) {
      // TODO : return something
      res.status(500).send({ message: "oh noooooo" });
    }
  }
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
