import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyProfilePage.css';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBBtn,
    MDBBreadcrumb,
    MDBBreadcrumbItem,
    MDBProgress,
    MDBProgressBar,
    MDBIcon,
    MDBListGroup,
    MDBListGroupItem
} from 'mdb-react-ui-kit';

const MemberDetails = () => {
    const [member, setMember] = useState({});
    const [error, setError] = useState('');
    const [bookings, setBookings] = useState([]);


    useEffect(() => {
        const fetchMemberDetails = async () => {
            try {
                const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const response = await axios.get('http://localhost:3001/displayMember', config);
                setMember(response.data.memberDetails); // Assuming response contains memberDetails
                setBookings(response.data.bookings); // Assuming response contains bookings
            } catch (err) {
                setError('Failed to fetch member details');
                console.error(err);
            }
        };

        fetchMemberDetails();
    }, []);

    const deleteBooking = async (bookingId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3001/deleteBooking/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Remove the booking from the local state to update UI
            setBookings(bookings.filter(booking => booking.id !== bookingId));
        } catch (err) {
            console.error('Failed to delete booking', err);
        }
    };


    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        /* Reference for template: https://mdbootstrap.com/docs/standard/extended/profiles/ */
        <section style={{ backgroundColor: '#eee' }}>
            <MDBContainer className="py-5">
                <MDBRow>
                    <MDBCol lg="4">
                        <MDBCard className="mb-4">
                            <MDBCardBody className="text-center">
                                <MDBCardImage
                                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                                    alt="avatar"
                                    className="rounded-circle"
                                    style={{ width: '150px' }}
                                    fluid />
                                <p className="text-muted mb-1"></p>
                                <p className="text-muted mb-4">Member</p>
                                <div className="d-flex justify-content-center mb-2">
                                    <MDBBtn>Follow</MDBBtn>
                                    <MDBBtn outline className="ms-1">Message</MDBBtn>
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol lg="8">
                        <MDBCard className="mb-4">
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>First Name</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{member.first_name}</MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Second Name</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{member.second_name}</MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Email</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{member.email_address}</MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Date of Birth</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">
                                            {
                                                member.date_of_birth ?
                                                    (new Date(member.date_of_birth).toISOString().split('T')[0]) :
                                                    'Date of Birth not available'
                                            }
                                        </MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Start Date</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">
                                            {
                                                member.date_of_birth ?
                                                    (new Date(member.start_date).toISOString().split('T')[0]) :
                                                    'Date of Birth not available'
                                            }
                                        </MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Gender</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{member.gender}</MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Type of Membership</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{member.type_of_membership}</MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>

                        <MDBRow>
                            <MDBCol md="6">
                                <MDBCard className="mb-4">
                                    <MDBCardBody>
                                        <MDBCardText className="mb-4">
                                            <span className="text-primary font-italic me-1">Bookings</span>
                                        </MDBCardText>
                                        {bookings.length > 0 ? (
                                            <MDBListGroup>
                                                {bookings.map((booking, index) => (
                                                    <MDBListGroupItem key={index}>
                                                        Class: {booking.class_name}, Date: {new Date(booking.date).toLocaleDateString()}
                                                        <MDBBtn className="ms-2" color="danger" size="sm" onClick={() => deleteBooking(booking.id)}>Delete</MDBBtn>
                                                    </MDBListGroupItem>
                                                ))}
                                            </MDBListGroup>
                                        ) : (
                                            <MDBCardText>No bookings found</MDBCardText>
                                        )}
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>

                        </MDBRow>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </section>
    );
};

export default MemberDetails;
