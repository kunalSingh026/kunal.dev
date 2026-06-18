const Message = require('../models/Message');

exports.submitMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  try {
    const newMessage = await Message.create({
      name,
      email,
      subject: subject || 'No Subject',
      message,
    });
    return res.status(201).json({
      message: 'Message sent successfully.',
      data: newMessage
    });
  } catch (error) {
    console.error('Submit message error:', error);
    return res.status(500).json({ message: 'Server error sending message.' });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    return res.status(500).json({ message: 'Server error retrieving messages.' });
  }
};

exports.updateMessageStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['unread', 'read', 'archived'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {
    const message = await Message.findByPk(id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    await message.update({ status });
    return res.status(200).json(message);
  } catch (error) {
    console.error('Update message status error:', error);
    return res.status(500).json({ message: 'Server error updating message.' });
  }
};

exports.deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findByPk(id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    await message.destroy();
    return res.status(200).json({ message: 'Message deleted successfully.' });
  } catch (error) {
    console.error('Delete message error:', error);
    return res.status(500).json({ message: 'Server error deleting message.' });
  }
};
