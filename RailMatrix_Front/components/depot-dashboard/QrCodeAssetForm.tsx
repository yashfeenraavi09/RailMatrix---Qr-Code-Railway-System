// "use client";

// import { useState } from "react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import jsPDF from "jspdf";
// import Papa from "papaparse";

// // Convert SVG string to Base64 PNG for jsPDF
// const svgToBase64PNG = async (svg: string) => {
//   const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
//   const url = URL.createObjectURL(blob);
//   const img = new Image();
//   img.src = url;
//   await new Promise<void>((resolve) => {
//     img.onload = () => resolve();
//   });
//   const canvas = document.createElement("canvas");
//   canvas.width = img.width;
//   canvas.height = img.height;
//   const ctx = canvas.getContext("2d");
//   if (ctx) ctx.drawImage(img, 0, 0);
//   const pngDataUrl = canvas.toDataURL("image/png");
//   URL.revokeObjectURL(url);
//   return pngDataUrl;
// };

// export default function QrCodeAssetForm() {
//   const [activeTab, setActiveTab] = useState("manual");
//   const [formTab, setFormTab] = useState("identification");
//   const [qrCode, setQrCode] = useState<string | null>(null);
//   const [uid, setUid] = useState<string | null>(null);
//   const [autoPrint, setAutoPrint] = useState(true); // default: Yes

//   // For CSV Import
//   const [csvPreview, setCsvPreview] = useState<any | null>(null);

//   const [formData, setFormData] = useState({
//     assetCategory: "",
//     vendorId: "",
//     vendorName: "",
//     poNumber: "",
//     lotNo: "",
//     manufactureDate: "",
//     supplyDate: "",
//     material: "",
//     dimensions: "",
//     weight: "",
//     surfaceFinish: "",
//     qcPass: false,
//     qcCert: "",
//     qualityGrade: "",
//     warranty: "",
//     expectedLife: "",
//     inspectionNotes: "",
//   });

//   // Handle change for input/select/textarea
//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value, type } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         type === "checkbox" && e.target instanceof HTMLInputElement
//           ? e.target.checked
//           : value,
//     }));
//   };

//   // Handle CSV Upload (using PapaParse)
//   const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     Papa.parse(file, {
//       header: true, // use first row as column headers
//       skipEmptyLines: true,
//       complete: (result) => {
//         const columns = result.meta.fields || [];
//         const rows = result.data as any[];
//         setCsvPreview({ columns, rows });
//       },
//       error: (err) => {
//         console.error("CSV Parsing Error:", err);
//         alert("Failed to parse CSV file.");
//       },
//     });
//   };

//   // Generate QR
//   const handleGenerateQR = async () => {
//     try {
//       // --- Step 1: Type Code ---

//       // Normalize assetCategory to handle lowercase/extra spaces
//       const assetCategory = formData.assetCategory?.trim().toLowerCase();

//       const typeMap = {
//         clip: "C",
//         pad: "P",
//         liner: "L",
//         sleeper: "S",
//         bolt: "B",
//       };

//       const typeCode = typeMap[assetCategory as keyof typeof typeMap] || "X"; // fallback to X

//       // --- Step 2: Vendor Code (normalize to 3 chars) ---
//       let vendor = (formData.vendorId || "").toString().toUpperCase();
//       if (vendor.length < 3) vendor = vendor.padStart(3, "0");
//       if (vendor.length > 3) vendor = vendor.slice(0, 3);

//       // --- Step 3: Lot Number (normalize to 4 chars) ---
//       let lot = (formData.lotNo || "").toString().toUpperCase();
//       if (lot.length < 4) lot = lot.padStart(4, "0");
//       if (lot.length > 4) lot = lot.slice(0, 4);

//       // --- Step 4: Manufacture Date (yy + julian day) ---
//       const date = formData.manufactureDate
//         ? new Date(formData.manufactureDate)
//         : new Date();

//       const year = date.getFullYear().toString().slice(-2); // last 2 digits
//       const startOfYear = new Date(date.getFullYear(), 0, 0);
//       const diff = date.getTime() - startOfYear.getTime();
//       const oneDay = 1000 * 60 * 60 * 24;
//       const dayOfYear = Math.floor(diff / oneDay); // Julian day

//       const julian = String(dayOfYear).padStart(3, "0");

//       // --- Final UID ---
//       const uidPayload = `${typeCode}-${vendor}-${lot}-${year}${julian}`;

//       // --- Payload for backend ---
//       const payload = {
//         uid_payload: uidPayload,
//         serial_number: formData.assetCategory + "-" + Date.now(),
//         item_type: formData.assetCategory,
//         vendor_id: formData.vendorId,
//         vendor_name: formData.vendorName,
//         po_number: formData.poNumber,
//         lot_no: formData.lotNo,
//         manufacture_date: formData.manufactureDate,
//         supply_date: formData.supplyDate,
//         material: formData.material,
//         dimensions: formData.dimensions,
//         weight_g: Number(formData.weight),
//         surface_finish: formData.surfaceFinish,
//         qc_pass: formData.qcPass,
//         qc_cert_no: formData.qcCert,
//         batch_quality_grade: formData.qualityGrade,
//         warranty_months: Number(formData.warranty),
//         expected_life_years: Number(formData.expectedLife),
//         inspection_notes: formData.inspectionNotes,
//       };

//       const res = await fetch("http://localhost:5000/api/items", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       console.log("data", data);
//       setQrCode(data.qr_svg); //SVG string from backend
//       setUid(uidPayload);
//       alert("Item Created Successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Server Error");
//     }
//   };

//   // --- PDF Generation (using jsPDF) ---
//   const handleCreatePDF = async () => {
//     if (!uid || !qrCode) return alert("Generate UID & QR first!");

//     const pdf = new jsPDF({ unit: "mm", format: [100, 180] }); // taller format for more details

//     pdf.setDrawColor(0);
//     pdf.rect(5, 5, 90, 170); // border

//     // Title
//     pdf.setFontSize(18);
//     pdf.setFont("helvetica", "bold");
//     pdf.text(formData.assetCategory || "Asset", 50, 15, { align: "center" });

//     // QR Code
//     let qrImage = qrCode;
//     if (qrCode.startsWith("<svg")) {
//       // convert SVG to PNG
//       const svgBlob = new Blob([qrCode], {
//         type: "image/svg+xml;charset=utf-8",
//       });
//       const svgUrl = URL.createObjectURL(svgBlob);
//       const img = new Image();
//       img.src = svgUrl;
//       await new Promise((res) => {
//         img.onload = () => res(true);
//       });
//       const canvas = document.createElement("canvas");
//       canvas.width = img.width;
//       canvas.height = img.height;
//       const ctx = canvas.getContext("2d");
//       if (ctx) ctx.drawImage(img, 0, 0);
//       qrImage = canvas.toDataURL("image/png");
//       URL.revokeObjectURL(svgUrl);
//     }
//     pdf.addImage(qrImage, "PNG", 30, 20, 40, 40);

