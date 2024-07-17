import express from "express"
import {fetchBrands } from "../controllers/brandController.js";
const router = express.Router();

router.get("/", fetchBrands);

export default router;