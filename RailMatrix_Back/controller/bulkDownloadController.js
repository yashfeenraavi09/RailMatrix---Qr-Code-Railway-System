// const fs = require("fs");
// const path = require("path");
// const archiver = require("archiver");
// const QRCode = require("qrcode");
// const { stringify } = require("csv-stringify/sync");


// const { generateUID, computeHMAC } = require("./assetsController");


// exports.bulkImportAndDownload = async (req, res) => {
//     const { batchName, items } = req.body;


//     if (!batchName || !Array.isArray(items) || items.length === 0) {
//         return res.status(400).json({ error: "Missing batchName or items" });
//     }


//     // Create temporary folders
//     const tmpDir = path.join(__dirname, "..", "temp", `${batchName}_${Date.now()}`);
//     const qrsDir = path.join(tmpDir, "qrs");
//     fs.mkdirSync(qrsDir, { recursive: true });


//     const csvRows = [];
//     const catalogRows = [];


//     try {
//         // Generate QR codes, CSV rows, and collect catalog data
//         for (const item of items) {
//             const uid = generateUID({
//                 itemType: item.item_type,
//                 vendorId: item.vendor_id,
//                 lotNo: item.lot_no,
//                 manufactureDate: item.manufacture_date,
//             });


//             const hmac = computeHMAC(uid);
//             const qrContent = `${uid}.${hmac}`;
//             const qrFileName = `${uid}.svg`;
//             const qrFilePath = path.join(qrsDir, qrFileName);


//             const qrSvg = await QRCode.toString(qrContent, { type: "svg" });
//             fs.writeFileSync(qrFilePath, qrSvg);


//             csvRows.push({
//                 ComponentID: uid,
//                 Payload: qrContent,
//                 QRFileName: qrFileName,
//             });


//             catalogRows.push({ uid, qrSvg, payload: qrContent });
//         }


//         // Create Master.csv
//         const masterCsvPath = path.join(tmpDir, "Master.csv");
//         const csvString = stringify(csvRows, { header: true });
//         fs.writeFileSync(masterCsvPath, csvString);


//         // Generate Catalog.svg content
//         function makeCatalogSVG(rows) {
//             const width = 800, rowHeight = 150;
//             const height = rows.length * rowHeight + 80;
//             return `
// <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
//   <text x="20" y="40" font-size="32">RailMatrix – Bulk QR Catalog</text>
//   ${rows.map((row, i) => `
//     <g>
//       <foreignObject x="20" y="${80 + i * rowHeight}" width="120" height="120">
//         ${row.qrSvg.replace(/^<\?xml[^>]+\?>/, '').replace('<svg', '<svg height="120" width="120"')}
//       </foreignObject>
//       <text x="160" y="${110 + i * rowHeight}" font-size="18" font-weight="bold">Component:</text>
//       <text x="280" y="${110 + i * rowHeight}" font-size="18">${row.uid}</text>
//       <text x="160" y="${140 + i * rowHeight}" font-size="16">Payload:</text>
//       <text x="280" y="${140 + i * rowHeight}" font-size="15">${row.payload}</text>
//     </g>
//   `).join('')}
//   <text x="20" y="${height - 20}" font-size="12">Generated: ${new Date().toISOString()}   Total: ${rows.length}</text>
// </svg>
// `;
//         }


//         const catalogSvgContent = makeCatalogSVG(catalogRows);
//         const catalogSvgPath = path.join(tmpDir, "Catalog.svg");
//         fs.writeFileSync(catalogSvgPath, catalogSvgContent);


//         const zipFileName = `${batchName}_${Date.now()}.zip`;
//         res.setHeader("Content-Disposition", `attachment; filename="${zipFileName}"`);
//         res.setHeader("Content-Type", "application/zip");


//         const archive = archiver("zip", { zlib: { level: 9 } });
//         archive.pipe(res);


//         archive.directory(tmpDir, false);
//         await archive.finalize();