//     pdf.setFontSize(12);
//     pdf.setFont("helvetica", "normal");

//     let y = 65; // start Y position after QR

//     // Asset Info
//     pdf.setFont("helvetica", "bold");
//     pdf.text("Asset Info:", 10, y);
//     y += 6;
//     pdf.setFont("helvetica", "normal");
//     pdf.text(`UID: ${uid}`, 10, y);
//     y += 6;
//     pdf.text(`Category: ${formData.assetCategory}`, 10, y);
//     y += 6;
//     pdf.text(`Material: ${formData.material}`, 10, y);
//     y += 6;
//     pdf.text(`Dimensions: ${formData.dimensions}`, 10, y);
//     y += 6;
//     pdf.text(`Weight: ${formData.weight} g`, 10, y);
//     y += 6;
//     pdf.text(`Surface Finish: ${formData.surfaceFinish}`, 10, y);
//     y += 10;

//     // Manufacturing Info
//     pdf.setFont("helvetica", "bold");
//     pdf.text("Manufacturing Info:", 10, y);
//     y += 6;
//     pdf.setFont("helvetica", "normal");
//     pdf.text(`Manufacture Date: ${formData.manufactureDate}`, 10, y);
//     y += 6;
//     pdf.text(`Supply Date: ${formData.supplyDate}`, 10, y);
//     y += 6;
//     pdf.text(`PO Number: ${formData.poNumber}`, 10, y);
//     y += 6;
//     pdf.text(`Lot No: ${formData.lotNo}`, 10, y);
//     y += 10;

//     // QC Info
//     pdf.setFont("helvetica", "bold");
//     pdf.text("QC Info:", 10, y);
//     y += 6;
//     pdf.setFont("helvetica", "normal");
//     pdf.text(`QC Pass: ${formData.qcPass ? "Yes" : "No"}`, 10, y);
//     y += 6;
//     pdf.text(`QC Certificate: ${formData.qcCert}`, 10, y);
//     y += 6;
//     pdf.text(`Quality Grade: ${formData.qualityGrade}`, 10, y);
//     y += 6;
//     pdf.text(`Warranty: ${formData.warranty} months`, 10, y);
//     y += 6;
//     pdf.text(`Expected Life: ${formData.expectedLife} years`, 10, y);
//     y += 10;

//     // Inspection Notes
//     pdf.setFont("helvetica", "bold");
//     pdf.text("Inspection Notes:", 10, y);
//     y += 6;
//     pdf.setFont("helvetica", "normal");
//     const notes = formData.inspectionNotes || "-";
//     const splitNotes = pdf.splitTextToSize(notes, 80);
//     pdf.text(splitNotes, 10, y);

//     // Save PDF
//     pdf.save(`${formData.assetCategory || "Asset"}_label.pdf`);
//   };

//   // --- Export QR Label (smaller) ---
//   const handleExportQRLabel = async () => {
//     if (!uid || !qrCode) return alert("Generate UID & QR first!");

//     const pdf = new jsPDF({ unit: "mm", format: [60, 80] }); // small label size

//     // QR Code
//     let qrImage = qrCode;
//     if (qrCode.startsWith("<svg")) {
//       const svgBlob = new Blob([qrCode], {
//         type: "image/svg+xml;charset=utf-8",
//       });
//       const svgUrl = URL.createObjectURL(svgBlob);
//       const img = new Image();
//       img.src = svgUrl;
//       await new Promise((res) => {
//         img.onload = () => res(true);
//       });

//       const canvas = document.createElement("canvas");
//       canvas.width = img.width;
//       canvas.height = img.height;
//       const ctx = canvas.getContext("2d");
//       if (ctx) ctx.drawImage(img, 0, 0);
//       qrImage = canvas.toDataURL("image/png");
//       URL.revokeObjectURL(svgUrl);
//     }

//     pdf.addImage(qrImage, "PNG", 10, 10, 40, 40); // QR in center

//     // UID & Asset Category
//     pdf.setFontSize(10);
//     pdf.setFont("helvetica", "bold");
//     pdf.text(`UID: ${uid}`, 10, 55);
//     pdf.text(`Category: ${formData.assetCategory}`, 10, 63);

//     // Optional: Vendor or Lot
//     pdf.setFontSize(9);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(`Vendor: ${formData.vendorName}`, 10, 70);
//     pdf.text(`Lot: ${formData.lotNo}`, 10, 77);

//     pdf.save(`${formData.assetCategory || "Asset"}_QR_Label.pdf`);
//   };

//   // --- Print Asset Label (auto print dialog) ---
//   const handlePrintAssetLabelAuto = async () => {
//     if (!uid || !qrCode) return alert("Generate UID & QR first!");

//     // Create PDF
//     const pdf = new jsPDF({ unit: "mm", format: [100, 180] });

//     try {
//       // --- Convert SVG string (qrCode) into a PNG image ---
//       let qrImgDataUrl: string;
//       if (qrCode.startsWith("<svg")) {
//         const svgBlob = new Blob([qrCode], {
//           type: "image/svg+xml;charset=utf-8",
//         });
//         const svgUrl = URL.createObjectURL(svgBlob);

//         const img = await new Promise<HTMLImageElement>((resolve, reject) => {
//           const image = new Image();
//           image.onload = () => resolve(image);
//           image.onerror = reject;
//           image.src = svgUrl;
//         });

//         // draw SVG to canvas and export PNG
//         const canvas = document.createElement("canvas");
//         canvas.width = img.width;
//         canvas.height = img.height;
//         const ctx = canvas.getContext("2d");
//         ctx?.drawImage(img, 0, 0);
//         qrImgDataUrl = canvas.toDataURL("image/png");

//         URL.revokeObjectURL(svgUrl);
//       } else {
//         // If backend already gives PNG
//         qrImgDataUrl = qrCode;
//       }

//       // --- Add QR & details ---
//       let y = 5; // starting vertical position

//       // ✅ Now add QR as PNG
//       pdf.addImage(qrImgDataUrl, "PNG", 30, y, 40, 40);
//       // pdf.addImage(qrImgDataUrl, "PNG", 10, 10, 50, 50);
//       y += 45; // move y below QR

//       // Asset Info
//       pdf.setFontSize(12);
//       pdf.setFont("helvetica", "bold");
//       pdf.text("Asset Info:", 10, y);
//       y += 6;

//       pdf.setFont("helvetica", "normal");
//       pdf.text(`UID: ${uid}`, 10, y);
//       y += 6;
//       pdf.text(`Category: ${formData.assetCategory}`, 10, y);
//       y += 6;
//       pdf.text(`Material: ${formData.material}`, 10, y);
//       y += 6;
//       pdf.text(`Dimensions: ${formData.dimensions}`, 10, y);
//       y += 6;
//       pdf.text(`Weight: ${formData.weight} g`, 10, y);
//       y += 6;
//       pdf.text(`Surface Finish: ${formData.surfaceFinish}`, 10, y);
//       y += 10;

