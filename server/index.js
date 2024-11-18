const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Task = require('./models/Task'); // Modell importieren


const app = express();
const PORT = 5000;
const path = require('path');
const uri = "mongodb+srv://alhasanali247:Pass%40word123@cluster0.fs5sc.mongodb.net/myDatabase?retryWrites=true&w=majority";


// Statische Dateien aus dem client-Ordner bereitstellen
app.use(express.static(path.join(__dirname, '../client')));


// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB verbinden
require('dotenv').config();

mongoose.connect(uri)
    .then(() => console.log('MongoDB verbunden'))
    .catch(err => console.error('Fehler beim Verbinden:', err));

// API-Routen
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Aufgaben abrufen
app.get('/tasks' ,async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Neue Aufgabe hinzufügen
app.post('/tasks', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Aufgabe löschen
app.delete('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Aufgabe gelöscht' });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
