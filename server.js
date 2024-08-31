import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
dotenv.config();
const app = express();
const PORT = 4000;

app.use(express.json()); // allows us to parse incoming request with JSON payloads
app.use(cookieParser()); // allows us to parse to incoming cookies
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server started on ${PORT}`);
});
