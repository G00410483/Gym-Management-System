import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './RegisterMembers.css'; // Assuming your CSS file is named BasicExample.css

function RegisterMembers() {
  return (
    <Form className="modern-form">
         {/* Enter first name */}
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label className="form-label">First name</Form.Label>
        <Form.Control type="email" placeholder="Enter email" className="form-control" />
      </Form.Group>
       {/* Enter second name */}
       <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label className="form-label">Second name</Form.Label>
        <Form.Control type="email" placeholder="Enter email" className="form-control" />
      </Form.Group>
       {/* Enter email address */}
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label className="form-label">Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" className="form-control" />
        <Form.Text className="text-muted form-text">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Button variant="primary" type="submit" className="submit-button">
        Submit
      </Button>
    </Form>
  );
}

export default RegisterMembers;
