const express = require('express');
const router = express.Router();
const {
  getUser,
  updateProfile,
  followUser,
  searchUsers,
  getSuggestions,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/search', protect, searchUsers);
router.get('/suggestions', protect, getSuggestions);
router.get('/:id', protect, getUser);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.post('/:id/follow', protect, followUser);

module.exports = router;
