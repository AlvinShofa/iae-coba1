import express from 'express';
import { paymentClient } from '../config/grpcClients.js';

const router = express.Router();

// PROCESS PAYMENT
router.post('/process', (req, res) => {
  const { user_id, event_id, amount, method, ticket_id } = req.body;

  console.log('📨 Payment request received:', { user_id, event_id, amount, method, ticket_id });

  if (!user_id || !event_id || !amount || !method) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }

  paymentClient.ProcessPayment(
    {
      user_id: user_id.toString(),
      event_id: event_id.toString(),
      amount: parseFloat(amount),
      method,
      ticket_id: ticket_id ? ticket_id.toString() : '0'
    },
    (err, response) => {
      if (err) {
        console.error('❌ ProcessPayment error:', err);
        return res.status(500).json({ 
          success: false, 
          message: err.message 
        });
      }
      
      console.log('✅ Payment processed:', response);
      res.json(response);
    }
  );
});

// GET PAYMENT HISTORY
router.get('/history/:userId', (req, res) => {
  const { userId } = req.params;

  paymentClient.GetPaymentHistory(
    { user_id: userId },
    (err, response) => {
      if (err) {
        console.error('GetPaymentHistory error:', err);
        return res.status(500).json({ 
          success: false, 
          message: err.message,
          payments: []
        });
      }
      res.json(response);
    }
  );
});

export default router;