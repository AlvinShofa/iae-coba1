require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2/promise');

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ticket-konser',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Payment Service connected to MySQL database');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection error:', error.message);
    process.exit(1);
  }
})();

// Load Proto
const PROTO_PATH = path.join(__dirname, 'proto', 'payment.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const paymentProto = grpc.loadPackageDefinition(packageDef).payment;

// Payment Controller
const paymentService = {
  async ProcessPayment(call, callback) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const { user_id, event_id, amount, method, ticket_id } = call.request;

      console.log(`💳 Processing payment for user ${user_id}, event ${event_id}, amount ${amount}`);

      // Generate transaction ID
      const transaction_id = `TXN-${Date.now()}-${uuidv4().substr(0, 8).toUpperCase()}`;

      // Simulate payment processing
      const success = Math.random() > 0.1; // 90% success rate

      if (!success) {
        await connection.rollback();
        return callback(null, {
          success: false,
          transaction_id: '',
          message: 'Payment failed. Please try again.'
        });
      }

      // Insert payment record
      await connection.query(
        `INSERT INTO payments 
        (transaction_id, ticket_id, user_id, event_id, amount, payment_method, status, payment_date) 
        VALUES (?, ?, ?, ?, ?, ?, 'success', NOW())`,
        [transaction_id, ticket_id || 0, user_id, event_id, amount, method]
      );

      // Update ticket status to 'paid' if ticket_id provided
      if (ticket_id) {
        await connection.query(
          'UPDATE tickets SET status = ? WHERE id = ?',
          ['paid', ticket_id]
        );
      }

      await connection.commit();

      console.log(`✅ Payment successful: ${transaction_id}`);

      callback(null, {
        success: true,
        transaction_id: transaction_id,
        message: 'Payment successful!'
      });

    } catch (error) {
      await connection.rollback();
      console.error('❌ ProcessPayment error:', error);
      callback(null, {
        success: false,
        transaction_id: '',
        message: error.message
      });
    } finally {
      connection.release();
    }
  },

  async GetPaymentHistory(call, callback) {
    try {
      const { user_id } = call.request;

      const [rows] = await pool.query(
        `SELECT p.*, e.title as event_title 
         FROM payments p 
         LEFT JOIN events e ON p.event_id = e.id 
         WHERE p.user_id = ? 
         ORDER BY p.created_at DESC`,
        [user_id]
      );

      const payments = rows.map(row => ({
        id: row.id.toString(),
        transaction_id: row.transaction_id,
        amount: parseFloat(row.amount),
        payment_method: row.payment_method,
        status: row.status,
        event_title: row.event_title || '',
        payment_date: row.payment_date ? row.payment_date.toISOString() : ''
      }));

      callback(null, { payments });

    } catch (error) {
      console.error('GetPaymentHistory error:', error);
      callback(null, { payments: [] });
    }
  }
};

// Create and start server
const server = new grpc.Server();
server.addService(paymentProto.PaymentService.service, paymentService);

const PORT = process.env.PAYMENT_SERVICE_PORT || 50053;

server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('✅ Payment Service is running!');
    console.log('📡 gRPC Server listening on port:', port);
    console.log('⏰ Started at:', new Date().toLocaleString());
    console.log('═══════════════════════════════════════════');
  }
);