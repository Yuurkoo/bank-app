import React, { useEffect, useState } from "react";
import axios from "axios";
import { FieldEmail } from "../../component/field-email/FieldEmail";
import { FieldPassword } from "../../component/field-password/FieldPassword";
import "./index.css";
import Divider from "../../component/divider/Divider";
import { useNavigate } from "react-router-dom";

const SettingsPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const nav = useNavigate();

  useEffect(() => {
    const fetchUserData = () => {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const { email, password } = JSON.parse(storedUserData);
        setEmail(email);
        setPassword(password);
      }
    };

    fetchUserData();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSaveEmail = async () => {
    if (!email.includes("@")) {
      setEmailError(true);
      return;
    }
    try {
      await axios.post("http://localhost:3002/settings", {
        email,
        newEmail: email,
      });
      alert("Email successfully updated!");
    } catch (error) {
      alert("Error updating email");
    }
  };

  const handleSavePassword = async () => {
    if (newPassword.length < 8) {
      setPasswordError(true);
      return;
    }

    try {
      await axios.post("http://localhost:3002/settings", {
        email,
        newPassword,
      });
      alert("Password successfully updated!");
      setNewPassword("");
    } catch (error) {
      alert("Error updating password");
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("userData"); // Очищаємо локальне збереження
    nav("/signup", { replace: true }); // Перенаправляємо на сторінку реєстрації
    window.location.reload(); // Оновлюємо сторінку для видалення залишкових даних
  };

  return (
    <div className="settings-page">
      <h2 className="title">Settings</h2>

      <div className="settings-section">
        <h2 className="settings_sub_title">Change Email</h2>
        <FieldEmail
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
        />
        <FieldPassword
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={false}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          title="Current Password"
        />
        <button className="setting-btn-save" onClick={handleSaveEmail}>
          Save Email
        </button>
      </div>

      <Divider />

      <div className="settings-section">
        <h2 className="settings_sub_title sub">Change Password</h2>
        <FieldPassword
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setPasswordError(e.target.value.length < 8);
          }}
          error={passwordError}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          title="New Password"
        />

        <button className="setting-btn-save" onClick={handleSavePassword}>
          Save Password
        </button>

        <Divider />

        <button className="setting-log-out" onClick={handleLogOut}>
          Log out
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
