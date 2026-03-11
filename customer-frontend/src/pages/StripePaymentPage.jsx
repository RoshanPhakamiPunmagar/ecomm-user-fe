// src/pages/StripePaymentPage.jsx
import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../components/PaymentForm.js";
import { getStripeKey } from "../api/stripe.js";

const StripePaymentPage = () => {
  const [stripePromise, setStripePromise] = useState(null);
  const [cartTotalCents, setCartTotalCents] = useState(0);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch Stripe key and initialize Stripe
  useEffect(() => {
    const initStripe = async () => {
      try {
        const key = await getStripeKey();
        if (!key) throw new Error("Stripe publishable key not found");
        setStripePromise(loadStripe(key));
      } catch (err) {
        console.error("Stripe init error:", err);
        setError("Unable to load Stripe. Please try again later.");
      }
    };
    initStripe();
  }, []);

  // Calculate cart total in cents from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity * 100,
        0,
      );
      setCartTotalCents(total);
    }
  }, []);

  if (error) return <div className="text-danger">{error}</div>;
  if (!stripePromise) return <div>Loading Stripe...</div>;
  if (cartTotalCents === 0)
    return (
      <div className="text-center mt-5">
        <h4>Your cart is empty 🛒</h4>
      </div>
    );

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto" }}>
      <h2>Complete Your Payment</h2>
      <p>Total Amount: ${(cartTotalCents / 100).toFixed(2)} AUD</p>
      <Elements stripe={stripePromise}>
        <PaymentForm token={token} amount={cartTotalCents} />
      </Elements>
    </div>
  );
};

export default StripePaymentPage;
