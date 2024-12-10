import "./index.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Transaction {
  email: string;
  amount: number;
  date: string;
}

export default function SendPage() {
  const [email, setEmail] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !amount) {
      alert("Please enter a valid email and amount.");
      return;
    }

    const newTransaction: Transaction = {
      email,
      amount: parseFloat(amount),
      date: new Date().toLocaleString(),
    };

    // Отримуємо існуючі транзакції або створюємо порожній масив
    const storedTransactions: Transaction[] = JSON.parse(
      localStorage.getItem("transactions") || "[]"
    );

    // Додаємо нову транзакцію
    storedTransactions.push(newTransaction);

    // Зберігаємо оновлений список транзакцій
    localStorage.setItem("transactions", JSON.stringify(storedTransactions));

    // Оновлюємо баланс
    const currentBalance = parseFloat(
      localStorage.getItem("balance") || "100.00"
    );
    const newBalance = currentBalance + newTransaction.amount;
    localStorage.setItem("balance", newBalance.toString());

    // Перенаправляємо на сторінку балансу
    navigate("/balance");
  };

  return (
    <div className="send-page">
      <div className="title">
        <h3>Send</h3>
      </div>

      <form className="send-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email:</label>
          <input
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />

          <label>Sum:</label>
          <input
            name="amount"
            placeholder="Enter the amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            required
          />

          <button type="submit" className="send-btn">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
