import express from 'express';
import { paymentClient } from '../config/grpcClients.js';

const router = express.Router();

// PROCESS PAYMENT
router.post('/process', (req, res) => {
  const { user_id, event_id, amount, method } = req.body;

  console.log('📨 Payment request received:', { user_id, event_id, amount, method });

  paymentClient.ProcessPayment(
    {
      user_id,
      event_id,
      amount: parseFloat(amount),
      method
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

export default router;