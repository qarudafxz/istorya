import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import { auth } from "./routes/auth.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	})
);
app.use(morgan("tiny"));
app.disable("x-powered-by");
app.use("/api/auth", auth);

app.listen(port, () => console.log(`Server is running on port ${port}`));
