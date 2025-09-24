// const crypto = require("crypto");
// const QRCode = require("qrcode");
// const Part = require("../models/Part");

// const SECRET_KEY = process.env.SECRET_KEY;

// // UID generation 
// function generateUID({ itemType, vendorId, lotNo, manufactureDate }) {
//   const typeMap = { Clip: "C", Pad: "P", Liner: "L", Sleeper: "S" };
//   const lookupType = typeof itemType === "string"
//     ? itemType.charAt(0).toUpperCase() + itemType.slice(1).toLowerCase()
//     : "";
//   const typeCode = typeMap[lookupType] || "X";

//   const vendorStr = (vendorId ?? "").toString().toUpperCase();
//   const vendor = vendorStr.padStart(3, "0").substring(0, 3);
//   const lotStr = (lotNo ?? "").toString().toUpperCase();
//   const lot = lotStr.padStart(4, "0").substring(0, 4);

//   let dt = manufactureDate ? new Date(manufactureDate) : new Date();
//   let yy = dt.getFullYear().toString().slice(-2);
//   let julian = String(
//     Math.floor((dt - new Date(dt.getFullYear(), 0, 0)) / 86400000)
//   ).padStart(3, "0");
//   const dateCode = yy + julian;

//   return `${typeCode}-${vendor}-${lot}-${dateCode}`;
// }

// // Compute the HMAC 
// function computeHMAC(message) {
//   return crypto
//     .createHmac("sha256", SECRET_KEY)
//     .update(message)
//     .digest("base64url"); // URL-safe Base64 encoding
// }


// exports.registerPart = async (req, res) => {
//   try {
//     const data = req.body;

//     if (!data || Object.keys(data).length === 0) {
//       return res.status(400).json({ success: false, error: "Empty request body" });
//     }

//     const { itemType, vendorId, lotNo, manufactureDate } = {
//       itemType: data.item_type,
//       vendorId: data.vendor_id,
//       lotNo: data.lot_no,
//       manufactureDate: data.manufacture_date,
//     };

//     if (!itemType || !vendorId || !lotNo) {
//       return res.status(400).json({ success: false, error: "Missing required fields" });
//     }

//     const uid = generateUID({ itemType, vendorId, lotNo, manufactureDate });
//     const hmac = computeHMAC(uid);

//     const qrContent = `${uid}.${hmac}`; 
//     data.uid = uid; // 

//     // Generate SVG QR code for combined content
//     const qrSvg = await QRCode.toString(qrContent, { type: "svg" });

//     // Store in MongoDB document
//     const newPart = new Part({
//       ...data,
//       uid_payload: uid,      // Store only UID
//       qr_svg: qrSvg, // Store SVG string encoding uid+hmac
//     });

//     await newPart.save();

//     res.status(201).json({
//       success: true,
//       data: newPart,
//       qrCodeSvg: qrSvg, 
//     });
//   } catch (err) {
//     console.error("Error in register:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// exports.bulkImport = async (req, res) => {
//   const { batchName, items } = req.body;
//   console.log("batchname:", batchName);
//   console.log("Received items:", items);

//   if (!batchName || !Array.isArray(items)) {
//     return res.status(400).json({ error: "Missing batchName or items" });
//   }

//   try {
//     const docs = await Promise.all(
//      items.map(async (item) => {
//         const uid = generateUID({
//           itemType: item.item_type,
//           vendorId: item.vendor_id,
//           lotNo: item.lot_no,
//           manufactureDate: item.manufacture_date,
//         });
//         const hmac = computeHMAC(uid);
//         const qrContent = `${uid}.${hmac}`;
//         const qrSvg = await QRCode.toString(qrContent, { type: "svg" });
//         // normalize critical types
//         const normalizedItem = {
//           ...item,
//           weight_g: item.weight_g ? Number(item.weight_g) : undefined,
//           warranty_months: item.warranty_months
//             ? Number(item.warranty_months)
//             : undefined,
//           expected_life_years: item.expected_life_years
//             ? Number(item.expected_life_years)
//             : undefined,
//           qc_pass: item.qc_pass === true || item.qc_pass === "true",
//         };

//         const part = new Part({
//           ...normalizedItem,
//           batch_name: batchName,
//           uid_payload: uid,
//           qr_svg: qrSvg,
//         });

