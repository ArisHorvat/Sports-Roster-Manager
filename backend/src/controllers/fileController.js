const path = require('path');
const fs = require('fs');

const FileController = {
    uploadFile(req, res) {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        res.json({ message: 'File uploaded successfully', filename: req.file.filename });
    },

    downloadFile(req, res) {
        const filePath = path.join(__dirname, 'uploads', req.params.filename);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.download(filePath);
    }
};

module.exports = FileController;
