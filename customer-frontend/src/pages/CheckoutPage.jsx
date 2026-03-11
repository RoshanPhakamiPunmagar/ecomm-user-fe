import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../components/PaymentForm";
import { getStripeKey, createPaymentIntent } from "../api/stripe";

const CheckoutPage = () => {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const token = localStorage.getItem("token"); // raw token

  // Load Stripe publishable key
  useEffect(() => {
    const initStripe = async () => {
      try {
        const stripeKey = await getStripeKey(); // string only
        setStripePromise(loadStripe(stripeKey));
      } catch (err) {
        console.error("Error fetching Stripe key:", err);
      }
    };
    initStripe();
  }, []);

  // Create PaymentIntent
  useEffect(() => {
    const initPaymentIntent = async () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (!cart.length) return;

        const amount =
          cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100;

        const res = await createPaymentIntent(amount, token);
        if (res.clientSecret) setClientSecret(res.clientSecret);
      } catch (err) {
        console.error("Error creating PaymentIntent:", err);
      }
    };
    initPaymentIntent();
  }, [token]);

  // Do not render Elements until both are ready
  if (!stripePromise || !clientSecret)
    return <div>Loading payment details...</div>;

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto" }}>
      <h2>Complete Your Payment</h2>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentForm />
      </Elements>
    </div>
  );
};

export default CheckoutPage;
