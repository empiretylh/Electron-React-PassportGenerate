import React, { useState, forwardRef,useRef, useMemo, useEffect, useCallback, useImperativeHandle } from 'react';
import '../style/ImageEditor.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import {
  ArrowLeftCircle,
  ArrowReturnLeft,
  ClockFill,
  Trash2,
  XDiamondFill,
} from 'react-bootstrap-icons';
import { toPng } from 'html-to-image';

const ImageEditor = ({
  imguri,
  capsize,
  setCapSize,
  filtered,
  setFiltered,
  afterDone,
},ref)=> {
  const [saturation, setSaturation] = useState(1);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);

  const [width,setWidth] = useState(500);
  const [height,setHeight] = useState(320);

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

  useEffect(() => {
    console.log('Getting image');
    const getImage = async () => {
      const result = await window.electron.ipcRenderer.invoke('uritoimg', [
        imguri,
      ]);

      setImg(result[0]);
    };

    getImage();
  }, [imguri]);

  useEffect(() => {
    setFiltered(
      `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`
    );
  }, [saturation, brightness, contrast]);

  useEffect(() => {
    if (FilteredImage.current && img) {
      const { naturalWidth, naturalHeight } = FilteredImage.current;
      console.log('Image width:', naturalWidth);
      console.log('Image height:', naturalHeight);
      setCapSize([naturalWidth, naturalHeight]);

    }
  }, [img, setImg]);


  const onSaveButtonClick = useCallback(()=>{
    if(capsize)
      setWidth(capsize[0]);
      setHeight(capsize[1]);

  
    if(FilteredImage.current === null){
      return false;
    }

    FilteredImage.current.style.width = `${capsize[0]}px`;
    FilteredImage.current.style.height = `${capsize[1]}px`;

    console.log("Converting to PNG")

  

    toPng(FilteredImage.current,{cacheBust:true}).then((dataUrl)=>{
      setWidth(500);
      setHeight(320);
      console.log("Data URL COmplete",dataUrl)
      window.electron.ipcRenderer.invoke('save-image',[dataUrl,imguri]);
    
      console.log("LINK CLICKED")
    }).catch((err)=>{
      console.log(err)
    })
  },[FilteredImage,capsize])

  useImperativeHandle(ref,()=>{
    return{
      save(){
        onSaveButtonClick();
      }
    }
  },[capsize]);

  return (
    <div className="image-editor">
      <Container>
        <Row>
          <Col>
            <div className="controls">
              <label htmlFor="saturation">Saturation ({saturation})</label>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                
                <XDiamondFill
                  size={15}
                  style={{ marginLeft: 5, flexGrow: 1 }}
                  onClick={()=>{
                    setSaturation(1)
                  }}
                />
                <input
                  id="saturation"
                  type="range"
                  min="-1"
                  max="3"
                  step="0.1"
                  value={saturation}
                  onChange={handleSaturationChange}
                  style={{ flexGrow: 5 }}
                />
              </div>
              <label htmlFor="brightness">Brightness ({brightness})</label>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
               
                <XDiamondFill
                  size={15}
                  style={{ marginLeft: 5, flexGrow: 1 }}
                  onClick={()=>{
                    setBrightness(1);
                  }}
                />
                 <input
                  id="brightness"
                  type="range"
                  min="-1"
                  max="3"
                  step="0.1"
                  value={brightness}
                  onChange={handleBrightnessChange}
                  style={{ flexGrow: 5 }}
                />
              </div>

              <label htmlFor="contrast">Contrast ({contrast})</label>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
               
                <XDiamondFill
                  size={15}
                  style={{ marginLeft: 5, flexGrow: 1 }}
                  onClick={()=>{
                    setContrast(1);
                  }}
                />
                 <input
                  id="contrast"
                  type="range"
                  min="-1"
                  max="3"
                  step="0.1"
                  value={contrast}
                  onChange={handleContrastChange}
                  style={{ flexGrow: 5 }}
                />
              </div>
            </div>
            <Button
              onClick={ResetAll}
              variant="danger"
              style={{ width: '100%', margin: 5 }}
            >
              Reset All
            </Button>
            </Col>
          <Col>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{overflow:'auto'}}>
              <img
                ref={FilteredImage}
                src={img}
                style={{
                  width: width,
                  height: height,
                  objectFit: 'contain',
                  filter: `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`,
                }}
              />
             
              
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default forwardRef(ImageEditor);
