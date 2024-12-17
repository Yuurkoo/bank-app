import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FieldEmail } from "../../component/field-email/FieldEmail";
import { FieldPassword } from "../../component/field-password/FieldPassword";
import "./index.css";

type SignInPageProps = {
  description: string;
  onLogin: () => void;
};

const SignInPage: React.FC<SignInPageProps> = ({ description, onLogin }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      setFormErrors((prev) => ({
        ...prev,
        email: !validateEmail(value),
      }));
    } else if (name === "password") {
      setFormErrors((prev) => ({
        ...prev,
        password: value.length < 8,
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailValid = validateEmail(form.email);
    const passwordValid = form.password.length >= 8;

    setFormErrors({
      email: !emailValid,
      password: !passwordValid,
    });

    if (!emailValid || !passwordValid) return;

    try {
      const response = await fetch("http://localhost:3002/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          LoginEmail: form.email,
          LoginPassword: form.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);

        // Save login information
        const loginTime = new Date().toISOString();
        localStorage.setItem(
          "userData",
          JSON.stringify({ email: form.email, password: form.password })
        );

        const signInNotifications = JSON.parse(
          localStorage.getItem("signInNotifications") || "[]"
        );
        signInNotifications.push({
          type: "warning",
          title: `Logged in as ${form.email}`,
          time: loginTime,
        });
        localStorage.setItem(
          "signInNotifications",
          JSON.stringify(signInNotifications)
        );

        onLogin();
        navigate("/balance");
      } else {
        const error = await response.json();
        alert(`Login failed: ${error.error || "Server error"}`);
      }
    } catch (error: any) {
      alert(`Login failed: ${error.message || "Network error"}`);
    }
  };

  return (
    <div className="add-user">
      <div className="title">
        <h3>Sign In</h3>
        <p>{description}</p>
      </div>

      <form className="user-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <FieldEmail
            value={form.email}
            onChange={handleChange}
            error={formErrors.email}
          />
          <FieldPassword
            title="Password:"
            value={form.password}
            onChange={handleChange}
            error={formErrors.password}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
          />
          <div className="restore-password">
            <p>Forgot your password?</p>
            <Link to="/recovery">Restore</Link>
          </div>
          <button type="submit" className="sign-up-btn">
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignInPage;
