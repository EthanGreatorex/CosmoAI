// Global variables
let currentRequests = 0;
let lastRequestTime = 0;
const COOLDOWN_TIME = 3000; // 3 seconds cooldown

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  console.log("toggled");
  sidebar.classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.querySelector(".sidebar-icon-toggle");
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main");

  toggleButton.addEventListener("click", function () {
    sidebar.classList.toggle("sidebar-visible");
    mainContent.classList.toggle("main-expanded");
  });
});

async function clearCache() {
  const response = await fetch("/clearcache", { method: "POST" });
  const chatMessages = document.getElementById("chat-messages");
  chatMessages.innerHTML = "";
  const chatBubble = document.createElement("div");
  chatBubble.classList.add("message", "ai");
  chatBubble.textContent = "Hello there! I'm Cosmo, how can I help you today?";
  chatMessages.appendChild(chatBubble);
}

async function loadChatHistory() {
  const response = await fetch("/get_chat_history", { method: "GET" });
  const data = await response.json();
  const chatMessages = document.getElementById("chat-messages");
  data.history.forEach((message) => {
    const chatBubble = document.createElement("div");
    chatBubble.classList.add("message", message.role);
    chatBubble.textContent = message.message;
    chatMessages.appendChild(chatBubble);
  });
}

function scrollToBottom() {
  const chatMessages = document.getElementById("chat-messages");
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function requestAI() {
  const currentTime = Date.now();

  // Prevent multiple requests within cooldown period
  if (currentTime - lastRequestTime < COOLDOWN_TIME) {
    const chatMessages = document.getElementById("chat-messages");
    const aiMessage = document.createElement("div");
    aiMessage.classList.add("message", "ai");
    chatMessages.appendChild(aiMessage);
    aiMessage.innerHTML = `<p>Oi Oi! Stop spamming me! Please wait ${(COOLDOWN_TIME - (currentTime - lastRequestTime)) / 1000} seconds.</p>`;
    scrollToBottom();
    return;
  }

  // Update last request time
  lastRequestTime = currentTime;

  // Disable input and button during processing
  document.getElementById("user-input").style.backgroundColor = "#030014";
  document.getElementById("user-input").style.color = "#030014";
  document.getElementById("user-input").style.pointerEvents = "none";
  document.getElementById("send-btn").style.backgroundColor = "#030014";
  document.getElementById("send-btn").style.color = "#030014";
  document.getElementById("send-btn").style.pointerEvents = "none";

  document.getElementById("loading").style.display = "flex";

  const userInput = document.getElementById("user-input").value.trim();
  const userName = document.getElementById("user-name").value.trim();
  const websiteUrl = document.getElementById("website-url").value.trim();
  const fileInput = document.getElementById("file-upload");
  const selectedMood = document.querySelector(
    '.mood-inputs input[name="mood"]:checked',
  );
  const selectedLength = document.querySelector(
    '.length-inputs input[name="messlength"]:checked',
  );


  if (!userInput) return;

  const moodValue = selectedMood.value;
  const selectedLengthValue = selectedLength.value;

  document.getElementById("user-input").value = "";

  const chatMessages = document.getElementById("chat-messages");
  const userMessage = document.createElement("div");
  userMessage.classList.add("message", "user");
  userMessage.textContent = userInput;
  chatMessages.appendChild(userMessage);

  const formData = new FormData();
  formData.append("prompt", userInput);
  formData.append("mood", moodValue);
  formData.append("name", userName);
  formData.append("length", selectedLengthValue);

  if (websiteUrl) {
    formData.append("context", websiteUrl);
  } else if (fileInput.files.length > 0) {
    formData.append("file", fileInput.files[0]);
  } else {
    formData.append("context", "");
  }

  try {
    const response = await fetch("/process", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    const aiMessage = document.createElement("div");
    aiMessage.classList.add("message", "ai");
    chatMessages.appendChild(aiMessage);

    const lines = data.response.split("\n");
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < lines.length) {
        aiMessage.innerHTML += lines[currentIndex];
        currentIndex++;
      } else {
        clearInterval(interval);
      }
      scrollToBottom();
    }, 100);
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while processing your request.");
  } finally {
    document.getElementById("loading").style.display = "none";

    document.getElementById("user-input").style.backgroundColor = "";
    document.getElementById("user-input").style.color = "";
    document.getElementById("user-input").style.pointerEvents = "";
    document.getElementById("send-btn").style.backgroundColor = "";
    document.getElementById("send-btn").style.color = "";
    document.getElementById("send-btn").style.pointerEvents = "";

    currentRequests = 0;
  }
}

function initializeChat() {
  window.scrollTo(0, document.body.scrollHeight);
  const chatMessages = document.getElementById("chat-messages");
  chatMessages.innerHTML = "";

  const aiMessage = document.createElement("div");
  aiMessage.classList.add("message", "ai");
  aiMessage.innerText = "Hello there! I'm Cosmo, how can I help you today?";
  chatMessages.appendChild(aiMessage);

  document.querySelector(".top-section").classList.add("hidden");
  document.querySelector(".bottom-section").classList.add("hidden");
  document.getElementById("chat-area").classList.remove("hidden");
}

function copyEmail() {
  navigator.clipboard.writeText("eggGreatorex@gmail.com");
  const mail = document.getElementById("copy-mail");
  mail.innerText = "Copied!";

  setTimeout(() => {
    mail.innerText = "Mail";
  }, 1000);
}

function startNewChat() {
  initializeChat();
  clearCache();
}

document.getElementById("chat-messages").addEventListener("click", () => {
  toggleSidebar();
});

document.getElementById("send-btn").addEventListener("click", async () => {
  requestAI();
});

document
  .getElementById("user-input")
  .addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      requestAI();
    }
  });

function reloadPage() {
  window.location.reload();
}

window.onload = function () {
  window.scrollTo(0, document.body.scrollHeight);
};

document.addEventListener("DOMContentLoaded", function () {
  const moodRadios = document.querySelectorAll(
    '.mood-inputs input[name="mood"]',
  );
  const cosmoLogo = document.getElementById("cosmo-logo");

  function updateColorScheme(mood) {
    const root = document.documentElement;
    switch (mood) {
      case "Happy":
        root.style.setProperty("--main-bg-color", "#030014"); // Default
        root.style.setProperty("--accent-color", "#d2a6ff");
        break;
      case "Angry":
        root.style.setProperty("--main-bg-color", "#7f0000"); // Red scheme
        root.style.setProperty("--accent-color", "#ff4c4c");
        break;
      case "Sad":
        root.style.setProperty("--main-bg-color", "#00134d"); // Blue scheme
        root.style.setProperty("--accent-color", "#4c9eff");
        break;
    }
  }

  moodRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const mood = document.querySelector(
        '.mood-inputs input[name="mood"]:checked',
      ).value;
      updateColorScheme(mood);

      switch (mood) {
        case "Happy":
          cosmoLogo.src = cosmoLogo.getAttribute("data-happy");
          break;
        case "Angry":
          cosmoLogo.src = cosmoLogo.getAttribute("data-angry");
          break;
        case "Sad":
          cosmoLogo.src = cosmoLogo.getAttribute("data-sad");
          break;
      }
    });
  });
});
