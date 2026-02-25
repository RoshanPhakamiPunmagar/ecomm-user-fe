import React, { useState } from "react";
import api from "../../services/api";

const OrderSummary = ({ cartItems = [], onOrderSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculate total amount
  const totalAmount = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError("");

      if (!cartItems.length) {
        setError("Your cart is empty");
        return;
      }

      // Match backend structure
      const orderPayload = {
        products: cartItems.map((item) => ({
          productId: item._id, // make sure your cart item has _id
          quantity: item.quantity,
        })),
      };

      const { data } = await api.post("/orders", orderPayload);

      if (data?.status === "success") {
        alert("Order placed successfully!");
        onOrderSuccess && onOrderSuccess(data.order);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to place order. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow p-4">
      <h4 className="mb-3">Order Summary</h4>

      {cartItems.length === 0 ? (
        <p className="text-muted">No items in cart</p>
      ) : (
        <>
          {/* Items List */}
          <ul className="list-group mb-3">
            {cartItems.map((item) => (
              <li
                key={item._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 className="my-0">{item.name}</h6>
                  <small className="text-muted">Qty: {item.quantity}</small>
                </div>
                <span className="text-muted">
                  ${item.price * item.quantity}
                </span>
              </li>
            ))}
          </ul>

          {/* Total */}
          <div className="d-flex justify-content-between mb-3">
            <strong>Total</strong>
            <strong>${totalAmount.toFixed(2)}</strong>
          </div>

          {error && <p className="text-danger">{error}</p>}

          {/* Place Order Button */}
          <button
            className="btn btn-primary w-100"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
};

export default OrderSummary;
