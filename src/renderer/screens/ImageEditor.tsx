import React, { useState, useRef } from 'react';
import '../style/ImageEditor.css';
import img2 from '../../../assets/image/img2.jpg';
import { Button } from 'react-bootstrap';
import html2canvas from 'html2canvas';

const ImageEditor = () => {
  const [saturation, setSaturation] = useState(1);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);

  const FilteredImage = useRef<HTMLDivElement>(null);

  const handleSaturationChange = (e) => {
    setSaturation(e.target.value);
  };

  const handleBrightnessChange = (e) => {
    setBrightness(e.target.value);
  };

  const handleContrastChange = (e) => {
    setContrast(e.target.value);
  };

  const ResetAll = () => {
    setSaturation(1);
    setBrightness(1);
    setContrast(1);
  };

  const SaveImage = () => {
    window.electron.ipcRenderer.invoke('save-image', [img2, `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`]);
  };

  return (
    <div className="image-editor">
      <div className="controls">
        <label htmlFor="saturation">Saturation</label>
        <input
          id="saturation"
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={saturation}
          onChange={handleSaturationChange}
        />

        <label htmlFor="brightness">Brightness</label>
        <input
          id="brightness"
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={brightness}
          onChange={handleBrightnessChange}
        />

        <label htmlFor="contrast">Contrast</label>
        <input
          id="contrast"
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={contrast}
          onChange={handleContrastChange}
        />
      </div>
      <Button onClick={ResetAll}>Reset All</Button>
      <Button onClick={SaveImage}>Save</Button>
      <div
        // ref={FilteredImage}
        style={{
          filter: `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`,
        }}
      >
        <img
          ref={FilteredImage}
          src={img2}
          style={{
            width: 500,
            height: 320,
            objectFit: 'contain',
            filter: `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`,
          }}
        />
      </div>
      {/* Add your image display component here */}
    </div>
  );
};

export default ImageEditor;
