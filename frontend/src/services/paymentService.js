import axios from "axios";

const API_URL = import.meta.env.VITE_PAYMENT_API || "http://localhost:5000/api/payments";

// Process payment
export const processPayment = async (paymentData, ticketId) => {
  const token = localStorage.getItem('token');

  // Gabungkan ticket_id ke dalam body request
  const dataToSend = {
    ...paymentData,
    ticket_id: ticketId
  };

  const response = await axios.post(`${API_URL}/process`, dataToSend, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
};
