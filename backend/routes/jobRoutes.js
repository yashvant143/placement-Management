const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Optional auth token verification middleware so students see eligibility scoring while guests can still browse jobs
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const jwt = require('jsonwebtoken');
      const User = require('../models/User');
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretplacementjwtkey2026');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // Ignore token failure for public job browsing
    }
  }
  next();
};

router.get('/', optionalAuth, getJobs);
router.get('/:id', optionalAuth, getJobById);
router.post('/', protect, authorize('hr', 'admin'), createJob);
router.put('/:id', protect, authorize('hr', 'admin'), updateJob);
router.delete('/:id', protect, authorize('hr', 'admin'), deleteJob);

module.exports = router;
