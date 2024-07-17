import express from "express"
import {fetchCategories } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", fetchCategories);

export default router;