import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import './SubscriptionPlan.css'; 

// Subscription Plans Component with Dynamic Data Fetching
const SubscriptionPlans = () => {
    const [plans, setPlans] = useState([]);

    const navigate = useNavigate();

    const handleSubscribeClick = () => {
      navigate('/registerMember'); // The path you've associated with RegisterMembers in your routing setup
    };

    useEffect(() => {
        fetch('http://localhost:3001/') 
            .then(response => response.json())
            .then(data => setPlans(data))
            .catch(error => console.error('Error fetching subscription plans:', error));
    }, []); // The empty array ensures this effect runs only once after the initial render

    return (
        <section className="subscription-section">
            <MDBContainer>
                <MDBRow className="text-center">
                    {plans.map((plan, index) => (
                        <MDBCol key={index} md="4" className="mb-4">
                            <div className="subscription-card">
                                <h5 className="subscription-title">{plan.type_of_membership.toUpperCase()}</h5>
                                <p className="price">${plan.price}/month</p>
                                <button className="subscribe-button" onClick={handleSubscribeClick}>Subscribe</button>
                            </div>
                        </MDBCol>
                    ))}
                </MDBRow>
            </MDBContainer>
        </section>
    );
};

export default SubscriptionPlans;
