const messageService = require('../services/messageService');

/**
 * Controller for retrieving all stored messages (oldest to newest).
 * GET /api/messages
 */
const getMessages = async (req, res, next) => {
  try {
    const messages = await messageService.getAllMessages();
    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for creating a new message.
 * POST /api/messages
 */
const createMessage = async (req, res, next) => {
  try {
    const { username, text } = req.body;
    const newMessage = await messageService.createMessage({ username, text });
    res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMessages,
  createMessage,
};
