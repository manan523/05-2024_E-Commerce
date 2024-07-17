import express from "express"
import { fetchUserInfo, updateUser } from "../controllers/userController.js";

const router = express.Router();

router.patch("/", updateUser);
router.get("/", fetchUserInfo);


export default router;