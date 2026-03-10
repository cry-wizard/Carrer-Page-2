const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect, admin } = require('../middleware/auth.middleware');

// @route   POST /api/applications/:jobId
// @desc    Apply for a job
// @access  Private (User)
router.post('/:jobId', protect, async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Prevent duplicate application (also handled by MongoDB unique index)
    const existingApplication = await Application.findOne({ jobId, userId: req.user._id });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = new Application({
      jobId,
      userId: req.user._id,
      resumeLink: req.body.resumeLink || ''
    });

    const createdApp = await application.save();
    res.status(201).json(createdApp);
  } catch (error) {
    // Check for MongoDB duplicate key error code
    if (error.code === 11000) {
        return res.status(400).json({ message: 'You have already applied for this job' });
    }
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/applications/job/:jobId
// @desc    Get all active applications for a specific job
// @access  Private/Admin
router.get('/job/:jobId', protect, admin, async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
        .populate('userId', 'name email role')
        .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/applications/my-applications
// @desc    Get user's own applications
// @access  Private (User)
router.get('/my/all', protect, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
        .populate('jobId', 'title department location')
        .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
