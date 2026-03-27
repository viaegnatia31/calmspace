let selectedMood = "";
let moodChart;

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  updateHistory();
  updateGratitude();
  updateChart();
  updatePrompt();
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("themeToggle").textContent = "Light Mode";
  }
});

// Toast Logic
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.classList.remove("toast-hidden");
  setTimeout(() => { toast.classList.add("toast-hidden"); }, 3000);
}

// Theme Toggle
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  document.getElementById("themeToggle").textContent = isDark ? "Light Mode" : "Dark Mode";
});

// Mood Selection with visual feedback
function selectMood(mood, event) {
  selectedMood = mood;
  document.querySelectorAll(".moods img").forEach(img => {
    img.style.transform = "scale(1)";
    img.style.filter = "grayscale(60%) opacity(0.7)";
  });
  event.target.style.transform = "scale(1.4) translateY(-10px)";
  event.target.style.filter = "grayscale(0%) opacity(1)";
}

function saveEntry() {
  const note = document.getElementById("note").value;
  if (!selectedMood) return showToast("Pick a mood first 🌿");
  
  const entries = JSON.parse(localStorage.getItem("entries") || "[]");
  entries.push({ mood: selectedMood, note, date: new Date().toLocaleDateString() });
  localStorage.setItem("entries", JSON.stringify(entries));
  
  document.getElementById("note").value = "";
  selectedMood = "";
  document.querySelectorAll(".moods img").forEach(img => {
    img.style.transform = "scale(1)";
    img.style.filter = "none";
  });
  
  showToast("Journey updated ✨");
  updateHistory();
  updateChart();
}

function updateHistory() {
  const entries = JSON.parse(localStorage.getItem("entries") || "[]");
  const tbody = document.querySelector("#historyTable tbody");
  if(!tbody) return;
  tbody.innerHTML = entries.slice().reverse().map(e => 
    `<tr><td>${e.date}</td><td>${e.mood}</td><td>${e.note}</td></tr>`).join('');
}

function updateChart() {
  const ctx = document.getElementById("moodChart");
  if (!ctx) return;
  const entries = JSON.parse(localStorage.getItem("entries") || "[]");
  const moodValues = {"😔":1,"😕":2,"😐":3,"🙂":4,"😊":5};
  
  if (moodChart) moodChart.destroy();
  moodChart = new Chart(ctx.getContext("2d"), {
    type: 'line',
    data: {
      labels: entries.map(e => e.date),
      datasets: [{ label: 'Vibe Level', data: entries.map(e => moodValues[e.mood] || 3), borderColor: '#7bbf9e', tension: 0.4, fill: true, backgroundColor: 'rgba(123,191,158,0.1)' }]
    },
    options: { scales: { y: { min: 1, max: 5, ticks: { stepSize: 1 } } } }
  });
}

function addGratitude() {
  const input = document.getElementById("gratitudeInput");
  if (!input.value) return;
  const list = JSON.parse(localStorage.getItem("gratitude") || "[]");
  list.push(input.value);
  localStorage.setItem("gratitude", JSON.stringify(list));
  input.value = "";
  showToast("Gratitude recorded 🌸");
  updateGratitude();
}

function updateGratitude() {
  const list = JSON.parse(localStorage.getItem("gratitude") || "[]");
  const ul = document.getElementById("gratitudeList");
  if(!ul) return;
  ul.innerHTML = list.map(item => `<li>🌟 ${item}</li>`).join('');
}

function startBreathing() {
  const circle = document.getElementById("breathCircle");
  const text = document.getElementById("breathText");
  circle.classList.add("breathing");
  text.innerText = "Follow the rhythm...";
  showToast("Deep breaths... 🌬️");
}

function clearAllData() {
  if (confirm("Reset your journey? 🌿")) {
    localStorage.clear();
    showToast("Space cleared. Fresh start! ✨");
    setTimeout(() => location.reload(), 1500);
  }
}

function exportCSV() {
  const entries = JSON.parse(localStorage.getItem("entries") || "[]");
  const csv = "Date,Mood,Note\n" + entries.map(e => `${e.date},${e.mood},"${e.note.replace(/"/g, '""')}"`).join("\n");
  const link = document.createElement("a");
  link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  link.download = 'CalmSpace_Log.csv';
  link.click();
}

function updatePrompt() {
  const prompts = ["What made you smile?", "A small win today?", "Someone you're thankful for?", "Describe a calm moment."];
  const p = document.getElementById("dailyPrompt");
  if(p) p.innerText = prompts[Math.floor(Math.random()*prompts.length)];
}

function showSupport() {
  const msg = ["You are doing great 🌿", "Take it one breath at a time.", "You are enough.", "Believe in yourself."];
  const box = document.getElementById("supportBox");
  box.innerText = msg[Math.floor(Math.random()*msg.length)];
  box.style.display = "block";
}