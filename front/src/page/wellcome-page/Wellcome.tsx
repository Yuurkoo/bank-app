import React from "react";
import "./index.css";

type WellcomePageProps = {
  onSignUpClick: () => void;
  onSignInClick: () => void;
};

const WellcomePage: React.FC<WellcomePageProps> = ({
  onSignUpClick,
  onSignInClick,
}) => {
  return (
    <div className="well--page">
      <div className="well--upp well">
        <div className="well--header">
          <div className="header-title">
            <h1>Hello!</h1>
          </div>
          <div className="header-subtitle">Welcome to bank app</div>
        </div>
      </div>

      <div className="kerfin-right kernif"></div>
      <div className="kerfin-left kernif"></div>

      <div className="well--down well">
        <div className="registartion-options">
          <button className="sign--up" onClick={onSignUpClick}>
            Sign Up
          </button>
          <button className="sign--in" onClick={onSignInClick}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default WellcomePage;
