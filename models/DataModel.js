const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    verified: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("ImportedData", DataSchema);
