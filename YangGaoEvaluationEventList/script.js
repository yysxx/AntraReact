const editIconSVG = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24">...</svg>`;
const deleteIconSVG = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24">...</svg>`;
const saveIconSVG = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24">...</svg>`;

document.addEventListener('DOMContentLoaded', loadEvents);
document.getElementById('addEventBtn').addEventListener('click', addNewEventRow);

function loadEvents() {
    fetch('http://localhost:3000/events')
        .then(response => response.json())
        .then(events => {
            events.forEach(event => appendEventToTable(event));
        });
}

function appendEventToTable(event) {
    const eventList = document.getElementById('eventList');
    const row = eventList.insertRow();
    row.setAttribute('data-id', event.id);
    row.innerHTML = `
        <td>${event.name}</td>
        <td>${event.start}</td>
        <td>${event.end}</td>
        <td>
            <button class="action-btn edit-btn" onclick="editEvent(this)">✏️ Edit</button>
            <button class="action-btn delete-btn" onclick="deleteEvent(this)">🗑️ Delete</button>
        </td>
    `;
}

function addNewEventRow() {
    const eventList = document.getElementById('eventList');
    const newRow = eventList.insertRow();
    newRow.innerHTML = `
        <td><input type="text" placeholder="Enter event name"></td>
        <td><input type="date"></td>
        <td><input type="date"></td>
        <td>
            <button class="action-btn save-btn" onclick="saveEvent(this)">💾 Save</button>
        </td>
    `;
}

function saveEvent(btn) {
    const row = btn.parentNode.parentNode;
    const eventData = {
        name: row.cells[0].querySelector('input').value,
        start: row.cells[1].querySelector('input').value,
        end: row.cells[2].querySelector('input').value
    };

    fetch('http://localhost:3000/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    })
    .then(response => response.json())
    .then(event => {
        appendEventToTable(event);
        row.remove(); // Remove the input row after saving
    });
}

function editEvent(btn) {
    const row = btn.parentNode.parentNode;
    const event = {
        id: row.getAttribute('data-id'),
        name: row.cells[0].innerText,
        start: row.cells[1].innerText,
        end: row.cells[2].innerText
    };

    row.cells[0].innerHTML = `<input type="text" value="${event.name}">`;
    row.cells[1].innerHTML = `<input type="date" value="${event.start}">`;
    row.cells[2].innerHTML = `<input type="date" value="${event.end}">`;
    row.cells[3].innerHTML = `<button class="action-btn save-btn" onclick="saveEditedEvent(this)">💾 Save</button>`;
}

function saveEditedEvent(btn) {
    const row = btn.parentNode.parentNode;
    const updatedEvent = {
        name: row.cells[0].querySelector('input').value,
        start: row.cells[1].querySelector('input').value,
        end: row.cells[2].querySelector('input').value
    };

    const eventId = row.getAttribute('data-id');

    fetch(`http://localhost:3000/events/${eventId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedEvent)
    })
    .then(response => response.json())
    .then(data => {
        row.cells[0].innerText = data.name;
        row.cells[1].innerText = data.start;
        row.cells[2].innerText = data.end;
        row.cells[3].innerHTML = `
            <button class="action-btn edit-btn" onclick="editEvent(this)">✏️ Edit</button>
            <button class="action-btn delete-btn" onclick="deleteEvent(this)">🗑️ Delete</button>
        `;
    });
}

function deleteEvent(btn) {
    const row = btn.parentNode.parentNode;
    const eventId = row.getAttribute('data-id');

    fetch(`http://localhost:3000/events/${eventId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            row.remove();
        }
    });
}



