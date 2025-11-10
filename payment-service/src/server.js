require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const paymentController = require('./controllers/paymentController');

const PROTO_PATH = path.join(__dirname, 'proto', 'payment.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDef);
const paymentPackage = grpcObject.payment;

const server = new grpc.Server();

server.addService(paymentPackage.PaymentService.service, {
  ProcessPayment: paymentController.processPayment,
});

const PORT = process.env.PAYMENT_SERVICE_PORT || 50053;

server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`💳 Payment gRPC Server running at port ${port}`);
  
});
