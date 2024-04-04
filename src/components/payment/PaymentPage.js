import React from 'react';
import { useLocation } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

// Loading Stripe publishable key
const stripePromise = loadStripe('pk_test_51OyyOfRpGdubHKaA6VpqAAfcsozJuhCtLUjpEasbzDoD0dBBUrNCm9PZ8ZhFOrRjySB2NNNzAYOeSkuTNyGk94DI00UDap7uvu');

const PaymentPage = () => {
  // Using location to get state passed from the previous page 
  const location = useLocation();

  // Destruct price and email from the location state 
  const { price, email } = location.state || { price: null, email: '' };
  
  // Render Stripe Element component which provide Stipe functionality 
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm price={price} email={email}/>
    </Elements>
  );
};


export default PaymentPage;
