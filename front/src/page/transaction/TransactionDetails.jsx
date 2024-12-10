import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./index.css";

export default function TransactionDetails() {
  const { transactionId } = useParams(); // Отримуємо ID з URL
  const { state } = useLocation(); // Отримуємо передані дані
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    // Якщо дані передані через state, використовуємо їх
    if (state?.transaction) {
      setTransaction(state.transaction);
    } else {
      // Якщо state немає, шукаємо транзакцію в localStorage
      const storedTransactions = JSON.parse(
        localStorage.getItem("transactions") || "[]"
      );
      const foundTransaction = storedTransactions.find(
        (txn) => txn.id === transactionId
      );
      setTransaction(foundTransaction || null);
    }
  }, [state, transactionId]);

  if (!transaction) {
    return (
      <div className="transaction-details">
        <h2>Transaction not found</h2>
        <button onClick={() => navigate("/")}>Go back to Balance</button>
      </div>
    );
  }

  return (
    <div className="block-cont">
      <div className="transaction-details">
        <h2>Transaction Details</h2>
        <div className="transaction-details-amount">
          {transaction.email ? (
            `+${transaction.amount.toFixed(2)}$`
          ) : (
            <p className="transaction-details-amount-minus">
              -{transaction.amount.toFixed(2)}$
            </p>
          )}
        </div>
        <div className="transaction-details-info-list">
          <div className="transaction-details-info-list-item">
            <strong>Date:</strong> {transaction.date}
          </div>
          <div className="transaction-details-info-list-item">
            <strong>Address:</strong> {transaction.email || transaction.method}
          </div>
          <div className="transaction-details-info-list-item">
            <strong>Type:</strong> {transaction.email ? "Send" : "Receive"}
          </div>
        </div>
      </div>
    </div>
  );
}
