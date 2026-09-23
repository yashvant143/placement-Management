const express = require('express');
const router = express.Router();
const {
  scheduleInterview,
  getInterviews,
  updateInterview
} = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('hr', 'admin'), scheduleInterview);
router.get('/', protect, getInterviews);
router.put('/:id', protect, authorize('hr', 'admin'), updateInterview);

module.exports = router;
