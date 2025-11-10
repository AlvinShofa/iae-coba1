import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "./proto/user.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

const client = new userProto.UserService("localhost:50051", grpc.credentials.createInsecure());

// 🔹 Test Register
client.Register({ username: "ditoo", password: "123456", role: "user" }, (err, res) => {
  if (err) console.error("Register error:", err.message);
  else console.log("Register response:", res);
});

// 🔹 Test Login
setTimeout(() => {
  client.Login({ username: "ditoo", password: "123456" }, (err, res) => {
    if (err) console.error("Login error:", err.message);
    else console.log("Login response:", res);
  });
}, 1000);
