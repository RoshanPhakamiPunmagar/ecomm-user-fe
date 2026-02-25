import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-light mt-5 pt-4 pb-3">
      <div className="container">
        <div className="row">
          {/* Brand Section */}
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">Ecommerce</h5>
            <p className="text-muted">
              Your one-stop shop for the latest products. Fast delivery, secure
              payment, and best quality guaranteed.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold">Quick Links</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-light text-decoration-none">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-light text-decoration-none">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-light text-decoration-none">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-light text-decoration-none">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-light text-decoration-none">
                  Signup
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Info */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold">Contact</h6>
            <p className="mb-1">Email: support@ecommerce.com</p>
            <p className="mb-1">Phone: +977-9800000000</p>
            <p className="mb-0">Location: Nepal</p>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-secondary" />

        {/* Bottom Copyright */}
        <div className="text-center">
          <small className="text-muted">
            © {new Date().getFullYear()} Ecommerce. All rights reserved.
          </small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
