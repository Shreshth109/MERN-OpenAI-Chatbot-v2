import express from "express";
import { config } from "dotenv";
import morgan from 'morgan'
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
config();
const app = express();

app.set("trust proxy", 1);

const corsOptions = {
	origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
		return callback(null, true);
	},
	credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Fallback CORS headers to ensure browser sees them on all responses
app.use((req, res, next) => {
	const origin = req.headers.origin as string | undefined;
	if (origin) {
		res.header("Access-Control-Allow-Origin", origin);
		res.header("Vary", "Origin");
	}
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
	if (req.method === "OPTIONS") {
		return res.sendStatus(204);
	}
	next();
});

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(morgan("dev"));

app.use("/api/v1",appRouter);

export default app;
