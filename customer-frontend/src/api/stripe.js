import axios from "axios";

// Get Stripe publishable key as a string
export const getStripeKey = async () => {
  const res = await axios.get("http://localhost:3000/payment/config");
  return res.data.publishableKey; // <-- return string only
};

// Create PaymentIntent
export const createPaymentIntent = async (amount, token) => {
  const res = await axios.post(
    "http://localhost:3000/payment/intent",
    { amount },
    {
      headers: {
        Authorization: token, // raw token, no 'Bearer ' prefix
        "Content-Type": "application/json",
      },
    },
  );
  return res.data;
};
