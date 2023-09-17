import "./style.css";
// @ts-ignore
import Typed from "typed.js";
import {
  IEmailRequestBody,
  IEmailResponseBody,
} from "../../server/src/types/email";

const SERVER_URL =
  import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:3000";

const CONSOLE_COMMANDS_AND_OUTPUT = [
  "cat hello_world.py",
  "print('Hello World')",
  "cat helloWorld.ts",
  "console.log('Hello World');",
  "cat HelloWorld.java",
  'System.out.println("Hello World");',
  "cat helloworld.go",
  'fmt.Println("Hello World") ',
];

new Typed("#prog-lang-heading", {
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
  "bg-pink-500",
];
const techTags = document.querySelectorAll(".tech-tag");
if (techTags) {
  techTags.forEach((techTag) => {
    const actualTechTag = techTag as HTMLSpanElement;
    const randomBgColor =
      TECH_TAG_BG_COLORS[Math.floor(Math.random() * TECH_TAG_BG_COLORS.length)];
    actualTechTag.classList.add(randomBgColor);
  });
}

const messageMeForm = document.querySelector("#message-me-form");
const messageSendBtn = document.querySelector("#message-send-btn");
const messageLoadingSpinner = document.querySelector("#email-loading-spinner");
const successToast = document.querySelector("#success-toast");
const failureToast = document.querySelector("#failure-toast");
const successText = document.querySelector("#success-text");
const failureText = document.querySelector("#failure-text");
if (
  messageMeForm &&
  messageSendBtn &&
  messageLoadingSpinner &&
  successToast &&
  failureToast &&
  successText &&
  failureText
) {
  const actualMessageMeForm = messageMeForm as HTMLFormElement;
  const actualMessageSendBtn = messageSendBtn as HTMLButtonElement;
  const actualMessageLoadingSpinner = messageLoadingSpinner as HTMLDivElement;
  const actualSuccessToast = successToast as HTMLDivElement;
  const actualFailureToast = failureToast as HTMLDivElement;
  const actualSuccessText = successText as HTMLParagraphElement;
  const actualFailureText = failureText as HTMLParagraphElement;

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
      messageBody,
    };

    const emailEndpointURL = `${SERVER_URL}/api/sendemail`;

    actualMessageSendBtn.disabled = true;
    actualMessageLoadingSpinner.classList.remove("hidden");
    if (!actualSuccessToast.classList.contains("hidden")) {
      actualSuccessToast.classList.add("hidden");
    }
    if (!actualFailureToast.classList.contains("hidden")) {
      actualFailureToast.classList.add("hidden");
    }

    const response = await fetch(emailEndpointURL, {
      method: "POST",
      body: JSON.stringify(emailBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    let responseMessage: string = "";
    try {
      const { message }: IEmailResponseBody = await response.json();
      responseMessage = message;
    } catch (exception) {
      responseMessage =
        "My backend server is unreachable at this time, please try again later";
    }

    actualMessageSendBtn.disabled = false;
    actualMessageLoadingSpinner.classList.add("hidden");

    if (response.ok) {
      if (!actualFailureToast.classList.contains("hidden")) {
        actualFailureToast.classList.add("hidden");
      }
      actualSuccessToast.classList.remove("hidden");

      actualSuccessText.innerText = responseMessage;
    } else {
      if (!actualSuccessToast.classList.contains("hidden")) {
        actualSuccessToast.classList.add("hidden");
      }
      actualFailureToast.classList.remove("hidden");

      actualFailureText.innerText = responseMessage;
    }
  });
}

window.addEventListener("show.hs.tooltip", ($tooltipEl) => {
  console.log($tooltipEl);
});

window.addEventListener("hide.hs.tooltip", ($tooltipEl) => {
  $tooltipEl.preventDefault();
  console.log($tooltipEl);
});
