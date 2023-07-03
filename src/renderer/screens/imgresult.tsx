import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Container, Row, Col, Button, Card, Modal } from 'react-bootstrap';
import loading from '../../../assets/image/loading.gif';
import { useNavigate, useParams } from 'react-router-dom';
import { ImageData, PaperData } from 'renderer/context/context';
import {
  ArrowRight,
  Folder,
  HouseExclamation,
  HouseFill,
  Pencil,
  Save,
  Save2,
} from 'react-bootstrap-icons';
import ImageEditor from './ImageEditor';

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
    window.electron.ipcRenderer.on('imageUpdated', ({ file, fileData }) => {
      setImageList((prevList) => [...prevList, fileData]);
      setImgURL((prev) => [...prev, file]);
    });

    return () => {
      window.electron.ipcRenderer.removeListener('imageUpdated');
    };
  }, []);
  
  const BacktoHome = () => {
    navigate('/passportmaker');
  };

  const gotoPrint = () => {    
    window.electron.ipcRenderer.sendMessage('PSave', '_');
    navigate('/paper');
  };

  const OpenLocation = async (url) => {
    await window.electron.ipcRenderer.sendMessage('openLocation', url);
  };
  //Image Editing....................
  const [editShow, setEditShow] = useState(false);
  const [imguri, setImgURI] = useState(null);
  const [editIndex, setEditIndex] = useState(0);

  const handleClose = () => {
    setEditShow(false);
  };

  const handleEditOpen = (index) => {
    let imguri = imgURL[index];
    setEditIndex(index);
    setImgURI(imguri);
    setEditShow(true);
  };

  const [filterdata,setFilterData] =  useState({})

  const handleSave = (imgindex: number) => {
    let img = imageList[imgindex];
  

    if (img && capsize) {
      window.electron.ipcRenderer.invoke('save-image', [
        img, //Image Data
        filtered,
        capsize, //Captured Windows Size
        imguri, //For Saving img uri
      ]);
      setEditShow(false);
    }

    let fdata = filterdata;
    fdata[imgindex] = filtered;
    setFilterData(fdata);


    console.log(filterdata,"filter data");
  };

  const [capsize, setCapSize] = useState(null);

  const [filtered, setFiltered] = useState();

  const FILTERDLIST = useMemo(()=>{
    return imageList;
  },[filtered,imgURL,imageList])


  const EditImageModal = () => {
    return (
      <Modal show={editShow} centered size="lg">
        <Modal.Header closeButton onHide={handleClose}>
          <Modal.Title>Image Editor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ImageEditor
            capsize={capsize}
            setCapSize={setCapSize}
            imguri={imguri}
            filtered={filtered}
            setFiltered={setFiltered}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleSave(editIndex);
            }}
          >
            <Save2 /> Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
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
      {EditImageModal()}
      <Row>
        <Col
          style={{
            padding: 5,
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Button style={{ padding: 10, width: 180 }} onClick={BacktoHome}>
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
            {FILTERDLIST.length > 0 ? (
              FILTERDLIST.map((file, index) => (
                <Col key={index} xs={6} md={3} lg={2}>
                  <Card style={{ marginBottom: '1rem', alignItems: 'center' }}>
                    <Card.Img variant="top" src={file}  style={{
                      filter: filterdata[index] ? filterdata[index] : `brightness(${1}) contrast(${1}) saturate(${1})`
                    }}/>
                    <Card.Body style={{ padding: 5 }}>
                      <Button
                        variant="primary"
                        style={{ fontSize: 13, padding: 5 }}
                        onClick={() => OpenLocation(imgURL[index])}
                      >
                        <Folder /> Show in Folder
                      </Button>
                      <Button
                        variant="warning"
                        style={{ fontSize: 13, padding: 5,marginLeft:5 }}
                        onClick={() => handleEditOpen(index)}
                      >
                        <Pencil /> Edit
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
