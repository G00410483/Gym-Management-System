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
}
    from 'mdb-react-ui-kit';


function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful', data);
                localStorage.setItem('token', data.token);
                navigate('/homepage'); 
            } else {
                throw new Error('Unauthorized');
            }
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    };

    return (
        /* Reference: https://mdbootstrap.com/docs/react/extended/login-form/ */
        <div>
            <form onSubmit={handleSubmit}>
                <MDBContainer fluid>

                    <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                        <MDBCol col='12'>

                            <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '400px' }}>
                                <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>

                                    <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                                    <p className="text-white-50 mb-5">Please enter your login and password!</p>

                                    <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Email address' id='formControlLg' type='email' size="lg"
                                        value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Password' id='formControlLg' type='password' size="lg"
                                        value={password} onChange={(e) => setPassword(e.target.value)} required />

                                    <p className="small mb-3 pb-lg-2"><a class="text-white-50" href="#!">Forgot password?</a></p>

                                    <MDBBtn className='mx-2' color='light' size='lg' type="submit">
                                        Login
                                    </MDBBtn>
                                    <br></br>
                                    <div>
                                        <p className="mb-0">Don't have an account? <a href="/registerForm" class="text-white-50 fw-bold">Sign Up</a></p>

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

export default LoginForm;
