import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import ExampleCarouselImage from './ExampleCarouselImage';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import './Homepage.css';
import SubscriptionPlans from './SubscriptionPlan';
import videoBg from '../assets/video.mp4'


function Homepage() {
    return (
        <div className="video-background">
            <video autoPlay muted loop id="videoBg" style={{ position: 'absolute', width: '100%', left: '50%', top: '50%', height: '100%', objectFit: 'cover', transform: 'translate(-50%, -50%)', zIndex: '0' }}>
                <source src={videoBg} type="video/mp4" />
            </video>
            <div className="video-overlay"></div> {/* Overlay Added */}
            <div className="content-container">
                <div className="d-flex justify-content-center align-items-center">
                    <Carousel style={{ width: '32rem', height: '300px' }}>
                        {ExampleCarouselImage.map((imageUrl, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100"
                                    src={imageUrl}
                                    alt={`Slide ${index + 1}`}
                                    style={{ height: '300px' }}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
                <SubscriptionPlans />

                <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>
                    <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
                        <div className='me-5 d-none d-lg-block'>
                            <span>Get connected with us on social networks:</span>
                        </div>

                        <div>
                            <a href='' className='me-4 text-reset'>
                                <MDBIcon fab icon="facebook-f" />
                            </a>
                            <a href='' className='me-4 text-reset'>
                                <MDBIcon fab icon="twitter" />
                            </a>
                            <a href='' className='me-4 text-reset'>
                                <MDBIcon fab icon="google" />
                            </a>
                            <a href='' className='me-4 text-reset'>
                                <MDBIcon fab icon="instagram" />
                            </a>
                            <a href='' className='me-4 text-reset'>
                                <MDBIcon fab icon="linkedin" />
                            </a>
                            <a href='' className='me-4 text-reset'>
                                <MDBIcon fab icon="github" />
                            </a>
                        </div>
                    </section>

                    <section className=''>
                        <MDBContainer className='text-center text-md-start mt-5'>
                            <MDBRow className='mt-3'>
                                <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
                                    <h6 className='text-uppercase fw-bold mb-4'>
                                        <MDBIcon icon="gem" className="me-3" />
                                        Company name
                                    </h6>
                                    <p>
                                        Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit amet,
                                        consectetur adipisicing elit.
                                    </p>
                                </MDBCol>

                                <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
                                    <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
                                    <p>
                                        <MDBIcon icon="home" className="me-2" />
                                        New York, NY 10012, US
                                    </p>
                                    <p>
                                        <MDBIcon icon="envelope" className="me-3" />
                                        info@example.com
                                    </p>
                                    <p>
                                        <MDBIcon icon="phone" className="me-3" /> + 01 234 567 88
                                    </p>
                                    <p>
                                        <MDBIcon icon="print" className="me-3" /> + 01 234 567 89
                                    </p>
                                </MDBCol>
                            </MDBRow>
                        </MDBContainer>
                    </section>

                    <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                        © 2021 Copyright:
                        <a className='text-reset fw-bold' href='https://mdbootstrap.com/'>
                            MDBootstrap.com
                        </a>
                    </div>
                </MDBFooter>
            </div>
        </div>
    );
}

export default Homepage;
