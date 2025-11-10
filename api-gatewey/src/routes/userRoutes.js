import express from "express";
import grpc from "@grpc/grpc-js";
import userClient from "../grpc-clients/userClient.js"; 

const router = express.Router();

// REGISTER
router.post("/register", (req, res) => {
  const { username, password, role = "user" } = req.body; // sesuai kolom DB
  // forward ke gRPC dengan field username, password, role
  userClient.Register({ username, password, role }, (err, response) => {
    if (err) {
      console.error("gRPC Register error:", err);
      return res.status(500).json({ success: false, message: err.message || "Internal server error" });
    }
    return res.json(response);
  });
});

// LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body; // sesuai kolom DB
  userClient.Login({ username, password }, (err, response) => {
    if (err) {
      console.error("gRPC Login error:", err);
      const status = err.code === grpc.status.UNAUTHENTICATED ? 401 : 500;
      return res.status(status).json({ success: false, message: err.message });
    }
    res.json(response);
  });
});

export default router;
