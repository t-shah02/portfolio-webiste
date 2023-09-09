import ScreenCanvas from "./canvasEnvironment/screen";
import "./style.css";
// @ts-ignore
import Typed from 'typed.js';
import { IEmailRequestBody } from "server/src/types/email"

const SERVER_URL = import.meta.env.DEV ? "http://localhost:3000" : "";


const CONSOLE_COMMANDS_AND_OUTPUT = [
    "cat hello_world.py",
    "print('Hello World')",
    "cat helloWorld.ts",
    "console.log('Hello World');",
    "cat HelloWorld.java",
    'System.out.println("Hello World");',
    "cat helloworld.go",
    'fmt.Println("Hello World") '
];

new Typed('#prog-lang-heading', {
    strings: CONSOLE_COMMANDS_AND_OUTPUT,
    typeSpeed: 50,
    backSpeed: 50,
    loop: true,
    smartBackspace: false,
});


const TECH_TAG_BG_COLORS = [
    "bg-red-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500"
];
const techTags = document.querySelectorAll(".tech-tag");
if (techTags) {
    techTags.forEach(techTag => {
        const actualTechTag = (techTag) as HTMLSpanElement;
        const randomBgColor = TECH_TAG_BG_COLORS[Math.floor(Math.random() * TECH_TAG_BG_COLORS.length)];
        actualTechTag.classList.add(randomBgColor);
    });
}

const messageMeForm = document.querySelector("#message-me-form");
const messageSendBtn = document.querySelector("#mesage-send-btn");
const messageLoadingSpinner = document.querySelector("#email-loading-spinner");

if (messageMeForm && messageSendBtn && messageLoadingSpinner) {
    const actualMessageMeForm = (messageMeForm) as HTMLFormElement;
    const actualMessageSendBtn = (messageSendBtn) as HTMLButtonElement;
    const actualMessageLoadingSpinner = (messageLoadingSpinner) as HTMLDivElement;

    actualMessageMeForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(actualMessageMeForm);
        const senderName = formData.get("message-sender-name")?.toString() || "";
        const senderEmail = formData.get("message-sender-email")?.toString() || "";
        const messageBody = formData.get("message-sender-body")?.toString() || "";

        if (!senderName || !senderEmail || !messageBody) return;

        const emailBody: IEmailRequestBody = {
            senderEmail,
            senderName,
            messageBody
        };

        const emailEndpointURL = `${SERVER_URL}/api/sendemail`;
        actualMessageSendBtn.disabled = true;
        actualMessageLoadingSpinner.classList.remove("hidden");

        const response = await fetch(emailEndpointURL, {
            method: "POST",
            body: JSON.stringify(emailBody),
            headers: {
                "Content-Type": "application/json"
            }
        });

        actualMessageSendBtn.disabled = false;
        actualMessageLoadingSpinner.classList.add("hidden");


    });
}

const screenCanvas = document.querySelector("#screen-bubble-canvas");
if (screenCanvas) {
    const actualScreenCanvas = screenCanvas as HTMLCanvasElement;
    const canvasContext = actualScreenCanvas.getContext("2d");

    if (canvasContext) {
        const screenCanvasEnvironment = new ScreenCanvas(actualScreenCanvas, canvasContext);
        screenCanvasEnvironment.init();
        screenCanvasEnvironment.animate();
    }
}