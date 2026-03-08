import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const SERVER_URL = "http://localhost:3000";

function ProductCard({ product }) {
  const imageUrl =
    product.images && product.images.length > 0
      ? `${SERVER_URL}/uploads/${product.images[0]}`
      : null;

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find((item) => item.productId === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart");
  };

  return (
    <div className="card h-100 shadow-sm">
      {imageUrl && (
        <img
          src={imageUrl}
          className="card-img-top"
          alt={product.name}
          style={{ height: "200px", objectFit: "cover" }}
        />
      )}

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>

        <p className="card-text text-muted">
          {product.description?.slice(0, 60)}...
        </p>

        <h6 className="text-primary fw-bold mb-3">${product.price}</h6>

        <Link
          to={`/product/${product._id}`}
          className="btn btn-outline-primary mt-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
