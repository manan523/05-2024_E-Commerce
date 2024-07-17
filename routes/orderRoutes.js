import express from "express"
import { createOrder, fetchAllOrders, fetchUserOrders, updateOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", fetchAllOrders);
router.get("/my", fetchUserOrders);
router.patch("/:id", updateOrder);

export default router;