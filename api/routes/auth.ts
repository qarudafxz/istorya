/* eslint-disable @typescript-eslint/ban-ts-comment */
import express from "express";
//@ts-ignore
import { login, signup } from "../controllers/auth.ts";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

export { router as auth };
