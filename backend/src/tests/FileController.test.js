import request from 'supertest';
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
const { FileController } = require('../controllers/fileController.js');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), FileController.uploadFile);
app.get('/download/:filename', FileController.downloadFile);

describe('FileController', () => {
    let testFilename = 'testfile.txt';
    let testFilePath = path.join('uploads', testFilename);

    beforeAll(() => {
        // Create a dummy file for download test
        fs.writeFileSync(testFilePath, 'Test content');
    });

    afterAll(() => {
        if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
    });

    test('should upload a file successfully', async () => {
        const res = await request(app)
            .post('/upload')
            .attach('file', Buffer.from('Sample upload content'), 'sample.txt');

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('File uploaded successfully');
        expect(res.body.filename).toBeDefined();

        // Clean up uploaded file
        const uploadedPath = path.join('uploads', res.body.filename);
        if (fs.existsSync(uploadedPath)) fs.unlinkSync(uploadedPath);
    });

    test('should return 400 if no file is uploaded', async () => {
        const res = await request(app).post('/upload');
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('No file uploaded');
    });

    test('should download an existing file', async () => {
        const res = await request(app).get(`/download/${testFilename}`);
        expect(res.status).toBe(200);
        expect(res.headers['content-disposition']).toContain(`filename="${testFilename}"`);
    });

    test('should return 404 if file not found', async () => {
        const res = await request(app).get('/download/nonexistent.txt');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('File not found');
    });
});
