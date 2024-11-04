import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { GearFill } from 'react-bootstrap-icons';
import icon from '../../../assets/image/icon.png';
import i1 from '../../../assets/image/h1.png';
import i2 from '../../../assets/image/h2.png';
import i3 from '../../../assets/image/h3.png';
import '../style/home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const goToPassportMaker = () => {
    navigate('/passportmaker');
  };

  const goToBeautyMaker = () => {
    navigate('/beautymaker');
  };

  const goToInvitationMaker = () => {
    navigate('/invitationmaker');
  };

  const goToSetting = () =>{
    navigate('/settings');
  }

  return (
    <div style={{ display: 'flex', backgroundColor: '#fbfbfb' }}>
      <Container>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            marginTop: 70,
          }}
        >
          <img
            src={icon}
            style={{
              width: 100,
              height: 100,
              objectFit: 'contain',
              marginBottom: 5,
            }}
          />
          <h2>Smart Crop Photo Maker </h2>
          <p>10x your productivity</p>
        </div>
        <div>
          <Row>
            <Col>
              <Card onClick={goToPassportMaker} className={'hcard'}>
                <Card.Img src={i1} className={'hcard-img'} />
                <Card.Text className={'hcard-text'}>
                  Passport Photo Maker
                </Card.Text>
              </Card>
            </Col>
            <Col>
              <Card onClick={goToBeautyMaker} className="hcard">
                <Card.Img src={i2} className={'hcard-img'} />
                <Card.Text className={'hcard-text'}>
                  Beauty Photo Maker
                </Card.Text>
              </Card>
            </Col>
            <Col>
              <Card onClick={goToInvitationMaker} className={'hcard'}>
                <Card.Img src={i3} className={'hcard-img'} />
                <Card.Text className={'hcard-text'}>Invitation Maker</Card.Text>
              </Card>
            </Col>
          </Row>
        </div>
        <Row>
          {/* <Col>
            <div style={{ position: 'absolute', bottom: 10, right: 15 }} onClick={goToSetting}>
              <GearFill size={30} />
            </div>
          </Col> */}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
