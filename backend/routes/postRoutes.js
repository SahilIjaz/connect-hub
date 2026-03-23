const express = require('express');
const router = express.Router();
const {
  createPost,
  getFeed,
  getExplorePosts,
  getPost,
  likePost,
  addComment,
  getComments,
  deletePost,
  getUserPosts,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, upload.single('image'), createPost);
router.get('/feed', protect, getFeed);
router.get('/explore', protect, getExplorePosts);
router.get('/user/:id', protect, getUserPosts);
router.get('/:id', protect, getPost);
router.put('/:id/like', protect, likePost);
router.post('/:id/comments', protect, addComment);
router.get('/:id/comments', protect, getComments);
router.delete('/:id', protect, deletePost);

module.exports = router;
