import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { Store } from './redux/Store';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('YOUR_STRIPE_PUBLIC_KEY'); // Replace with your actual Stripe public key

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={Store}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
  </Provider>
);

reportWebVitals();
