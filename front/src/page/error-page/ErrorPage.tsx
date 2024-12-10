import "./index.css";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const nav = useNavigate();
  return (
    <div className="error-page">
      <h2 className="error-title">Oopps!</h2>
      <p>404 - page not found</p>
      <div className="err-text">
        The page you are looking for might have been removed, had it's name
        changed or it's temporarily unavailable
      </div>

      <button
        className="go-home"
        onClick={() => {
          nav("/");
        }}
      >
        Go to the home page
      </button>
    </div>
  );
}
