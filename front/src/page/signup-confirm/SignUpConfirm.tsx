import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import "./index.css";

export default function SignupConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const savedData = JSON.parse(localStorage.getItem("signupData") || "{}");

  const { email, password, recoveryCode } = location.state || savedData || {};

  // Логування для перевірки отриманих даних
  console.log("Received in SignupConfirm:", { email, password, recoveryCode });

  if (!email || !password || !recoveryCode) {
    console.error("Missing required data:", { email, password, recoveryCode });
    setError("Required data is missing. Please restart the sign-up process.");
    navigate("/signup", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (code !== recoveryCode) {
      setError("Invalid code. Please try again.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    console.log("Sending to /signup:", { email, password });

    try {
      await Axios.post("http://localhost:3002/api/signup", { email, password });
      alert("Account created successfully!");

      navigate("/balance");
      localStorage.removeItem("signupData");
    } catch (error: any) {
      console.error("Signup error:", error.response?.data || error.message);
      setError("Failed to create an account. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-user">
      <div className="title">
        <h3>Confirm account</h3>
        <p>Write the code you received</p>
      </div>

      <form className="user-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Code:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter confirmation code"
          />
          {error && <p className="error-message">{error}</p>}
          <button
            type="submit"
            className="sign-up-btn"
            disabled={!code || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Confirm"}
          </button>
        </div>
      </form>
    </div>
  );
}
