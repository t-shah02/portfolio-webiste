import { SERVER_URL } from "../util";
import { IAIChatResponseBody } from "../../../server/src/types/ai";
import { IChatMessage, ESenderType } from "../types/chatting";

const botChatMessageStyle = `"bg-gray-800/[.1] border border-gray-200 text-sm text-gray-600 rounded-md p-4"`;
const humanChatMessageStyle = `"bg-blue-50 border border-blue-200 text-sm text-blue-600 rounded-md p-4"`;
const botChatMessageErrorStyle = `"bg-red-50 border border-red-200 text-sm text-red-600 rounded-md p-4"`;
const localStorageMessagesKey = "previous-chat-messages";

const loadMessagesFromLocalStorage = (): IChatMessage[] => {
  const chatMessages = localStorage.getItem(localStorageMessagesKey);
  if (chatMessages) {
    return JSON.parse(chatMessages) as IChatMessage[];
  }

  localStorage.setItem(localStorageMessagesKey, "[]");
  return [];
};

const addMessageToLocalStorage = (newChatMessage: IChatMessage | null) => {
  if (newChatMessage === null) return;

  const currentChatMessages = loadMessagesFromLocalStorage();
  currentChatMessages.push(newChatMessage);

  localStorage.setItem(
    localStorageMessagesKey,
    JSON.stringify(currentChatMessages),
  );
};

const generateMessageListNode = (
  message: IChatMessage | null,
): HTMLLIElement => {
  const messageElementClassName =
    message === null
      ? botChatMessageErrorStyle
      : message.type === ESenderType.User
      ? humanChatMessageStyle
      : botChatMessageStyle;
  const senderName =
    message === null
      ? "BOT"
      : message.type === ESenderType.User
      ? "YOU"
      : "BOT";
  const messageBody =
    message === null
      ? "I am having some trouble communicating to the server right now!"
      : message.content;

  const newMessageElement = document.createElement("li");
  newMessageElement.innerHTML = `<div class=${messageElementClassName} role="alert">
  <span class="font-bold">${senderName}</span> ${messageBody}</div>`;

  newMessageElement.style.listStyle = "none";
  newMessageElement.style.width = "50%";
  newMessageElement.style.marginTop = "1.25rem";
  newMessageElement.style.marginBottom = "1.25rem";
  if (message?.type === ESenderType.User) {
    newMessageElement.style.marginRight = "1.2rem";
    newMessageElement.style.marginLeft = "auto";
  }
  if (message?.type === ESenderType.Chatbot) {
    newMessageElement.style.marginLeft = "1.2rem";
    newMessageElement.style.marginRight = "auto";
  }

  return newMessageElement;
};

const makeMessageObject = (
  message: string,
  messageType: ESenderType,
): IChatMessage => {
  const messageId = crypto.randomUUID();
  const currentTime = new Date(Date.now());

  return {
    id: messageId,
    type: messageType,
    dateSent: currentTime,
    content: message,
  };
};

async function askQuestion(question: string) {
  const serverUrl = `${SERVER_URL}/api/aichat`;
  const finalUrl = new URL(serverUrl);
  finalUrl.searchParams.append("question", question);

  const response = await fetch(finalUrl);
  let chatMessage: IChatMessage | null = null;

  try {
    const chatResponse: IAIChatResponseBody = await response.json();
    chatMessage = makeMessageObject(chatResponse.answer, ESenderType.Chatbot);
  } catch (_) {
    chatMessage = null;
  }

  return { response, chatMessage };
}

export function setupChattingToggle(
  chattingToggleBtnId: string,
  messageIconId: string,
  messageXMarkIconId: string,
  chattingWindowContainerId: string,
) {
  const chattingToggleBtn = document.querySelector(chattingToggleBtnId);
  const messageIcon = document.querySelector(messageIconId);
  const messageXMarkIcon = document.querySelector(messageXMarkIconId);
  const chattingWindowContainer = document.querySelector(
    chattingWindowContainerId,
  );

  if (
    chattingToggleBtn &&
    messageIcon &&
    messageXMarkIcon &&
    chattingWindowContainer
  ) {
    chattingToggleBtn.addEventListener("click", (event) => {
      event.stopPropagation();

      if (messageIcon.classList.contains("hidden")) {
        messageIcon.classList.remove("hidden");
        messageXMarkIcon.classList.add("hidden");
        chattingWindowContainer.classList.add("hidden");
      } else {
        messageXMarkIcon.classList.remove("hidden");
        messageIcon.classList.add("hidden");
        chattingWindowContainer.classList.remove("hidden");
      }
    });

    window.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

      if (
        !chattingWindowContainer.classList.contains("hidden") &&
        target.id !== chattingWindowContainerId &&
        !chattingWindowContainer.contains(target)
      ) {
        chattingWindowContainer.classList.add("hidden");
        messageXMarkIcon.classList.add("hidden");
        messageIcon.classList.remove("hidden");
      }
    });
  }
}

export function setupChattingWindow(
  chatMessagesListId: string,
  chatMessageInputId: string,
  sendChatMessageButtonId: string,
) {
  const chatMessagesList = document.querySelector(chatMessagesListId);
  const chatMessageInput = document.querySelector(chatMessageInputId);
  const sendChatMessageButton = document.querySelector(sendChatMessageButtonId);

  if (chatMessagesList && chatMessageInput && sendChatMessageButton) {
    const actualChatMessageInput = chatMessageInput as HTMLInputElement;
    const actualChatMessagesList = chatMessagesList as HTMLDListElement;
    const actualSendChatMessageButton =
      sendChatMessageButton as HTMLButtonElement;

    const messagesFromHistory = loadMessagesFromLocalStorage();
    messagesFromHistory.forEach((message) => {
      const messageLiElement = generateMessageListNode(message);
      actualChatMessagesList.appendChild(messageLiElement);
    });

    actualChatMessagesList.scrollTop = actualChatMessagesList.scrollHeight;

    const addNewMessageToChatWindow = async () => {
      if (!actualChatMessageInput.value.length) return;

      const humanMessage = makeMessageObject(
        actualChatMessageInput.value,
        ESenderType.User,
      );
      const humanMessageLiElement = generateMessageListNode(humanMessage);
      actualChatMessagesList.appendChild(humanMessageLiElement);

      addMessageToLocalStorage(humanMessage);

      // const { chatMessage: chatBotMessage } = await askQuestion(
      //   humanMessage.content,
      // );

      // addMessageToLocalStorage(chatBotMessage);

      // const chatBotMessageLiElement = generateMessageListNode(chatBotMessage);
      // actualChatMessagesList.appendChild(chatBotMessageLiElement);

      actualChatMessageInput.value = "";
      actualChatMessagesList.scrollTop = actualChatMessagesList.scrollHeight;
    };

    actualChatMessageInput.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        await addNewMessageToChatWindow();
      }
    });

    actualSendChatMessageButton.addEventListener("click", async () => {
      await addNewMessageToChatWindow();
    });
  }
}
