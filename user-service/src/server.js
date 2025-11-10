import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import { registerUser, loginUser } from "./services/userService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Proto
const PROTO_PATH = path.join(__dirname, "../proto/user.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

// gRPC Service Implementation
const userService = {
  Register: async (call, callback) => {
    try {
      const { username, password, role } = call.request;
      const user = await registerUser(username, password, role || "user");
      callback(null, { message: "User registered successfully", user });
    } catch (err) {
      console.error("Register error:", err.message);
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },

  Login: async (call, callback) => {
    try {
      const { username, password } = call.request;
      const user = await loginUser(username, password);
      callback(null, { message: "Login successful", user });
    } catch (err) {
      console.error("Login error:", err.message);
      callback({ code: grpc.status.UNAUTHENTICATED, message: err.message });
    }
  },
};

// Jalankan Server
const server = new grpc.Server();
server.addService(userProto.UserService.service, userService);

const PORT = 50051;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err) => {
  if (err) throw err;
  console.log(`✅ User Service running on port ${PORT}`);
  server.start();
});
