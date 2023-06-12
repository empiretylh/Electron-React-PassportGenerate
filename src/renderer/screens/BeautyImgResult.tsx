import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  RangeSlider,
} from 'react-bootstrap';
import loading from '../../../assets/image/loading.gif';
import Person from '../../../assets/image/img2.jpg';
import { useNavigate, useParams } from 'react-router-dom';
import { ImageData, PaperData } from 'renderer/context/context';
import {
  ArrowLeftCircleFill,
  ArrowRight,
  ArrowRightCircleFill,
  Folder,
  HouseExclamation,
  HouseFill,
} from 'react-bootstrap-icons';

import icon from '../../../assets/image/icon.png';
import Paper from 'renderer/extra/Paper';
import { UrlWithStringQuery } from 'url';

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

  const ImgContainerRef = useRef(null);

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

  const MapedImage = useMemo(() => {
    const fitImageCount = PhotoCount(
      paperSize?.split(',')[0],
      paperSize?.split(',')[1],
      imagesize?.split(',')[0],
      imagesize?.split(',')[1]
    );

    let count = 0;

    let MapedList = {};

    imageList.map((img, index) => {
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

  return (
    <Container
      fluid
      style={{
        position: 'relative',
        padding: 10,
        paddingBottom:0,
        width:'99.7vw'
      }}
    >
    
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
        <Col lg={3}>
          <Button>Some Button</Button>
          <Button>Some Button</Button>
        </Col>
        <Col
          style={{
            backgroundColor: 'gray',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            height: '100%',
          }}
        >
          <div>
            <ArrowLeftCircleFill size={50} />
          </div>
          {MapedImage &&
            MapedImage.map((images, index) => (
              <Paper
                paperSize={paperSize}
                imagesize={imagesize}
                dpi={50}
                images={images}
              />
            ))}

          <div>
            <ArrowRightCircleFill size={50} />
          </div>
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
