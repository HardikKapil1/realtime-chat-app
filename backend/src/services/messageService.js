const Message = require('../models/Message');

/**
 * Service to manage message persistence and retrieval.
 */
class MessageService {
  /**
   * Save a new message to MongoDB after validating input.
   * @param {Object} messageData - { username, text }
   * @returns {Promise<Object>} Created message document
   */
  async createMessage({ username, text }) {
    const trimmedUsername = typeof username === 'string' ? username.trim() : '';
    const trimmedText = typeof text === 'string' ? text.trim() : '';

    if (!trimmedUsername) {
      const error = new Error('Username is required and cannot be empty');
      error.statusCode = 400;
      throw error;
    }

    if (!trimmedText) {
      const error = new Error('Message text is required and cannot be empty');
      error.statusCode = 400;
      throw error;
    }

    const message = new Message({
      username: trimmedUsername,
      text: trimmedText,
    });

    return await message.save();
  }

  /**
   * Fetch all stored messages from MongoDB ordered from oldest to newest.
   * @returns {Promise<Array>} Array of message documents
   */
  async getAllMessages() {
    return await Message.find()
      .sort({ createdAt: 1 })
      .exec();
  }

  /**
   * Helper to fetch recent messages (kept for compatibility with sockets/controllers).
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async getRecentMessages(limit = 50) {
    return await Message.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}

module.exports = new MessageService();
