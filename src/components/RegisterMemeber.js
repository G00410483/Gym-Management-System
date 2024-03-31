import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './RegisterMember.css';
import { useNavigate } from 'react-router-dom';
import PaymentPage from './PaymentPage';

const membershipPrices = {
  basic: 40000, 
  premium: 55000,
  VIP: 70000,
};

function RegisterMembers() {
  const [ppsNumber, setPPSNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [startDate, setStartDate] = useState('');
  const [typeOfMembership, setTypeOfMembership] = useState('');

  const navigate = useNavigate();

  // Calculate the date 16 years ago from today
  const today = new Date();
  const minimumAge = 16;
  const minDateOfBirth = new Date(today.getFullYear() - minimumAge, today.getMonth(), today.getDate());

  // Calculate today's date in YYYY-MM-DD format
  const todayFormatted = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // PPS Number validation
    // 7 digits followed by 2 letters
    const ppsRegex = /^\d{7}[A-Z]{2}$/i; // The 'i' flag makes it case-insensitive
    if (!ppsRegex.test(ppsNumber)) {
      alert('Invalid PPS Number format. Please enter 7 numbers followed by 2 letters.');
      return; // Stop the form submission
    }

    // 
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      alert('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return; // Stop the form submission
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return; // Stop the form submission
    }

    // Compare entered date of birth with the calculated date
    if (new Date(dateOfBirth) > minDateOfBirth) {
      alert('You must be at least 16 years old.');
      return; // Stop the form submission
    }

    try {
      const response = await fetch('http://localhost:3001/registerMember', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ppsNumber, firstName, secondName, email, password, gender, dateOfBirth, startDate, typeOfMembership }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful', data);
        navigate('/payment', { state: { email: email, price: membershipPrices[typeOfMembership] } });
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
      <Form.Group className="mb-3" controlId="formPPS">
        <Form.Label className="form-label" >PPS Number</Form.Label>
        <Form.Control type="ppsNumber" placeholder="Enter PPS Number" className="form-control" value={ppsNumber} onChange={(e) => setPPSNumber(e.target.value)} required />
      </Form.Group>
      {/* Enter first name */}
      <Form.Group className="mb-3" controlId="formName">
        <Form.Label className="form-label" >First name</Form.Label>
        <Form.Control type="firstName" placeholder="Enter First Name" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
      </Form.Group>
      {/* Enter second name */}
      <Form.Group className="mb-3" controlId="formSurname">
        <Form.Label className="form-label" >Second name</Form.Label>
        <Form.Control type="secondName" placeholder="Enter Second Name" className="form-control" value={secondName} onChange={(e) => setSecondName(e.target.value)} required />
      </Form.Group>
      {/* Enter email address */}
      <Form.Group className="mb-3" controlId="formEmail">
        <Form.Label className="form-label" >Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Form.Text className="text-muted form-text">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>
      {/* Enter password */}
      <Form.Group className="mb-3" controlId="formPassword">
        <Form.Label className="form-label">Password</Form.Label>
        <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </Form.Group>
      {/* Confirm password */}
      <Form.Group className="mb-3" controlId="formConfirmPassword">
        <Form.Label className="form-label">Confirm Password</Form.Label>
        <Form.Control type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      </Form.Group>
      {/* Enter gender */}
      <Form.Group className="mb-3" controlId="formGender">
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
      <Form.Group className="mb-3" controlId="formStartDate">
        <Form.Label className="form-label" >Start Date</Form.Label>
        <Form.Control
          type="date"
          placeholder="Enter Start Date"
          className="form-control"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={todayFormatted} // Set the minimum date to today
          required
        />
      </Form.Group>
      {/* Enter type of membership */}
      <Form.Group className="mb-3" controlId="formBasicGender">
        <Form.Label className="form-label" >Type of Membership</Form.Label>
        <Form.Select aria-label="Membership select" className="form-control" value={typeOfMembership} onChange={(e) => {setTypeOfMembership(e.target.value)}} required>
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
