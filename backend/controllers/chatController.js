const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// GET /api/chat/conversations
const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .sort({ updatedAt: -1 })
      .populate('participants', 'name avatar');

    res.json(conversations);
  } catch (error) {
    next(error);
  }
};

// GET /api/chat/messages/:conversationId
const getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      conversationId: req.params.conversationId,
    })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'name avatar');

    // Mark unread messages as read
    await Message.updateMany(
      {
        conversationId: req.params.conversationId,
        sender: { $ne: req.user._id },
        read: false,
      },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// POST /api/chat/messages
const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, text } = req.body;

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, receiverId],
        lastMessage: text,
      });
    } else {
      conversation.lastMessage = text;
      await conversation.save();
    }

    const message = await Message.create({
      conversationId: conversation._id,
      sender: req.user._id,
      text,
    });

    const populated = await message.populate('sender', 'name avatar');

    res.status(201).json({
      message: populated,
      conversationId: conversation._id,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/chat/conversation
const getOrCreateConversation = async (req, res, next) => {
  try {
    const { participantId } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, participantId] },
    }).populate('participants', 'name avatar');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, participantId],
      });
      conversation = await conversation.populate('participants', 'name avatar');
    }

    res.json(conversation);
  } catch (error) {
    next(error);
  }
};

module.exports = { getConversations, getMessages, sendMessage, getOrCreateConversation };
