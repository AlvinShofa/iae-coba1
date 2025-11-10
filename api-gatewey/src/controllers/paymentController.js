exports.processPayment = (req, res) => {
  console.log('✅ Payment request received:', req.body);
  res.json({
    message: 'Payment route works!',
    data: req.body
  });
};
