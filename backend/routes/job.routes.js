const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect, admin } = require('../middleware/auth.middleware');

// @route   GET /api/jobs
// @desc    Get all jobs
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Add simple filtering query if needed
    const { department, type, location } = req.query;
    let query = {};
    if (department) query.department = { $regex: new RegExp(department, 'i') };
    if (type) query.type = { $regex: new RegExp(type, 'i') };
    if (location) query.location = { $regex: new RegExp(location, 'i') };

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/jobs
// @desc    Create a job
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const job = new Job({ ...req.body, createdBy: req.user._id });
    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    Object.assign(job, req.body);
    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
