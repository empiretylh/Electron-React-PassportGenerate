import React, { useState, useEffect } from 'react';
const { ipcRenderer } = window.require('electron');

const DownloadButton = () => {
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    ipcRenderer.on('download-progress', (_, downloadProgress) => {
      setProgress(downloadProgress.percent);
    });

    ipcRenderer.on('download-complete', (_, filePath) => {
      setProgress(100);
      setIsDownloading(false);
      console.log('Download complete!', filePath);
    });

    return () => {
      ipcRenderer.removeAllListeners('download-progress');
      ipcRenderer.removeAllListeners('download-complete');
    };
  }, []);

  const handleDownload = () => {
    setIsDownloading(true);
    ipcRenderer.send('download-file', 'https://www.github.com/something.pdf');
  };

  return (
    <div>
      <button onClick={handleDownload} disabled={isDownloading}>
        {isDownloading ? 'Downloading...' : 'Download'}
      </button>
      {isDownloading && (
        <div>Download Progress: {progress}%</div>
      )}
    </div>
  );
};

export default DownloadButton;
