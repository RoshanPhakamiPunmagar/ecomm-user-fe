import React, { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const OrderSummary = ({ cartItems = [], onOrderSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculate total
  const totalAmount = cartItems.reduce(
    (acc, item) =>
      acc + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0,
  );

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError("");

      if (!cartItems.length) {
        setError("Your cart is empty");
        return;
      }

      // Important: use `productId` from cart (not _id)
      const orderPayload = {
        products: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const { data } = await api.post("/orders", orderPayload);

      if (data?.status === "success") {
        onOrderSuccess && onOrderSuccess(data.order);
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to place order";
      setError(msg);
      toast.error(msg);
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
                key={item.productId}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 className="my-0">{item.name}</h6>
                  <small className="text-muted">Qty: {item.quantity}</small>
                </div>
                <span className="text-muted">
                  $
                  {(
                    (Number(item.price) || 0) * (Number(item.quantity) || 0)
                  ).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          {/* Total */}
          <div className="d-flex justify-content-between mb-3">
            <strong>Total</strong>
            <strong>${Number(totalAmount || 0).toFixed(2)}</strong>
          </div>

          {error && <p className="text-danger">{error}</p>}

          {/* Place Order */}
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
