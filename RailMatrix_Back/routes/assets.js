// // routes/assets.js
// const express = require("express");
// const router = express.Router();
// const { registerPart } = require("../controllers/assetsController");
// const { bulkImport } = require('../controllers/assetsController');
// const { bulkImportAndDownload } = require('../controllers/bulkDownloadController');
// const Part = require('../models/Part');


// router.post("/register", registerPart);
// router.get("/qr/:uid", async (req, res) => {
//   try {
//     const part = await Part.findOne({ uid_payload: req.params.uid })
//     if (!part || !part.qr_png) 
//       return res.status(404).send("QR not found")
//     res.set("Content-Type", "image/png")
//     res.send(part.qr_png)
//   } catch (e) {
//     res.status(500).send("Error retrieving QR")
//   }
// })

// router.post('/bulk-import', bulkImport);
// router.post('/bulk-download', bulkImportAndDownload);



// module.exports = router;

// routes/assets.js
import express from "express";
import { registerPart, bulkImport } from "../controller/assetsController.js";
import { bulkImportAndDownload } from "../controller/bulkDownloadController.js";
import Part from "../model/from.model.js";

const router = express.Router();

router.post("/register", registerPart);

router.get("/qr/:uid", async (req, res) => {
  try {
    const part = await Part.findOne({ uid_payload: req.params.uid });
    if (!part || !part.qr_png) {
      return res.status(404).send("QR not found");
    }
    res.set("Content-Type", "image/png");
    res.send(part.qr_png);
  } catch (e) {
    res.status(500).send("Error retrieving QR");
  }
});

router.post("/bulk-import", bulkImport);
router.post("/bulk-download", bulkImportAndDownload);

export default router;
