import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FieldEmail } from "../../component/field-email/FieldEmail";
import { FieldPassword } from "../../component/field-password/FieldPassword";
import "./index.css";

type SignUpPageProps = {
  description: string;
};

type FormState = {
  email: string;
  password: string;
};

const SignUpPage: React.FC<SignUpPageProps> = ({ description }) => {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = (form: FormState) => {
    const emailValid = validateEmail(form.email);
    const passwordValid = form.password.length >= 8;
    return emailValid && passwordValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updatedForm = { ...prev, [name]: value };

      setFormErrors({
        email: !validateEmail(updatedForm.email),
        password: updatedForm.password.length < 8,
      });

      setIsFormValid(validateForm(updatedForm));

      return updatedForm;
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) return;

    const recoveryCode = Math.random().toString(36).slice(-6); // Генеруємо код підтвердження
    alert(`Your confirmation code: ${recoveryCode}`);

    const signupData = {
      recoveryCode,
      email: form.email,
      password: form.password,
    };
    localStorage.setItem("signupData", JSON.stringify(signupData));

    navigate("/signup-confirm", {
      state: signupData,
    });
  };

  return (
    <div className="add-user">
      <div className="title">
        <h3>Sign Up</h3>
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
            <p>Already have an account?</p>
            <Link to="/signin">Sign in</Link>
          </div>
          <button type="submit" className="sign-up-btn" disabled={!isFormValid}>
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
