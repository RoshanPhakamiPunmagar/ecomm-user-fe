import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function EmailVerificationPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("Verifying your email...");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await api.get(`/auth/verify/${token}`);

        if (res.data?.status === "success") {
          setSuccess(true);
          setStatus("Email verified successfully! Redirecting to login...");

          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setSuccess(false);
          setStatus("Email verification failed.");
        }
      } catch (error) {
        console.error(error);
        setSuccess(false);
        setStatus("Invalid or expired verification link.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        background: "linear-gradient(135deg,#667eea,#764ba2)",
      }}
    >
      <div
        className="card shadow-lg text-center p-4"
        style={{ width: "420px", borderRadius: "15px" }}
      >
        <h3 className="mb-4">Email Verification</h3>

        {loading ? (
          <>
            <div className="spinner-border text-primary mb-3"></div>
            <p className="text-muted">Verifying your email...</p>
          </>
        ) : (
          <>
            <div style={{ fontSize: "40px" }}>{success ? "✅" : "❌"}</div>

            <p className="mt-3 fs-5">{status}</p>

            <button
              className="btn btn-primary mt-3 w-100"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default EmailVerificationPage;
