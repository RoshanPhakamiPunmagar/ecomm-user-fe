import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { SERVER_URL } from "../services/api";
import { toast } from "react-toastify";

function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({
    rating: 5,
    comment: "",
  });

  const isLoggedIn = !!localStorage.getItem("accessJWT");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        productId: id,
        ...review,
        rating: Number(review.rating),
      };
      const res = await api.post(`/reviews`, payload);
      toast.success(res?.data?.message || "Review submitted!");
      // update list locally instead of full reload
      setProduct((prev) => ({
        ...prev,
        reviews: [
          {
            rating: payload.rating,
            comment: payload.comment,
            createdAt: new Date().toISOString(),
            user: { name: "You" },
          },
          ...(prev.reviews || []),
        ],
      }));
      setReview({ rating: 5, comment: "" });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit review";

      // If backend route is missing (Cannot POST /...), fall back to adding review locally
      const backendHtml = err?.response?.data;
      const backendMissing =
        err?.response?.status === 404 ||
        err?.response?.status === 405 ||
        (typeof backendHtml === "string" &&
          backendHtml.includes("Cannot POST"));

      if (backendMissing) {
        const payload = { ...review, rating: Number(review.rating) };
        const newRev = {
          rating: payload.rating,
          comment: payload.comment,
          createdAt: new Date().toISOString(),
          user: { name: "You" },
        };

        setProduct((prev) => {
          const reviews = [newRev, ...(prev.reviews || [])];
          const avg =
            reviews.reduce((s, r) => s + Number(r.rating), 0) / reviews.length;
          return { ...prev, reviews, rating: avg };
        });

        setReview({ rating: 5, comment: "" });
        toast.info("Review saved locally (backend route missing).");
        return;
      }

      toast.error(msg);
    }
  };

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (!product) return <div className="container mt-5">Not found</div>;

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
    toast.success("Product added to cart");
  };

  return (
    <div className="container mt-5">
      <div className="mb-3">
        <Link to="/home" className="btn btn-link">
          ← Back to products
        </Link>
      </div>
      <div className="row">
        {/* Product Info */}
        <div className="col-md-6">
          <img
            src={
              product.images?.length
                ? `${SERVER_URL}/uploads/${product.images[0]}`
                : "https://via.placeholder.com/400"
            }
            alt={product.name}
            className="img-fluid rounded"
          />
        </div>

        <div className="col-md-6">
          <h2>{product.name}</h2>
          <h4 className="text-success">${product.price}</h4>
          <p>{product.description}</p>

          <p>
            ⭐ {product.rating || 0} / 5 ({product.reviews?.length || 0}{" "}
            reviews)
          </p>

          <button className="btn btn-primary mt-3" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <div className="mt-2">
            <Link to="/home" className="btn btn-sm btn-outline-secondary me-2">
              Continue shopping
            </Link>
            <Link to="/cart" className="btn btn-sm btn-outline-primary">
              View cart
            </Link>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-5">
        <h4>Customer Reviews</h4>

        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((rev, index) => (
            <div key={index} className="border p-3 mb-3 rounded">
              <strong>{rev.user?.name || "User"}</strong>
              <p>⭐ {rev.rating}</p>
              <p>{rev.comment}</p>
              <small className="text-muted">
                {new Date(rev.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      {/* Submit Review */}
      {isLoggedIn && (
        <div className="mt-4">
          <h5>Write a Review</h5>

          <form onSubmit={handleReviewSubmit}>
            <div className="mb-3">
              <label>Rating</label>
              <select
                className="form-control"
                value={review.rating}
                onChange={(e) =>
                  setReview({ ...review, rating: e.target.value })
                }
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label>Comment</label>
              <textarea
                className="form-control"
                rows="3"
                value={review.comment}
                onChange={(e) =>
                  setReview({ ...review, comment: e.target.value })
                }
              ></textarea>
            </div>

            <button type="submit" className="btn btn-success">
              Submit Review
            </button>
          </form>
        </div>
      )}

      {!isLoggedIn && (
        <div className="mt-4 text-muted">Please login to submit a review.</div>
      )}
    </div>
  );
}

export default ProductDetailPage;
