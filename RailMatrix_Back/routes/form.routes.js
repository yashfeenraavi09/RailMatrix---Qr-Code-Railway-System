import express from "express";
import { createItem } from '../controller/from.controller.js'

const router = express.Router();

// POST /api/items
router.post("/", createItem);

export default router;