//       // Manufacturing Info
//       pdf.setFont("helvetica", "bold");
//       pdf.text("Manufacturing Info:", 10, y);
//       y += 6;
//       pdf.setFont("helvetica", "normal");
//       pdf.text(`Manufacture Date: ${formData.manufactureDate}`, 10, y);
//       y += 6;
//       pdf.text(`Supply Date: ${formData.supplyDate}`, 10, y);
//       y += 6;
//       pdf.text(`PO Number: ${formData.poNumber}`, 10, y);
//       y += 6;
//       pdf.text(`Lot No: ${formData.lotNo}`, 10, y);
//       y += 10;

//       // QC Info
//       pdf.setFont("helvetica", "bold");
//       pdf.text("QC & Warranty:", 10, y);
//       y += 6;
//       pdf.setFont("helvetica", "normal");
//       pdf.text(`QC Pass: ${formData.qcPass ? "Yes" : "No"}`, 10, y);
//       y += 6;
//       pdf.text(`QC Certificate: ${formData.qcCert}`, 10, y);
//       y += 6;
//       pdf.text(`Quality Grade: ${formData.qualityGrade}`, 10, y);
//       y += 6;
//       pdf.text(`Warranty: ${formData.warranty} months`, 10, y);
//       y += 6;
//       pdf.text(`Expected Life: ${formData.expectedLife} years`, 10, y);
//       y += 10;

//       // Inspection Notes
//       pdf.setFont("helvetica", "bold");
//       pdf.text("Inspection Notes:", 10, y);
//       y += 6;
//       pdf.setFont("helvetica", "normal");
//       const notes = formData.inspectionNotes || "-";
//       const lines = pdf.splitTextToSize(notes, 80); // wrap text within 80mm width
//       pdf.text(lines, 10, y);
//       y += lines.length * 6;

//       // ✅ Generate Blob and open in new tab
//       const pdfBlob = pdf.output("blob");
//       const pdfUrl = URL.createObjectURL(pdfBlob);

//       const printWindow = window.open(pdfUrl);
//       if (printWindow) {
//         printWindow.addEventListener("load", () => {
//           printWindow.focus();
//           printWindow.print();
//         });
//       }

//       // Remove iframe after printing OR Cleanup
//       setTimeout(() => URL.revokeObjectURL(pdfUrl), 2000);
//     } catch (error) {
//       console.error("Failed to generate PDF:", error);
//       alert("Failed to generate PDF. Check console for details.");
//     }
//   };

//   // Reset Form
//   const handleClearAll = () => {
//     setFormTab("identification");
//     setActiveTab("manual");
//     setQrCode(null);
//     setUid(null);
//     setFormData({
//       assetCategory: "",
//       vendorId: "",
//       vendorName: "",
//       poNumber: "",
//       lotNo: "",
//       manufactureDate: "",
//       supplyDate: "",
//       material: "",
//       dimensions: "",
//       weight: "",
//       surfaceFinish: "",
//       qcPass: false,
//       qcCert: "",
//       qualityGrade: "",
//       warranty: "",
//       expectedLife: "",
//       inspectionNotes: "",
//     });
//   };

//   // Submit Button
//   const handleSubmit = async () => {
//     try {
//       // 1️⃣ Form data validation (optional)
//       if (!uid || !qrCode) {
//         alert("Generate UID & QR first!");
//         return;
//       }

//       // 2️⃣ Payload prepare
//       const payload = {
//         uid_payload: uid,
//         serial_number: formData.assetCategory + "-" + Date.now(),
//         item_type: formData.assetCategory,
//         vendor_id: formData.vendorId,
//         vendor_name: formData.vendorName,
//         po_number: formData.poNumber,
//         lot_no: formData.lotNo,
//         manufacture_date: formData.manufactureDate,
//         supply_date: formData.supplyDate,
//         material: formData.material,
//         dimensions: formData.dimensions,
//         weight_g: Number(formData.weight),
//         surface_finish: formData.surfaceFinish,
//         qc_pass: formData.qcPass,
//         qc_cert_no: formData.qcCert,
//         batch_quality_grade: formData.qualityGrade,
//         warranty_months: Number(formData.warranty),
//         expected_life_years: Number(formData.expectedLife),
//         inspection_notes: formData.inspectionNotes,
//         qr_svg: qrCode,
//       };

//       // 3️⃣ Call backend
//       const res = await fetch("http://localhost:5000/api/items", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Failed to submit");

//       alert("Item submitted successfully ✅");

//       // 4️⃣ Optionally auto-print label
//       // if (data.qr_svg) {
//       //   handlePrintAssetLabelAuto();
//       // }
//       // handlePrintAssetLabelAuto();
//       // 5️⃣ Clear all fields
//       handleClearAll(); // This will reset formData, UID, QR code, and tabs
//     } catch (err: any) {
//       console.error("Submit error:", err);
//       alert("Submit failed: " + err.message);
//     }
//   };

//   const handleBulkImport = async () => {
//     if (!csvPreview?.rows?.length) return alert("No CSV data to import!");

//     for (const row of csvPreview.rows) {
//       try {
//         // --- Step 1: Generate UID ---
//         const assetCategory = (row.assetCategory || "").trim().toLowerCase();
//         const typeMap: Record<string, string> = {
//           clip: "C",
//           pad: "P",
//           liner: "L",
//           sleeper: "S",
//         };
//         const typeCode = typeMap[assetCategory] || "X";

//         let vendor = (row.vendorId || "")
//           .toString()
//           .toUpperCase()
//           .padStart(3, "0")
//           .slice(-3);
//         let lot = (row.lotNo || "")
//           .toString()
//           .toUpperCase()
//           .padStart(4, "0")
//           .slice(-4);

//         const date = row.manufactureDate
//           ? new Date(row.manufactureDate)
//           : new Date();
//         const year = date.getFullYear().toString().slice(-2);
//         const startOfYear = new Date(date.getFullYear(), 0, 0);
//         const dayOfYear = Math.floor(
//           (date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
//         );
//         const julian = String(dayOfYear).padStart(3, "0");

//         const uidPayload = `${typeCode}-${vendor}-${lot}-${year}${julian}`;

