require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
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
    console.log('✅ Notification Service connected to MySQL database');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection error:', error.message);
    process.exit(1);
  }
})();

// Load Proto
const PROTO_PATH = path.join(__dirname, '../proto/notification.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const notificationProto = grpc.loadPackageDefinition(packageDef).notification;

// Service Implementation
const notificationService = {
  async SendNotification(call, callback) {
    try {
      const { userId, title, message, type = 'info' } = call.request;

      const [result] = await pool.query(
        `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)`,
        [userId, title, message, type]
      );

      callback(null, {
        success: true,
        message: 'Notification sent successfully'
      });
    } catch (error) {
      console.error('SendNotification error:', error);
      callback(null, {
        success: false,
        message: error.message
      });
    }
  },

  async GetNotificationsByUser(call, callback) {
    try {
      const { userId } = call.request;

      const [rows] = await pool.query(
        `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
      );

      const notifications = rows.map(row => ({
        id: row.id.toString(),
        title: row.title,
        message: row.message,
        type: row.type,
        isRead: row.is_read === 1,
        date: row.created_at.toISOString()
      }));

      callback(null, { notifications });
    } catch (error) {
      console.error('GetNotificationsByUser error:', error);
      callback(null, { notifications: [] });
    }
  },

  async MarkAsRead(call, callback) {
    try {
      const { notificationId } = call.request;

      await pool.query(
        'UPDATE notifications SET is_read = 1 WHERE id = ?',
        [notificationId]
      );

      callback(null, {
        success: true,
        message: 'Notification marked as read'
      });
    } catch (error) {
      console.error('MarkAsRead error:', error);
      callback(null, {
        success: false,
        message: error.message
      });
    }
  }
};

// Create and start server
const server = new grpc.Server();
server.addService(notificationProto.NotificationService.service, notificationService);

const PORT = process.env.PORT || 50054;

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
    console.log('✅ Notification Service is running!');
    console.log('📡 gRPC Server listening on port:', port);
    console.log('⏰ Started at:', new Date().toLocaleString());
    console.log('═══════════════════════════════════════════');
  }
);