// import Item from '../model/from.model.js'
// import QRCode from 'qrcode';
// import uploadOnCloudinary from '../utils/cloudinary.js'

// export const createItem = async (req, res) => {
//   try {
//     const data = req.body;
//     const {
//       uid_payload,
//       serial_number,
//       item_type,
//       vendor_id,
//       vendor_name,
//       po_number,
//       lot_no,
//       manufacture_date,
//       supply_date,
//       material,
//       dimensions,
//       weight_g,
//       surface_finish,
//       qc_pass,
//       qc_cert_no,
//       batch_quality_grade,
//       warranty_months,
//       expected_life_years,
//       inspection_notes
//     } = data;

//     if (
//       !uid_payload ||
//       !serial_number ||
//       !item_type ||
//       !vendor_id ||
//       !vendor_name ||
//       !po_number ||
//       !lot_no ||
//       !manufacture_date ||
//       !supply_date ||
//       !material ||
//       !dimensions ||
//       !weight_g ||
//       !surface_finish ||
//       !qc_cert_no ||
//       !batch_quality_grade ||
//       !warranty_months ||
//       !expected_life_years ||
//       !inspection_notes
//     ) {
//       return res.status(400).json({ message: "Please fill all required fields" });
//     }

//     const qrDataUrl = await QRCode.toDataURL(JSON.stringify({
//       uid_payload,
//       serial_number,
//       item_type,
//       vendor_id,
//       vendor_name,
//       po_number,
//       lot_no,
//       manufacture_date,
//       supply_date,
//       material,
//       dimensions,
//       weight_g,
//       surface_finish,
//       qc_cert_no,
//       batch_quality_grade,
//       warranty_months,
//       expected_life_years,
//       inspection_notes
//     }));

//     const uploaded = await uploadOnCloudinary(qrDataUrl);
//     // console.log(uploaded)

//     const newItem = new Item({
//       ...data,
//       qc_pass: qc_pass || false,
//       qr_svg: uploaded
//     });

//     const savedItem = await newItem.save();
//     res.status(201).json(savedItem);

//   } catch (error) {
//     console.error("Error creating item:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

import Item from '../model/from.model.js';
import QRCode from 'qrcode';

export const createItem = async (req, res) => {
  try {
    const data = req.body;
    const {
      uid_payload,
      serial_number,
      item_type,
      vendor_id,
      vendor_name,
      po_number,
      lot_no,
      manufacture_date,
      supply_date,
      material,
      dimensions,
      weight_g,
      surface_finish,
      qc_pass,
      qc_cert_no,
      batch_quality_grade,
      warranty_months,
      expected_life_years,
      inspection_notes
    } = data;

    if (
      !uid_payload ||
      !serial_number ||
      !item_type ||
      !vendor_id ||
      !vendor_name ||
      !po_number ||
      !lot_no ||
      !manufacture_date ||
      !supply_date ||
      !material ||
      !dimensions ||
      !weight_g ||
      !surface_finish ||
      !qc_cert_no ||
      !batch_quality_grade ||
      !warranty_months ||
      !expected_life_years ||
      !inspection_notes
    ) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Generate QR SVG
    const qrSvg = await QRCode.toString(JSON.stringify({
      uid_payload,
      serial_number,
      item_type,
      vendor_id,
      vendor_name,
      po_number,
      lot_no,
      manufacture_date,
      supply_date,
      material,
      dimensions,
      weight_g,
      surface_finish,
      qc_cert_no,
      batch_quality_grade,
      warranty_months,
      expected_life_years,
      inspection_notes
    }), { type: "svg" });

    const newItem = new Item({
      ...data,
      qc_pass: qc_pass || false,
      qr_svg: qrSvg
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);

  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
