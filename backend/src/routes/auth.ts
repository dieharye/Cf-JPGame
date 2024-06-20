import { Router } from "express";
import {signUp, signIn, signOut} from "../controllers/authController"

const router = Router()

router.post("/signup", signUp);

export default router;