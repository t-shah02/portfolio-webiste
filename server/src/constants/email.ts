import fs from "fs";

// Envrironment variables
export const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || "";
export const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || "";
export const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || "";
export const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || "";

// API
export const BASE_NODEJS_API_URL = "https://api.emailjs.com/api/v1.0";

// Single Emails
export const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;


// Name and Message Body
export const SWEAR_WORDS = fs.readFileSync("./src/constants/swear-words.txt").toString().split("\n");
