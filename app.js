let selectedMood = "";

// Moods
function selectMood(mood) {
  selectedMood = mood;
}

// Save Mood
function saveMood() {
  const note = document.getElementById("moodNote").value;
  const entry = { mood: selectedMood, note: note, date: new Date().toLocaleDateString() };
  let entries = JSON.parse(localStorage.getItem("moodEntries")) || [];
  entries.push(entry);
  localStorage.setItem("moodEntries", JSON.stringify(entries));
  alert("Mood saved 🌿");
  renderMoodHistory();
}

// Save Gratitude
function saveGratitude() {
  const note = document.getElementById("gratitudeNote").value;
  if (!note) return;
  let entries = JSON.parse(localStorage.getItem("gratitudeEntries")) || [];
  entries.push(note);
  localStorage.setItem("gratitudeEntries", JSON.stringify(entries));
  renderGratitude();
  document.getElementById("gratitudeNote").value = "";
}

// Render Gratitude
function renderGratitude() {
  const container = document.getElementById("gratitudeEntries");
  container.innerHTML = "";
  let entries = JSON.parse(localStorage.getItem("gratitudeEntries")) || [];
  entries.forEach(entry => {
    const div = document.createElement("div");
    div.className = "gratitude-entry";
    div.innerText = entry;
    container.appendChild(div);
  });
}

// Render Mood History
function renderMoodHistory() {
  let entries = JSON.parse(localStorage.getItem("moodEntries")) || [];
  const tbody = document.querySelector("#moodTable tbody");
  tbody.innerHTML = "";
  entries.forEach(e => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${e.date}</td><td>${e.mood}</td><td>${e.note}</td>`;
    tbody.appendChild(tr);
  });
  renderMoodChart(entries);
}

// Mood Chart
let chartInstance;
function renderMoodChart(entries) {
  const ctx = document.getElementById("moodChart").getContext("2d");
  const labels = entries.map(e => e.date);
  const data = entries.map(e => e.mood.charCodeAt(0)); // convert emoji to numeric for chart
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: "line",
    data: { labels: labels, datasets: [{ label: "Mood", data: data, borderColor: "#7bbf9e", fill: false }] },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
}

// Daily prompts
const prompts = [
  "Name one small win today",
  "What made you smile today?",
  "What can you do to be kind to yourself?",
  "Write one thing you're grateful for"
];
function rotatePrompt() {
  const idx = Math.floor(Math.random() * prompts.length);
  document.getElementById("dailyPrompt").innerText = prompts[idx];
}
setInterval(rotatePrompt, 5000);
rotatePrompt();

// Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

// Breathing
let breathingInterval;
function startBreathing() {
  const text = document.getElementById("breathText");
  let inhale = true;
  clearInterval(breathingInterval);
  breathingInterval = setInterval(() => {
    text.innerText = inhale ? "Inhale..." : "Exhale...";
    inhale = !inhale;
  }, 4000);
}

// Support messages
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

// Toggle Table "See More"
function toggleTable() {
  const tbody = document.querySelector("#moodTable tbody");
  tbody.classList.toggle("expanded");
}

// Initial render
renderGratitude();
renderMoodHistory();