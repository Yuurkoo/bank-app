import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { FieldPassword } from "../../component/field-password/FieldPassword";

type RecoveryPageProps = {
  description: string;
};

export default function RecoveryConfirm({ description }: RecoveryPageProps) {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!code || !password || !email) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/recovery-confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code, newPassword: password }),
      });

      if (!response.ok) {
        setError("Invalid code or failed to update password.");
        return;
      }

      alert("Password updated successfully!");
      navigate("/signin");
    } catch (err) {
      console.error("Error during recovery:", err);
      setError("An error occurred. Please try again.");
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
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Code:</label>
          <input
            name="code"
            placeholder="Enter the recovery code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <FieldPassword
            title="Password:"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            error={password.length > 0 && password.length < 8}
          />

          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            className="sign-up-btn"
            disabled={!email || !code || password.length < 8}
          >
            Restore password
          </button>
        </div>
      </form>
    </div>
  );
}
