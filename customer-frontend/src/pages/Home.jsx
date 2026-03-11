import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/global.css";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "createdAt",
    order: "desc",
    page: 1,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products", {
        params: filters,
      });

      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const changePage = (pageNumber) => {
    setFilters({ ...filters, page: pageNumber });
  };

  return (
    <div className="container mt-4">
      {/* Hero Header */}
      <div className="mb-4 text-center">
        <h2 className="fw-bold">Discover Products</h2>
        <p className="text-muted">Find the best products at the best prices</p>
      </div>

      {/* Filters */}
      <div className="card shadow-sm p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search products..."
              name="search"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Min Price"
              name="minPrice"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Max Price"
              name="maxPrice"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              name="order"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  sortBy: "price",
                  order: e.target.value,
                  page: 1,
                })
              }
            >
              <option value="asc">Price: Low → High</option>
              <option value="desc">Price: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div key={product._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            {[...Array(pagination.pages).keys()].map((num) => (
              <li
                key={num}
                className={`page-item ${
                  pagination.page === num + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => changePage(num + 1)}
                >
                  {num + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export default Home;
