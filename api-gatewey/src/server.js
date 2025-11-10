import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes.js"; // pastikan path sesuai
import eventRouter from "./routes/eventRoutes.js";
import ticketRouter from "./routes/ticketRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";

const app = express();

// 🔹 Enable CORS dulu
app.use(cors());

// 🔹 Parse JSON body
app.use(express.json());

// 🔹 Routes
app.use("/api/users", userRouter);
app.use("/api/events", eventRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/notifications", notificationRouter);

// 🔹 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
