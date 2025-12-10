// ---------------- Elements ----------------
const noteContent = document.getElementById("noteContent");
const noteTitle = document.getElementById("noteTitle");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const notesList = document.getElementById("notesList");
const searchInput = document.getElementById("searchNotes");
const charCount = document.getElementById("charCount");

// ---------------- Formatting ----------------
function format(command) { noteContent.focus(); document.execCommand(command, false, null); }
function undo() { noteContent.focus(); document.execCommand("undo", false, null); }
function redo() { noteContent.focus(); document.execCommand("redo", false, null); }
function copyText() { noteContent.focus(); document.execCommand("copy"); }
function cutText() { noteContent.focus(); document.execCommand("cut"); }
function selectAll() { noteContent.focus(); document.execCommand("selectAll", false, null); }
function setFontSize(size) { if(!size) return; noteContent.focus(); document.execCommand("fontSize", false, size); }
function setFontColor(color) { if(!color) return; noteContent.focus(); document.execCommand("foreColor", false, color); }
function setBgColor(color) { if(!color) return; noteContent.focus(); document.execCommand("hiliteColor", false, color); }

// ---------------- Notes Management ----------------
function loadNotes() {
  const notes = JSON.parse(localStorage.getItem("myNotes") || "[]");
  if(notes.length === 0){ notesList.innerHTML="<p>No notes yet.</p>"; return; }

  const query = searchInput ? searchInput.value.toLowerCase() : "";
  const filtered = notes.filter(note => note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query));
  if(filtered.length===0){ notesList.innerHTML="<p>No matching notes found.</p>"; return; }

  notesList.innerHTML="";
  filtered.forEach((note,index)=>{
    const div=document.createElement("div");
    div.classList.add("noteItem");
    div.innerHTML = `
      <strong>${note.title}</strong> <small>${note.date}</small>
      <button onclick="editNote(${index})">Edit</button>
      <button onclick="deleteNote(${index})">Delete</button>
      <div class="noteContent">${note.content}</div>
    `;

    div.addEventListener("click", e=>{
      if(!e.target.tagName.includes("BUTTON")){
        window.location.href=`noteRead.html?index=${index}`;
      }
    });

    notesList.appendChild(div);
  });
}

function saveNote() {
  const title = noteTitle.value.trim();
  const content = noteContent.innerHTML.trim();
  if(!title||!content) return;
  const notes=JSON.parse(localStorage.getItem("myNotes")||"[]");
  notes.push({title, content, date:new Date().toLocaleString()});
  localStorage.setItem("myNotes",JSON.stringify(notes));
  noteTitle.value=""; noteContent.innerHTML=""; charCount.textContent="Characters: 0";
  loadNotes();
}

function editNote(index){
  const notes = JSON.parse(localStorage.getItem("myNotes")||"[]");
  noteTitle.value = notes[index].title;
  noteContent.innerHTML = notes[index].content;
  notes.splice(index,1);
  localStorage.setItem("myNotes", JSON.stringify(notes));
  loadNotes();
}

function deleteNote(index){
  const notes = JSON.parse(localStorage.getItem("myNotes")||"[]");
  notes.splice(index,1);
  localStorage.setItem("myNotes",JSON.stringify(notes));
  loadNotes();
}

function searchNotesFunc(){ loadNotes(); }

noteContent.addEventListener("input",()=>{ charCount.textContent=`Characters: ${noteContent.innerText.length}`; });

// Disable default context menu
noteContent.addEventListener("contextmenu", e=>e.preventDefault());
noteContent.addEventListener("selectstart", e=>e.preventDefault());

saveNoteBtn.addEventListener("click", saveNote);
if(searchInput) searchInput.addEventListener("keyup", searchNotesFunc);

// Initial load
loadNotes();
