import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CheckoutPage = () => {
  const navigate = useNavigate();

  // Get cart from localStorage (adjust if you use Redux/Context)
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cart")) || [],
  );

  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    phone: "",
  });

  // Calculate total price
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const handleChange = (e) => {
    setShipping({
      ...shipping,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!shipping.fullName || !shipping.address || !shipping.phone) {
      alert("Please fill in shipping details");
      return;
    }

    try {
      setLoading(true);

      // Format products for your backend
      const products = cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      }));

      const res = await api.post("/orders", {
        products,
        shipping,
      });

      if (res.data.status === "success") {
        alert("Order placed successfully!");

        // Clear cart after order
        localStorage.removeItem("cart");
        setCartItems([]);

        // Redirect to order history
        navigate("/orders");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5">
        <h3>Your cart is empty 🛒</h3>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Checkout</h2>

      <div className="row">
        {/* Left: Shipping Form */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h4 className="mb-3">Shipping Information</h4>

            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="form-control"
                value={shipping.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={shipping.address}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                className="form-control"
                value={shipping.city}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={shipping.phone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h4 className="mb-3">Order Summary</h4>

            {cartItems.map((item) => (
              <div
                key={item._id}
                className="d-flex justify-content-between border-bottom py-2"
              >
                <div>
                  <strong>{item.name}</strong>
                  <br />
                  <small>Qty: {item.quantity}</small>
                </div>
                <div>${item.price * item.quantity}</div>
              </div>
            ))}

            <hr />

            <h5 className="d-flex justify-content-between">
              <span>Total:</span>
              <span className="text-success">${totalAmount.toFixed(2)}</span>
            </h5>

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
