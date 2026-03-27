let selectedMood = "";

// Mood selection
function selectMood(mood) { selectedMood = mood; }

// Save mood entry
function saveEntry() {
  const note = document.getElementById("note").value;
  const entry = { mood:selectedMood, note, date:new Date().toLocaleDateString() };
  let entries = JSON.parse(localStorage.getItem("entries")) || [];
  entries.push(entry);
  localStorage.setItem("entries", JSON.stringify(entries));
  alert("Saved 🌿");
  showHistory();
  loadChart();
}

// Show support messages
function showSupport() {
  const messages = [
    "Take a slow breath in… and out 🌬️",
    "You are safe right now.",
    "Name 5 things you can see around you.",
    "This feeling will pass.",
    "Be gentle with yourself today 💛"
  ];
  const random = messages[Math.floor(Math.random()*messages.length)];
  const box = document.getElementById("supportBox");
  box.innerText = random; box.classList.remove("hidden");
}

// Mood history
function showHistory() {
  const entries = JSON.parse(localStorage.getItem("entries")) || [];
  const tbody = document.getElementById("historyTable").querySelector("tbody");
  if(entries.length===0){tbody.innerHTML="<tr><td colspan='3'>No entries yet.</td></tr>"; return;}
  tbody.innerHTML = "";
  entries.forEach(e=>{
    const tr = document.createElement("tr");
    tr.innerHTML=`<td>${e.date}</td><td>${e.mood}</td><td>${e.note}</td>`;
    tbody.appendChild(tr);
  });
}

// Gratitude journal
function saveGratitude(){
  const gratitude = document.getElementById("gratitude").value;
  if(!gratitude) return;
  let list = JSON.parse(localStorage.getItem("gratitudes"))||[];
  list.push(gratitude);
  localStorage.setItem("gratitudes",JSON.stringify(list));
  document.getElementById("gratitudeBox").classList.remove("hidden");
  setTimeout(()=>document.getElementById("gratitudeBox").classList.add("hidden"),2000);
  document.getElementById("gratitude").value="";
  showGratitude();
}
function showGratitude(){
  const list = JSON.parse(localStorage.getItem("gratitudes"))||[];
  const ul = document.getElementById("gratitudeList");
  ul.innerHTML="";
  list.forEach(g=>{
    const li=document.createElement("li"); li.innerText=g; ul.appendChild(li);
  });
}

// Breathing
function startBreathing(){
  const circle = document.getElementById("breathCircle");
  circle.style.width="150px"; circle.style.height="150px";
  setTimeout(()=>{circle.style.width="100px"; circle.style.height="100px";},4000);
}

// Chat
function openChat(){ document.getElementById("chatBox").classList.remove("hidden"); }
function sendChat(){
  const input = document.getElementById("chatInput");
  if(!input.value) return;
  const chat = document.getElementById("chatMessages");
  chat.innerHTML += `<p><strong>You:</strong> ${input.value}</p>`;
  chat.innerHTML += `<p><strong>AI:</strong> Thanks for sharing 🌿</p>`;
  input.value="";
  chat.scrollTop=chat.scrollHeight;
}

// Mood chart
function loadChart(){
  const ctx = document.getElementById("moodChart").getContext("2d");
  const entries = JSON.parse(localStorage.getItem("entries"))||[];
  const labels = entries.map(e=>e.date);
  const data = entries.map(e=>{
    switch(e.mood){case"😔":return 1;case"😕":return 2;case"😐":return 3;case"🙂":return 4;case"😊":return 5;default:return 0;}
  });
  new Chart(ctx,{type:"line",data:{labels,datasets:[{label:"Mood over time",data,fill:true,borderColor:"#7bbf9e",backgroundColor:"rgba(123,191,158,0.2)",tension:0.3}]},options:{scales:{y:{min:0,max:5,ticks:{stepSize:1}}}}});
}

// Initialize
showHistory(); showGratitude(); loadChart();