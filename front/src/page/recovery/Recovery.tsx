import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

type RecoveryPageProps = {
  description: string;
};

export default function Recovery({ description }: RecoveryPageProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/api/recovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError("Email not found. Please try again.");
        } else {
          setError("An error occurred. Please try again later.");
        }
        return;
      }

      const data = await response.json();
      alert(`Recovery code sent to your email: ${data.code}`); // Тимчасово
      navigate("/recovery-confirm", { state: { email } });
    } catch (err) {
      console.error("Error during recovery:", err);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="add-user">
      <div className="title">
        <h3>Recover password</h3>
        <p>{description}</p>
      </div>

      <form className="user-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email:</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
          />
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="sign-up-btn">
            Send code
          </button>
        </div>
      </form>
    </div>
  );
}
