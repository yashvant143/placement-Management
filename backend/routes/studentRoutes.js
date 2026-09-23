const express = require('express');
const router = express.Router();
const {
  getStudentProfile,
  updateStudentProfile,
  uploadResume,
  getStudentApplications,
  getStudentInterviews
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/profile', protect, authorize('student'), getStudentProfile);
router.put('/profile', protect, authorize('student'), updateStudentProfile);
router.post('/resume', protect, authorize('student'), upload.single('resume'), uploadResume);
router.get('/applications', protect, authorize('student'), getStudentApplications);
router.get('/interviews', protect, authorize('student'), getStudentInterviews);

module.exports = router;
