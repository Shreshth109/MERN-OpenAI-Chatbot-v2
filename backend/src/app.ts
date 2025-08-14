import express from "express";
import { config } from "dotenv";
import morgan from 'morgan'
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
config();
const app = express();

// trust proxy for secure cookies in production (Render)
app.set("trust proxy", 1);

//middlewares
const envOrigins = (process.env.FRONTEND_URL || "")
	.split(",")
	.map((o) => o.trim())
	.filter(Boolean);

const allowedOrigins = [
	"http://localhost:5173",
	"http://localhost:3000",
	"https://mern-openai-chatbot-v2-frontend2.onrender.com",
	"https://mern-openai-chatbot-v2-frontend3.onrender.com",
	...envOrigins,
].filter(Boolean);

const corsOptions = {
	origin: allowedOrigins,
	credentials: true,
};

app.use(cors(corsOptions));
// Ensure preflight requests are handled for all routes
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

//remove it in production
app.use(morgan("dev"));

app.use("/api/v1",appRouter);

export default app;
