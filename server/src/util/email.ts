import { IEmailJSSendBody, IEmailRequestBody } from "../types/email";
import {
    EMAILJS_PRIVATE_KEY,
    EMAILJS_PUBLIC_KEY,
    EMAILJS_TEMPLATE_ID,
    EMAILJS_SERVICE_ID,
    EMAIL_REGEX,
    BASE_NODEJS_API_URL,
    SWEAR_WORDS
} from "../constants/email";

const isValidEmail = (email: string) => EMAIL_REGEX.test(email);

function isSFWString(targetString: string): boolean {
    const targetStringLowered = targetString.toLowerCase();

    for (const SWEAR_WORD of SWEAR_WORDS) {
        if (targetStringLowered.includes(SWEAR_WORD)) return false;
    }

    return true;
}

export async function sendEmail(emailBody: IEmailRequestBody): Promise<void> {
    const { senderName, senderEmail, messageBody } = emailBody;

    if (!senderName || !sendEmail || !messageBody) {
        throw new Error("At least one of the required email fields is empty");
    }

    const finalSenderEmail = senderEmail.toLowerCase();

    if (!isValidEmail(finalSenderEmail)) {
        throw new Error(`${finalSenderEmail} is not in an valid email format`);
    }

    if (!isSFWString(senderName)) {
        throw new Error(`${senderName} is not an appropriate name`);
    }

    if (!isSFWString(messageBody)) {
        throw new Error(`${messageBody} is not an appropriate phrase`);
    }

    const sendEndpointURL = `${BASE_NODEJS_API_URL}/email/send`;
    const emailJSPostBody: IEmailJSSendBody = {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY,
        template_params: {
            fromName: senderName,
            fromEmail: senderEmail,
            message: messageBody
        }
    };

    const response = await fetch(sendEndpointURL, {
        method: "POST",
        body: JSON.stringify(emailJSPostBody),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        console.log("hello world adada")
        throw new Error(`The EmailJS server responded with a status code of ${response.status}`);
    }

}  
