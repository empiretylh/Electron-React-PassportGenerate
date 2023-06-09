/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/function-component-definition */
import { useState, useRef, useEffect, useContext } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import ColorPicker from './colorfield';
import { useNavigate } from 'react-router-dom';
import { ImageData, PaperSize } from 'renderer/context/context';
import { GearWideConnected, House, Images } from 'react-bootstrap-icons';
import icon from '../../../assets/image/icon.png';
import '../style/beauty.css';

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
  const [imgsize, setImgsize] = useState('1.1,1.3');
  const [imageWidth, setImageWidth] = useState('1.1');
  const [imageHeight, setImageHeight] = useState('1.3');
  const [quantity, setQuantity] = useState('6');
  const [color, setColor] = useState('0099ff');
  const [bw, setBw] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('Uploading...');
  const [finish, setFinish] = useState(false);

  const [quantities, setQuantities] = useState([]);

  const handleQuantityChange = (index, increment) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index] += increment;
    setQuantities(updatedQuantities);
  
    if (updatedQuantities[index] === 0) {
      const updatedImages = [...selectedFiles];
      const imguri = [...selectedURI];
      updatedImages.splice(index, 1);
      imguri.splice(index,1)
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
      setQuantities((prev)=>[...prev,...result.qtys])
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
    <Container fluid style={{ position: 'relative', padding: 10 }}>
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
                    height: 200,
                    objectFit: 'cover',
                  }}
                />
                <Card.Body>
                  <div>
                    Quantity: {quantities[index]}
                    <Button
                      variant="secondary"
                      onClick={() => handleQuantityChange(index, -1)}
                    >
                      -
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleQuantityChange(index, 1)}
                    >
                      +
                    </Button>
                  </div>
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
              width: '80%',
              padding: 20,
              fontSize: 20,
              marginTop: 10,
            }}
          >
            <Images size={20} /> Import Images
          </Button>
        </Form>
      </Row>
    </Container>
  );
};

export default BeautyMaker;
