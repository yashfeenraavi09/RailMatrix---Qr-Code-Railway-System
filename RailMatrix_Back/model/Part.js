// const mongoose = require("mongoose");

// const partSchema = new mongoose.Schema({
//   uid_payload: { type: String, required: true, unique: true },
//   item_type: String,
//   vendor_id: String,
//   vendor_name: String,
//   po_number: String,
//   lot_no: String,
//   manufacture_date: Date,
//   supply_date: Date,
//   material: String,
//   dimensions: String,
//   weight_g: Number,
//   surface_finish: String,
//   qr_svg: String, 
//   qc_pass: Boolean,
//   qc_cert_no: String,
//   batch_quality_grade: String,
//   warranty_months: Number,
//   expected_life_years: Number,
//   inspection_notes: String,
//   batch_name: { type: String },
//   created_at: { type: Date, default: Date.now },
// });

// const Part = mongoose.model("Part", partSchema, "parts");

// module.exports = Part;

import mongoose from "mongoose";

const partSchema = new mongoose.Schema({
  uid_payload: { type: String, required: true, unique: true },
  item_type: String,
  vendor_id: String,
  vendor_name: String,
  po_number: String,
  lot_no: String,
  manufacture_date: Date,
  supply_date: Date,
  material: String,
  dimensions: String,
  weight_g: Number,
  surface_finish: String,
  qr_svg: String,
  qc_pass: Boolean,
  qc_cert_no: String,
  batch_quality_grade: String,
  warranty_months: Number,
  expected_life_years: Number,
  inspection_notes: String,
  batch_name: { type: String },
  created_at: { type: Date, default: Date.now },
});

const Part = mongoose.model("Part", partSchema, "parts");

export default Part;
