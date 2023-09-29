const colors = ['#FEC871', '#FD9A71', '#B491FB', '#E3ED8E', '#00D3FE'];
const generatedColors = [];
document.addEventListener('DOMContentLoaded', function () {
    const titleInput = document.querySelector('#titleInput');
    const contentInput = document.querySelector('#contentInput');
    const noteForm = document.querySelector('#noteForm');

    noteForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = titleInput.value;
        const content = contentInput.value;
        
        fetch('http://127.0.0.1:8090/api/collections/notes/records', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    content
                })
            }
        )
        .then(res => res.json())
        .then(data => {
            console.log(data);

            titleInput.value = '';
            contentInput.value = '';
        })
        .catch(err => {
            console.error(err);
        })
    })
});
async function getNotes() {
    const res = await fetch('http://127.0.0.1:8090/api/collections/notes/records?page=1&perPage=30', { cache: 'no-store' });
    const data = await res.json();
    return data?.items || [];
}

async function loadNotes() {
    const notes = await getNotes();
    const noteContainer = document.querySelector('.note-container');

    notes.forEach(note => {
        const noteElement = createNoteElement(note);
        noteContainer.appendChild(noteElement);
    });
}

function createNoteElement(note) {
    const { id, title, content, created } = note || {};
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.style.backgroundColor = randomColor();

    const titleElement = document.createElement('h2');
    titleElement.textContent = note.title;
    noteDiv.appendChild(titleElement);

    const contentElement = document.createElement('h5');
    contentElement.textContent = note.content;
    noteDiv.appendChild(contentElement);

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info');
    noteDiv.appendChild(infoDiv);

    const createdElement = document.createElement('p');
    createdElement.textContent = new Date(note.created).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
    infoDiv.appendChild(createdElement);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.addEventListener('click', function () {
        deleteNoteById(id);
        noteDiv.remove();
    });
    infoDiv.appendChild(deleteButton);

    return noteDiv;
}

function deleteNoteById(id) {
    fetch(`http://127.0.0.1:8090/api/collections/notes/records/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
        throw new Error('Failed to delete note');
        }
    })
    .catch(error => {
        console.error(error);
    });
}

function randomColor() {
    let color;
  
    if (generatedColors.length < colors.length) {
      do {
        color = colors[Math.floor(Math.random() * colors.length)];
      } while (generatedColors.includes(color));
      
      generatedColors.push(color);
    } else {
      color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    return color;
}

document.addEventListener('DOMContentLoaded', function () {
    loadNotes();
});