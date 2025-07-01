const express = require('express');
const router = express.Router();
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  toggleFavorite,
  toggleArchive
} = require('../controllers/notesController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// @route   GET /api/notes
// @desc    Get all notes for user
// @access  Private
router.get('/', getNotes);

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post('/', createNote);

// @route   GET /api/notes/:id
// @desc    Get single note by ID
// @access  Private
router.get('/:id', getNote);

// @route   PUT /api/notes/:id
// @desc    Update note
// @access  Private
router.put('/:id', updateNote);

// @route   DELETE /api/notes/:id
// @desc    Delete note
// @access  Private
router.delete('/:id', deleteNote);

// @route   POST /api/notes/:id/share
// @desc    Share note with another user
// @access  Private
router.post('/:id/share', shareNote);

// @route   PATCH /api/notes/:id/favorite
// @desc    Toggle favorite status
// @access  Private
router.patch('/:id/favorite', toggleFavorite);

// @route   PATCH /api/notes/:id/archive
// @desc    Toggle archive status
// @access  Private
router.patch('/:id/archive', toggleArchive);

module.exports = router;