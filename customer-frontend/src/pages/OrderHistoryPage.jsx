import React, { useEffect, useState } from "react";
import api from "../services/api";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <h3>Loading your orders...</h3>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Order History</h2>

      {orders.length === 0 ? (
        <div className="alert alert-info">
          You have not placed any orders yet.
        </div>
      ) : (
        orders.map((order) => (
          <div className="card mb-4 shadow-sm" key={order._id}>
            <div className="card-header d-flex justify-content-between">
              <div>
                <strong>Order ID:</strong> {order._id}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <span className="badge bg-warning text-dark">
                  {order.status}
                </span>
              </div>
            </div>

            <div className="card-body">
              <h5 className="mb-3">Products</h5>

              {order.products.map((item, index) => (
                <div
                  key={index}
                  className="d-flex justify-content-between border-bottom py-2"
                >
                  <div>
                    <strong>Product ID:</strong> {item.productId}
                    <br />
                    <small>Quantity: {item.quantity}</small>
                  </div>

                  <div>
                    <strong>
                      ${item.price ? item.price * item.quantity : "N/A"}
                    </strong>
                  </div>
                </div>
              ))}

              <div className="text-end mt-3">
                <h5>
                  Total Amount:{" "}
                  <span className="text-success">${order.totalAmount}</span>
                </h5>
              </div>
            </div>

            <div className="card-footer text-muted">
              Placed on:{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "N/A"}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistoryPage;
