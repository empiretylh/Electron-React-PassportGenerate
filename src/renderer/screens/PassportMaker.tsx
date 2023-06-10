/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/function-component-definition */
import { useState, useRef, useEffect, useContext } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import ColorPicker from './colorfield';
import { useNavigate } from 'react-router-dom';
import { ImageData, PaperSize } from 'renderer/context/context';
import { GearWideConnected, HouseFill, Images } from 'react-bootstrap-icons';
import icon from '../../../assets/image/icon.png'
const colorCodeToRGB = (code: string) => {
  // Split the code into separate R, G, B components
  const r = parseInt(code.substring(0, 2), 16);
  const g = parseInt(code.substring(2, 4), 16);
  const b = parseInt(code.substring(4, 6), 16);

  // Return the RGB channel values as an object
  return `${b},${g},${r},${0}`;
};

const Home = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedURI, setSelectedURI] = useState([]);
  const [isCustomImgSize, setIsCustomImgSize] = useState(false);
  const [paperSize, setPaperSize] = useState('2480,3508');
  const [imgsize, setImgsize] = useState('1.1,1.3');
  const [imageWidth, setImageWidth] = useState('1.1');
  const [imageHeight, setImageHeight] = useState('1.3');
  const [quantity, setQuantity] = useState('6');
  const [color, setColor] = useState('0099ff');
  const [bw, setBw] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('Uploading...');
  const [finish, setFinish] = useState(false);

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
    const qty = Array(selectedURI.length).fill(quantity);
    const arg = [imguri, qty, imgsize, paperSize, bw, colorCodeToRGB(color)];

    window.electron.ipcRenderer.sendMessage('runExecutable', { arg });

    window.electron.ipcRenderer.once(
      'executableOutput',
      (event, { error, stdout, stderr }) => {
        if (error) {
          console.error('Error:', error);
        } else {
          console.log('Standard Output:', stdout);
          console.error('Standard Error:', stderr);
        }
      }
    );
  }

  async function handleSelectButtonClick() {
    const result = await window.electron.ipcRenderer?.invoke(
      'open-files-dialog'
    );
    if (result.imgdata && result.uridata) {
      setImgsSelect((prev) => [...prev, ...result.imgdata]);
      setSelectedFiles((prev) => [...prev, ...result.imgdata]);
      setSelectedURI((prev) => [...prev, ...result.uridata]);
    }

    // console.log('I am file from the react', files);
    // if (files) {
    //   setSelectedFiles(files);
    // }
    // fileInputRef.current.click();
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
    navigate('/imgresult/' + selectedURI.length);
    setSelectedFiles([]);
    setSelectedURI([]);
  };

  const BackToMenu = () => {
    navigate('/');
  };

  return (
    <Container fluid style={{ position:'relative',padding:10 }}>
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
                Passport Photo Maker
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
            <HouseFill size={30} />
          </div>
        </Col>
      </Row>
         <Row>
        <Col lg={9}>
          <Row className="imageContainer">
            {selectedFiles.length > 0 ? (
              selectedFiles.map((file, index) => (
                <Col key={index} lg={3}>
                  <Card style={{ marginBottom: '1rem', alignItems: 'center' }}>
                    <Card.Img
                      variant="top"
                      src={file}
                      style={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                      }}
                    />
                    <Card.Body>
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveButtonClick(index)}
                      >
                        Remove
                      </Button>
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
                <Button onClick={handleSelectButtonClick}>
                  {' '}
                  <Images size={20} /> Import Images
                </Button>
              </div>
            )}
          </Row>
          <Row>
            <Form onSubmit={handleSubmit}>
              <Button
                onClick={handleSelectButtonClick}
                style={{
                  width: '100%',
                  padding: 20,
                  fontSize: 20,
                  marginTop: 10,
                }}
              >
                <Images size={20} /> Import Images
              </Button>
            </Form>
          </Row>
        </Col>
        <Col lg={3}>
          <Form onSubmit={handleSubmit}>
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
                <option value="2550,3300">Legal (8.5 x 14 inches)</option>
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
                      <option value="1.1,1.3">
                        1.1 x 1.3 (ကျောင်းသား/ဝန်ထမ်းကဒ်)
                      </option>
                      <option value="0.8,0.8">
                        0.8 x 0.8 (မှတ်ပုံတင်ဆိုဒ်)
                      </option>
                      <option value="1,1">1 x 1 (ကားလိုင်စင်ဆိုဒ်)</option>
                      <option value="1.2,1.4">
                        1.2 x 1.4 (လုပ်ငန်းသုံးလိုင်စင်ဆိုဒ်)
                      </option>
                      <option value="1.25,1.5">
                        1.25 x 1.5 (ဖောင်တင်ရန်၊ ဖုန်းလျှောက်ရန်)
                      </option>
                      <option value="1.25,1.6">
                        1.25 x 1.6 (Visa လျှောက်ရန်)
                      </option>
                      <option value="1.25,1.65">
                        1.25 x 1.65 (Passport စာအုပ်ဆိုဒ်)
                      </option>
                      <option value="1.5,2">1.5 x 2 (ဘွဲ့ဖောင်ဆိုဒ်)</option>
                      <option value="2,3">
                        2 x 3 (ထီးပေါက်လက်မှတ်ငွေထုတ်)
                      </option>
                    </Form.Control>
                  </Col>
                )}
              </Row>
            </Form.Group>

            <Form.Group controlId="quantity" style={{ marginTop: 10 }}>
              <Form.Label>Quantity:</Form.Label>
              <Form.Control
                type="number"
                defaultValue={quantity}
                required
                placeholder="Enter quantity"
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
              />
            </Form.Group>
            <ColorPicker color={color} setColor={setColor} />
            <div
              onClick={() => {
                setBw((prev) => !prev);
              }}
            >
              <Form.Check
                type="checkbox"
                label="Black and White"
                style={{ marginTop: 15 }}
                checked={bw}
                onChange={(e) => setBw(e.target.checked)}
              />
            </div>
            {selectedFiles.length > 0 && (
              <Button
                variant="primary"
                type="submit"
                style={{ width: '100%', marginTop: 15 }}
                disabled={uploading}
              >
                <GearWideConnected size={20} /> Generate{' '}
                {selectedFiles.length > 0 && `(${selectedFiles.length})`}{' '}
                {selectedFiles.length > 1 ? ' Images' : 'Image'}
              </Button>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
