
document.addEventListener('DOMContentLoaded', function () {
  const notesList = document.getElementById('notes-list');
  const createNoteBtn = document.getElementById('create-note-btn');
  const noteEditor = document.getElementById('note-editor');
  const noteTitleInput = document.getElementById('note-title');
  const noteContentTextarea = document.getElementById('note-content');
  const actionItemInput = document.getElementById('action-item');
  const addActionItemBtn = document.getElementById('add-action-item-btn');
  const actionItemsContainer = document.getElementById('action-items');
  const saveNoteBtn = document.getElementById('save-note-btn');
  const noteDetails = document.getElementById('note-details');
  const detailsTitle = document.getElementById('details-title');
  const detailsContent = document.getElementById('details-content');
  const detailsActionItems = document.getElementById('details-action-items');
  const editNoteBtn = document.getElementById('edit-note-btn');

  let notesData = [];

  // Fetch notes from JSON file
  function fetchNotes() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'notes.json', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        notesData = JSON.parse(xhr.responseText);
        renderNotes();
      }
    };
    xhr.send();
  }

  // Render notes list
  function renderNotes() {
    notesList.innerHTML = '';
    notesData.forEach((note, index) => {
      const noteElement = document.createElement('div');
      noteElement.classList.add('note');
      noteElement.innerHTML = `<h3>${note.title}</h3><p>${truncateContent(note.content)}</p>`;
      noteElement.addEventListener('click', () => showNoteDetails(index));
      notesList.appendChild(noteElement);
    });
  }

  // Truncate note content
  function truncateContent(content) {
    return content.split(' ').slice(0, 10).join(' ') + '...';
  }

  // Show note details
  function showNoteDetails(index) {
    const note = notesData[index];
    detailsTitle.textContent = note.title;
    detailsContent.textContent = note.content;
    detailsActionItems.innerHTML = '';
    note.actionItems.forEach(actionItem => {
      const li = document.createElement('li');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = actionItem.completed;
      checkbox.addEventListener('change', () => toggleActionItem(index, actionItem.id));
      li.appendChild(checkbox);
      li.appendChild(document.createTextNode(actionItem.text));
      detailsActionItems.appendChild(li);
    });
    noteDetails.classList.remove('hidden');
  }

  // Toggle action item completed status
  function toggleActionItem(noteIndex, actionItemId) {
    const note = notesData[noteIndex];
    const actionItem = note.actionItems.find(item => item.id === actionItemId);
    actionItem.completed = !actionItem.completed;
    renderNotes();
    showNoteDetails(noteIndex);
  }

  // Show note editor
  createNoteBtn.addEventListener('click', () => {
    noteTitleInput.value = '';
    noteContentTextarea.value = '';
    actionItemInput.value = '';
    actionItemsContainer.innerHTML = '';
    noteEditor.classList.remove('hidden');
  });

  // Add action item
  addActionItemBtn.addEventListener('click', () => {
    const actionText = actionItemInput.value.trim();
    if (actionText !== '') {
      const actionItem = { id: Date.now(), text: actionText, completed: false };
      const li = document.createElement('li');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.addEventListener('change', () => {});
      li.appendChild(checkbox);
      li.appendChild(document.createTextNode(actionText));
      actionItemsContainer.appendChild(li);
      actionItemInput.value = '';
    }
  });

  // Save note
  saveNoteBtn.addEventListener('click', () => {
    const title = noteTitleInput.value.trim();
    const content = noteContentTextarea.value.trim();
    const actionItems = Array.from(actionItemsContainer.children).map(li => ({
      id: parseInt(li.querySelector('input').getAttribute('id')),
      text: li.textContent.trim(),
      completed: li.querySelector('input').checked
    }));
    const newNote = { title, content, actionItems, created: new Date().toISOString() };
    notesData.push(newNote);
    renderNotes();
    noteEditor.classList.add('hidden');
  });

  // Edit note
  editNoteBtn.addEventListener('click', () => {
    noteEditor.classList.remove('hidden');
    noteDetails.classList.add('hidden');
  });

  // Initialize
  fetchNotes();
});
