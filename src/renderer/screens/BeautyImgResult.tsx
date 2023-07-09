import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { Container, Row, Col, Button, Card, Modal } from 'react-bootstrap';
import loading from '../../../assets/image/loading.gif';
import Person from '../../../assets/image/img2.jpg';
import { useNavigate, useParams } from 'react-router-dom';
import { ImageData, PaperData } from 'renderer/context/context';
import {
  ArrowLeftCircleFill,
  ArrowRight,
  ArrowRightCircleFill,
  Back,
  Folder,
  Folder2Open,
  FolderX,
  HouseExclamation,
  HouseFill,
  Images,
  PencilSquare,
  Printer,
  Save2,
} from 'react-bootstrap-icons';

import icon from '../../../assets/image/icon.png';
import Paper from 'renderer/extra/Paper';
import html2canvas from 'html2canvas';
import ImageEditor from './ImageEditor';

function PhotoCount(
  paperWidth: any,
  paperHeight: any,
  imageHeight: any,
  imageWidth: any
): any {
  imageWidth = imageWidth * 300;
  imageHeight = imageHeight * 300;

  const portraitImagesInWidth = Math.floor(paperWidth / imageHeight);
  const portraitImagesInHeight = Math.floor(paperHeight / imageWidth);
  const portraitImagesTotal = portraitImagesInWidth * portraitImagesInHeight;

  const landscapeImagesInWidth = Math.floor(paperWidth / imageWidth);
  const landscapeImagesInHeight = Math.floor(paperHeight / imageHeight);
  const landscapeImagesTotal = landscapeImagesInWidth * landscapeImagesInHeight;

  console.log(portraitImagesTotal, landscapeImagesTotal);

  return portraitImagesTotal > landscapeImagesTotal
    ? portraitImagesTotal
    : landscapeImagesTotal;
}

