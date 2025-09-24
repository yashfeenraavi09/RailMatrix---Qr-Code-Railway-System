import express from "express";
import {
  getInventory,
  getDispatchOrders,
  updateDispatch,
  getWarrantyClaims,
  processWarranty
} from '../controller/depot.controller.js'

const router = express.Router();

// Inventory
router.get("/inventory", getInventory);

// Dispatch
router.get("/dispatch", getDispatchOrders);
router.post("/dispatch_update", updateDispatch);

// Warranty
router.get("/warranty", getWarrantyClaims);
router.post("/warranty_claim", processWarranty);

export default router;
