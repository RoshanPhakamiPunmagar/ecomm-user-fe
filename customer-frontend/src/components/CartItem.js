import React from "react";

const SERVER_URL = "http://localhost:3000";

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="d-flex align-items-center mb-3 border-bottom pb-3">
      {/* Product Image */}
      <img
        src={
          item.image
            ? `${SERVER_URL}/uploads/${item.image}`
            : "https://via.placeholder.com/100"
        }
        alt={item.name}
        style={{
          width: "100px",
          height: "100px",
          objectFit: "cover",
          marginRight: "1rem",
        }}
      />

      <div className="flex-grow-1">
        <h6>{item.name}</h6>
        <p className="mb-1">
          ${Number(item.price || 0).toFixed(2)} x {item.quantity} = $
          {((Number(item.price) || 0) * (Number(item.quantity) || 0)).toFixed(
            2,
          )}
        </p>

        {/* Quantity Controls */}
        <div>
          <button
            className="btn btn-sm btn-outline-primary me-2"
            onClick={onDecrease}
          >
            -
          </button>
          <button
            className="btn btn-sm btn-outline-primary me-2"
            onClick={onIncrease}
          >
            +
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={onRemove}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
