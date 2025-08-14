import express from "express";
import { config } from "dotenv";
import morgan from 'morgan'
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
config();
const app = express();

//middlewares
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000", 
    "https://mern-openai-chatbot-v2-frontend3.onrender.com",
    "https://mern-openai-chatbot-v2-frontend2.onrender.com",
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"]
}))
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

//remove it in production
app.use(morgan("dev"));

app.use("/api/v1",appRouter);

export default app;
