import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CartProvider } from './context/CartContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// 👇 Replace this with your Google Client ID from https://console.cloud.google.com/
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE';
console.log('Google Client ID Loaded:', GOOGLE_CLIENT_ID);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <CartProvider>
        <App />
      </CartProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
