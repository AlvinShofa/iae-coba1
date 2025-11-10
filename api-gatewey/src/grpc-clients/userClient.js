import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "../../proto/user.proto"); // copy proto ke api-gateway/proto

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(packageDef).user;

const USER_SERVICE_ADDR = process.env.USER_SERVICE_URL || "localhost:50051";
const userClient = new userProto.UserService(USER_SERVICE_ADDR, grpc.credentials.createInsecure());

export default userClient;
