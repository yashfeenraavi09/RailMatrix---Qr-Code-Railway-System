import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  item_name: { type: String, required: true },
  stock: { type: Number, default: 0 },
  allocated: { type: Number, default: 0 },
  available: { type: Number, default: 0 },
  reorder_level: { type: Number, default: 10 }
});

export default mongoose.model("Inventory", InventorySchema);
