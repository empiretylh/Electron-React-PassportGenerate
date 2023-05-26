import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup } from 'react-bootstrap';
import { ArrowRightCircle } from 'react-bootstrap-icons';

const RegisterPage = () => {
  const [phoneNo, setPhoneNo] = useState('');
  const [data, setData] = useState([]);
  const [key, setKey] = useState();
  const [isLoading,setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    console.log(phoneNo);

    const result = await window.electron.ipcRenderer.invoke(
      'create_acc',
      phoneNo
    );
    console.log(result, 'Resultttt::;');
    if (result) {
      setKey(result);
    }
    await window.electron.ipcRenderer.sendMessage('key_listen');
  };
  const getKey = async () => {
    console.log('Getting Key');
    await window.electron.ipcRenderer.sendMessage('key_listen');

    const key = await window.electron.ipcRenderer.invoke('register_id');
    console.log('Key :: ', key);
    if (key) {
      setKey(key);
    }
  };

  useEffect(() => {
    getKey();
  }, []);

  const handleChangePhone = async () => {
    setIsLoading(false);
    await window.electron.ipcRenderer.invoke('delete_register_id');
    setKey(null);
  };

  return (
    <div className="container">
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <h3>Register</h3>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          {key ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              {' '}
              <h5>You are registered with this key.</h5>
              <br />
              <h4>
                <a href={'#'}>({key}) </a> <br />{' '}
              </h4>
              <p>
                You have to wait when the admin is allow to use this
                application.
              </p>
            </div>
          ) : (
            <Form disabled={isLoading} onSubmit={handleSubmit}>
              <FormGroup
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <Form.Control
                  id="phoneNo"
                  name="phoneNo"
                  type="text"
                  placeholder="09xxxxxxxxx"
                  maxLength={11}
                  minLength={11}
                  value={phoneNo}
                  onChange={(event) => setPhoneNo(event.target.value)}
                  required
                />
                <Button
                  variant="primary"
                  type="submit"
                  style={{ marginLeft: 5 }}
                >
                  <ArrowRightCircle />
                </Button>
              </FormGroup>
            </Form>
          )}
          {key && (
            <Button
              variant="primary"
              type="submit"
              style={{ marginLeft: 5 }}
              onClick={handleChangePhone}
            >
              Change Phone Number
            </Button>
          )}
        </div>
       {!key && <p style={{ marginTop: 10, }}>
          <strong>To get started,</strong> we require your phone number for
          registration.
          <br /> Please provide your valid <strong> phone number </strong> in
          the field.
        </p>}
        <div style={{ position: 'absolute', bottom: 10 }}>
          By registering, you agree to our <a href="#">Terms of Service</a> and{' '}
          <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
