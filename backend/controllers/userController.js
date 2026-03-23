const User = require('../models/User');
const Notification = require('../models/Notification');
const { getOnlineUsers } = require('../config/socket');

// GET /api/users/:id
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;

    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// POST /api/users/:id/follow
const followUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const userToFollow = await User.findById(req.params.id);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = req.user.following.includes(req.params.id);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $pull: { followers: req.user._id },
      });
      res.json({ message: 'Unfollowed', following: false });
    } else {
      // Follow
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { following: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $addToSet: { followers: req.user._id },
      });

      // Create notification
      const notification = await Notification.create({
        recipient: req.params.id,
        sender: req.user._id,
        type: 'follow',
      });

      // Real-time notification
      const io = req.app.get('io');
      const onlineUsers = getOnlineUsers();
      const receiverSocketId = onlineUsers.get(req.params.id);
      if (receiverSocketId) {
        const populated = await notification.populate('sender', 'name avatar');
        io.to(receiverSocketId).emit('newNotification', populated);
      }

      res.json({ message: 'Followed', following: true });
    }
  } catch (error) {
    next(error);
  }
};

// GET /api/users/search?q=
const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } },
          ],
        },
      ],
    })
      .select('name avatar bio')
      .limit(20);

    res.json(users);
  } catch (error) {
    next(error);
  }
};

// GET /api/users/suggestions
const getSuggestions = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const users = await User.find({
      _id: { $nin: [...currentUser.following, req.user._id] },
    })
      .select('name avatar bio followers')
      .limit(5);

    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUser, updateProfile, followUser, searchUsers, getSuggestions };
