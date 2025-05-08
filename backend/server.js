// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let taches = [];

app.get('/api/taches', (req, res) => {
  res.json(taches);
});

app.post('/api/taches', (req, res) => {
  const { text, done } = req.body;
  if (!text) return res.status(400).send('Texte requis');
  taches.push({ text, done: !!done });
  res.status(201).send('Tâche ajoutée');
});

app.delete('/api/taches/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (index < 0 || index >= taches.length) return res.status(404).send('Tâche introuvable');
  taches.splice(index, 1);
  res.send('Tâche supprimée');
});

app.listen(PORT, () => {
  console.log(`Backend démarré sur http://localhost:${PORT}`);
});
