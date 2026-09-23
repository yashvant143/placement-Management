const express = require('express');
const router = express.Router();
const {
  getCompanyProfile,
  updateCompanyProfile,
  getHRDashboardStats
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/profile', protect, authorize('hr'), getCompanyProfile);
router.put('/profile', protect, authorize('hr'), updateCompanyProfile);
router.get('/dashboard', protect, authorize('hr'), getHRDashboardStats);

module.exports = router;
