import React, { useState } from 'react';
import { Button, Form, FormGroup } from 'react-bootstrap';
import { ArrowRightCircle } from 'react-bootstrap-icons';

const RegisterPage = () => {
  const [phoneNo, setPhoneNo] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(phoneNo);
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
          <Form onSubmit={handleSubmit}>
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
              <Button variant="primary" type="submit" style={{ marginLeft: 5 }}>
                <ArrowRightCircle />
              </Button>
            </FormGroup>
          </Form>
        </div>

        <p>
          By registering, you agree to our <a href="#">Terms of Service</a> and{' '}
          <a href="#">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
