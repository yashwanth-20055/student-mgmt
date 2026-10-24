const express = require('express');
const mongoose = require('mongoose');

const Student = mongoose.model('Student', new mongoose.Schema({
  name: { type: String, required: true },
  roll: { type: String, required: true, unique: true },
  branch: String
}));

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({
  status: 'UP',
  db: mongoose.connection.readyState === 1 ? 'UP' : 'DOWN',
  version: process.env.APP_VERSION || 'dev'
}));

app.get('/api/students', async (req, res) => res.json(await Student.find()));

app.post('/api/students', async (req, res) => {
  try { res.status(201).json(await Student.create(req.body)); }
  catch (e) { res.status(400).json({ error: e.message }); }
});

module.exports = app;