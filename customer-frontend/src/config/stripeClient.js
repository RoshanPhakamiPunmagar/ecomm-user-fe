// src/config/stripeClient.js
import { loadStripe } from "@stripe/stripe-js";

// Preload once at module level
export const stripePromise = loadStripe(
  "pk_test_51SvvaYC5p1uRWBFsfPFWcDKmn1VSdEnZbrsUEqnR4twkJCxHRg3JASNifqz67FPVdGpCpzQj8LAOoouXu9YKerSU00YcMxk7q",
);
