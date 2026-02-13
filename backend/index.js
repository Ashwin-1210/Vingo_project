import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import itemRouter from "./routes/item.routes.js";
import shopRouter from "./routes/shop.routes.js";
import orderRouter from "./routes/order.routes.js";
import { socketHandler } from "./socket.js";

const app = express();
const server = http.createServer(app);

// 🌐 Frontend URL from env (important for Render)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// 🔌 Socket.io setup
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

app.set("io", io);

// 📦 Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// 🛣️ Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

// 🔌 Socket handler
socketHandler(io);

// 🚀 Start server AFTER DB connection
const port = process.env.PORT || 5000;

connectDb()
  .then(() => {
    server.listen(port, () => {
      console.log(`✅ Server started at port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });
