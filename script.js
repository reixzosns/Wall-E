// script.js
const form = document.getElementById('chat-form');
const input = document.getElementById('prompt');
const messagesEl = document.getElementById('messages');

function appendMessage(text, who){
  const el = document.createElement('div');
  el.className = 'msg ' + (who === 'me' ? 'me' : 'bot');
  el.textContent = text;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function appendTyping(){
  const el = document.createElement('div');
  el.className = 'msg bot';
  el.id = '__typing';
  el.textContent = 'Wall-E is typing...';
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function removeTyping(){
  const t = document.getElementById('__typing');
  if(t) t.remove();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if(!text) return;
  appendMessage(text, 'me');
  input.value = '';
  appendTyping();

  try{
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ message: text })
    });

    if(!res.ok){
      const txt = await res.text();
      throw new Error(txt || 'Server error');
    }

    const data = await res.json();
    removeTyping();
    appendMessage(data.reply, 'bot');

  } catch(err){
    removeTyping();
    appendMessage('Oops, something went wrong. ' + (err.message || ''), 'bot');
    console.error(err);
  }
});
