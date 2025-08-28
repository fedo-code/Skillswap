// ✅ messageController.js (FINAL FIXED VERSION)
const Message = require('../models/Message');

// ✅ Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;

    console.log("📨 Sending message to:", recipientId); // ✅ ADD THIS
    console.log("✉️  Content:", content);               // ✅ ADD THIS
    console.log("👤 From user:", req.user._id); 
    const newMsg = new Message({
      sender: req.user._id,
      recipient: recipientId,
      content,
      read: false, // 🟢 initially unread
    });
    await newMsg.save();
    console.log("✅ Message saved:", newMsg); // ✅ ADD TH
    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get messages between current user and a recipient
exports.getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const recipientId = req.params.recipientId;

    // 🟢 Mark all unread messages FROM recipient TO current user as read
    await Message.updateMany(
      { sender: recipientId, recipient: userId, read: false },
      { $set: { read: true } }
    );

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: recipientId },
        { sender: recipientId, recipient: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name');

    const formatted = messages.map((msg) => ({
      _id: msg._id,
      sender: msg.sender._id.toString(),
      senderName: msg.sender.name,
      content: msg.content,
      createdAt: msg.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

// ✅ Get conversation list for the current logged-in user
exports.getAllUserMessages = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    // 🟢 Find all messages for this user
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name')
      .populate('recipient', 'name');

    const conversationsMap = new Map();

    messages.forEach((msg) => {
      const senderId = msg.sender._id.toString();
      const recipientId = msg.recipient._id.toString();

      // ❗ This determines the "other" person in conversation
      const otherUser = senderId === userId ? msg.recipient : msg.sender;
      const otherUserId = otherUser._id.toString();

      // 🛠️ Only count messages as unread if:
      const isUnread = !msg.read && msg.recipient._id.toString() === userId;

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          userId: otherUser._id,
          name: otherUser.name,
          lastMessage: msg.content,
          timestamp: msg.createdAt,
          unread: isUnread ? 1 : 0,
        });
      } else {
        const convo = conversationsMap.get(otherUserId);

        if (msg.createdAt > convo.timestamp) {
          convo.lastMessage = msg.content;
          convo.timestamp = msg.createdAt;
        }

        if (isUnread) {
          convo.unread += 1;
        }

        conversationsMap.set(otherUserId, convo);
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
};
