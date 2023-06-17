/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/function-component-definition */
import { useState, useRef, useEffect, useContext } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import ColorPicker from './colorfield';
import { useNavigate } from 'react-router-dom';
import { ImageData, PaperSize } from 'renderer/context/context';
import {
  Crop,
  GearWideConnected,
  House,
  HouseFill,
  Images,
  Plus,
} from 'react-bootstrap-icons';
import icon from '../../../assets/image/icon.png';
import '../style/beauty.css';
import html2canvas from 'html2canvas';

const colorCodeToRGB = (code: string) => {
  // Split the code into separate R, G, B components
  const r = parseInt(code.substring(0, 2), 16);
  const g = parseInt(code.substring(2, 4), 16);
  const b = parseInt(code.substring(4, 6), 16);

  // Return the RGB channel values as an object
  return `${b},${g},${r},${0}`;
};

const BeautyMaker = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedURI, setSelectedURI] = useState([]);
  const [isCustomImgSize, setIsCustomImgSize] = useState(false);
  const [paperSize, setPaperSize] = useState('2480,3508');
  const [imgsize, setImgsize] = useState('3.9,5.7');
  const [imageWidth, setImageWidth] = useState('3.9');
  const [imageHeight, setImageHeight] = useState('5.7');
  const [quantity, setQuantity] = useState('6');
  const [color, setColor] = useState('0099ff');
  const [bw, setBw] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('Uploading...');
  const [finish, setFinish] = useState(false);

  const [selectedMode, setSelectedMode] = useState('false');

  const [quantities, setQuantities] = useState([]);

  const handleQuantityChange = (index, increment) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index] += increment;
    setQuantities(updatedQuantities);

    if (updatedQuantities[index] === 0) {
      const updatedImages = [...selectedFiles];
      const imguri = [...selectedURI];
      updatedImages.splice(index, 1);
      imguri.splice(index, 1);
      setSelectedFiles(updatedImages);
      setSelectedURI(imguri);
      setQuantities(updatedQuantities.filter((_, i) => i !== index));
    }
  };

  const { imgsSelect, setImgsSelect } = useContext(ImageData);
  const { papersize, setPSize } = useContext(PaperSize);

  const navigate = useNavigate();

  useEffect(() => {
    setImgsize(`${imageWidth},${imageHeight}`);
  }, [imageWidth, imageHeight]);

  useEffect(() => {
    setPSize(paperSize);
  }, [paperSize, setPaperSize]);

  function runExecutable() {
    const imguri = selectedURI.join(',');
    const qty = quantities;
    const arg = [imguri, qty, imgsize, paperSize, selectedMode];

    console.log(arg);

    window.electron.ipcRenderer.sendMessage('generateBeauty', { arg });
  }

  async function handleSelectButtonClick() {
    const result = await window.electron.ipcRenderer?.invoke(
      'open-files-dialog'
    );
    if (result.imgdata && result.uridata) {
      setImgsSelect((prev) => [...prev, ...result.imgdata]);
      setSelectedFiles((prev) => [...prev, ...result.imgdata]);
      setSelectedURI((prev) => [...prev, ...result.uridata]);
      setQuantities((prev) => [...prev, ...result.qtys]);
    }
  }

  const handleRemoveButtonClick = (index) => {
    setSelectedFiles((prevSelectedFiles) =>
      prevSelectedFiles.filter((_, i) => i !== index)
    );
    setSelectedURI((prevSelectedFiles) =>
      prevSelectedFiles.filter((_, i) => i !== index)
    );
    setImgsSelect((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    runExecutable();
    navigate(
      '/beautymaker/imgresult/' +
        selectedURI.length +
        '/' +
        paperSize +
        '/' +
        imgsize
    );
    setSelectedFiles([]);
    setSelectedURI([]);
  };

  const BackToMenu = () => {
    navigate('/');
  };

  const handleCropModeChange = (event) => {
    setSelectedMode(event.target.value);
  };


  return (
    <Container fluid style={{ position: 'relative', padding: 10 }}>
      <Row>
        <Col>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <img
              src={icon}
              style={{ width: 50, height: 50, objectFit: 'contain' }}
            />
            <div style={{ marginLeft: 10 }}>
              <h4 style={{ padding: 0 }}>Pascal X</h4>
              <p style={{ padding: 0, marginTop: -5, fontSize: 15 }}>
                Beauty Photo Maker
              </p>
            </div>
          </div>
        </Col>
        <Col
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <div onClick={BackToMenu}>
            <HouseFill size={40} />
          </div>
        </Col>
      </Row>

      <Row className="beautyimageContainer">
        {selectedFiles.length > 0 ? (
          selectedFiles.map((file, index) => (
            <Col key={index} lg={3}>
              <Card style={{ marginBottom: '1rem', alignItems: 'center' }}>
                <Card.Img
                  variant="top"
                  src={file}
                  style={{
                    width: '100%',
                    height: 150,
                    objectFit: 'cover',
                  }}
                />
                <Card.Body>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-around' }}
                  >
                    <Button
                      variant="danger"
                      onClick={() => handleQuantityChange(index, -1)}
                    >
                      -
                    </Button>
                    <div
                      style={{
                        width: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                      }}
                    >
                      {quantities[index]}
                    </div>
                    <Button
                      variant="warning"
                      onClick={() => handleQuantityChange(index, 1)}
                    >
                      +
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <h3> Please Choose Images</h3>
          </div>
        )}

        <Col lg={3}>
          <Card
            style={{ marginBottom: '1rem', alignItems: 'center' }}
            className={'importbutton'}
            onClick={handleSelectButtonClick}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <Plus size={120} />
              <h6>Import Images</h6>
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xl={4} lg={5}>
          <Form>
            <Form.Group controlId="paperSize">
              <Form.Label>Paper Size:</Form.Label>
              <Form.Control
                as="select"
                name="paperSize"
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value)}
              >
                <option value="2480,3508">A4 (8.268 x 11.693 inches) </option>
                <option value="1200,1800">4x6 (4 x 6 inches) </option>
                <option value="1748,2480">A5 (6.142 x 8.268 inches)</option>
                <option value="2550,4200">Legal (8.5 x 14 inches)</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="Image Size" style={{ marginTop: 15 }}>
              <Form.Label>
                {' '}
                <Form.Check
                  type="checkbox"
                  label="Custom Image Size (inches)"
                  checked={isCustomImgSize}
                  onChange={(e) => setIsCustomImgSize(e.target.checked)}
                />
              </Form.Label>
              <Row>
                {isCustomImgSize ? (
                  <>
                    <Col>
                      <Form.Control
                        type="number"
                        name="imageWidth"
                        placeholder="Width"
                        value={imageWidth}
                        onChange={(e) => setImageWidth(e.target.value)}
                      />{' '}
                    </Col>
                    <Col xs="auto" className="d-flex align-items-center">
                      x
                    </Col>
                    <Col>
                      <Form.Control
                        type="number"
                        name="imageHeight"
                        placeholder="Height"
                        value={imageHeight}
                        onChange={(e) => setImageHeight(e.target.value)}
                      />
                    </Col>
                  </>
                ) : (
                  <Col>
                    <Form.Control
                      as="select"
                      name="imgsize"
                      value={imgsize}
                      onChange={(e) => setImgsize(e.target.value)}
                    >
                      <option value="3.8,5.7">
                        4 x 6 (Standard Photography Size)
                      </option>
                      <option value="4.8,6.8">
                        5 x 7 (Standard Photography Size)
                      </option>
                      <option value="7.9,9.8">
                        8 x 10 (Portraits Photography Size)
                      </option>
                      <option value="8.5,11">8.5, 11 (Flyer Size)</option>
                      <option value="8.2,11.5">A4 Size</option>
                      <option value="5.8,8.3">A5 Size</option>
                    </Form.Control>
                  </Col>
                )}
              </Row>
            </Form.Group>
          </Form>
        </Col>
        <Col>
          <div style={{ marginTop: 20 }}>
            <Form.Check
              type="checkbox"
              name="checkboxgroup"
              id="aspect-ratio"
              label="Crop with aspect ratio"
              value={'false'}
              checked={selectedMode == 'false'}
              onChange={handleCropModeChange}
            />
            <Form.Check
              type="checkbox"
              name="checkboxgroup"
              id="face-crop"
              label="Crop with detect faces"
              value={'true'}
              checked={selectedMode == 'true'}
              onChange={handleCropModeChange}
            />
          </div>
        </Col>
        <Col>
          {selectedFiles.length > 0 && (
            <div style={{ marginTop: 5, display: 'flex' }}>
              <Button
                style={{
                  display: 'flex',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10,
                }}
                onClick={handleSubmit}
              >
                <Crop size={30} style={{ marginRight: 10 }} />
                <span>Crop Images</span>
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BeautyMaker;
