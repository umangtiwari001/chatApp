import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDb } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve();

// cors (first)
// app.use(cors({
//   origin: "http://localhost:5173",

//   credentials: true
// }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://chatapp-6-ktwr.onrender.com"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Postman/curl requests
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://chatapp-6-ktwr.onrender.com"  // deployed frontend
// ];

// Body size limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Production static files
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Start server
server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDb();
});