//         // --- Step 2: Generate QR ---
//         const payload = {
//           uid_payload: uidPayload,
//           serial_number: assetCategory + "-" + Date.now(),
//           item_type: assetCategory,
//           vendor_id: row.vendorId,
//           vendor_name: row.vendorName,
//           po_number: row.poNumber,
//           lot_no: row.lotNo,
//           manufacture_date: row.manufactureDate,
//           supply_date: row.supplyDate,
//           material: row.material,
//           dimensions: row.dimensions,
//           weight_g: Number(row.weight),
//           surface_finish: row.surfaceFinish,
//           qc_pass: row.qcPass === "true" || row.qcPass === true,
//           qc_cert_no: row.qcCert,
//           batch_quality_grade: row.qualityGrade,
//           warranty_months: Number(row.warranty),
//           expected_life_years: Number(row.expectedLife),
//           inspection_notes: row.inspectionNotes,
//         };

//         const res = await fetch("http://localhost:5000/api/items", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });

//         const data = await res.json();
//         if (res.ok) {
//           console.log(`Item submitted: ${uidPayload}`);

//           // --- Step 3: Auto-print if selected ---
//           if (autoPrint) {
//             setUid(uidPayload);
//             setQrCode(data.qr_svg);
//             await handlePrintAssetLabelAuto();
//           }
//         } else {
//           console.error(`Failed to submit row ${uidPayload}:`, data.message);
//         }
//       } catch (err) {
//         console.error("Bulk import error:", err);
//       }
//     }

//     alert("Bulk import completed!");
//     setCsvPreview(null); // Clear CSV preview after import
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="px-6 py-3 text-sm text-gray-700 border-b bg-white shadow-sm">
//         <span className="font-medium">Current Location:</span> Zone - Central
//         Railway | Division - Mumbai
//       </div>

//       <div className="flex">
//         {/* Left Section */}
//         <div className="w-2/3 border-r bg-white p-8">
//           <h2 className="text-3xl font-bold text-green-700 mb-6">
//             Asset Registration Form
//           </h2>

//           <Tabs
//             value={activeTab}
//             onValueChange={setActiveTab}
//             className="space-y-6"
//           >
//             {/* Manual / Bulk */}
//             <TabsList className="bg-gray-100 rounded-lg p-1 w-fit">
//               <TabsTrigger value="manual" className="px-4 py-2 rounded-md">
//                 Manual Entry
//               </TabsTrigger>
//               <TabsTrigger value="bulk" className="px-4 py-2 rounded-md">
//                 Bulk Import
//               </TabsTrigger>
//             </TabsList>

//             {/* Manual Entry */}
//             <TabsContent value="manual">
//               <Tabs
//                 value={formTab}
//                 onValueChange={setFormTab}
//                 className="space-y-6"
//               >
//                 {/* Sub-Tabs */}
//                 <TabsList className="bg-gray-100 rounded-lg p-1">
//                   <TabsTrigger
//                     value="identification"
//                     className="px-4 py-2 rounded-md"
//                   >
//                     Identification
//                   </TabsTrigger>
//                   <TabsTrigger
//                     value="manufacturing"
//                     className="px-4 py-2 rounded-md"
//                   >
//                     Manufacturing
//                   </TabsTrigger>
//                   <TabsTrigger value="qc" className="px-4 py-2 rounded-md">
//                     Quality Control
//                   </TabsTrigger>
//                   <TabsTrigger value="docs" className="px-4 py-2 rounded-md">
//                     Documentation
//                   </TabsTrigger>
//                 </TabsList>

//                 {/* Identification */}
//                 <TabsContent
//                   value="identification"
//                   className="grid grid-cols-2 gap-6 mt-4"
//                 >
//                   <div>
//                     <Label className="mb-2 block">Asset Category</Label>
//                     <Select
//                       onValueChange={(v) =>
//                         setFormData((p) => ({ ...p, assetCategory: v }))
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Clip" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="clip">Clip</SelectItem>
//                         <SelectItem value="pad">Pad</SelectItem>
//                         <SelectItem value="liner">Liner</SelectItem>
//                         <SelectItem value="sleeper">Sleeper</SelectItem>
//                         <SelectItem value="bolt">Bolt</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <Label className="mb-2 block">Vendor ID</Label>
//                     <Input
//                       name="vendorId"
//                       value={formData.vendorId}
//                       onChange={handleChange}
//                       placeholder="Enter 8-digit vendor code"
//                     />
//                   </div>
//                   <div>
//                     <Label className="mb-2 block">Vendor Name</Label>
//                     <Input
//                       name="vendorName"
//                       value={formData.vendorName}
//                       onChange={handleChange}
//                       placeholder="Authorized supplier name"
//                     />
//                   </div>
//                   <div>
//                     <Label className="mb-2 block">Purchase Order</Label>
//                     <Input
//                       name="poNumber"
//                       value={formData.poNumber}
//                       onChange={handleChange}
//                       placeholder="PO/WO reference number"
//                     />
//                   </div>
//                   <div>
//                     <Label className="mb-2 block">Batch/Lot No</Label>
//                     <Input
//                       name="lotNo"
//                       value={formData.lotNo}
//                       onChange={handleChange}
//                       placeholder="Manufacturing batch identifier"
//                     />
//                   </div>
//                 </TabsContent>

//                 {/* Manufacturing */}
//                 <TabsContent
//                   value="manufacturing"
//                   className="grid grid-cols-2 gap-6 mt-4"
//                 >
//                   <div>
//                     <Label className="mb-2 block">Manufacture Date</Label>
//                     <Input
//                       type="date"
//                       name="manufactureDate"
//                       value={formData.manufactureDate}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div>
//                     <Label className="mb-2 block">Supply Date</Label>
//                     <Input
//                       type="date"
//                       name="supplyDate"
//                       value={formData.supplyDate}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div>
//                     <Label className="mb-2 block">Base Material</Label>
//                     <Select
//                       onValueChange={(v) =>
//                         setFormData((p) => ({ ...p, material: v }))
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Spring Steel" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="steel">Spring Steel</SelectItem>
//                         <SelectItem value="rubber">Rubber EVA</SelectItem>
//                         <SelectItem value="hdpe">HDPE</SelectItem>
//                         <SelectItem value="concrete">Concrete</SelectItem>
//                         <SelectItem value="other">Other</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <Label className="mb-2 block">Dimensions</Label>
//                     <Input
//                       name="dimensions"
//                       value={formData.dimensions}
//                       onChange={handleChange}
//                       placeholder="Length × Width × Height (mm)"
//                     />
//                   </div>
//                   <div>
//                     <Label className="mb-2 block">Net Weight</Label>
//                     <Input
//                       name="weight"
//                       value={formData.weight}
//                       onChange={handleChange}
//                       placeholder="Weight in grams (g)"
//                     />
//                   </div>
//                   <div>
//                     <Label className="mb-2 block">Surface Finish</Label>
//                     <Select
//                       onValueChange={(v) =>
//                         setFormData((p) => ({ ...p, surfaceFinish: v }))
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Phosphated" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="phosphated">Phosphated</SelectItem>
//                         <SelectItem value="galvanized">Galvanized</SelectItem>
//                         <SelectItem value="painted">Painted</SelectItem>
//                         <SelectItem value="raw">Raw</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </TabsContent>

