document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const API_URL = 'http://localhost:5000/tasks';

    // Aufgaben abrufen
    function fetchTasks() {
        fetch(API_URL)
            .then(res => res.json())
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    const li = document.createElement('li');
                    li.classList.add('task-item')
                    li.innerHTML = `
                        <span>${task.title}</span>
                        <button class="delete-btn" data-id="${task._id}">Löschen</button>
                    `;
                    taskList.appendChild(li);
                });
            })
            .catch(err => console.error('Fehler beim Abrufen der Aufgaben:', err));
    }

    // Neue Aufgabe hinzufügen
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTask = { title: taskInput.value };

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        })
            .then(() => {
                taskInput.value = '';
                fetchTasks();
            })
            .catch(err => console.error('Fehler beim Hinzufügen der Aufgabe:', err));
    });

    // Aufgabe löschen
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const li = e.target.parentElement;

            li.classList.add('fadeOut'); // Klasse für Animation
            setTimeout(() => {
                li.remove(); // Element nach der Animation entfernen
            }, 300);

            //Aufgabe aus DB löschen
            const id = e.target.getAttribute('data-id');
            fetch(`${API_URL}/${id}`, { method: 'DELETE' })
                .then(() => fetchTasks())
                .catch(err => console.error('Fehler beim Löschen der Aufgabe:', err));

        }
    });

    fetchTasks();
});