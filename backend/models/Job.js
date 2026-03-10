const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true }, // e.g., Full-time, Remote
  description: { type: String },
  salary: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
