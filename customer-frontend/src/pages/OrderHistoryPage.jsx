import React, { useEffect, useState } from "react";
import api from "../services/api";

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/orders");
        if (res.data?.status === "success") {
          setOrders(res.data.orders);
        } else {
          setError("Failed to fetch orders");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="container mt-5">Loading orders...</div>;
  if (error) return <div className="container mt-5 text-danger">{error}</div>;
  if (!orders.length)
    return (
      <div className="container mt-5 text-center">
        <h4>No orders found 🛒</h4>
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Orders</h2>

      {orders.map((order) => (
        <React.Fragment key={order._id}>
          <div className="card mb-3 p-3 shadow-sm">
            <h5>Order ID: {order._id}</h5>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Total:</strong> $
              {Number(order.totalAmount || 0).toFixed(2)}
            </p>
            <p>
              <strong>Ordered on:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <div>
              <strong>Products:</strong>
              {order.products.map((item, index) => (
                <div
                  key={index}
                  className="d-flex justify-content-between border-bottom py-1"
                >
                  <div>
                    {item.name} x {item.quantity}
                  </div>
                  <div>
                    $
                    {(
                      (Number(item.price) || 0) * (Number(item.quantity) || 0)
                    ).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export default OrderHistoryPage;
