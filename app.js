let selectedMood = "";
let moodChart;

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  updateHistory();
  updateGratitude();
  updateChart();
  updatePrompt();
  if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark-mode");
});

// Theme Toggle
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  document.getElementById("themeToggle").textContent = isDark ? "Light Mode" : "Dark Mode";
});

// Mood Selection
function selectMood(mood) {
  selectedMood = mood;
  document.querySelectorAll(".moods img").forEach(img => img.style.transform = "scale(1)");
  event.target.style.transform = "scale(1.3) rotate(10deg)";
}

function saveEntry() {
  const note = document.getElementById("note").value;
  if (!selectedMood) return alert("Select a mood first 🌿");
  
  const entries = JSON.parse(localStorage.getItem("entries") || "[]");
  entries.push({ mood: selectedMood, note, date: new Date().toLocaleDateString() });
  localStorage.setItem("entries", JSON.stringify(entries));
  
  document.getElementById("note").value = "";
  alert("Saved to journey ✨");
  updateHistory();
  updateChart();
}

function updateHistory() {
  const entries = JSON.parse(localStorage.getItem("entries") || "[]");
  const tbody = document.querySelector("#historyTable tbody");
  tbody.innerHTML = entries.slice().reverse().map(e => 
    `<tr><td>${e.date}</td><td>${e.mood}</td><td>${e.note}</td></tr>`).join('');
}

function updateChart() {
  const ctx = document.getElementById("moodChart").getContext("2d");
  const entries = JSON.parse(localStorage.getItem("entries") || "[]");
  const moodValues = {"😔":1,"😕":2,"😐":3,"🙂":4,"😊":5};
  
  if (moodChart) moodChart.destroy();
  moodChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: entries.map(e => e.date),
      datasets: [{ label: 'Vibe Level', data: entries.map(e => moodValues[e.mood] || 3), borderColor: '#7bbf9e', tension: 0.4, fill: true, backgroundColor: 'rgba(123,191,158,0.1)' }]
    },
    options: { scales: { y: { min: 1, max: 5, ticks: { stepSize: 1 } } } }
  });
}

// Gratitude Logic
function addGratitude() {
  const input = document.getElementById("gratitudeInput");
  if (!input.value) return;
  const list = JSON.parse(localStorage.getItem("gratitude") || "[]");
  list.push(input.value);
  localStorage.setItem("gratitude", JSON.stringify(list));
  input.value = "";
  updateGratitude();
}

function updateGratitude() {
  const list = JSON.parse(localStorage.getItem("gratitude") || "[]");
  document.getElementById("gratitudeList").innerHTML = list.map(item => `<li>🌟 ${item}</li>`).join('');
}

// Breathing Logic
function startBreathing() {
  const circle = document.getElementById("breathCircle");
  const text = document.getElementById("breathText");
  let inhale = true;
  text.innerText = "Inhale...";
  circle.style.transition = "transform 4s ease-in-out";
  
  setInterval(() => {
    circle.style.transform = inhale ? "scale(2.2)" : "scale(1)";
    text.innerText = inhale ? "Exhale..." : "Inhale...";
    inhale = !inhale;
  }, 4000);
}

function clearAllData() {
  if (confirm("Reset your journey? 🌿")) {
    localStorage.clear();
    location.reload();
  }
}

function exportCSV() {
  const entries = JSON.parse(localStorage.getItem("entries") || "[]");
  const csv = "Date,Mood,Note\n" + entries.map(e => `${e.date},${e.mood},${e.note}`).join("\n");
  const link = document.createElement("a");
  link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  link.download = 'CalmSpace_Log.csv';
  link.click();
}

function updatePrompt() {
  const prompts = ["What made you smile?", "A small win today?", "Someone you're thankful for?"];
  document.getElementById("dailyPrompt").innerText = prompts[Math.floor(Math.random()*prompts.length)];
}

function showSupport() {
  const msg = ["You are doing great 🌿", "Take it one breath at a time.", "You are enough."];
  const box = document.getElementById("supportBox");
  box.innerText = msg[Math.floor(Math.random()*msg.length)];
  box.style.display = "block";
}