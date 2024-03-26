import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MemberDetails = () => {
    const [member, setMember] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMemberDetails = async () => {
            try {
                const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const response = await axios.get('http://localhost:3001/displayMember', config);
                setMember(response.data);
            } catch (err) {
                setError('Failed to fetch member details');
                console.error(err);
            }
        };

        fetchMemberDetails();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
      /* Reference for template: https://mdbootstrap.com/docs/standard/extended/profiles/ */
        <section className="vh-100" style={{backgroundColor: "#f4f5f7"}}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-lg-6 mb-4 mb-lg-0">
                        <div className="card mb-3" style={{borderRadius: ".5rem"}}>
                            <div className="row g-0">
                                <div className="col-md-4 gradient-custom text-center text-white"
                                    style={{borderTopLeftRadius: ".5rem", borderBottomLeftRadius: ".5rem"}}>
                                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                        alt="Avatar" className="img-fluid my-5" style={{width: "80px"}} />
                                    <h5>{member.first_name} {member.second_name}</h5>
                                    <p>Member</p>
                                    <i className="far fa-edit mb-5"></i>
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body p-4">
                                        <h6>Information</h6>
                                        <hr className="mt-0 mb-4" />
                                        <div className="row pt-1">
                                            <div className="col-6 mb-3">
                                                <h6>Email</h6>
                                                <p className="text-muted">{member.email_address}</p>
                                            </div>
                                            <div className="col-6 mb-3">
                                                <h6>Gender</h6>
                                                <p className="text-muted">{member.gender}</p>
                                            </div>
                                        </div>
                                        <div className="row pt-1">
                                            <div className="col-6 mb-3">
                                                <h6>Date of Birth</h6>
                                                <p className="text-muted">{member.date_of_birth}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MemberDetails;