//         archive.on("end", () => {
//             if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
//         });
//     } catch (err) {
//         console.error("❌ Bulk download error:", err);
//         if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
//         res.status(500).json({ error: err.message });
//     }
// };

import fs from "fs";
import path from "path";
import archiver from "archiver";
import QRCode from "qrcode";
import { stringify } from "csv-stringify/sync";

import { generateUID, computeHMAC } from "./assetsController.js";

// Bulk Import + Download as ZIP
export const bulkImportAndDownload = async (req, res) => {
    const { batchName, items } = req.body;

    if (!batchName || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Missing batchName or items" });
    }

    // Create temporary folders
    const tmpDir = path.join(
        path.dirname(new URL(import.meta.url).pathname),
        "..",
        "temp",
        `${batchName}_${Date.now()}`
    );
    const qrsDir = path.join(tmpDir, "qrs");
    fs.mkdirSync(qrsDir, { recursive: true });

    const csvRows = [];
    const catalogRows = [];

    try {
        // Generate QR codes, CSV rows, and collect catalog data
        for (const item of items) {
            const uid = generateUID({
                itemType: item.item_type,
                vendorId: item.vendor_id,
                lotNo: item.lot_no,
                manufactureDate: item.manufacture_date,
            });

            const hmac = computeHMAC(uid);
            const qrContent = `${uid}.${hmac}`;
            const qrFileName = `${uid}.svg`;
            const qrFilePath = path.join(qrsDir, qrFileName);

            const qrSvg = await QRCode.toString(qrContent, { type: "svg" });
            fs.writeFileSync(qrFilePath, qrSvg);

            csvRows.push({
                ComponentID: uid,
                Payload: qrContent,
                QRFileName: qrFileName,
            });

            catalogRows.push({ uid, qrSvg, payload: qrContent });
        }

        // Create Master.csv
        const masterCsvPath = path.join(tmpDir, "Master.csv");
        const csvString = stringify(csvRows, { header: true });
        fs.writeFileSync(masterCsvPath, csvString);

        // Generate Catalog.svg
        function makeCatalogSVG(rows) {
            const width = 800,
                rowHeight = 150;
            const height = rows.length * rowHeight + 80;
            return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <text x="20" y="40" font-size="32">RailMatrix – Bulk QR Catalog</text>
  ${rows
                    .map(
                        (row, i) => `
    <g>
      <foreignObject x="20" y="${80 + i * rowHeight}" width="120" height="120">
        ${row.qrSvg
                                .replace(/^<\?xml[^>]+\?>/, "")
                                .replace("<svg", '<svg height="120" width="120"')}
      </foreignObject>
      <text x="160" y="${110 + i * rowHeight}" font-size="18" font-weight="bold">Component:</text>
      <text x="280" y="${110 + i * rowHeight}" font-size="18">${row.uid}</text>
      <text x="160" y="${140 + i * rowHeight}" font-size="16">Payload:</text>
      <text x="280" y="${140 + i * rowHeight}" font-size="15">${row.payload}</text>
    </g>
  `
                    )
                    .join("")}
  <text x="20" y="${height - 20}" font-size="12">Generated: ${new Date().toISOString()}   Total: ${rows.length}</text>
</svg>
`;
        }

        const catalogSvgContent = makeCatalogSVG(catalogRows);
        const catalogSvgPath = path.join(tmpDir, "Catalog.svg");
        fs.writeFileSync(catalogSvgPath, catalogSvgContent);

        const zipFileName = `${batchName}_${Date.now()}.zip`;
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${zipFileName}"`
        );
        res.setHeader("Content-Type", "application/zip");

        const archive = archiver("zip", { zlib: { level: 9 } });
        archive.pipe(res);

        archive.directory(tmpDir, false);
        await archive.finalize();

        archive.on("end", () => {
            if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
        });
    } catch (err) {
        console.error("❌ Bulk download error:", err);
        if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
        res.status(500).json({ error: err.message });
    }
};
