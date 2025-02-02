const express = require("express");
const multer = require("multer");
const exceljs = require("exceljs");
const Data = require("../models/DataModel");
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure uploads folder exists
    cb(null, 'uploads/'); // Store files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save with unique filename
  }
});

const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory


// **File Upload & Validation API**
router.post("/upload", upload.single("file"), async (req, res) => {
  console.log("req.file", req.file);
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  console.log("req.file", req.file);
  try {
    const workbook = new exceljs.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    let validationErrors = [];
    let extractedData = [];
    console.log("workbook", workbook);

    workbook.eachSheet((sheet, sheetId) => {
      sheet.eachRow((row, rowIndex) => {
        console.log("workbook", row, rowIndex);
        if (rowIndex === 1) return; // Skip header

        const name = row.getCell(1).value;
        const amount = parseFloat(row.getCell(2).value);
        const date = new Date(row.getCell(3).value);
        const verified = row.getCell(4).value;
        console.log("->", name, amount, date, verified);

        // Validation Rules
        if (!name || !amount || !date || !verified) {
          console.log("missing required fields");
          validationErrors.push({ sheet: sheet.name, row: rowIndex, error: "Missing required fields" });
          return;
        }

        if (isNaN(amount) || amount <= 0) {
          console.log("Invalid amount");

          validationErrors.push({ sheet: sheet.name, row: rowIndex, error: "Invalid amount" });
          return;
        }

        if (date.getMonth() !== new Date().getMonth()) {
          console.log("Date must be within the current month");

          validationErrors.push({ sheet: sheet.name, row: rowIndex, error: "Date must be within the current month" });
          return;
        }

        extractedData.push({ name, amount, date, verified });
      });
    });

    if (validationErrors.length > 0) {
      console.log("validationErrors", validationErrors);
      return res.status(400).json({ errors: validationErrors });
    }

    res.json({ message: "File processed successfully", data: extractedData });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error processing file", error });
  }
});

// //**Get Data Preview API**
// router.get("/preview", async (req, res) => {
//   try {
//     const data = await Data.find().limit(10);
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching preview data", error });
//   }
// });

// **Import Data API**
router.post("/import", async (req, res) => {
  try {
    const validRows = req.body.validRows;
    await Data.insertMany(validRows);
    res.json({ message: "Data imported successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error importing data", error });
  }
});

// // **Delete Row API**
// router.delete("/delete-row/:id", async (req, res) => {
//   try {
//     await Data.findByIdAndDelete(req.params.id);
//     res.json({ message: "Row deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting row", error });
//   }
// });

// **Get Validation Errors API**
router.get("/errors", async (req, res) => {
  res.json({ errors: validationErrors });
});

module.exports = router;
