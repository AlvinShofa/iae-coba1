import axios from "axios";

const API_URL = import.meta.env.VITE_TICKET_API || "http://localhost:5000/api/tickets";

// Purchase ticket
export const purchaseTicket = async (ticketData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(API_URL, ticketData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// Get ticket by ID
export const getTicketById = async (ticketId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/${ticketId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// Get user's tickets
export const getUserTickets = async (userId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/user/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// Get tickets for an event
export const getEventTickets = async (eventId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/event/${eventId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// Update ticket status
export const updateTicketStatus = async (ticketId, status) => {
  const token = localStorage.getItem('token');
  const response = await axios.patch(`${API_URL}/${ticketId}/status`, 
    { status },
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.data;
};

// Validate ticket
export const validateTicket = async (ticketCode) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/validate`, 
    { ticketCode },
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.data;
};