import React, { useState } from 'react';
import axios from 'axios';
import MyInput from '../MyInput/MyInput';
import MyButton from '../MyButton/MyButton';

function DownloadFile() {
    const [filename, setFilename] = useState('');

    const handleDownload = async () => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL;

            const res = await axios.get(`${apiUrl}/files/download/${filename}`, {
                responseType: 'blob',
            });

            const blob = new Blob([res.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('❌ Download failed');
        }
    };

    return (
        <div className='home-main-row'>
            <MyInput type="text" placeholder="Enter Filename" value={filename} onChange={(e) => setFilename(e.target.value)}></MyInput>
            <MyButton text="Download" onClick={handleDownload}></MyButton>
        </div>
    );
}

export default DownloadFile;
