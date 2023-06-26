import React, { useState, useRef, useMemo, useEffect } from 'react';
import '../style/ImageEditor.css';
import img2 from '../../../assets/image/img2.jpg';
import { Button } from 'react-bootstrap';
import html2canvas from 'html2canvas';

const ImageEditor = () => {
  const [saturation, setSaturation] = useState(1);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);

  const FilteredImage = useRef<HTMLDivElement>(null);
  const SavingTime = useRef(null);

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

  const [img, setImg] = useState(null);
  const [capsize, setCapSize] = useState(null);

  let imguri = '/home/thura/Documents/Pascal/img/photo_2023-06-10_09-25-15.jpg';

  const IMG = useMemo(async () => {
    console.log('Getting Image......');
    const result = await window.electron.ipcRenderer.invoke('uritoimg', [
      imguri,
    ]);
    setImg(result[0]);
  }, []);

  const SaveImage = () => {
    console.log(img,capsize,saturation,brightness,contrast)
    console.log(
      img && capsize 
    );
    if (img && capsize) {
      window.electron.ipcRenderer.invoke('save-image', [
        img, //Image Data
        `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`, //Image Filterd
        capsize, //Captured Windows Size
        imguri, //For Saving img uri
      ]);
    }
  };

  useEffect(() => {
    clearTimeout(SavingTime.current);
    SavingTime.current = setTimeout(()=>{

    SaveImage();
    },4000) // wait 4 seconds to save image
    return ()=>{
      clearTimeout(SavingTime.current)
    }
  }, [saturation, brightness, contrast]);

  useEffect(() => {
    if (FilteredImage.current && img) {
      const { naturalWidth, naturalHeight } = FilteredImage.current;
      console.log('Image width:', naturalWidth);
      console.log('Image height:', naturalHeight);
      setCapSize([naturalWidth, naturalHeight]);
    }
  }, [img,setImg]);

  return (
    <div className="image-editor">
      <div className="controls">
        <label htmlFor="saturation">Saturation</label>
        <input
          id="saturation"
          type="range"
          min="-1"
          max="3"
          step="0.1"
          value={saturation}
          onChange={handleSaturationChange}
        />

        <label htmlFor="brightness">Brightness</label>
        <input
          id="brightness"
          type="range"
          min="-1"
          max="3"
          step="0.1"
          value={brightness}
          onChange={handleBrightnessChange}
        />

        <label htmlFor="contrast">Contrast</label>
        <input
          id="contrast"
          type="range"
          min="-1"
          max="3"
          step="0.1"
          value={contrast}
          onChange={handleContrastChange}
        />
      </div>
      <Button onClick={ResetAll}>Reset All</Button>
      <Button onClick={SaveImage}>Save</Button>
      <div>
        <img
          ref={FilteredImage}
          src={img}
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
