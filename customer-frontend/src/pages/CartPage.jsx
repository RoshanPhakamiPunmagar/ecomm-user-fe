import { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Load cart from localStorage on page load
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  // Save cart to localStorage whenever it changes
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
    const updatedCart = cartItems.filter(
      (item) => item.productId !== productId,
    );
    setCartItems(updatedCart);
  };

  // Clear cart after successful order
  const handleOrderSuccess = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    // Redirect to order history without showing an alert
    navigate("/orders");
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center mt-5">
          <h4>Your cart is empty 🛒</h4>
          <p className="text-muted">Add products to cart to see them here.</p>
        </div>
      ) : (
        <div className="row">
          {/* Cart Items */}
          <div className="col-md-8">
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
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
