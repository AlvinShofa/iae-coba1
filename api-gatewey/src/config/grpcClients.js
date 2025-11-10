import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to load proto files
const loadProto = (filename) => {
  const protoPath = path.join(__dirname, '../../proto', filename);
  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  return grpc.loadPackageDefinition(packageDefinition);
};

// Load all proto files
const userProto = loadProto('user.proto');
const eventProto = loadProto('event.proto');
const paymentProto = loadProto('payment.proto');

// Create gRPC clients
export const userClient = new userProto.user.UserService(
  `${process.env.USER_SERVICE_HOST}:${process.env.USER_SERVICE_PORT}`,
  grpc.credentials.createInsecure()
);

export const eventClient = new eventProto.event.EventService(
  `${process.env.EVENT_SERVICE_HOST}:${process.env.EVENT_SERVICE_PORT}`,
  grpc.credentials.createInsecure()
);

export const paymentClient = new paymentProto.payment.PaymentService(
  `${process.env.PAYMENT_SERVICE_HOST}:${process.env.PAYMENT_SERVICE_PORT}`,
  grpc.credentials.createInsecure()
);

console.log('✅ gRPC Clients initialized successfully');