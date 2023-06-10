import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import loading from '../../../assets/image/loading.gif';
import Person from '../../../assets/image/img2.jpg';
import { useNavigate, useParams } from 'react-router-dom';
import { ImageData, PaperData } from 'renderer/context/context';
import {
  ArrowRight,
  Folder,
  HouseExclamation,
  HouseFill,
} from 'react-bootstrap-icons';

const ImageResult = () => {
  const { imgcount } = useParams();

  const [imageList, setImageList] = useState([]);
  const [imgURL, setImgURL] = useState([]);

  const { imgsSelect, setImgsSelect } = useContext(ImageData);

  const { paperList, setPaperList } = useContext(PaperData);

  const [isGenerate, setIsGenerate] = useState(true);
  

  const ComputeGeneratingImage = useMemo(() => {
    let image = imgsSelect[0];

    let indexc = 1;

    imageList.map((data, index) => {
      indexc = index + 2;
    });

    image = imgsSelect[indexc - 1];

   

    if (imgcount == imageList.length) {
      setImgsSelect([]);
      console.log('Cleared Selected Image');
      setIsGenerate(false);
    }

    return { image: image, indexc: indexc };
  }, [imageList, setImageList, setImgsSelect]);

  const navigate = useNavigate();

  useEffect(() => {
 
    window.electron.ipcRenderer.on('imageUpdated', ({file,fileData}) => {
      
      setImageList((prevList) => [...prevList, fileData]);
      setImgURL((prev) => [...prev, file]);
    });

    return () => {
      window.electron.ipcRenderer.removeListener('imageUpdated');
    };
  }, []);
  useEffect(() => {
    // window.electron.ipcRenderer.invoke('imageUpdated');
    setPaperList([]);

    window.electron.ipcRenderer.on('paperUpdated', (filename) => {
      console.log(filename);
      setPaperList((prevList) => [...prevList, filename]);
    });

    return () => {
      window.electron.ipcRenderer.removeListener('paperUpdated');
    };
  }, []);

  const BacktoHome = () => {
    navigate('/passportmaker');
  };

  const gotoPrint = () => {
    navigate('/paper');
  };

  const OpenLocation = async (url) => {
    await window.electron.ipcRenderer.sendMessage('openLocation', url);
  };

  return (
    <Container
      fluid
      style={{
        position: 'relative',
        backgroundColor: '#f0f0f0',
        width: '100wh',
        height: '100vh',
      }}
    >
      <Row>
        <Col
          style={{
            padding: 5,
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Button style={{ padding: 10, width: 180 }} onClick={BacktoHome} >
            <HouseFill /> Back to Home
          </Button>
        </Col>
        <Col
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h5>{imageList.length + '/' + imgcount}</h5>
        </Col>
        <Col
          style={{ display: 'flex', justifyContent: 'flex-end', padding: 5 }}
        >
          {imgcount == imageList.length ? (
            <Button style={{ padding: 10, width: 120 }} onClick={gotoPrint}>
              Continue <ArrowRight />
            </Button>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* <img src={loading} style={{ width: 120, marginTop: -5 }} />
              <h6 style={{ marginLeft: 5 }}>Generating Image...</h6> */}
            </div>
          )}
        </Col>
      </Row>
      <div
        style={{
          width: '100%',
          height: 2,
          backgroundColor: '#fbfbfb',
        }}
      />
      <Row>
        <Col style={{ height: '90vh', overflowY: 'auto' }}>
          <Row>
            <h5>Generated Images</h5>
            {imageList.length > 0 ? (
              imageList.map((file, index) => (
                <Col key={index} xs={6} md={3} lg={2}>
                  <Card style={{ marginBottom: '1rem', alignItems: 'center' }}>
                    <Card.Img variant="top" src={file} />
                    <Card.Body style={{ padding: 5 }}>
                      <Button
                        variant="primary"
                        style={{ fontSize: 13, padding: 5 }}
                        onClick={()=>OpenLocation(imgURL[index])}
                      >
                        <Folder /> Show in Folder
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
              ></div>
            )}
          </Row>
        </Col>
      </Row>
      {isGenerate && (
        <div className="generatingimg">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src={ComputeGeneratingImage.image}
              style={{
                width: 150,
                height: 150,
                objectFit: 'cover',
                borderRadius: 300,
              }}
            />
            <h6 style={{ color: 'black', marginTop: 5 }}>Generating Image</h6>
            <h6 style={{ color: 'black', marginTop: 5 }}>
              {imageList.length + '/' + imgcount}
            </h6>
            <img src={loading} style={{ width: 100 }} />
          </div>
        </div>
      )}
    </Container>
  );
};

export default ImageResult;
