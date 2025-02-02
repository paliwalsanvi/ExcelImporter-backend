const express = require("express");
const mongoose = require("mongoose");
const DataModel = require("../models/DataModel"); // Ensure you have a Mongoose model
const router = express.Router();

// Fetch stored data with pagination
router.get("/preview", async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const data = await DataModel.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const totalCount = await DataModel.countDocuments();

    res.json({
      data,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching preview data:", error);
    res.status(500).json({ message: "Error fetching preview data" });
  }
});

router.delete("/delete/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedRow = await DataModel.findByIdAndDelete(id);
  
      if (!deletedRow) {
        return res.status(404).json({ message: "Row not found" });
      }
  
      res.json({ message: "Row deleted successfully" });
    } catch (error) {
      console.error("Error deleting row:", error);
      res.status(500).json({ message: "Error deleting row" });
    }
  });

module.exports = router;