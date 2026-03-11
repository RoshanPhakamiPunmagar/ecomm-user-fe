// src/pages/CartPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Increase quantity
  const increaseQty = (productId) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    );
    setCartItems(updatedCart);
  };

  // Decrease quantity
  const decreaseQty = (productId) => {
    const updatedCart = cartItems
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      )
      .filter((item) => item.quantity > 0);
    setCartItems(updatedCart);
  };

  // Remove item
  const removeItem = (productId) => {
    setCartItems(cartItems.filter((item) => item.productId !== productId));
  };

  // Clear cart after order
  const handleOrderSuccess = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  // Calculate total amount in cents
  const totalAmountCents = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity * 100,
    0,
  );

  // Navigate to checkout page
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;
    // Optionally, store total or cart in localStorage if needed by checkout
    navigate("/checkout");
  };

  return (
    <div className="container mt-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/home">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Cart
          </li>
        </ol>
      </nav>

      {/* Continue Shopping */}
      <div className="mb-3">
        <Link to="/home" className="btn btn-outline-primary">
          ← Continue Shopping
        </Link>
      </div>

      <h2 className="mb-4">My Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center mt-5">
          <h4>Your cart is empty 🛒</h4>
          <p className="text-muted">Add products to cart to see them here.</p>
          <Link to="/home" className="btn btn-primary mt-3">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="row">
          {/* Cart Items */}
          <div className="col-md-8 mb-4">
            <div className="card p-3 shadow-sm">
              <h5 className="mb-3">Cart Items</h5>
              {cartItems.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onIncrease={() => increaseQty(item.productId)}
                  onDecrease={() => decreaseQty(item.productId)}
                  onRemove={() => removeItem(item.productId)}
                />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-md-4">
            <OrderSummary
              cartItems={cartItems}
              onOrderSuccess={handleOrderSuccess}
            />
            <button
              className="btn btn-success w-100 mt-3"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </button>
            <p className="text-muted mt-2">
              Total: ${(totalAmountCents / 100).toFixed(2)} AUD
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
