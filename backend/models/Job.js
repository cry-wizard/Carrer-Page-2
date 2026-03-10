const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  companyName: { type: String, default: 'Centennial Infotech' },
  location: { type: String, required: true },
  type: { type: String, required: true }, // e.g., Full-time, Part-time
  workMode: { type: String, default: 'Remote' }, // Remote, On-site, Hybrid
  minSalary: { type: String },
  maxSalary: { type: String },
  salary: { type: String },
  expRequired: { type: String, default: '1' },
  openings: { type: Number, default: 1 },
  description: { type: String },
  showRequirements: { type: Boolean, default: false },
  showResponsibilities: { type: Boolean, default: false },
  requirements: { type: String },
  responsibilities: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
