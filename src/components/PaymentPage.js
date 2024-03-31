import React from 'react';
import { useLocation } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

// Load your Stripe publishable key here
const stripePromise = loadStripe('pk_test_51OyyOfRpGdubHKaA6VpqAAfcsozJuhCtLUjpEasbzDoD0dBBUrNCm9PZ8ZhFOrRjySB2NNNzAYOeSkuTNyGk94DI00UDap7uvu');

const PaymentPage = () => {
  const location = useLocation();
  const { price } = location.state || {}; // Accessing price from the state
  const { email } = location.state || {}; // Accessing email from the state

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm price={price} email={email}/>
    </Elements>
  );
};


export default PaymentPage;
