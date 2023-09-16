export const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || "";
export const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || "";
export const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || "";
export const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || "";

export const BASE_NODEJS_API_URL = "https://api.emailjs.com/api/v1.0";

export const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const MINIMUM_EMAIL_LENGTH = 5;
export const MAXIMUM_EMAIL_LENGTH = 100;

export const SWEAR_WORDS_DATA_PATH = "./data/swear-words.txt";
export const MINIMUM_NAME_LENGTH = 3;
export const MAXIMUM_NAME_LENGTH = 50;
export const MINIMUM_MESSAGE_BODY_LENGTH = 1;
export const MAXIMUM_MESSAGE_BODY_LENGTH = 800;
