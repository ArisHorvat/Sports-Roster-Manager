import React from 'react';
import UploadFile from '../../components/FileComponents/UploadFIle';
import DownloadFile from '../../components/FileComponents/DownloadFile';
import Title from '../../components/Title/Title';


function FilePage() {
    return (
        <div className='home-page'>
            <div style={{height: '30vh'}}>
                <Title text="File Upload & Download"></Title>
            </div>
            <div style={{height: '30vh'}}>
                <UploadFile></UploadFile>
            </div>
            <div style={{height: '30vh'}}>
                <DownloadFile></DownloadFile>
            </div>
        </div>
    );
}

export default FilePage;
