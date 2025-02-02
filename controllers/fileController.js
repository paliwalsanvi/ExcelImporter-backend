const multer = require("multer");
const path = require("path");

// Ensure "uploads" directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

// File Filter (Only .xlsx files)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        cb(null, true);
    } else {
        cb(new Error("Only .xlsx files are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = { upload };
