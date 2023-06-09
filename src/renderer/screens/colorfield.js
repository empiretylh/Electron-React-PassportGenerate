import { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';

const ColorPicker = ({color,setColor}) => {


    const handleColorChange = (e) => {
        const enteredColor = e.target.value;
        setColor(enteredColor);
    };

    return (
        <Form.Group controlId="colorPicker">
            <Form.Label>Background Color:</Form.Label>

            <div className="d-flex align-items-center">
                <InputGroup>
                    <InputGroup.Text>
                        <div
                            className="ml-2"
                            style={{
                                width: '24px',
                                height: '24px',
                                backgroundColor: '#' + color,
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                            }}
                        />
                    </InputGroup.Text>
                    <Form.Control
                        type="text"
                        required
                        placeholder="Enter color code"
                        maxLength={6}

                        minLength={6}
                        value={color}
                        onChange={handleColorChange}
                    />

                </InputGroup>
            </div>
        </Form.Group>
    );
};

export default ColorPicker;
