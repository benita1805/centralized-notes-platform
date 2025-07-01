const Note = require('../models/Note');
const User = require('../models/User');
const Joi = require('joi');

// Validation schemas
const noteSchema = Joi.object({
  title: Joi.string().max(200).required(),
  content: Joi.string().max(10000).required(),
  category: Joi.string().valid('personal', 'work', 'study', 'project', 'other').default('personal'),
  tags: Joi.array().items(Joi.string().max(30)),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  isPrivate: Joi.boolean().default(true),
  isFavorite: Joi.boolean().default(false)
});

// @desc    Get all notes for user
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      priority,
      tags,
      search,
      archived = false,
      favorite
    } = req.query;

    // Build query
    const query = {
      $or: [
        { author: req.user._id },
        { 
          'sharedWith.user': req.user._id,
          isPrivate: false 
        }
      ],
      isArchived: archived === 'true'
    };

    // Add filters
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (tags) query.tags = { $in: tags.split(',') };
    if (favorite !== undefined) query.isFavorite = favorite === 'true';

    // Add search
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const notes = await Note.find(query)
      .populate('author', 'username firstName lastName')
      .populate('sharedWith.user', 'username firstName lastName')
      .sort(search ? { score: { $meta: 'textScore' } } : { updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count
    const total = await Note.countDocuments(query);

    res.json({
      notes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      message: 'Server error while fetching notes'
    });
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('author', 'username firstName lastName')
      .populate('sharedWith.user', 'username firstName lastName');

    if (!note) {
      return res.status(404).json({
        message: 'Note not found'
      });
    }

    // Check if user has access
    if (!note.canAccess(req.user._id)) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    res.json({ note });

  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      message: 'Server error while fetching note'
    });
  }
};

// @desc    Create new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
  try {
    const { error } = noteSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details[0].message
      });
    }

    const noteData = {
      ...req.body,
      author: req.user._id
    };

    const note = new Note(noteData);
    await note.save();

    // Populate author info
    await note.populate('author', 'username firstName lastName');

    res.status(201).json({
      message: 'Note created successfully',
      note
    });

  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      message: 'Server error while creating note'
    });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  try {
    const { error } = noteSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details[0].message
      });
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: 'Note not found'
      });
    }

    // Check if user can edit
    if (!note.canEdit(req.user._id)) {
      return res.status(403).json({
        message: 'Not authorized to edit this note'
      });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username firstName lastName');

    res.json({
      message: 'Note updated successfully',
      note: updatedNote
    });

  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      message: 'Server error while updating note'
    });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: 'Note not found'
      });
    }

    // Only author can delete
    if (note.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to delete this note'
      });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Note deleted successfully'
    });

  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      message: 'Server error while deleting note'
    });
  }
};

// @desc    Share note with user
// @route   POST /api/notes/:id/share
// @access  Private
const shareNote = async (req, res) => {
  try {
    const { username, permission = 'read' } = req.body;

    if (!username) {
      return res.status(400).json({
        message: 'Username is required'
      });
    }

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({
        message: 'Note not found'
      });
    }

    // Only author can share
    if (note.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Only the author can share this note'
      });
    }

    // Find user to share with
    const userToShare = await User.findOne({ username });
    if (!userToShare) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Check if already shared
    const alreadyShared = note.sharedWith.find(
      share => share.user.toString() === userToShare._id.toString()
    );

    if (alreadyShared) {
      // Update permission
      alreadyShared.permission = permission;
    } else {
      // Add new share
      note.sharedWith.push({
        user: userToShare._id,
        permission
      });
    }

    await note.save();

    res.json({
      message: `Note shared with ${username}`,
      note
    });

  } catch (error) {
    console.error('Share note error:', error);
    res.status(500).json({
      message: 'Server error while sharing note'
    });
  }
};

// @desc    Toggle favorite status
// @route   PATCH /api/notes/:id/favorite
// @access  Private
const toggleFavorite = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: 'Note not found'
      });
    }

    // Check if user has access
    if (!note.canAccess(req.user._id)) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    note.isFavorite = !note.isFavorite;
    await note.save();

    res.json({
      message: `Note ${note.isFavorite ? 'added to' : 'removed from'} favorites`,
      note
    });

  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      message: 'Server error while updating favorite status'
    });
  }
};

// @desc    Archive/Unarchive note
// @route   PATCH /api/notes/:id/archive
// @access  Private
const toggleArchive = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: 'Note not found'
      });
    }

    // Check if user can edit
    if (!note.canEdit(req.user._id)) {
      return res.status(403).json({
        message: 'Not authorized to archive this note'
      });
    }

    note.isArchived = !note.isArchived;
    await note.save();

    res.json({
      message: `Note ${note.isArchived ? 'archived' : 'unarchived'} successfully`,
      note
    });

  } catch (error) {
    console.error('Toggle archive error:', error);
    res.status(500).json({
      message: 'Server error while updating archive status'
    });
  }
};

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  toggleFavorite,
  toggleArchive
};