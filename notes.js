// ---------------- Elements ----------------
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const notesList = document.getElementById("notesList");
const searchInput = document.getElementById("searchNotes");
const charCount = document.getElementById("charCount");

let autosaveTimeout;
let editingIndex = null; // Track the index of note being edited

// ---------------- Notes ----------------
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem("myNotes") || "[]");
    if (!notes.length) { notesList.innerHTML = "<p>No notes yet.</p>"; return; }

    const query = searchInput.value.toLowerCase();
    const filtered = notes.filter(n => n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query));
    if (!filtered.length) { notesList.innerHTML="<p>No matching notes found.</p>"; return; }

    notesList.innerHTML = "";
    filtered.forEach((note,index)=>{
        const div=document.createElement("div");
        div.classList.add("noteItem");
        div.innerHTML=`<strong>${note.title}</strong> <small>${note.date}</small>
            <button onclick="editNote(${index})">Edit</button>
            <button onclick="deleteNote(${index})">Delete</button>`;
        notesList.appendChild(div);
    });
}

// Save note (manual)
function saveNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.innerHTML.trim();
    if (!title || !content) return;

    const notes = JSON.parse(localStorage.getItem("myNotes") || "[]");

    if (editingIndex !== null) {
        // Update existing note
        notes[editingIndex] = {title, content, date: new Date().toLocaleString()};
        editingIndex = null;
    } else {
        // Add new note
        notes.push({title, content, date:new Date().toLocaleString()});
    }

    localStorage.setItem("myNotes", JSON.stringify(notes));

    noteTitle.value="";
    noteContent.innerHTML="<br>";
    charCount.textContent="Characters: 0";
    loadNotes();
}

// Edit note
function editNote(index) {
    const notes = JSON.parse(localStorage.getItem("myNotes") || "[]");
    noteTitle.value = notes[index].title;
    noteContent.innerHTML = notes[index].content;
    editingIndex = index; // Track the index being edited
}

// Delete note
function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem("myNotes") || "[]");
    notes.splice(index,1);
    localStorage.setItem("myNotes", JSON.stringify(notes));
    if(editingIndex === index) {
        noteTitle.value="";
        noteContent.innerHTML="<br>";
        editingIndex = null;
        charCount.textContent="Characters: 0";
    }
    loadNotes();
}

// ---------------- Autosave ----------------
noteContent.addEventListener("input", () => {
    charCount.textContent = `Characters: ${noteContent.innerText.length}`;

    clearTimeout(autosaveTimeout);
    autosaveTimeout = setTimeout(() => {
        const title = noteTitle.value.trim();
        const content = noteContent.innerHTML.trim();
        if (!title || !content) return;

        const notes = JSON.parse(localStorage.getItem("myNotes") || "[]");

        if(editingIndex !== null){
            // Update existing note
            notes[editingIndex] = {title, content, date:new Date().toLocaleString()};
        } else {
            // Add new note
            notes.push({title, content, date:new Date().toLocaleString()});
            editingIndex = notes.length - 1; // Track this new note
        }

        localStorage.setItem("myNotes", JSON.stringify(notes));
        loadNotes();
        console.log("Autosaved note:", title);
    }, 1000);
});

// ---------------- Formatting ----------------
function format(cmd) { noteContent.focus(); document.execCommand(cmd); }
function undo() { format("undo"); }
function redo() { format("redo"); }
function copyText() { format("copy"); }
function cutText() { format("cut"); }
function selectAll() { format("selectAll"); }

function setFontSize(size) { if(!size) return; noteContent.focus(); document.execCommand("fontSize", false, size); }
function setFontColor(color) { if(!color) return; noteContent.focus(); document.execCommand("foreColor", false, color); }
function setBgColor(color) { if(!color) return; noteContent.focus(); document.execCommand("hiliteColor", false, color); }
function setFontFamily(family) { if(!family) return; noteContent.focus(); document.execCommand("fontName", false, family); }

// ---------------- Dark Mode ----------------
function toggleDarkMode() { document.body.classList.toggle("dark-mode"); }

// ---------------- Event Listeners ----------------
saveNoteBtn.addEventListener("click", saveNote);
searchInput.addEventListener("keyup", loadNotes);

loadNotes();
          
