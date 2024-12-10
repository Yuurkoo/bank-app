import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

export default function Balance({ title }) {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(100.0);
  const [transactions, setTransactions] = useState([]);
  const [infoPopup, setInfoPopup] = useState({ id: null });

  useEffect(() => {
    const storedTransactions = JSON.parse(
      localStorage.getItem("transactions") || "[]"
    );
    const storedBalance = parseFloat(
      localStorage.getItem("balance") || "100.00"
    );

    const updatedTransactions = storedTransactions.map(
      (transaction, index) => ({
        ...transaction,
        id: transaction.id || `${index + 1}`,
      })
    );

    setTransactions(updatedTransactions);
    setBalance(storedBalance);
  }, []);

  const handleNavigateToDetails = (transaction) => {
    navigate(`/transaction/${transaction.id}`, { state: { transaction } });
  };

  const toggleInfoPopup = (id) => {
    setInfoPopup((prev) => ({ id: prev.id === id ? null : id }));
  };

  return (
    <div className="balance-page">
      <div className="balance">
        <div className="balance-header">
          <div className="balance-top-section">
            <button
              className="balance-settings"
              onClick={() => navigate("/settings")}
            >
              <img src="/img/settings.svg" alt="settings" />
            </button>
            <div className="balance-title">{title}</div>
            <button
              className="balance-notification"
              onClick={() => navigate("/notifications")}
            >
              <img src="/img/noticfiction.svg" alt="notification" />
            </button>
          </div>

          <div className="balance-amount">${balance.toFixed(2)}</div>
        </div>

        <div className="balance-transactions">
          <button className="btn-recive" onClick={() => navigate("/recive")}>
            <div className="balance-receive">
              <img src="/img/receive.svg" alt="receive" />
            </div>
            <p>Recieve</p>
          </button>

          <button className="btn-send" onClick={() => navigate("/send")}>
            <div className="balance-send">
              <img src="/img/send.svg" alt="send" />
            </div>
            <p>Send</p>
          </button>
        </div>
      </div>

      <div className="transaction-list">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="transaction-item">
            {transaction.email ? (
              <div className="methods-stripe-coinbase">
                <img src="/img/user.svg" alt="send" className="method-icon" />
                <div className="methods-info-container">
                  <div className="methods-recive-info">
                    <div className="method-amount-about">
                      <div className="method-amoun-about-title-info info-icon">
                        {transaction.email}
                        <img
                          className="info-icon"
                          src="/img/info.svg"
                          alt=""
                          onClick={() => handleNavigateToDetails(transaction)}
                        />
                      </div>
                      <p className="method-date-info">
                        {transaction.date} - Send
                      </p>
                    </div>
                  </div>
                  <div className="minus-amount plus">
                    +${transaction.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="methods-stripe-coinbase">
                <img
                  src={
                    transaction.method === "Stripe"
                      ? "/img/stripe.svg"
                      : "/img/coinbase.svg"
                  }
                  alt={transaction.method}
                  className="method-icon"
                />
                <div className="methods-info-container">
                  <div className="methods-recive-info">
                    <div className="method-amount-about">
                      <div className="method-amoun-about-title-info info-icon">
                        {transaction.method}
                        <img
                          className="info-icon"
                          src="/img/info.svg"
                          alt=""
                          onClick={() => handleNavigateToDetails(transaction)}
                        />
                      </div>
                      <p className="method-date-info">
                        {transaction.date} - Receipt
                      </p>
                    </div>
                  </div>
                  <div className="minus-amount">
                    -${transaction.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            )}
            {infoPopup.id === transaction.id && (
              <div className="popup">
                <p>
                  <strong>ID:</strong> {transaction.id}
                </p>
                <p>
                  <strong>Date:</strong> {transaction.date}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {transaction.email || transaction.method}
                </p>
                <p>
                  <strong>Type:</strong>{" "}
                  {transaction.email ? "Send" : "Receive"}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

Balance.propTypes = {
  title: PropTypes.string.isRequired,
};
