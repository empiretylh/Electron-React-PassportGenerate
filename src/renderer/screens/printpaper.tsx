import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import loading from '../../../assets/image/loading.gif';
import Person from '../../../assets/image/img2.jpg';
import { useNavigate, useParams } from 'react-router-dom';
import { ImageData, PaperData,PaperSize } from 'renderer/context/context';
import { nativeImage } from 'electron';

const PrintPaper = () => {
  const { imgcount } = useParams();

  const [imageList, setImageList] = useState([]);

  const { imgsSelect, setImgsSelect } = useContext(ImageData);

  const { paperList, setPaperList } = useContext(PaperData);

  const {papersize,setPSize} = useContext(PaperSize);

  const [isGenerate, setIsGenerate] = useState(true);

  const [paperdata, setPaperData] = useState([]);

  const navigate = useNavigate();

  const LoadImg = async () => {
    const result = await window.electron.ipcRenderer.invoke(
      'uritoimg',
      paperList
    );
    if (result) {
      console.log(result, 'Resultttttttttttttt');
      setPaperData(result);
    }
  };

  const PrintPaper = async (image:any,papersize:any) => {
    // calling IPC exposed from preload script

    await window.electron.ipcRenderer.sendMessage('print-paper',{image,papersize})
  };

  const HandlePrint = ()=>{
 
      PrintPaper(paperList,papersize);
      console.log("printing paper",papersize)
 
  }

  useEffect(() => {
    LoadImg();
  }, [paperList, setPaperList]);

  const BacktoHome = () => {
    navigate('/');
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
          <Button style={{ padding: 10, width: 180 }} onClick={BacktoHome}>
            Back to Home
          </Button>
        </Col>
        <Col
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h5>{paperList.length} Pages</h5>
        </Col>
        <Col>
          <Button variant='primary' onClick={HandlePrint}>Print</Button>
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
        <Col
          style={{
            height: '90vh',
            overflowY: 'auto',
            backgroundColor: '#949494',
          }}
        >
          <Row
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {paperdata.map((paper, index) => (
              <img
                src={paper}
                key={index}
                style={{ width: '79%', marginTop: 5, marginBottom: 5 }}
              />
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default PrintPaper;
