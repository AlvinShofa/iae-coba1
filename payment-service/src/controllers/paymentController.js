const { v4: uuidv4 } = require('uuid');

class PaymentController {
  async processPayment(call, callback) {
    const { user_id, event_id, amount, method } = call.request;

    console.log(`Processing payment for user ${user_id}, event ${event_id}, amount ${amount} via ${method}`);

    // simulasi logic pembayaran
    const success = true; // seolah berhasil
    const transaction_id = uuidv4();
    const message = success
      ? 'Payment successful!'
      : 'Payment failed. Please try again.';

    callback(null, {
      success,
      transaction_id,
      message,
    });
  }
}

module.exports = new PaymentController();
