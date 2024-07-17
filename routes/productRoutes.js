import express from "express"
import { createProduct, fetchProductById, fetchProducts, updateProduct } from "../controllers/productController.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", fetchProducts);
router.get("/:id", fetchProductById);
router.patch("/:id", updateProduct);


export default router;