//                 {/* QC */}
//                 <TabsContent value="qc" className="grid grid-cols-2 gap-6 mt-4">
//                   <div className="col-span-2">
//                     <Label className="text-green-600 mb-2 block">
//                       QC Status
//                     </Label>
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         name="qcPass"
//                         checked={formData.qcPass}
//                         onChange={handleChange}
//                         className="h-4 w-4 text-green-600"
//                         title="Quality Control Passed"
//                       />
//                       <span className="text-green-600 font-semibold">
//                         Quality Control Passed
//                       </span>
//                     </div>
//                   </div>
//                   <div>
//                     <Label className="mb-2 block">QC Certificate</Label>
//                     <Input
//                       name="qcCert"
//                       value={formData.qcCert}
//                       onChange={handleChange}
//                       placeholder="QC certificate reference number"
//                     />
//                   </div>
//                   <div>
//                     <Label className="mb-2 block">Quality Grade</Label>
//                     <Select
//                       onValueChange={(v) =>
//                         setFormData((p) => ({ ...p, qualityGrade: v }))
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="A" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="a">A</SelectItem>
//                         <SelectItem value="b">B</SelectItem>
//                         <SelectItem value="c">C</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <Label className="mb-2 block">
//                       Warranty Period (months)
//                     </Label>
//                     <Input
//                       name="warranty"
//                       value={formData.warranty}
//                       onChange={handleChange}
//                       placeholder="12"
//                     />
//                   </div>
//                   <div>
//                     <Label className="mb-2 block">
//                       Expected Lifespan (years)
//                     </Label>
//                     <Input
//                       name="expectedLife"
//                       value={formData.expectedLife}
//                       onChange={handleChange}
//                       placeholder="8"
//                     />
//                   </div>
//                 </TabsContent>

//                 {/* Docs */}
//                 <TabsContent value="docs" className="mt-4 space-y-6">
//                   <div>
//                     <Label className="mb-2 block">
//                       Inspection Notes & Additional Comments
//                     </Label>
//                     <Textarea
//                       name="inspectionNotes"
//                       value={formData.inspectionNotes}
//                       onChange={handleChange}
//                       placeholder="Enter notes or instructions..."
//                       className="mt-2"
//                     />
//                   </div>

//                   <div className="flex gap-2 flex-wrap">
//                     <Button
//                       onClick={handleGenerateQR}
//                       className="bg-green-600 text-white"
//                     >
//                       Generate UID & QR
//                     </Button>
//                     <Button
//                       onClick={handlePrintAssetLabelAuto}
//                       className="bg-orange-600 text-white"
//                     >
//                       Print Asset Label
//                     </Button>
//                     <Button
//                       onClick={handleExportQRLabel}
//                       className="bg-green-600 text-white"
//                     >
//                       Export QR Label
//                     </Button>
//                     <Button
//                       onClick={handleCreatePDF}
//                       className="bg-purple-600 text-white"
//                     >
//                       Create PDF Label
//                     </Button>
//                     <Button
//                       onClick={handleSubmit}
//                       type="submit"
//                       className="bg-blue-600 text-white"
//                     >
//                       Submit
//                     </Button>
//                     <Button
//                       onClick={handleClearAll}
//                       className="bg-red-600 text-white"
//                     >
//                       Clear All Fields
//                     </Button>
//                   </div>
//                 </TabsContent>
//               </Tabs>
//             </TabsContent>

//             {/* Bulk Import */}
//             <TabsContent value="bulk" className="mt-6">
//               <div className="space-y-6">
//                 <div className="flex gap-3 items-center flex-wrap">
//                   <input
//                     type="file"
//                     accept=".csv"
//                     onChange={handleCsvUpload}
//                     className="hidden"
//                     id="csvUpload"
//                   />
//                   <label htmlFor="csvUpload">
//                     <Button asChild variant="secondary">
//                       <span>Select CSV...</span>
//                     </Button>
//                   </label>
//                   <Input placeholder="Batch name" className="w-1/3" />
//                   <Button variant="secondary">Map Columns</Button>
//                   <Button variant="secondary">Validate</Button>
//                   <Button
//                     disabled={!csvPreview}
//                     onClick={handleBulkImport}
//                     className="bg-green-600 text-white"
//                   >
//                     Start Import
//                   </Button>
//                 </div>

//                 <div className="border rounded-lg h-60 overflow-auto bg-gray-50">
//                   {!csvPreview ? (
//                     <div className="flex items-center justify-center h-full text-gray-500">
//                       No columns in table
//                     </div>
//                   ) : (
//                     <table className="min-w-full border-collapse">
//                       <thead className="bg-gray-200 sticky top-0">
//                         <tr>
//                           {csvPreview.columns.map((col: string) => (
//                             <th
//                               key={col}
//                               className="px-4 py-2 border text-left text-sm font-medium text-gray-700"
//                             >
//                               {col}
//                             </th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {csvPreview.rows.map((row: any, idx: number) => (
//                           <tr key={idx} className="even:bg-gray-100">
//                             {csvPreview.columns.map((col: string) => (
//                               <td
//                                 key={col}
//                                 className="px-4 py-2 border text-sm text-gray-700"
//                               >
//                                 {row[col] ?? ""}
//                               </td>
//                             ))}
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   )}
//                 </div>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>

//         {/* Right Section */}
//         <div className="w-1/3 bg-gray-50 p-6 flex flex-col gap-6">
//           {/* QR Preview */}
//           <div className="border rounded-xl bg-white shadow p-6 flex flex-col items-center justify-center text-gray-500 h-60">
//             {qrCode ? (
//               <>
//                 <div
//                   className="w-40 h-40 relative"
//                   dangerouslySetInnerHTML={{ __html: qrCode }} // render SVG properly
//                 ></div>
//                 <p className="font-medium text-gray-700">{uid}</p>
//               </>
//             ) : (
//               <>
//                 <p className="font-medium">No QR code loaded</p>
//                 <p className="text-sm">QR Code will appear here</p>
//               </>
//             )}
//           </div>

//           {/* QR Info */}
//           <div className="text-sm flex justify-between text-gray-600">
//             <span>
//               Format: <span className="font-medium">QR Code 2D</span>
//             </span>
//             <span>
//               Resolution: <span className="font-medium">300 DPI</span>
//             </span>
//           </div>

//           {/* System Log */}
//           <div className="border rounded-xl bg-white shadow p-4 text-sm">
//             <h3 className="font-semibold text-green-700 mb-2">
//               System Status & Activity Log
//             </h3>
//             <p className="text-gray-600">RailMatrix initialized.</p>
//             <div className="mt-2 text-green-600 font-medium">● Online</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import jsPDF from "jspdf";
import Papa from "papaparse";

