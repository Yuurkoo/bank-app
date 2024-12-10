import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
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
      const response = await Axios.post("http://localhost:3002/signin", {
        LoginEmail: form.email,
        LoginPassword: form.password,
      });

      alert(response.data.message);

      if (response.data.message) {
        const loginTime = new Date().toISOString();

        // Зберігаємо дані користувача та час входу
        localStorage.setItem(
          "userData",
          JSON.stringify({
            email: form.email,
            password: form.password,
          })
        );

        // Зберігаємо інформацію про входи
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
      }
    } catch (error: any) {
      alert("Login failed: " + (error.response?.data?.error || "Server error"));
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
