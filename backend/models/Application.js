const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'reviewed', 'rejected', 'hired'], default: 'pending' },
  resumeLink: { type: String }, // optional, for real-world scenarios
}, { timestamps: true });

// Prevent a user from applying to the same job multiple times
applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