export default function QrCodeAssetForm() {
  const [activeTab, setActiveTab] = useState("manual");
  const [formTab, setFormTab] = useState("identification");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [csvPreview, setCsvPreview] = useState<{
    columns: string[];
    rows: any[];
  } | null>(null);
  const [qrCodeSvg, setQrCodeSvg] = useState<string | null>(null);
  const [columnMap, setColumnMap] = useState<Record<string, string>>({});

  // Activity log state
  const [activityLog, setActivityLog] = useState<string[]>([
    "RailMatrix initialized.",
  ]);

  function addLog(entry: string) {
    setActivityLog((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()} - ${entry}`,
    ]);
  }

  // Form fields state
  const [assetCategory, setAssetCategory] = useState("clip");
  const [vendorId, setVendorId] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [purchaseOrder, setPurchaseOrder] = useState("");
  const [batchLotNo, setBatchLotNo] = useState("");
  const [manufactureDate, setManufactureDate] = useState("");
  const [supplyDate, setSupplyDate] = useState("");
  const [baseMaterial, setBaseMaterial] = useState("steel");
  const [dimensions, setDimensions] = useState("");
  const [netWeight, setNetWeight] = useState("");
  const [surfaceFinish, setSurfaceFinish] = useState("phosphated");
  const [qcPass, setQcPass] = useState(false);
  const [qcCertificate, setQcCertificate] = useState("");
  const [qualityGrade, setQualityGrade] = useState("a");
  const [warrantyPeriod, setWarrantyPeriod] = useState("");
  const [expectedLifespan, setExpectedLifespan] = useState("");
  const [inspectionNotes, setInspectionNotes] = useState("");
  const [csvRows, setCsvRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [batchName, setBatchName] = useState("");
  // const [columnMap, setColumnMap] = useState({});
  const [valid, setValid] = useState(false);

  async function handleSubmit() {
    const payload = {
      item_type: assetCategory
        ? assetCategory.charAt(0).toUpperCase() +
          assetCategory.slice(1).toLowerCase()
        : "",
      vendor_id: vendorId,
      vendor_name: vendorName,
      po_number: purchaseOrder,
      lot_no: batchLotNo,
      manufacture_date: manufactureDate,
      supply_date: supplyDate,
      material: baseMaterial,
      dimensions: dimensions,
      weight_g: Number(netWeight),
      surface_finish: surfaceFinish,
      qc_pass: qcPass,
      qc_cert_no: qcCertificate,
      batch_quality_grade: qualityGrade,
      warranty_months: Number(warrantyPeriod),
      expected_life_years: Number(expectedLifespan),
      inspection_notes: inspectionNotes,
    };

    try {
      // const res = await fetch("http://localhost:3001/api/assets/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      const res = await fetch("http://localhost:5000/api/assets/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        addLog(data.error || "Failed to save asset data.");
        alert(data.error || "Failed to register asset.");
        return;
      }

      setUid(data.data.uid_payload);
      setQrCodeSvg(data.qrCodeSvg);
      addLog(`Registered asset with UID: ${data.data.uid_payload}`);
      alert(`Asset registered successfully with UID: ${data.data.uid_payload}`);
    } catch (error) {
      addLog("Error submitting asset data.");
      alert(
        error instanceof Error
          ? error.message
          : "Unknown error submitting data."
      );
    }
  }

  function handleExportQr() {
    // Export SVG QR as file

    if (!qrCodeSvg) return;
    const blob = new Blob([qrCodeSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `QR_${uid || "unknown"}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addLog("SVG QR code exported.");
  }

  async function handleCreatePdfLabel() {
    if (!qrCodeSvg) return alert("No QR code to create.");

    // Create SVG Blob and URL
    const svgBlob = new Blob([qrCodeSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);

    // Load SVG into an Image element
    const img = new Image();
    img.src = url;
    img.width = 160;
    img.height = 160;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load SVG image"));
    });

    // Draw image on Canvas
    const canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 160;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      alert("Failed to get canvas context.");
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, 160, 160);
    URL.revokeObjectURL(url);

    const pngDataUrl = canvas.toDataURL("image/png");

    // Create PDF using jsPDF
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    const startX = 40;
    const startY = 40;
    const qrSize = 160;

    // Draw border
    doc.setDrawColor(50);
    doc.rect(startX - 10, startY - 10, 520, 220);

    // Add QR code image
    doc.addImage(pngDataUrl, "PNG", startX, startY, qrSize, qrSize);

    let textY = startY + 10;
    doc.setFontSize(16);

    // Add UID text
    doc.text("UID:", startX + qrSize + 30, textY);
    doc.setFont(undefined, "normal");
    doc.text(uid ?? "", startX + qrSize + 75, textY);

    // Increase Y pos and add Vendor text
    textY += 30;
    doc.setFont(undefined, "bold");
    doc.text("Vendor:", startX + qrSize + 30, textY);
    doc.setFont(undefined, "normal");
    doc.text(vendorName ?? "", startX + qrSize + 100, textY);

    // Add Lot text
    textY += 30;
    doc.setFont(undefined, "bold");
    doc.text("Lot:", startX + qrSize + 30, textY);
    doc.setFont(undefined, "normal");
    doc.text(batchLotNo ?? "", startX + qrSize + 75, textY);

    // Add Manufacture Date text
    textY += 30;
    doc.setFont(undefined, "bold");
    doc.text("Mfg:", startX + qrSize + 30, textY);
    doc.setFont(undefined, "normal");
    doc.text(manufactureDate ?? "", startX + qrSize + 75, textY);

    // Add Notes text
    textY += 30;
    doc.setFont(undefined, "bold");
    doc.text("Notes:", startX + qrSize + 30, textY);
    doc.setFont(undefined, "normal");
    doc.text(inspectionNotes ?? "", startX + qrSize + 75, textY);

    // Save the PDF file
    doc.save(`Asset_Label_${uid ?? "Unknown"}.pdf`);
    addLog("PDF label created and saved.");
  }

  function handlePrintAssetLabel() {
    if (!qrCodeSvg) {
      alert("No QR code available");
      return;
    }

    function svgToDataUrl(svgString: string): string {
      return (
        "data:image/svg+xml;base64," +
        window.btoa(unescape(encodeURIComponent(svgString)))
      );
    }

    const qrImgData = svgToDataUrl(qrCodeSvg);

    // Escape HTML helper
    const escapeHtml = (text: string) =>
      String(text ?? "").replace(
        /[<>&'"]/g,
        (c) =>
          ({
            "<": "&lt;",
            ">": "&gt;",
            "&": "&amp;",
            "'": "&#39;",
            '"': "&quot;",
          }[c])
      );

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Popup blocked; please allow popups for this site.");
      return;
    }

    printWindow.document.write(`
    <html>
      <head>
        <title>Print Asset Label</title>
        <style>
          body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .label-container { border: 2px solid #222; display: flex; flex-direction: row; padding: 24px 36px 24px 24px; font-size: 15px; }
          .qr-box { margin-right: 32px; display: flex; align-items: flex-start; }
          .qr-box img { width: 160px; height: 160px; }
          .info-box { font-family: Arial, sans-serif; color: #111; }
          .info-label { font-weight: bold; margin-right: 8px; }
          .row { margin-bottom: 14px; }
        </style>
      </head>
      <body>
        <div class="label-container">
          <div class="qr-box">
            <img src="${qrImgData}" alt="QR Code" />
          </div>
          <div class="info-box">
            <div class="row"><span class="info-label">UID:</span> ${escapeHtml(
              uid
            )}</div>
            <div class="row"><span class="info-label">Vendor:</span> ${escapeHtml(
              vendorName
            )}</div>
            <div class="row"><span class="info-label">Lot:</span> ${escapeHtml(
              batchLotNo
            )}</div>
            <div class="row"><span class="info-label">Mfg:</span> ${escapeHtml(
              manufactureDate
            )}</div>
            <div class="row"><span class="info-label">Notes:</span> ${escapeHtml(
              inspectionNotes
            )}</div>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.focus();
            window.print();
            window.close();
          };
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
    addLog("Print job initiated for asset label.");
  }

  async function parseCsvFile(
    file: File
  ): Promise<{ columns: string[]; rows: any[] }> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve({
            columns: results.meta.fields || [],
            rows: results.data,
          });
        },
        error: (err) => reject(err),
      });
    });
  }

  async function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await parseCsvFile(file);
    setCsvPreview({
      columns: result.columns,
      rows: result.rows,
    });
  }

  function handleMapColumns() {
    setColumnMap({
      item_type: "item_type",
      vendor_id: "vendor_id",
      vendor_name: "vendor_name",
      po_number: "po_number",
      lot_no: "lot_no",
      manufacture_date: "manufacture_date",
      supply_date: "supply_date",
      material: "material",
      dimensions: "dimensions",
      weight: "weight_g",
      surface_finish: "surface_finish",
      qc_pass: "qc_pass",
      qc_cert: "qc_cert_no",
      batch_grade: "batch_quality_grade",
      warranty: "warranty_months",
      expected_life: "expected_life_years",
      inspection_notes: "inspection_notes",
    });
    setActivityLog((log) => [...log, "Mapped succesfully"]);
  }

  function handleValidate() {
    if (!batchName) {
      setActivityLog((log) => [...log, "Batch name is mandatory"]);
      setValid(false);
    } else {
      setValid(true);
      setActivityLog((log) => [...log, "Validation passed"]);
    }
  }

  async function handleStartImport() {
    if (!valid) {
      setActivityLog((log) => [...log, "Cannot import, validation failed"]);
      return;
    }

    if (!csvPreview || !csvPreview.rows) {
      setActivityLog((log) => [...log, "No CSV rows to import"]);
      return;
    }

    const mappedItems = csvPreview.rows.map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([k, v]) => [columnMap[k] || k, v])
      )
    );

    console.log("Payload to backend:", { batchName, items: mappedItems });
    console.log("Mapped items for import:", mappedItems);

    // const res = await fetch("http://localhost:3001/api/assets/bulk-import", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ batchName, items: mappedItems }),
    // });
    const res = await fetch("http://localhost:5000/api/assets/bulk-import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batchName, items: mappedItems }),
    });

    const data = await res.json();
    setActivityLog((log) => [...log, `Imported ${data.count} items`]);

    // const downloadRes = await fetch("http://localhost:3001/api/assets/bulk-download", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ batchName, items: mappedItems }),
    // });
    const downloadRes = await fetch(
      "http://localhost:5000/api/assets/bulk-download",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchName, items: mappedItems }),
      }
    );

    if (!downloadRes.ok) {
      const errorData = await downloadRes.json();
      setActivityLog((log) => [...log, `Download failed: ${errorData.error}`]);
      return;
    }

    // Convert response to blob and trigger browser download
    const blob = await downloadRes.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${batchName}_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    setActivityLog((log) => [...log, "Bulk download triggered successfully"]);
  }

  function handleClearAll() {
    setFormTab("identification");
    setActiveTab("manual");
    setQrCodeSvg(null);
    setUid(null);
    setCsvPreview(null);
    setAssetCategory("clip");
    setVendorId("");
    setVendorName("");
    setPurchaseOrder("");
    setBatchLotNo("");
    setManufactureDate("");
    setSupplyDate("");
    setBaseMaterial("steel");
    setDimensions("");
    setNetWeight("");
    setSurfaceFinish("phosphated");
    setQcPass(false);
    setQcCertificate("");
    setQualityGrade("a");
    setWarrantyPeriod("");
    setExpectedLifespan("");
    setInspectionNotes("");
    setActivityLog([]);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-3 border-b bg-white shadow-sm text-sm text-gray-700">
        <span className="font-medium"> Current Location:</span> Zone - Central
        Railway | Division - Mumbai
      </div>

      <div className="flex">
        {/* Left Section */}
        <div className="w-2/3 border-r bg-white p-8">
          <h2 className="text-3xl font-bold text-green-700 mb-6">
            Asset Registration Form
          </h2>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="bg-gray-100 rounded-lg p-1 w-fit">
              <TabsTrigger value="manual" className="px-4 py-2 rounded-md">
                Manual Entry
              </TabsTrigger>
              <TabsTrigger value="bulk" className="px-4 py-2 rounded-md">
                Bulk Import
              </TabsTrigger>
            </TabsList>

            {/* Manual Entry */}
            <TabsContent value="manual">
              <Tabs
                value={formTab}
                onValueChange={setFormTab}
                className="space-y-6"
              >
                <TabsList className="bg-gray-100 rounded-lg p-1">
                  <TabsTrigger
                    value="identification"
                    className="px-4 py-2 rounded-md"
                  >
                    Identification
                  </TabsTrigger>
                  <TabsTrigger
                    value="manufacturing"
                    className="px-4 py-2 rounded-md"
                  >
                    Manufacturing
                  </TabsTrigger>
                  <TabsTrigger value="qc" className="px-4 py-2 rounded-md">
                    Quality Control
                  </TabsTrigger>
                  <TabsTrigger value="docs" className="px-4 py-2 rounded-md">
                    Documentation
                  </TabsTrigger>
                </TabsList>

                {/* Identification */}
                <TabsContent
                  value="identification"
                  className="grid grid-cols-2 gap-6 mt-4"
                >
                  <div>
                    <Label className="mb-2 block">Asset Category</Label>
                    <Select
                      value={assetCategory}
                      onValueChange={setAssetCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Clip" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clip">Clip</SelectItem>
                        <SelectItem value="pad">Pad</SelectItem>
                        <SelectItem value="liner">Liner</SelectItem>
                        <SelectItem value="sleeper">Sleeper</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">Vendor ID</Label>
                    <Input
                      placeholder="Enter 8-digit vendor code"
                      value={vendorId}
                      onChange={(e) => setVendorId(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Vendor Name</Label>
                    <Input
                      placeholder="Authorized supplier name"
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Purchase Order</Label>
                    <Input
                      placeholder="PO/WO reference number"
                      value={purchaseOrder}
                      onChange={(e) => setPurchaseOrder(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Batch/Lot No</Label>
                    <Input
                      placeholder="Manufacturing batch identifier"
                      value={batchLotNo}
                      onChange={(e) => setBatchLotNo(e.target.value)}
                    />
                  </div>
                </TabsContent>

                {/* Manufacturing */}
                <TabsContent
                  value="manufacturing"
                  className="grid grid-cols-2 gap-6 mt-4"
                >
                  <div>
                    <Label className="mb-2 block">Manufacture Date</Label>
                    <Input
                      type="date"
                      value={manufactureDate}
                      onChange={(e) => setManufactureDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Supply Date</Label>
                    <Input
                      type="date"
                      value={supplyDate}
                      onChange={(e) => setSupplyDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Base Material</Label>
                    <Select
                      value={baseMaterial}
                      onValueChange={setBaseMaterial}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Spring Steel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="steel">Spring Steel</SelectItem>
                        <SelectItem value="rubber">Rubber EVA</SelectItem>
                        <SelectItem value="hdpe">HDPE</SelectItem>
                        <SelectItem value="concrete">Concrete</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">Dimensions</Label>
                    <Input
                      placeholder="Length × Width × Height (mm)"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Net Weight</Label>
                    <Input
                      placeholder="Weight in grams (g)"
                      value={netWeight}
                      onChange={(e) => setNetWeight(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Surface Finish</Label>
                    <Select
                      value={surfaceFinish}
                      onValueChange={setSurfaceFinish}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Phosphated" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phosphated">Phosphated</SelectItem>
                        <SelectItem value="galvanized">Galvanized</SelectItem>
                        <SelectItem value="painted">Painted</SelectItem>
                        <SelectItem value="raw">Raw</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                {/* Quality Control */}
                <TabsContent value="qc" className="grid grid-cols-2 gap-6 mt-4">
                  <div className="col-span-2">
                    <Label className="text-green-600 mb-2 block">
                      QC Status
                    </Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={qcPass}
                        onChange={(e) => setQcPass(e.target.checked)}
                        className="h-4 w-4 text-green-600"
                        title="Quality Control Passed"
                        aria-label="Quality Control Passed"
                      />
                      <span className="text-green-600 font-semibold">
                        Quality Control Passed
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">QC Certificate</Label>
                    <Input
                      placeholder="QC certificate reference number"
                      value={qcCertificate}
                      onChange={(e) => setQcCertificate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Quality Grade</Label>
                    <Select
                      value={qualityGrade}
                      onValueChange={setQualityGrade}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="A" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a">A</SelectItem>
                        <SelectItem value="b">B</SelectItem>
                        <SelectItem value="c">C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">Warranty Period</Label>
                    <Input
                      placeholder="12"
                      value={warrantyPeriod}
                      onChange={(e) => setWarrantyPeriod(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Expected Lifespan</Label>
                    <Input
                      placeholder="8"
                      value={expectedLifespan}
                      onChange={(e) => setExpectedLifespan(e.target.value)}
                    />
                  </div>
                </TabsContent>

                {/* Documentation */}
                <TabsContent value="docs" className="mt-4 space-y-6">
                  <div>
                    <Label className="mb-2 block">
                      Inspection Notes & Additional Comments
                    </Label>
                    <Textarea
                      placeholder="Enter notes or instructions..."
                      className="mt-2"
                      value={inspectionNotes}
                      onChange={(e) => setInspectionNotes(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={handleSubmit}
                      className="bg-blue-600 text-white"
                    >
                      Submit
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handlePrintAssetLabel}
                      disabled={!qrCodeSvg}
                    >
                      Print Asset Label
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleExportQr}
                      disabled={!qrCodeSvg}
                    >
                      Export QR Label
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleCreatePdfLabel}
                      disabled={!qrCodeSvg}
                    >
                      Create PDF Label
                    </Button>

                    <Button
                      onClick={handleClearAll}
                      className="bg-red-600 text-white"
                    >
                      Clear All Fields
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Bulk Import */}
            <TabsContent value="bulk" className="mt-6">
              <div className="space-y-6">
                <div className="flex gap-3 items-center flex-wrap">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    className="hidden"
                    id="csvUpload"
                  />
                  <label htmlFor="csvUpload">
                    <Button asChild variant="secondary">
                      <span>Select CSV...</span>
                    </Button>
                  </label>

                  <Input
                    placeholder="Batch name"
                    className="w-1/3"
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                  />

                  <Button variant="secondary" onClick={handleMapColumns}>
                    Map Columns
                  </Button>

                  <Button variant="secondary" onClick={handleValidate}>
                    Validate
                  </Button>

                  <Button disabled={!csvPreview} onClick={handleStartImport}>
                    Start Import
                  </Button>
                </div>

                <div className="border rounded-lg h-60 overflow-auto bg-gray-50">
                  {!csvPreview ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No columns in table
                    </div>
                  ) : (
                    <table className="min-w-full border-collapse">
                      <thead className="bg-gray-200 sticky top-0">
                        <tr>
                          {csvPreview.columns.map((col) => (
                            <th
                              key={col}
                              className="px-4 py-2 border text-left text-sm font-medium text-gray-700"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {csvPreview.rows.map((row, idx) => (
                          <tr key={idx} className="even:bg-gray-100">
                            {csvPreview.columns.map((col) => (
                              <td
                                key={col}
                                className="px-4 py-2 border text-sm text-gray-700"
                              >
                                {row[col] ?? ""}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-1/3 bg-gray-50 p-6 flex flex-col gap-6">
          <div className="border rounded-xl bg-white shadow p-6 flex flex-col items-center justify-center text-gray-500 h-60">
            {qrCodeSvg ? (
              <div
                className="w-40 h-40 mb-2"
                dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
              />
            ) : (
              <>
                <p className="font-medium">No QR code loaded</p>
                <p className="text-sm">QR Code will appear here</p>
              </>
            )}
          </div>
          <div className="border rounded-xl bg-white shadow p-4 text-sm max-h-48 overflow-auto">
            <h3 className="font-semibold text-green-700 mb-2">
              System Status & Activity Log
            </h3>
            {activityLog.map((entry, index) => (
              <div key={index} className="whitespace-pre-wrap">
                {entry}
              </div>
            ))}
            <div className="mt-2 text-green-600 font-medium">● Online</div>
          </div>
        </div>
      </div>
    </div>
  );
}
