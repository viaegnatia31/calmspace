// app.js

let selectedMood = "";

// Mood selection
function selectMood(mood) {
  selectedMood = mood;
}

// Save mood entry
function saveEntry() {
  const note = document.getElementById("note").value;
  const entry = {
    mood: selectedMood,
    note: note,
    date: new Date().toLocaleDateString()
  };
  let entries = JSON.parse(localStorage.getItem("entries")) || [];
  entries.push(entry);
  localStorage.setItem("entries", JSON.stringify(entries));
  alert("Saved 🌿");
  showHistory();
}

// Display support messages
function showSupport() {
  const messages = [
    "Take a slow breath in… and out 🌬️",
    "You are safe right now.",
    "Name 5 things you can see around you.",
    "This feeling will pass.",
    "Be gentle with yourself today 💛"
  ];
  const random = messages[Math.floor(Math.random() * messages.length)];
  document.getElementById("supportText").innerText = random;
  document.getElementById("supportBox").classList.remove("hidden");
}

// Display mood history
function showHistory() {
  const historyList = document.getElementById("historyList");
  let entries = JSON.parse(localStorage.getItem("entries")) || [];
  if (entries.length === 0) {
    historyList.innerHTML = "<p>No entries yet.</p>";
    return;
  }
  historyList.innerHTML = "";
  entries.forEach(entry => {
    const div = document.createElement("div");
    div.classList.add("entry-bg");
    div.style.background = "#7bbf9e"; // simple color coding
    div.innerHTML = `<span class="icon">${entry.mood}</span> <strong>${entry.date}:</strong> ${entry.note}`;
    historyList.appendChild(div);
  });
}

// Gratitude journal
function saveGratitude() {
  const gratitude = document.getElementById("gratitude").value;
  if (!gratitude) return;
  localStorage.setItem("gratitude", gratitude);
  document.getElementById("gratitudeBox").classList.remove("hidden");
  setTimeout(() => document.getElementById("gratitudeBox").classList.add("hidden"), 2000);
  document.getElementById("gratitude").value = "";
}

// Simple breathing exercise
function startBreathing() {
  const box = document.getElementById("breathingBox");
  box.classList.remove("hidden");
  const circle = document.getElementById("breathCircle");
  circle.style.transition = "all 4s ease-in-out";
  circle.style.width = "150px";
  circle.style.height = "150px";
  setTimeout(() => {
    circle.style.width = "100px";
    circle.style.height = "100px";
  }, 4000);
}

// Chat placeholder
function openChat() {
  document.getElementById("chatBox").classList.remove("hidden");
}

function sendChat() {
  const input = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");
  const userText = input.value;
  if (!userText) return;
  const p = document.createElement("p");
  p.innerHTML = "<strong>You:</strong> " + userText;
  chatMessages.appendChild(p);
  const bot = document.createElement("p");
  bot.innerHTML = "<strong>AI:</strong> " + "Thanks for sharing 🌿";
  chatMessages.appendChild(bot);
  input.value = "";
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Mood chart
function loadChart() {
  const ctx = document.getElementById('moodChart').getContext('2d');
  const entries = JSON.parse(localStorage.getItem("entries")) || [];
  const labels = entries.map(e => e.date);
  const data = entries.map(e => {
    switch (e.mood) {
      case "😔": return 1;
      case "😕": return 2;
      case "😐": return 3;
      case "🙂": return 4;
      case "😊": return 5;
      default: return 0;
    }
  });
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Mood over time',
        data: data,
        fill: true,
        borderColor: '#7bbf9e',
        backgroundColor: 'rgba(123,191,158,0.2)',
        tension: 0.3
      }]
    },
    options: {
      scales: {
        y: { min: 0, max: 5, ticks: { stepSize: 1 } }
      }
    }
  });
}

// Initialize
showHistory();
loadChart();