const ImageResult = () => {
  const { imgcount, paperSize, imagesize } = useParams();

  const [imageList, setImageList] = useState([]);
  const [imgURL, setImgURL] = useState([]);

  const { imgsSelect, setImgsSelect } = useContext(ImageData);

  const { paperList, setPaperList } = useContext(PaperData);

  const [isGenerate, setIsGenerate] = useState(true);

  const [isPrint, setIsPrint] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  const [loadingStatus, setLoadingStatus] = useState('Printing Images');

  const [selectedImages, setSelectedImages] = useState([]);

  const ImgContainerRef = useRef(null);

  const ImgEditorRef = useRef(null);

  const PaperRef = useRef(null);
  let DefaultDPI = 60;
  const [DPI, setDPI] = useState(DefaultDPI);

  const handleSaveImageToPDF = () => {
    setLoadingStatus('Saving Images To PDF');
    window.electron.ipcRenderer
      .invoke('BSaveToPDF')
      .then((res) => {
        console.log(res);

        setIsProcessing(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (ImgContainerRef.current) {
      const divWidth = ImgContainerRef.current.offsetWidth;
      const divHeight = ImgContainerRef.current.offsetHeight;

      console.log('Div width:', divWidth, divHeight);
    }
  }, []);

  const ComputeGeneratingImage = useMemo(() => {
    let image = imgsSelect[0];

    let indexc = 1;

    imageList.map((data, index) => {
      indexc = index + 2;
    });

    image = imgsSelect[indexc - 1];

    if (imgcount == imageList.length || imageList.length > imgcount) {
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

  const PrintPaper = async (image: any, papersize: any) => {
    // calling IPC exposed from preload script
    console.log('Printing Img', image, papersize);
    await window.electron.ipcRenderer.sendMessage('print-paper', {
      image,
      papersize,
    });
  };

  useEffect(() => {
    // window.electron.ipcRenderer.invoke('imageUpdated');
    setPaperList([]);

    window.electron.ipcRenderer.on('paperUpdated', (filename) => {
      console.log(filename);
      setPaperList((prevList) => [...prevList, filename]);
      console.log('IS Print', isPrint);
      if (isPrint) {
        PrintPaper(filename, paperSize);
      }
    });

    return () => {
      window.electron.ipcRenderer.removeListener('paperUpdated');
    };
  }, [isPrint]);

  useEffect(() => {
    window.electron.ipcRenderer.on('pdfUpdated', (filename) => {
      console.log(filename);
      // setPaperList((prevList) => [...prevList, filename]);
      setIsProcessing(false);
    });

    return () => {
      window.electron.ipcRenderer.removeListener('pdfUpdated');
    };
  }, []);

  const [position, setPosition] = useState(0);

  const OnRightArrowClick = () => {
    setSelectedImages([]);
    setFilterData([])
    console.log(position);
    if (MapedImage) {
      if (position < MapedImage.length - 1) setPosition((prev) => prev + 1);
    }
  };

  const OnLeftArrowClick = () => {
    setSelectedImages([]);
    setFilterData([])
    console.log(position, MapedImage.length - 1);
    if (MapedImage) {
      let mil = MapedImage.length - 1;
      if (position >= 1) setPosition((prev) => prev - 1);
    }
  };

  const PrintPages = () => {
    // window.electron.ipcRenderer.invoke('imageUpdated');
    setLoadingStatus('Printing Papers');
    setPaperList([]);

    setIsPrint(true);
    setIsProcessing(true);
    window.electron.ipcRenderer.sendMessage('BSave', '_');
  };

  //Stop IS Processing when the paper is full to mapedimaged

  useEffect(() => {
    if (paperList.length >= MapedImage.length) {
      if(isProcessing && paperList.length > 0){
         window.electron.ipcRenderer.sendMessage('openLocation',paperList[0])
      }
      setIsProcessing(false);
      setIsPrint(false);
      // window.electron.ipcRenderer.invoke('imageUpdated');
      setPaperList([]);
    }
  }, [isProcessing, setIsProcessing, setIsPrint, paperList, setPaperList]);

  const saveImagesToFolder = () => {
    setLoadingStatus('Saving Images To Folder');

    window.electron.ipcRenderer
      .invoke('BSaveToFolder')
      .then((res) => {
        console.log(res);

        setIsProcessing(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const BackToMenu = () => {
    navigate('/beautymaker');
  };

  //Image Editing....................
  const [editShow, setEditShow] = useState(false);
  const [imguri, setImgURI] = useState(null);
  const [editIndex, setEditIndex] = useState(0);

  const handleClose = () => {
    setEditShow(false);
  };

  const handleEditOpen = (index) => {
    let imguri = MapedImage[position][selectedImages[index]];
    console.log(selectedImages[index])
    setEditIndex(selectedImages[index]);
    setImgURI(imguri);
    setEditShow(true);
  };

  const [filterdata, setFilterData] = useState({});

  const handleSave = (imgindex: number) => {
    // let img = MapedImage[imgindex];

    const getImageAndSave = async (imguri: string) => {
      // const result = await window.electron.ipcRenderer.invoke('uritoimg', [
      //   imguri,
      // ]);

      // // setImgData((prev) => [...img_data, result[0]]);
      // console.log(result[0])
      // if (result && capsize) {
      //   window.electron.ipcRenderer.invoke('save-image', [
      //     result[0], //Image Data
      //     filtered,
      //     capsize, //Captured Windows Size
      //     imguri, //For Saving img uri
      //   ]);
      //   setEditShow(false);
      // }

      ImgEditorRef.current.save();

      console.log(imgindex,"IMage index")
      let fdata = filterdata;
      fdata[imgindex] = filtered;
      setFilterData(fdata);
      setReload(true);
      setSelectedImages([])
      console.log(fdata, 'filter data');
    };

    getImageAndSave(imguri);
  };

  const [capsize, setCapSize] = useState(null);

  const [filtered, setFiltered] = useState();
  const [reload,setReload] = useState(true);

  const MapedImage = useMemo(() => {
    const fitImageCount = PhotoCount(
      paperSize?.split(',')[0],
      paperSize?.split(',')[1],
      imagesize?.split(',')[0],
      imagesize?.split(',')[1]
    );

    let count = 0;

    let MapedList = {};

    imgURL.map((img, index) => {
      if (index % fitImageCount === 0) {
        count += 1;
      }

      if (!MapedList[count]) {
        MapedList[count] = [img];
      } else {
        MapedList[count].push(img);
      }
    });

    console.log('Mapped List', Object.values(MapedList));
    return Object.values(MapedList);
  }, [imageList, paperSize, imagesize]);


  const EditImageModal = () => {
    return (
      <Modal show={editShow} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Image Editor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ImageEditor
          ref={ImgEditorRef}
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
        padding: 10,
        paddingBottom: 0,
        width: '99.7vw',
      }}
    >
      {EditImageModal()}
      <Col
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          justifyCotent: 'center',
        }}
      >
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
        <div onClick={BackToMenu}>
          <HouseFill size={40} />
        </div>
      </Col>

      <div
        style={{
          width: '100%',
          height: 2,
          backgroundColor: '#fbfbfb',
        }}
      />
      <Row
        style={{
          display: 'flex',
          position: 'relative',
          height: '87vh',
        }}
      >
       
        <Col
          lg={1}
          md={1}
          sm={1}
          style={{
            backgroundColor: 'gray',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          <div onClick={OnLeftArrowClick} className={'arrow-button left'}>
            {position !== 0 && <ArrowLeftCircleFill size={50} />}
          </div>
        </Col>
        <Col
          style={{
            backgroundColor: 'gray',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',

            height: '100%',
          }}
        >
          {reload && MapedImage.length > 0 && (
            <Paper
              paperSize={paperSize}
              imagesize={imagesize}
              dpi={DPI}
              images={MapedImage[position]}
              ref={PaperRef}
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImages}
              filter={filterdata}
              
            />
          )}

          <div
            style={{
              position: 'absolute',
              bottom: 10,
              backgroundColor: '#d9d9d9',
              borderRadius: 15,
              padding: 8,
              textAlign: 'center',
            }}
          >
            {MapedImage && position + 1 + '/' + MapedImage.length}
          </div>
        </Col>

        <Col
          lg={1}
          md={1}
          sm={1}
          style={{
            backgroundColor: 'gray',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          <div onClick={OnRightArrowClick} className={'arrow-button right'}>
            {MapedImage && position == MapedImage.length - 1 ? null : (
              <ArrowRightCircleFill size={50} />
            )}
          </div>
        </Col>

        <Col lg={2}>
          <Button style={{ width: '100%', padding: 3 }} onClick={PrintPages}>
            <Printer size={25} /> Print
          </Button>
          <Button
            style={{ width: '100%', padding: 3, marginTop: 8 }}
            onClick={handleSaveImageToPDF}
          >
            <Save2 size={25} /> Export PDF
          </Button>
          <Button
            style={{ width: '100%', padding: 3, marginTop: 8 }}
            onClick={saveImagesToFolder}
          >
            <Folder2Open size={25} /> Save To Folder
          </Button>
          {selectedImages.length == 1 ? (
            <Button
              variant="warning"
              style={{ width: '100%', padding: 3, marginTop: 8 }}
              onClick={() => handleEditOpen(0)}
            >
              <PencilSquare size={25} /> Edit Image
            </Button>
          ) : null}
        </Col>

      </Row>

      {isProcessing && (
        <div className="generatingimg">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h6 style={{ color: 'black', marginTop: 5 }}>{loadingStatus}</h6>
            <h6 style={{ color: 'black', marginTop: 5 }}>
              {paperList.length + '/' + MapedImage.length}
            </h6>
            <img src={loading} style={{ width: 100 }} />
          </div>
        </div>
      )}

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
