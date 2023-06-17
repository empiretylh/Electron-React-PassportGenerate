import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Setting = () => {
  const navigate = useNavigate();

  const [key, setKey] = useState();

  const BackkToHome = () => {
    navigate('/');
  };

  useEffect(() => {
    getKey();
  }, []);

  const getKey = () => {
    return window.electron.ipcRenderer.invoke('register_id').then((res) => {
      setKey(res);
    });
  };

  const deleteKey = () => {
    window.electron.ipcRenderer.invoke('delete_register_id');
  };
  return (
    <Container>
      <h2 style={{ marginTop: 100 }}>
        <strong>Setting</strong>
      </h2>
      <Row>
        <Col>Your Key is {key}</Col>
      </Row>
      <Row>
        <Col>
          <Button style={{ margin: 10 }}> Change Key</Button>
          <Button style={{ margin: 10 }} variant="danger" onClick={deleteKey}>
            {' '}
            Delete Key
          </Button>
          <Button style={{ margin: 10 }} onClick={deleteKey}>
            {' '}
            Delete Key
          </Button>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default Setting;
