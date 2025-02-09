import express from "express"
import passport from "passport";
import { checkAuth, createUser, loginUser, logoutUser } from "../controllers/authController.js";
import { isAuth } from "../index.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login",  loginUser);
router.get("/check", isAuth(), checkAuth);
router.get("/logout", logoutUser);

export default router;