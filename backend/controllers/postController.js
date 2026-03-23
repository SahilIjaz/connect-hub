const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const { getOnlineUsers } = require('../config/socket');

// POST /api/posts
const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    const postData = {
      author: req.user._id,
      content,
    };

    if (req.file) {
      postData.image = `/uploads/${req.file.filename}`;
    }

    const post = await Post.create(postData);
    const populated = await post.populate('author', 'name avatar');

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// GET /api/posts/feed
const getFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get posts from people the user follows + own posts
    const following = [...req.user.following, req.user._id];

    const posts = await Post.find({ author: { $in: following } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name avatar');

    const total = await Post.countDocuments({ author: { $in: following } });

    res.json({
      posts,
      hasMore: skip + posts.length < total,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/posts/explore
const getExplorePosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name avatar');

    const total = await Post.countDocuments();

    res.json({
      posts,
      hasMore: skip + posts.length < total,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/posts/:id
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      'name avatar'
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await Comment.find({ post: req.params.id })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar');

    res.json({ post, comments });
  } catch (error) {
    next(error);
  }
};

// PUT /api/posts/:id/like
const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.addToSet(req.user._id);

      // Notify post author (not self)
      if (post.author.toString() !== req.user._id.toString()) {
        const notification = await Notification.create({
          recipient: post.author,
          sender: req.user._id,
          type: 'like',
          refPost: post._id,
        });

        const io = req.app.get('io');
        const onlineUsers = getOnlineUsers();
        const receiverSocketId = onlineUsers.get(post.author.toString());
        if (receiverSocketId) {
          const populated = await notification.populate('sender', 'name avatar');
          io.to(receiverSocketId).emit('newNotification', populated);
        }
      }
    }

    await post.save();
    res.json({ likes: post.likes, liked: !isLiked });
  } catch (error) {
    next(error);
  }
};

// POST /api/posts/:id/comments
const addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      author: req.user._id,
      post: req.params.id,
      text: req.body.text,
    });

    post.commentCount += 1;
    await post.save();

    const populated = await comment.populate('author', 'name avatar');

    // Notify post author
    if (post.author.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: 'comment',
        refPost: post._id,
      });

      const io = req.app.get('io');
      const onlineUsers = getOnlineUsers();
      const receiverSocketId = onlineUsers.get(post.author.toString());
      if (receiverSocketId) {
        const notifPopulated = await notification.populate(
          'sender',
          'name avatar'
        );
        io.to(receiverSocketId).emit('newNotification', notifPopulated);
      }
    }

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// GET /api/posts/:id/comments
const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar');

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/posts/:id
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Comment.deleteMany({ post: req.params.id });
    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
};

// GET /api/posts/user/:id
const getUserPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: req.params.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name avatar');

    const total = await Post.countDocuments({ author: req.params.id });

    res.json({
      posts,
      hasMore: skip + posts.length < total,
      total,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getFeed,
  getExplorePosts,
  getPost,
  likePost,
  addComment,
  getComments,
  deletePost,
  getUserPosts,
};
