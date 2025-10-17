// backend/src/routes/fileRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const FileController = require('../controllers/fileController.js');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 500, // 500MB
    },
});

// Routes
router.post('/upload', upload.single('file'), FileController.uploadFile);
router.get('/download/:filename', FileController.downloadFile);

module.exports = router;
