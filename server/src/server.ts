import express from "express";
import cors from "cors";
import helmet from "helmet";
import { IEmailRequestBody } from "./types/email";
import { sendEmail } from "./util/email";
import { SERVER_PORT, CLIENT_BASE_URL } from "./constants/server";
import { emailRateLimiter, aiChatRateLimiter } from "./util/redis";
import { constructQAChain, answerQuestion } from "./util/ai";
import { RetrievalQAChain } from "langchain/chains";

const app = express();
let llmQaChain: RetrievalQAChain | null = null;

app.use(
  cors({
    origin: [CLIENT_BASE_URL],
  }),
);
app.use(helmet());
app.use(express.json());
app.use(express.static("public"));
app.use("/api/sendemail", emailRateLimiter);
app.use("/api/aichat", aiChatRateLimiter);

app.get("/api/aichat", async (req, res) => {
  const question = req.query.question as string;

  try {
    const answer = await answerQuestion(llmQaChain, question);
    res.json({
      status: "ok",
      question,
      answer,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(400).json({
      status: "reject",
      message: errorMessage,
    });
  }
});

app.post("/api/sendemail", async (req, res) => {
  const emailBody: IEmailRequestBody = req.body;

  try {
    await sendEmail(emailBody);
    res.json({
      status: "ok",
      message: "The message was successfully sent to me",
    });
  } catch (exception) {
    const errorMessage = (exception as Error).message;
    res.status(400).json({
      status: "reject",
      message: errorMessage,
    });
  }
});

app.get("/api/health", (_, res) => {
  res.json({
    status: "ok",
    message: "This server is healthy and handling your requests strongly! 💪",
  });
});

app.listen(SERVER_PORT, async () => {
  llmQaChain = await constructQAChain();

  const runningMessage = `The server is running at port: ${SERVER_PORT}`;
  console.debug(runningMessage);
});
