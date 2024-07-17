import express from "express"
import { addToCart, deleteCart, fetchCartByUser, updateCart } from "../controllers/cartController.js";

const router = express.Router();

router.post("/", addToCart);
router.get("/", fetchCartByUser);
router.patch("/:id", updateCart);
router.delete("/:id", deleteCart);

export default router;