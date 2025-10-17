import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyButton from '../MyButton/MyButton';
import MyLabel from '../MyLabel/MyLabel';

function UploadFile() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('Waiting...');

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const apiUrl = process.env.REACT_APP_API_URL;

            const res = await axios.post(`${apiUrl}/files/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadStatus(`✅ Upload successful`);
        } catch (err) {
            setUploadStatus('❌ Upload failed');
        }
    };

    const handleClick = () => {
        document.getElementById('hidden-file-input').click();
    };

    return (
        <div className='home-main-row'>
            <div>
                <MyButton text="Select File" onClick={handleClick}></MyButton>
                <input
                    id="hidden-file-input"
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
            </div>
            <MyLabel text={uploadStatus}></MyLabel>
            <MyButton text="Upload" onClick={handleUpload}></MyButton>
        </div>
    );
}

export default UploadFile;
