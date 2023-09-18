import {
  IEmailRequestBody,
  IEmailResponseBody,
} from "../../../server/src/types/email";
import { SERVER_URL } from "../util";

async function sendEmailFromForm(formData: FormData) {
  const senderName = formData.get("message-sender-name")?.toString() || "";
  const senderEmail = formData.get("message-sender-email")?.toString() || "";
  const messageBody = formData.get("message-sender-body")?.toString() || "";

  const emailBody: IEmailRequestBody = {
    senderEmail,
    senderName,
    messageBody,
  };

  const emailEndpointURL = `${SERVER_URL}/api/sendemail`;
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
  } catch (_) {
    responseMessage =
      "My backend server is unreachable at this time, please try again later";
  }

  return { response, responseMessage };
}

function setupEmailMessageForm(
  messageFormId: string,
  messageSendBtnId: string,
  messageLoadingSpinnerId: string,
  successToastId: string,
  failureToastId: string,
  successTextId: string,
  failureTextId: string,
) {
  const messageMeForm = document.querySelector(messageFormId);
  const messageSendBtn = document.querySelector(messageSendBtnId);
  const messageLoadingSpinner = document.querySelector(messageLoadingSpinnerId);
  const successToast = document.querySelector(successToastId);
  const failureToast = document.querySelector(failureToastId);
  const successText = document.querySelector(successTextId);
  const failureText = document.querySelector(failureTextId);
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

      actualMessageSendBtn.disabled = true;
      actualMessageLoadingSpinner.classList.remove("hidden");
      if (!actualSuccessToast.classList.contains("hidden")) {
        actualSuccessToast.classList.add("hidden");
      }
      if (!actualFailureToast.classList.contains("hidden")) {
        actualFailureToast.classList.add("hidden");
      }

      const formData = new FormData(actualMessageMeForm);
      const { response, responseMessage } = await sendEmailFromForm(formData);

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

      actualMessageSendBtn.disabled = false;
      actualMessageLoadingSpinner.classList.add("hidden");
    });
  }
}

export default setupEmailMessageForm;
