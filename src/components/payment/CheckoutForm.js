import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './CheckoutForm.css';
import { useNavigate } from 'react-router-dom';

// Reference: https://docs.stripe.com/checkout/quickstart
const CheckoutForm = ({ price, email }) => {
   // Hooks provided by Stripe to use Stripe.js and Elements
  const stripe = useStripe();
  const elements = useElements();

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    // Prevent the form from submitting in the traditional way
    event.preventDefault();

    // Check if Stripe.js is loaded
    if (!stripe || !elements) {
      console.log('Stripe has not loaded');
      return;
    }

     // Retrieves the card details element.
    const cardElement = elements.getElement(CardElement);

    // Attempt of creating payment method using the card details
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    // In case of an error stop the process
    if (error) {
      console.log('[error]', error);
      return; 
    } 
    else {
      console.log('[PaymentMethod]', paymentMethod);
    }

    try {
      // Calling backend to create payment intent
      const response = await fetch('http://localhost:3001/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: price,
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Extraxt payment intent's client secret to proceed with the payment 
      const paymentIntent = await response.json();

      const { clientSecret } = paymentIntent;

      // Confirm the card payment using the client secret
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { email: email },
        },
      });

      if (result.error) {
        console.log('[error]', result.error);
        
      } 
      else {
        // If payment was successful navigate to homepage
        if (result.paymentIntent.status === 'succeeded') {
          console.log('Payment succeeded!');
          alert('Payment succeeded!');
          navigate('/');
        }
      }
    } catch (error) {
      console.error('There was an error!', error);
    }
  };


  return (
    <form className='checkoutForm' onSubmit={handleSubmit}>
      {/* Display price or use it as needed */}
      <p>Email Address: {email}</p>
      <hr/>
      <p>Total Price: € {price}</p>
      <hr/>
      <CardElement />
      <button className='formBtn' type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

export default CheckoutForm;