//         return part.save(); 
//       })
//     );

//     res.json({ success: true, count: docs.length });
//   } catch (err) {
//     console.error(" Bulk import error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.generateUID = generateUID;
// exports.computeHMAC = computeHMAC;

import crypto from "crypto";
import QRCode from "qrcode";
import Part from "../model/from.model.js"; // make sure to include .js if using ES modules
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

// UID generation 
export function generateUID({ itemType, vendorId, lotNo, manufactureDate }) {
  const typeMap = { Clip: "C", Pad: "P", Liner: "L", Sleeper: "S" };
  const lookupType = typeof itemType === "string"
    ? itemType.charAt(0).toUpperCase() + itemType.slice(1).toLowerCase()
    : "";
  const typeCode = typeMap[lookupType] || "X";

  const vendorStr = (vendorId ?? "").toString().toUpperCase();
  const vendor = vendorStr.padStart(3, "0").substring(0, 3);
  const lotStr = (lotNo ?? "").toString().toUpperCase();
  const lot = lotStr.padStart(4, "0").substring(0, 4);

  let dt = manufactureDate ? new Date(manufactureDate) : new Date();
  let yy = dt.getFullYear().toString().slice(-2);
  let julian = String(
    Math.floor((dt - new Date(dt.getFullYear(), 0, 0)) / 86400000)
  ).padStart(3, "0");
  const dateCode = yy + julian;

  return `${typeCode}-${vendor}-${lot}-${dateCode}`;
}

// Compute the HMAC 
export function computeHMAC(message) {
  return crypto
    .createHmac("sha256", SECRET_KEY)
    .update(message)
    .digest("base64url"); // URL-safe Base64 encoding
}

// Register single part
export const registerPart = async (req, res) => {
  try {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ success: false, error: "Empty request body" });
    }

    const { itemType, vendorId, lotNo, manufactureDate } = {
      itemType: data.item_type,
      vendorId: data.vendor_id,
      lotNo: data.lot_no,
      manufactureDate: data.manufacture_date,
    };

    if (!itemType || !vendorId || !lotNo) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const uid = generateUID({ itemType, vendorId, lotNo, manufactureDate });
    const hmac = computeHMAC(uid);

    const qrContent = `${uid}.${hmac}`;
    data.uid = uid;

    // Generate SVG QR code
    const qrSvg = await QRCode.toString(qrContent, { type: "svg" });

    const newPart = new Part({
      ...data,
      uid_payload: uid,
      qr_svg: qrSvg,
    });

    await newPart.save();

    res.status(201).json({
      success: true,
      data: newPart,
      qrCodeSvg: qrSvg,
    });
  } catch (err) {
    console.error("Error in register:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Bulk import parts
export const bulkImport = async (req, res) => {
  const { batchName, items } = req.body;
  console.log("batchname:", batchName);
  console.log("Received items:", items);

  if (!batchName || !Array.isArray(items)) {
    return res.status(400).json({ error: "Missing batchName or items" });
  }

  try {
    const docs = await Promise.all(
      items.map(async (item) => {
        const uid = generateUID({
          itemType: item.item_type,
          vendorId: item.vendor_id,
          lotNo: item.lot_no,
          manufactureDate: item.manufacture_date,
        });
        const hmac = computeHMAC(uid);
        const qrContent = `${uid}.${hmac}`;
        const qrSvg = await QRCode.toString(qrContent, { type: "svg" });

        const normalizedItem = {
          ...item,
          weight_g: item.weight_g ? Number(item.weight_g) : undefined,
          warranty_months: item.warranty_months
            ? Number(item.warranty_months)
            : undefined,
          expected_life_years: item.expected_life_years
            ? Number(item.expected_life_years)
            : undefined,
          qc_pass: item.qc_pass === true || item.qc_pass === "true",
        };

        const part = new Part({
          ...normalizedItem,
          batch_name: batchName,
          uid_payload: uid,
          qr_svg: qrSvg,
        });

        return part.save();
      })
    );

    res.json({ success: true, count: docs.length });
  } catch (err) {
    console.error("Bulk import error:", err);
    res.status(500).json({ error: err.message });
  }
};
