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
router.use(authMiddleware);
router.get('/', getNotes);
router.post('/', createNote);
router.get('/:id', getNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);
router.post('/:id/share', shareNote);
router.patch('/:id/favorite', toggleFavorite);
router.patch('/:id/archive', toggleArchive);

module.exports = router;