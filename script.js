// --- Wall-E Chat Frontend ---
// Replace the string below with *your* OpenAI key (keep it local only!)
// Example: const API_KEY = "sk-xxxxx";
const API_KEY = "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";

const form = document.getElementById("chat-form");
const input = document.getElementById("prompt");
const messagesEl = document.getElementById("messages");

function appendMessage(text, who) {
  const el = document.createElement("div");
  el.className = "msg " + (who === "me" ? "me" : "bot");
  el.textContent = text;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function appendTyping() {
  const el = document.createElement("div");
  el.className = "msg bot";
  el.id = "__typing";
  el.textContent = "Wall-E is thinking...";
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}
function removeTyping() {
  const t = document.getElementById("__typing");
  if (t) t.remove();
}

async function callOpenAI(messageText) {
  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are Wall-E, a friendly helpful robot that gives short, kind replies." },
      { role: "user", content: messageText }
    ],
    max_tokens: 600,
    temperature: 0.7
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "No reply.";
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  appendMessage(text, "me");
  input.value = "";
  appendTyping();

  try {
    const reply = await callOpenAI(text);
    removeTyping();
    appendMessage(reply, "bot");
  } catch (err) {
    removeTyping();
    appendMessage("Error: " + err.message, "bot");
    console.error(err);
  }
});
