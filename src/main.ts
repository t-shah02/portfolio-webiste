import "./style.css";

const footerYearParagraph: HTMLParagraphElement | null = document.querySelector("#footer-year-p");

if (footerYearParagraph) {
    const currentYear = new Date(Date.now()).getFullYear();
    footerYearParagraph.innerText = `© Tanish Shah. ${currentYear}. All rights reserved.`
}