const chat = document.getElementById('chat');
const input = document.getElementById('message-input');
const statusText = document.getElementById('assistant-status');

function addMessage(text, who) {
  const item = document.createElement('div');
  item.className = `message ${who}`;
  const label = document.createElement('b');
  label.textContent = who === 'bot' ? 'FRIDAY' : 'YOU';
  const body = document.createElement('p');
  body.textContent = text;
  item.append(label, body);
  chat.appendChild(item);
  chat.scrollTop = chat.scrollHeight;
}
function replyTo(message) {
  const q = message.toLowerCase();
  if (q.includes('what can you do') || q.includes('help')) return 'I can respond to simple prompts, speak replies aloud, and demonstrate browser voice input. A real AI brain can be connected later through a secure server-side API.';
  if (q.includes('time')) return `Your device time is ${new Date().toLocaleTimeString()}.`;
  if (q.includes('date')) return `Today is ${new Date().toLocaleDateString()}.`;
  if (q.includes('motivat') || q.includes('quote')) return 'Small steps every day create big results. Keep learning, keep building, and do not give up!';
  if (q.includes('hello') || q.includes('hi')) return 'Hello! Great to hear from you. What would you like to work on?';
  return 'I received your message. This starter version uses demo responses and is not connected to an online AI service yet.';
}
function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
}
function send(text) {
  const clean = text.trim();
  if (!clean) return;
  addMessage(clean, 'user');
  input.value = '';
  statusText.textContent = 'Thinking...';
  setTimeout(() => {
    const answer = replyTo(clean);
    addMessage(answer, 'bot');
    statusText.textContent = 'Ready when you are';
    speak(answer);
  }, 350);
}
document.getElementById('chat-form').addEventListener('submit', e => {
  e.preventDefault(); send(input.value);
});
document.querySelectorAll('[data-prompt]').forEach(button => {
  button.addEventListener('click', () => send(button.dataset.prompt));
});
const micButton = document.getElementById('mic-button');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-IN';
  recognition.interimResults = false;
  micButton.addEventListener('click', () => {
    statusText.textContent = 'Listening...';
    recognition.start();
  });
  recognition.onresult = event => {
    input.value = event.results[0][0].transcript;
    statusText.textContent = 'Voice captured';
    send(input.value);
  };
  recognition.onerror = () => { statusText.textContent = 'Microphone unavailable'; };
  recognition.onend = () => {
    if (statusText.textContent === 'Listening...') statusText.textContent = 'Ready when you are';
  };
} else {
  micButton.disabled = true;
  micButton.title = 'Voice input is not supported in this browser';
}
