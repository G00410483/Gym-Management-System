import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './BasicExample.css'; // Assuming your CSS file is named BasicExample.css

function BasicExample() {
  return (
    <Form className="modern-form">
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label className="form-label">Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" className="form-control" />
        <Form.Text className="text-muted form-text">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label className="form-label">Password</Form.Label>
        <Form.Control type="password" placeholder="Password" className="form-control" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" className="form-check" />
      </Form.Group>
      <Button variant="primary" type="submit" className="submit-button">
        Submit
      </Button>
    </Form>
  );
}

export default BasicExample;
