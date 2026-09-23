const express = require('express');
const router = express.Router();
const {
  getAdminStatistics,
  getAllStudents,
  getAllCompanies
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/statistics', protect, authorize('admin'), getAdminStatistics);
router.get('/students', protect, authorize('admin'), getAllStudents);
router.get('/companies', protect, authorize('admin'), getAllCompanies);

module.exports = router;
