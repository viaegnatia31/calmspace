let selectedMood = "";

// Mood selection
function selectMood(mood){ selectedMood=mood; }

// Save entry
function saveEntry(){
  const note=document.getElementById("note").value;
  const entry={ mood:selectedMood, note:note, date:new Date().toLocaleDateString() };
  let entries=JSON.parse(localStorage.getItem("entries"))||[];
  entries.push(entry);
  localStorage.setItem("entries",JSON.stringify(entries));
  alert("Saved 🌿");
  updateHistory();
  updateChart();
}

// Support messages
function showSupport(){
  const messages=["Take a slow breath in… and out 🌬️","You are safe right now.","Name 5 things you can see around you.","This feeling will pass.","Be gentle with yourself today 💛"];
  const random=messages[Math.floor(Math.random()*messages.length)];
  document.getElementById("supportText").innerText=random;
  document.getElementById("supportBox").classList.remove("hidden");
}

// Gratitude
function addGratitude(){
  const val=document.getElementById("gratitudeInput").value;
  if(val){
    let list=JSON.parse(localStorage.getItem("gratitude"))||[];
    list.push(val);
    localStorage.setItem("gratitude",JSON.stringify(list));
    document.getElementById("gratitudeInput").value="";
    updateGratitude();
  }
}

function updateGratitude(){
  const list=JSON.parse(localStorage.getItem("gratitude"))||[];
  const ul=document.getElementById("gratitudeList");
  ul.innerHTML="";
  list.forEach(item=>{ const li=document.createElement("li"); li.textContent="🌟 "+item; ul.appendChild(li); });
}

// Mood History Table
function updateHistory(){
  const entries=JSON.parse(localStorage.getItem("entries"))||[];
  const tbody=document.querySelector("#historyTable tbody");
  tbody.innerHTML="";
  entries.forEach(e=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${e.date}</td><td>${e.mood}</td><td>${e.note}</td>`;
    tbody.appendChild(tr);
  });
}
updateGratitude();
updateHistory();

// Mood Chart
let ctx=document.getElementById("moodChart").getContext("2d");
let moodChart=new Chart(ctx,{ type:"bar", data:{ labels:[], datasets:[{ label:"Mood Value", data:[], backgroundColor:"#7bbf9e" }] }, options:{ responsive:true, scales:{ y:{min:0,max:5} } }});
function updateChart(){
  const entries=JSON.parse(localStorage.getItem("entries"))||[];
  const moodValues={"😔":1,"😕":2,"😐":3,"🙂":4,"😊":5};
  moodChart.data.labels=entries.map(e=>e.date);
  moodChart.data.datasets[0].data=entries.map(e=>moodValues[e.mood]||3);
  moodChart.update();
}
updateChart();

// Daily Prompt
const prompts=["What made you smile today?","Name one small victory today.","What are you grateful for right now?","Write one thing you learned today.","Describe something that brought you peace today."];
function updatePrompt(){ const box=document.getElementById("dailyPrompt"); box.textContent=prompts[Math.floor(Math.random()*prompts.length)]; }
updatePrompt();
setInterval(updatePrompt,24*60*60*1000);

// Breathing Exercise
let breathInterval;
function startBreathing(){
  const circle=document.getElementById("breathCircle");
  const text=document.getElementById("breathText");
  let phase=0;
  clearInterval(breathInterval);
  breathInterval=setInterval(()=>{
    if(phase%2===0){ circle.style.transform="scale(1.5)"; text.innerText="Inhale…"; }
    else{ circle.style.transform="scale(1)"; text.innerText="Exhale…"; }
    phase++;
  },4000);
}

// Export CSV
function exportCSV(){
  const entries=JSON.parse(localStorage.getItem("entries"))||[];
  let csv="Date,Mood,Note\n";
  entries.forEach(e=>{ csv+=`${e.date},${e.mood},${e.note.replace(/,/g," ")}\n`; });
  const blob=new Blob([csv],{type:"text/csv"});
  const link=document.createElement("a");
  link.href=URL.createObjectURL(blob);
  link.download="CalmSpace_Journal.csv";
  link.click();
}

// Dark Mode Toggle
document.getElementById("themeToggle").addEventListener("click",()=>{
  document.body.classList.toggle("dark");
});

// Notifications
if("Notification" in window){
  if(Notification.permission!=="granted") Notification.requestPermission();
  setTimeout(()=>{ new Notification("CalmSpace Reminder","Time to log your mood today 🌿"); },5000);
}