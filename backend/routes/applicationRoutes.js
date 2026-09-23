const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('student'), applyForJob);
router.get('/', protect, authorize('hr', 'admin'), getApplications);
router.put('/:id/status', protect, authorize('hr', 'admin'), updateApplicationStatus);

module.exports = router;
