import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './CheckoutForm.css';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ price, email }) => {
  const stripe = useStripe();
  const elements = useElements();

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log('Stripe has not loaded');
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.log('[error]', error);
      return; 
    } else {
      console.log('[PaymentMethod]', paymentMethod);
    }

    // Now we are sure paymentMethod is defined, we can proceed
    try {
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
      navigate('/');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const paymentIntent = await response.json();

      const { clientSecret } = paymentIntent;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        console.log('[error]', result.error);
        // Handle errors here
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          console.log('Payment succeeded!');
        }
      }
    } catch (error) {
      console.error('There was an error!', error);
    }
  };


  return (
    <form className='checkoutForm' onSubmit={handleSubmit}>
      {/* Display price or use it as needed */}
      <p>Total Price: € {price/1000}</p>
      <CardElement />
      <button className='formBtn' type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

export default CheckoutForm;
