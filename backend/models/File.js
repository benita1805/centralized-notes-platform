// models/File.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  mimeType: { type: String, required: true },
  subjectName: { type: String, required: true },
  subjectCode: { type: String, required: true },
  semester: { type: String, required: true },
  description: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ✅ CORRECT
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
