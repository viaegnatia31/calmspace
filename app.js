let selectedMood="";

// Mood
function selectMood(mood){ selectedMood=mood; }
function saveEntry(){
  const note=document.getElementById("note").value;
  const entry={mood:selectedMood,note:note,date:new Date().toLocaleDateString()};
  let entries=JSON.parse(localStorage.getItem("entries"))||[];
  entries.push(entry);
  localStorage.setItem("entries",JSON.stringify(entries));
  alert("Saved 🌿"); updateHistory(); updateChart();
}

// Support
function showSupport(){
  const messages=["Take a slow breath 🌬️","You are safe right now 💛","This feeling will pass","Be kind to yourself today","You’re doing better than you think 🌿"];
  const box=document.getElementById("supportBox"); box.innerText=messages[Math.floor(Math.random()*messages.length)];
  box.classList.remove("hidden");
}

// Gratitude
function addGratitude(){
  const val=document.getElementById("gratitudeInput").value;
  if(val){ let list=JSON.parse(localStorage.getItem("gratitude"))||[]; list.push(val); localStorage.setItem("gratitude",JSON.stringify(list)); document.getElementById("gratitudeInput").value=""; updateGratitude(); }
}
function updateGratitude(){
  const list=JSON.parse(localStorage.getItem("gratitude"))||[];
  const ul=document.getElementById("gratitudeList"); ul.innerHTML="";
  list.forEach(item=>{ const li=document.createElement("li"); li.textContent="🌟 "+item; ul.appendChild(li); });
}

// History
function updateHistory(){
  const entries=JSON.parse(localStorage.getItem("entries"))||[];
  const tbody=document.querySelector("#historyTable tbody"); tbody.innerHTML="";
  entries.forEach(e=>{ const tr=document.createElement("tr"); tr.innerHTML=`<td>${e.date}</td><td>${e.mood}</td><td>${e.note}</td>`; tbody.appendChild(tr); });
}

// Table See More
let tableExpanded=false;
function toggleTable(){
  const tbody=document.querySelector("#historyTable tbody");
  if(!tableExpanded){ tbody.style.maxHeight="500px"; tableExpanded=true; document.getElementById("seeMoreBtn").innerText="See Less"; }
  else{ tbody.style.maxHeight="200px"; tableExpanded=false; document.getElementById("seeMoreBtn").innerText="See More"; }
}

// Chart
let ctx=document.getElementById("moodChart").getContext("2d");
let moodChart=new Chart(ctx,{type:"bar",data:{labels:[],datasets:[{label:"Mood",data:[],backgroundColor:"#7bbf9e"}]},options:{responsive:true,scales:{y:{min:0,max:5}}}});
function updateChart(){
  const entries=JSON.parse(localStorage.getItem("entries"))||[];
  const moodValues={"😔":1,"😕":2,"😐":3,"🙂":4,"😊":5};
  moodChart.data.labels=entries.map(e=>e.date);
  moodChart.data.datasets[0].data=entries.map(e=>moodValues[e.mood]||3);
  moodChart.update();
}

// Daily Prompt
const prompts=["What made you smile today?","Name one small win today.","What are you grateful for?","What helped you feel calm today?","Write one positive thought."];
function updatePrompt(){ document.getElementById("dailyPrompt").textContent=prompts[Math.floor(Math.random()*prompts.length)]; }
updatePrompt(); setInterval(updatePrompt,24*60*60*1000);

// Breathing
let breathInterval;
function startBreathing(){
  const circle=document.getElementById("breathCircle"); const text=document.getElementById("breathText");
  let phase=0; clearInterval(breathInterval);
  breathInterval=setInterval(()=>{
    if(phase%2===0){ circle.style.transform="scale(1.5)"; text.innerText="Inhale…"; }
    else{ circle.style.transform="scale(1)"; text.innerText="Exhale…"; }
    phase++;
  },4000);
}

// Export CSV
function exportCSV(){
  const entries=JSON.parse(localStorage.getItem("entries"))||[];
  let csv="Date,Mood,Note\n"; entries.forEach(e=>{ csv+=`${e.date},${e.mood},${e.note.replace(/,/g," ")}\n`; });
  const blob=new Blob([csv],{type:"text/csv"}); const link=document.createElement("a"); link.href=URL.createObjectURL(blob); link.download="CalmSpace_Journal.csv"; link.click();
}

// Dark mode
document.getElementById("themeToggle").addEventListener("click",()=>{ document.body.classList.toggle("dark"); });

// Notifications
if("Notification" in window){ if(Notification.permission!=="granted"){ Notification.requestPermission(); }
setTimeout(()=>{ new Notification("CalmSpace Reminder",{ body:"Time to log your mood today 🌿" }); },5000); }

// Initialize
updateGratitude(); updateHistory(); updateChart();