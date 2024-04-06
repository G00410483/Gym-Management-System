import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import './SubscriptionPlan.css';

// Subscription Plans Component with Dynamic Data Fetching
const SubscriptionPlans = () => {
    const [plans, setPlans] = useState([]); // State to hold subscription plans data

    const navigate = useNavigate(); // Hook to navigate to different routes

    // Function to handle subscription button click
    const handleSubscribeClick = () => {
      navigate('/registerMember'); // Navigate to the registration page
    };

    // Effect hook to fetch subscription plans data when component mounts
    useEffect(() => {
        fetch('http://localhost:3001/') // Fetch data from server
            .then(response => response.json()) // Parse response as JSON
            .then(data => setPlans(data)) // Update state with fetched data
            .catch(error => console.error('Error fetching subscription plans:', error)); // Log any errors
    }, []); // The empty array ensures this effect runs only once after the initial render

    return (
        <section className="subscription-section">
            <MDBContainer>
                <MDBRow className="text-center">
                    {plans.map((plan, index) => ( // Map over subscription plans to render cards
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
