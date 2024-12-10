import "./index.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Transaction {
  amount: number;
  method: string;
  date: string;
}

export default function RecivePage() {
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!amount || !method) {
      alert("Please enter an amount and select a payment method.");
      return;
    }

    const newTransaction: Transaction = {
      amount: parseFloat(amount),
      method,
      date: new Date().toLocaleString(),
    };

    // Оновлення транзакцій у localStorage
    const storedTransactions: Transaction[] = JSON.parse(
      localStorage.getItem("transactions") || "[]"
    );
    storedTransactions.push(newTransaction);
    localStorage.setItem("transactions", JSON.stringify(storedTransactions));

    // Оновлення балансу
    const currentBalance = parseFloat(
      localStorage.getItem("balance") || "100.00"
    );
    const newBalance = currentBalance - parseFloat(amount);
    localStorage.setItem("balance", newBalance.toString());

    navigate("/balance");
  };

  return (
    <div className="recive-page-block">
      <div className="recive-page">
        <div className="title">
          <h3>Receive</h3>
        </div>

        <form className="recive-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Receive amount</label>
            <input
              style={{ marginTop: "10px" }}
              name="text"
              placeholder="Enter the amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              required
            />

            <div className="divider"></div>

            <div className="payment-system">
              <h4>Payment system</h4>

              <div className="payment-variantes">
                <button
                  type="button"
                  className={`stripe ${method === "Stripe" ? "active" : ""}`}
                  onClick={() => setMethod("Stripe")}
                >
                  <div className="stripe-container">
                    <img className="icon" src="/img/stripe.svg" alt="stripe" />
                    <p>Stripe</p>
                  </div>
                  <img
                    className="frame-img"
                    src="/img/stripe-frame.svg"
                    alt="frame1"
                  />
                </button>

                <button
                  type="button"
                  className={`coinbase ${
                    method === "Coinbase" ? "active" : ""
                  }`}
                  onClick={() => setMethod("Coinbase")}
                >
                  <div className="coinbase-container">
                    <img
                      className="icon"
                      src="/img/coinbase.svg"
                      alt="coinbase"
                    />
                    <p>Coinbase</p>
                  </div>
                  <img
                    className="frame-img"
                    src="/img/stripe-frame.svg"
                    alt="frame2"
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="sub-b">
            <button type="submit" className="submit-btn">
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
