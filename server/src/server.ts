import express from "express";
import cors from "cors";
import { IEmailRequestBody } from "./types/email";
import { sendEmail } from "./util/email";
import { SERVER_PORT } from "./constants/server";


const app = express();
app.use(cors({
    origin: ["http://localhost:5173"]
}));
app.use(express.json());

app.post("/api/sendemail", async (req, res) => {
    const emailBody: IEmailRequestBody = req.body;

    try {
        await sendEmail(emailBody);
        res.json({
            status: "ok",
            message: "The email was successfully sent"
        });
    } catch (exception) {
        console.debug(exception);
        res.status(400).json({
            status: "reject",
            message: "Please ensure the email is in a valid format and that the name and message body doesn't contain any offensive language"
        });
    }

});

app.listen(SERVER_PORT, () => {
    const runningMessage = `The server is running at port: ${SERVER_PORT}`;
    console.debug(runningMessage);
});
