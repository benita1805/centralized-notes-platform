const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  category: {
    type: String,
    enum: ['personal', 'work', 'study', 'project', 'other'],
    default: 'personal'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isPrivate: {
    type: Boolean,
    default: true
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['read', 'write'],
      default: 'read'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isArchived: {
    type: Boolean,
    default: false
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  reminder: {
    date: Date,
    isActive: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
noteSchema.index({ author: 1, createdAt: -1 });
noteSchema.index({ tags: 1 });
noteSchema.index({ category: 1 });
noteSchema.index({ title: 'text', content: 'text' });
noteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

noteSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString();
});

noteSchema.methods.canAccess = function(userId) {
   if (this.author.toString() === userId.toString()) {
    return true;
  }
  
  if (!this.isPrivate) {
    return true;
  }
  
  return this.sharedWith.some(share => 
    share.user.toString() === userId.toString()
  );
};


noteSchema.methods.canEdit = function(userId) {

  if (this.author.toString() === userId.toString()) {
    return true;
  }
  return this.sharedWith.some(share => 
    share.user.toString() === userId.toString() && 
    share.permission === 'write'
  );
};

module.exports = mongoose.model('Note', noteSchema);