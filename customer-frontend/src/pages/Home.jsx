import { useEffect, useState } from "react";
import api from "../services/api";
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
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const changePage = (pageNumber) => {
    setFilters({ ...filters, page: pageNumber });
  };

  return (
    <div className="container mt-4">
      <h2>Products</h2>

      {/* Search & Filters */}
      <div className="row mb-4">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
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
            className="form-control"
            name="order"
            onChange={(e) =>
              setFilters({
                ...filters,
                sortBy: "price",
                order: e.target.value,
              })
            }
          >
            <option value="asc">Price Low to High</option>
            <option value="desc">Price High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div key={product._id} className="col-md-3 mb-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <nav>
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
