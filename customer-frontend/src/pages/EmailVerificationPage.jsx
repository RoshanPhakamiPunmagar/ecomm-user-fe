import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function EmailVerificationPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("Verifying your email...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        //endpoint based on your backend
        const res = await api.get(`/auth/verify/${token}`);

        if (res.data?.status === "success") {
          setStatus("Email verified successfully! Redirecting to login...");

          // Redirect to login after 2 seconds
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setStatus("Email verification failed.");
        }
      } catch (error) {
        console.error(error);
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
    <div className="container mt-5 text-center">
      <h2>Email Verification</h2>

      {loading ? (
        <p className="text-primary">Verifying your email...</p>
      ) : (
        <p className="fs-5">{status}</p>
      )}

      {!loading && (
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      )}
    </div>
  );
}

export default EmailVerificationPage;