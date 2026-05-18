const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Note = require('../models/Note');

// GET /api/notes  -> list notes of logged-in user (with optional ?q=search & ?tag=tag)
router.get('/', auth, async (req, res) => {
  try {
    const q = req.query.q || '';
    const tag = req.query.tag;
    const filter = { user: req.user.id };
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (tag) filter.tag = tag;
    const notes = await Note.find(filter).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /api/notes  -> create note
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tag } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });
    const note = new Note({ title, content, tag, user: req.user.id });
    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT /api/notes/:id -> update note
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, tag } = req.body;
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    note.title = title ?? note.title;
    note.content = content ?? note.content;
    note.tag = tag ?? note.tag;
    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE /api/notes/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });
    await note.deleteOne();
    res.json({ message: 'Note removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
