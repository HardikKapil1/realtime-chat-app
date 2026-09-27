import axios from 'axios';
import { API_BASE_URL } from '../constants/config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch previous message history from backend REST API.
 * GET /api/messages
 * @returns {Promise<Array>} Array of stored message objects ordered oldest to newest
 */
export const fetchMessages = async () => {
  try {
    const response = await apiClient.get('/api/messages');
    if (response.data && response.data.success) {
      return response.data.messages || [];
    }
    return [];
  } catch (error) {
    console.error('[API Service] Error fetching messages:', error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to load previous messages from server.'
    );
  }
};

/**
 * Check backend server health status.
 * GET /api/health
 */
export const checkServerHealth = async () => {
  try {
    const response = await apiClient.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('[API Service] Health check failed:', error.message);
    throw error;
  }
};

export default apiClient;
