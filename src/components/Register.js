import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBIcon
} from 'mdb-react-ui-kit';
import { alignProperty } from '@mui/material/styles/cssUtils';


function Register() {
    const [firstName, setFirstName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://gms-deployment-heroku-129176233d83.herokuapp.com/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, secondName, email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Registration successful', data);
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                throw new Error('Unauthorized');
            }
        } catch (error) {
            alert('Registration failed: ' + error.message);
        }
    };

    const navigateToLogin = (e) => navigate('/');

    return (
        /* Reference: https://mdbootstrap.com/docs/react/extended/login-form/ */
        <div>
            <form onSubmit={handleSubmit}>
                <MDBContainer fluid>

                    <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                        <MDBCol col='12'>

                            <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '400px' }}>
                                <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>

                                    <h2 className="fw-bold mb-2 text-uppercase">REGISTER</h2>
                                    <p className="text-white-50 mb-5">Please enter your registration details!</p>

                                    <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='First Name' id='formControlLg' type='firstName' size="lg"
                                        value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                                    <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Second Name' id='formControlLg' type='secondName' size="lg"
                                        value={secondName} onChange={(e) => setSecondName(e.target.value)} required />
                                    <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Email address' id='formControlLg' type='email' size="lg"
                                        value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Password' id='formControlLg' type='password' size="lg"
                                        value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    <div>
                                        <MDBBtn className='mx-2' color='light' size='lg' type="submit">
                                            Register
                                        </MDBBtn>
                                        <div>
                                            <p className="mb-0"><a href="/login" class="text-white-50 fw-bold">Back to Login</a></p>

                                        </div>
                                    </div>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </form>

        </div>
    );
}

export default Register;
