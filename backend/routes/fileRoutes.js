const express = require('express');
const router = express.Router();
const File = require('../models/File');
const { authMiddleware } = require('../middleware/authMiddleware');

// @route   GET /api/files
// @desc    Fetch all files uploaded by the logged-in user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const files = await File.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });

    if (!Array.isArray(files)) {
      return res.status(500).json({ message: 'Invalid response from database' });
    }

    res.status(200).json(files);
  } catch (error) {
    console.error('❌ Error fetching files:', error);
    res.status(500).json({ message: 'Failed to fetch files' });
  }
});

module.exports = router;
