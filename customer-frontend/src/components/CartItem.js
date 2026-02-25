import React from "react";

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  // If your backend only sends image filename like "pixel8-front.jpg"
  const imageUrl = item?.images?.[0]
    ? `http://localhost:3000/uploads/${item.images[0]}`
    : "https://via.placeholder.com/100";

  return (
    <div className="card mb-3 shadow-sm">
      <div className="row g-0 align-items-center p-2">
        {/* Product Image */}
        <div className="col-md-2 text-center">
          <img
            src={imageUrl}
            alt={item.name}
            className="img-fluid rounded"
            style={{ maxHeight: "80px", objectFit: "contain" }}
          />
        </div>

        {/* Product Info */}
        <div className="col-md-4">
          <h6 className="mb-1">{item.name}</h6>
          <p className="text-muted mb-0">Price: ${item.price}</p>
        </div>

        {/* Quantity Controls */}
        <div className="col-md-3 d-flex align-items-center justify-content-center">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => onDecrease(item)}
          >
            -
          </button>

          <span className="mx-3 fw-bold">{item.quantity}</span>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => onIncrease(item)}
          >
            +
          </button>
        </div>

        {/* Total Price */}
        <div className="col-md-2 text-center">
          <p className="fw-bold mb-0">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>

        {/* Remove Button */}
        <div className="col-md-1 text-end">
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onRemove(item)}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
