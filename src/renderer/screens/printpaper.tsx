import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import loading from '../../../assets/image/loading.gif';
import Person from '../../../assets/image/img2.jpg';
import { useNavigate, useParams } from 'react-router-dom';
import { ImageData, PaperData } from 'renderer/context/context';

const PrintPaper = () => {
  const { imgcount } = useParams();

  const [imageList, setImageList] = useState([]);

  const { imgsSelect, setImgsSelect } = useContext(ImageData);

  const { paperList, setPaperList } = useContext(PaperData);

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
      </Row>
      <div
        style={{
          width: '100%',
          height: 2,
          backgroundColor: '#fbfbfb',
        }}
      />
      <Row>
        <Col style={{ height: '90vh', overflowY: 'auto',backgroundColor:'black' }}>
          <Row style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
            
            {paperdata.map((paper, index) => (
              <img src={paper} key={index} style={{width:'79%',marginTop:5,marginBottom:5}}/>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default PrintPaper;
