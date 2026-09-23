const express = require('express');
const router = express.Router();
const { getUserNotifications, markAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUserNotifications);
router.put('/:id/read', protect, markAsRead);

module.exports = router;
