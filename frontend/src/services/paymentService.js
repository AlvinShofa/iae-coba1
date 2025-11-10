import axios from "axios";

const API_URL = import.meta.env.VITE_PAYMENT_API || "http://localhost:5000/api/payments";

// Process payment
export const processPayment = async (paymentData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/process`, paymentData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};