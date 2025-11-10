import express from 'express';
import { eventClient } from '../config/grpcClients.js';

const router = express.Router();

// CREATE TICKET (Purchase)
router.post('/', (req, res) => {
  const { eventId, userId, quantity, totalPrice } = req.body;

  eventClient.CreateTicket(
    {
      eventId,
      userId,
      quantity: parseInt(quantity),
      totalPrice: parseFloat(totalPrice)
    },
    (err, response) => {
      if (err) {
        console.error('CreateTicket error:', err);
        return res.status(500).json({ 
          success: false, 
          message: err.message 
        });
      }
      res.json(response);
    }
  );
});

// GET TICKET BY ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  eventClient.GetTicket({ ticketId: id }, (err, response) => {
    if (err) {
      console.error('GetTicket error:', err);
      return res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
    res.json(response);
  });
});

// GET TICKETS BY USER
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;

  eventClient.GetTicketsByUser({ userId }, (err, response) => {
    if (err) {
      console.error('GetTicketsByUser error:', err);
      return res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
    res.json(response);
  });
});

// GET TICKETS BY EVENT
router.get('/event/:eventId', (req, res) => {
  const { eventId } = req.params;

  eventClient.GetTicketsByEvent({ eventId }, (err, response) => {
    if (err) {
      console.error('GetTicketsByEvent error:', err);
      return res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
    res.json(response);
  });
});

// UPDATE TICKET STATUS
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  eventClient.UpdateTicketStatus(
    { ticketId: id, status },
    (err, response) => {
      if (err) {
        console.error('UpdateTicketStatus error:', err);
        return res.status(500).json({ 
          success: false, 
          message: err.message 
        });
      }
      res.json(response);
    }
  );
});

// VALIDATE TICKET
router.post('/validate', (req, res) => {
  const { ticketCode } = req.body;

  eventClient.ValidateTicket({ ticketCode }, (err, response) => {
    if (err) {
      console.error('ValidateTicket error:', err);
      return res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
    res.json(response);
  });
});

export default router;