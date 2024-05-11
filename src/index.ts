import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

app.post(
  "/generate",
  (
    req: Request<GenerateRequestInput>,
    res: Response<GenerateResponseBody | SosError>
  ) => {
    // validation
    if (!req.body || !req.body.question) {
      return res
        .status(400)
        .send({ message: "Missing question in request body" });
    }

    const question = req.body.question;

    // TODO: GENERATE SOS
    const answer = `Your question: ${question}`;
    const dummyAnswers = {
      answers: [
        { content: "foo", username: "bar", isBest: false },
        { content: "bax", username: "boo", isBest: true },
      ],
    };
    res.status(200).send(dummyAnswers);
  }
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
