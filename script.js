const output = document.getElementById("output");
const historyDiv = document.getElementById("history");
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const dateTimeDiv = document.getElementById("currentDateTime");
const shareBtn = document.getElementById("shareBtn");

// Date & Time
function updateDateTime(){
  const now = new Date();
  const options = { weekday:'long', year:'numeric', month:'long', day:'numeric',
                    hour:'2-digit', minute:'2-digit', second:'2-digit' };
  dateTimeDiv.textContent = now.toLocaleDateString('en-US', options);
}
setInterval(updateDateTime,1000);
updateDateTime();

// History
function getHistory(){ return JSON.parse(localStorage.getItem("blessingHistory")||"[]"); }
function saveHistory(history){ localStorage.setItem("blessingHistory", JSON.stringify(history)); }
function renderHistory(){
  const history = getHistory();
  if(!history.length){ historyDiv.innerHTML="<p>No history yet.</p>"; return;}
  historyDiv.innerHTML = "";
  history.forEach((h,i)=>{
    const p=document.createElement("p");
    p.innerHTML=`<span class="histText">${h.text}</span> <small>${h.time}</small> <button class="delBtn" data-index="${i}">Delete</button>`;
    historyDiv.appendChild(p);
  });
  document.querySelectorAll(".histText").forEach((el,i)=>{
    el.addEventListener("click",()=>{ output.innerHTML=`<p><strong>Verse:</strong> ${history[i].text}</p>`; });
  });
  document.querySelectorAll(".delBtn").forEach(btn=>{
    btn.addEventListener("click",(e)=>{
      let hist=getHistory(); hist.splice(e.target.dataset.index,1); saveHistory(hist); renderHistory();
    });
  });
}
renderHistory();

// Today's Blessing
function getTodaysBlessing(){
  const books = Object.keys(dailyLift);
  const today = new Date();
  const diff = Math.floor((today - new Date("2023-01-01"))/(1000*60*60*24));
  const book = dailyLift[books[diff % books.length]];
  const verse = book[diff % book.length];
  return verse;
}
function showTodaysBlessing(){
  const b = getTodaysBlessing();
  output.innerHTML=`<p><strong>Verse:</strong> ${b.verse}</p><p><strong>Prayer:</strong> ${b.prayer}</p><p><strong>Notes:</strong> ${b.notes}</p>`;
  const hist = getHistory();
  hist.unshift({text:b.verse, time:new Date().toLocaleString()});
  saveHistory(hist.slice(0,10));
  renderHistory();
}
document.getElementById("getBtn").addEventListener("click",showTodaysBlessing);

// Dark Mode
themeToggle.addEventListener("click",()=>{
  body.classList.toggle("dark-mode");
  themeToggle.textContent = body.classList.contains("dark-mode") ? "Light":"Dark";
});

// Bubbles
function createBubble(){
  const b=document.createElement("div");
  b.className="bubble"; b.style.left=Math.random()*100+"vw";
  b.style.width=b.style.height=(10+Math.random()*30)+"px";
  b.style.animationDuration=(3+Math.random()*5)+"s";
  document.getElementById("bubbles").appendChild(b);
  setTimeout(()=>b.remove(),8000);
}
setInterval(createBubble,500);

// Share
shareBtn.addEventListener("click",()=>{
  const b = getTodaysBlessing();
  const text = `Blessing:\n${b.verse}\nPrayer:\n${b.prayer}`;
  if(navigator.share){
    navigator.share({title:"Daily Lift", text:text, url:window.location.href}).catch(console.log);
  }else{
    alert("Share manually:\n"+text);
  }
});
