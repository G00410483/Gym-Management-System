import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './RegisterMember.css';
import { useNavigate } from 'react-router-dom';

function RegisterMembers() {
  const [ppsNumber, setPPSNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [startDate, setStartDate] = useState('');
  const [typeOfMembership, setTypeOfMembership] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/registerMember', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ppsNumber, firstName, secondName, email, gender, dateOfBirth, startDate, typeOfMembership }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful', data);
        navigate('/');
      }
      else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };
  return (
    <Form className="modern-form" onSubmit={handleSubmit}>
      {/* Enter pps number */}
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label className="form-label" >PPS Number</Form.Label>
        <Form.Control type="ppsNumber" placeholder="Enter PPS Number" className="form-control" value={ppsNumber} onChange={(e) => setPPSNumber(e.target.value)} required />
      </Form.Group>
      {/* Enter first name */}
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label className="form-label" >First name</Form.Label>
        <Form.Control type="firstName" placeholder="Enter First Name" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
      </Form.Group>
      {/* Enter second name */}
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label className="form-label" >Second name</Form.Label>
        <Form.Control type="secondName" placeholder="Enter Second Name" className="form-control" value={secondName} onChange={(e) => setSecondName(e.target.value)} required />
      </Form.Group>
      {/* Enter email address */}
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label className="form-label" >Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Form.Text className="text-muted form-text">
          We'll never share your email with anyone else.
        </Form.Text>
        {/* Enter gender */}
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicGender">
        <Form.Label className="form-label" >Gender</Form.Label>
        <Form.Select aria-label="Gender select" className="form-control" value={gender} onChange={(e) => setGender(e.target.value)} required>
          <option value="">Select your gender</option> {/* Default prompt option */}
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="prefer not to say">Prefer not to say</option>
        </Form.Select>
      </Form.Group>
      {/* Enter date of birth */}
      <Form.Group className="mb-3" controlId="formDateOfBirth">
        <Form.Label className="form-label" >Date of Birth</Form.Label>
        <Form.Control type="date" placeholder="Enter Date of Birth" className="form-control" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
      </Form.Group>
      {/* Enter start date */}
      <Form.Group className="mb-3" controlId="formStartDate">
        <Form.Label className="form-label" >Start Date</Form.Label>
        <Form.Control type="date" placeholder="Enter Start Date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
      </Form.Group>
      {/* Enter type of membership */}
      <Form.Group className="mb-3" controlId="formBasicGender">
        <Form.Label className="form-label" >Type of Membership</Form.Label>
        <Form.Select aria-label="Membership select" className="form-control" value={typeOfMembership} onChange={(e) => setTypeOfMembership(e.target.value)} required>
          <option value="">Select Membership Type</option>
          <option value="basic">basic</option>
          <option value="premium">premium</option>
          <option value="VIP">VIP</option>
        </Form.Select>
      </Form.Group>

      <Button variant="primary" type="submit" className="submit-button">
        Submit
      </Button>
    </Form>
  );
}

export default RegisterMembers;
