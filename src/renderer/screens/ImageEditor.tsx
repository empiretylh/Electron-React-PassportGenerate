import React, { useState, useRef, useMemo, useEffect } from 'react';
import '../style/ImageEditor.css';
import { Button,Container,Row,Col } from 'react-bootstrap';

const ImageEditor = ({imguri,capsize,setCapSize,filtered,setFiltered}) => {
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

useEffect(()=>{
  console.log('Getting image')
  const getImage = async ()=>{
    const result = await window.electron.ipcRenderer.invoke('uritoimg',[
      imguri
    ])

    setImg(result[0])
  }

  getImage();
},[imguri]);

useEffect(()=>{
  setFiltered(`brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`)
},[saturation,brightness,contrast])



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
      <Container>
        <Row>
          <Col>
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
      <Button onClick={ResetAll} variant="secondary">Reset All</Button>
           </Col>
      <Col>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
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
      </Col>
      </Row>
      </Container>
    </div>
  );
};

export default ImageEditor;
