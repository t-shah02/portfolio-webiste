import { IEmailJSSendBody, IEmailRequestBody } from "../types/email";
import {
    EMAILJS_PRIVATE_KEY,
    EMAILJS_PUBLIC_KEY,
    EMAILJS_TEMPLATE_ID,
    EMAILJS_SERVICE_ID,
    EMAIL_REGEX,
    BASE_NODEJS_API_URL,
    SWEAR_WORDS,
    MINIMUM_EMAIL_LENGTH,
    MAXIMUM_EMAIL_LENGTH,
    MINIMUM_NAME_LENGTH,
    MAXIMUM_NAME_LENGTH,
    MINIMUM_MESSAGE_BODY_LENGTH,
    MAXIMUM_MESSAGE_BODY_LENGTH
} from "../constants/email";
import { SERVER_ENV } from "../constants/server";

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

    if (finalSenderEmail.length < MINIMUM_EMAIL_LENGTH || finalSenderEmail.length > MAXIMUM_EMAIL_LENGTH) {
        throw new Error(`${finalSenderEmail} is not between ${MINIMUM_EMAIL_LENGTH} and ${MAXIMUM_EMAIL_LENGTH} characters long`);
    }

    if (!isValidEmail(finalSenderEmail)) {
        throw new Error(`${finalSenderEmail} is not in an valid email format`);
    }

    if (!isSFWString(finalSenderEmail)) {
        throw new Error(`${finalSenderEmail} is not an appropriate email address`);
    }

    if (senderName.length < MINIMUM_NAME_LENGTH || senderName.length > MAXIMUM_NAME_LENGTH) {
        throw new Error(`${senderName} is not between ${MINIMUM_NAME_LENGTH} and ${MAXIMUM_NAME_LENGTH} characters long`);
    }

    if (!isSFWString(senderName)) {
        throw new Error(`${senderName} is not an appropriate name`);
    }

    if (messageBody.length < MINIMUM_MESSAGE_BODY_LENGTH || messageBody.length > MAXIMUM_MESSAGE_BODY_LENGTH) {
        throw new Error(`${messageBody} is not between ${MINIMUM_MESSAGE_BODY_LENGTH} and ${MAXIMUM_MESSAGE_BODY_LENGTH} characters long`);
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

    if (SERVER_ENV !== "development") {
        const response = await fetch(sendEndpointURL, {
            method: "POST",
            body: JSON.stringify(emailJSPostBody),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`The EmailJS server responded with a status code of ${response.status}`);
        }

    }

}  
