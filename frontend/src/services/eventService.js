import axios from "axios";

const API_URL = import.meta.env.VITE_EVENT_API || "http://localhost:5000/api/events";

// Get all events with optional filters
export const getAllEvents = async (filters = {}) => {
  const { page = 1, limit = 10, category, search } = filters;
  
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  if (category) params.append('category', category);
  if (search) params.append('search', search);

  const response = await axios.get(`${API_URL}?${params.toString()}`);
  return response.data;
};

// Get single event by ID
export const getEventById = async (eventId) => {
  const response = await axios.get(`${API_URL}/${eventId}`);
  return response.data;
};

// Create new event (admin only)
export const createEvent = async (eventData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(API_URL, eventData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// Update event (admin only)
export const updateEvent = async (eventId, eventData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/${eventId}`, eventData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// Delete event (admin only)
export const deleteEvent = async (eventId) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/${eventId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};