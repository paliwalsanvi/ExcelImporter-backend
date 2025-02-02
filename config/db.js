const mongoose = require("mongoose");
const MONGO_URI = "mongodb+srv://admin23:admin2323@cluster0.pxs0q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(" MongoDB connected successfully");
    } catch (error) {
        console.error(" MongoDB connection error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
