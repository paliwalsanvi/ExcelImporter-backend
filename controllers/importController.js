const XLSX = require("xlsx");
const fs = require("fs");
const DataModel = require("../models/DataModel");

const importExcel = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const filePath = req.file.path;
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Read first sheet
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        let validRows = [];
        let errors = [];

        data.forEach((row, index) => {
            let error = {};

            if (!row.Name) error.name = "Name is required";
            if (!row.Amount || isNaN(row.Amount) || row.Amount <= 0) error.amount = "Invalid Amount";
            if (!row.Date || new Date(row.Date) < new Date(new Date().getFullYear(), new Date().getMonth(), 1)) {
                error.date = "Invalid Date (must be within current month)";
            }
            if (!row.Verified || (row.Verified !== "Yes" && row.Verified !== "No")) {
                error.verified = "Verified should be Yes or No";
            }

            if (Object.keys(error).length > 0) {
                errors.push({ row: index + 2, error });
            } else {
                validRows.push({
                    name: row.Name,
                    amount: parseFloat(row.Amount),
                    date: new Date(row.Date),
                    verified: row.Verified === "Yes"
                });
            }
        });

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        await DataModel.insertMany(validRows);
        fs.unlinkSync(filePath); // Delete the uploaded file

        res.status(201).json({ message: "Data imported successfully", inserted: validRows.length });
    } catch (error) {
        console.error("Import Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { importExcel };
