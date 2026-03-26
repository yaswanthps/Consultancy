/**
 * Centralized API configuration.
 * Change the API_BASE_URL here to point to your laptop's IP address
 * when testing on other devices (e.g., http://192.168.1.5:5000).
 * For production, Vercel will use the environment variable.
 */

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
