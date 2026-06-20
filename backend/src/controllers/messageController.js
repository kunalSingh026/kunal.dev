const Message = require('../models/Message');
const nodemailer = require('nodemailer');

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

    // Check if email configuration is available
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_RECEIVER) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.EMAIL_PORT) || 587,
          secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"${name}" <${process.env.EMAIL_USER}>`, // Send on behalf of user but authenticated through our account
          to: process.env.EMAIL_RECEIVER,
          replyTo: email, // Direct reply to the user's email
          subject: `KUNAL.DEV Contact Form: ${subject || 'New Message'}`,
          text: `You have received a new message from your portfolio contact form.\n\n` +
                `Name: ${name}\n` +
                `Email: ${email}\n` +
                `Subject: ${subject || 'No Subject'}\n\n` +
                `Message:\n${message}\n`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #d3c2c5; border-radius: 8px; background-color: #FAF6EE; color: #1d1b18;">
              <h2 style="border-bottom: 2px solid #7a545d; padding-bottom: 10px; color: #7a545d; font-family: serif; font-size: 24px; margin-top: 0;">New Portfolio Message</h2>
              <p style="margin: 15px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 15px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #49654d; text-decoration: none; font-weight: bold;">${email}</a></p>
              <p style="margin: 15px 0;"><strong>Subject:</strong> ${subject || 'No Subject'}</p>
              <div style="margin-top: 20px; padding: 15px; background-color: #ffffff; border-left: 4px solid #7a545d; border-radius: 4px; font-family: monospace; white-space: pre-wrap; line-height: 1.5; color: #1d1b18;">${message}</div>
              <hr style="border: 0; border-top: 1px solid #d3c2c5; margin: 20px 0;" />
              <p style="font-size: 11px; color: #827476; text-align: center; margin: 0;">This email was sent from the contact form at KUNAL.DEV</p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email notification successfully sent for message ID ${newMessage.id}`);
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
      }
    } else {
      console.log('Email configuration missing in environment. Saved to database only.');
    }

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
