const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');

router.post('/', messageController.submitMessage);
router.get('/', authMiddleware, messageController.getAllMessages);
router.patch('/:id', authMiddleware, messageController.updateMessageStatus);
router.delete('/:id', authMiddleware, messageController.deleteMessage);

module.exports = router;
