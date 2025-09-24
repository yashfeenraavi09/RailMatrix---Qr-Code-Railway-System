import mongoose from "mongoose";

const DispatchSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  status: { type: String, enum: ["Ready", "In Transit", "Delivered"], default: "Ready" }
});

export default mongoose.model("Dispatch", DispatchSchema);
