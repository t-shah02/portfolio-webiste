import "./style.css";
import setupEmailMessageForm from "./ui/emailForm";
import setupNavbarTyping from "./ui/typing";
import setupProjectTags from "./ui/tagging";
import { setupChattingToggle, setupChattingWindow } from "./ui/chatting";

window.addEventListener("DOMContentLoaded", () => {
  setupNavbarTyping();
  setupProjectTags();
  setupEmailMessageForm(
    "#message-me-form",
    "#message-send-btn",
    "#email-loading-spinner",
    "#success-toast",
    "#failure-toast",
    "#success-text",
    "#failure-text",
  );
  setupChattingToggle(
    "#chat-window-toggle-btn",
    "#message-icon",
    "#message-xmark",
    "#chatting-window",
  );
  setupChattingWindow(
    "#chat-messages-container",
    "#chat-message-input",
    "#send-chat-message-btn",
  );
});
