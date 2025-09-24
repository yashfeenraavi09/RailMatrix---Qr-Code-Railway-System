import mongoose from "mongoose";

const WarrantySchema = new mongoose.Schema({
  component: { type: String, required: true },
  status: { type: String, enum: ["Under Review", "Approved", "Rejected"], default: "Under Review" },
  reportedBy: { type: String }
});

export default mongoose.model("Warranty", WarrantySchema);
