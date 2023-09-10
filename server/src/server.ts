import express from "express";
import cors from "cors";
import helmet from "helmet";
import { IEmailRequestBody } from "./types/email";
import { sendEmail } from "./util/email";
import { SERVER_PORT } from "./constants/server";


const app = express();
app.use(cors({
    origin: ["http://localhost:5173"]
}));
app.use(helmet());
app.use(express.json());
app.use(express.static("public"));

app.post("/api/sendemail", async (req, res) => {
    const emailBody: IEmailRequestBody = req.body;

    try {
        await sendEmail(emailBody);
        res.json({
            status: "ok",
            message: "The message was successfully sent to me"
        });
    } catch (exception) {
        const errorMessage = (exception as Error).message;
        res.status(400).json({
            status: "reject",
            message: errorMessage
        });
    }

});

app.get("/api/health", (_, res) => {
    res.json({
        status: "ok",
        message: "This server is healthy and handling your requests strongly! 💪"
    });
})

app.listen(SERVER_PORT, () => {
    const runningMessage = `The server is running at port: ${SERVER_PORT}`;
    console.debug(runningMessage);
});
