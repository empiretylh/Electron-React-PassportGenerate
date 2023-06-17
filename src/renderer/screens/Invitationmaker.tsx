import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { HouseFill } from 'react-bootstrap-icons';
import icon from '../../../assets/image/icon.png';
import { useNavigate } from 'react-router-dom';

const InvitationMaker = () => {

    const navigate = useNavigate()

    const BackToHome = ()=>{
        navigate('/')
    }

  return (
    <Container style={{ height: '100vh' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          height:'70vh'
        }}
      >
        <img src={icon} style={{ width: 100, height: 100, marginBottom: 50 }} />
        <h1 style={{ textAlign: 'center' }}>
          <strong>Invitation Maker is Comming Soon</strong>
        </h1>
        <p style={{ textAlign: 'center' }}>
          We are thrilled to announce that we are developing a powerful
          Invitation Maker to enhance your productivity.
        </p>
        <Button onClick={BackToHome}>
          <HouseFill size={30} /> Back To Menu
        </Button>
      </div>
      <div>
        <h2><strong>Features</strong></h2>
        <ul>
            <li>
                <strong>Customizable Templates:</strong> Choose from a wide range of beautifully designed invitation templates for various occasions.
            </li>
            <li>
                <strong>Personalized Text:</strong> Add your own text, event details, and special messages to make your invitations truly unique.
            </li>
            <li>
                <strong>Image Integration:</strong> Incorporate your own photos to personalize your invitations.
            </li>
            <li>
                <strong>Font and Color Customization:</strong> Select from a variety of fonts and colors to create visually appealing invitations.
            </li>
            <li>
                <strong>Print and Share:</strong> Print your invitations or share them digitally through email or social media platforms.
            </li>
        </ul>
      </div>
    </Container>
  );
};

export default InvitationMaker;
