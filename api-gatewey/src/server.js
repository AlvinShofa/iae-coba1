import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes.js"; // pastikan path sesuai

const app = express();

// 🔹 Enable CORS dulu
app.use(cors());

// 🔹 Parse JSON body
app.use(express.json());

// 🔹 Routes
app.use("/api/users", userRouter);

// 🔹 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
