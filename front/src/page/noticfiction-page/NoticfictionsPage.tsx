import { useState, useEffect } from "react";
import "./index.css";

type Transaction = {
  email?: string;
  method?: string;
  date: string;
};

type Notification = {
  type: "info" | "warning";
  title: string;
  time: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const storedWarnings: Notification[] = JSON.parse(
      localStorage.getItem("signInNotifications") || "[]"
    );

    const storedTransactions: Transaction[] = JSON.parse(
      localStorage.getItem("transactions") || "[]"
    );

    const transactionNotifications: Notification[] = storedTransactions.map(
      ({ email, method, date }) => ({
        type: "info",
        title: email ? `Sent to ${email}` : `Received via ${method}`,
        time: date,
      })
    );

    const allNotifications = [...storedWarnings, ...transactionNotifications];

    // Сортуємо повідомлення за часом
    const sortedNotifications = allNotifications.sort(
      (a, b) =>
        new Date(parseDate(b.time)).getTime() -
        new Date(parseDate(a.time)).getTime()
    );

    setNotifications(sortedNotifications);
  }, []);

  // Функція для парсингу дати з різних форматів
  const parseDate = (date: string): string => {
    const isoDate = new Date(date);
    if (!isNaN(isoDate.getTime())) return isoDate.toISOString(); // ISO формат коректний

    // Якщо дата у форматі dd.MM.yyyy HH:mm:ss
    const parts = date.match(
      /(\d{2})\.(\d{2})\.(\d{4}),? (\d{2}):(\d{2}):(\d{2})/
    );
    if (parts) {
      const [, day, month, year, hour, minute, second] = parts.map(Number);
      return new Date(year, month - 1, day, hour, minute, second).toISOString();
    }

    return new Date().toISOString(); // Значення за замовчуванням
  };

  // Функція для форматування дати у єдиний вигляд
  const formatDate = (date: string): string => {
    const parsedDate = new Date(parseDate(date));

    const day = String(parsedDate.getDate()).padStart(2, "0");
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const year = parsedDate.getFullYear();

    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
    const seconds = String(parsedDate.getSeconds()).padStart(2, "0");

    return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="notif-head">
      <div className="notifications-page">
        <h2 className="notifications-title">Notifications</h2>
        <div className="notifications-container">
          {notifications.map((notification, index) => (
            <NotificationItem
              key={index}
              notification={{
                ...notification,
                time: formatDate(notification.time),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Окремий компонент для відображення повідомлення
const NotificationItem = ({ notification }: { notification: Notification }) => {
  const iconSrc =
    notification.type === "info" ? "/img/notification.svg" : "/img/warning.svg";

  return (
    <div
      className={`notification-item ${
        notification.type === "info"
          ? "notifications-info"
          : "notifications-warning"
      }`}
    >
      <img
        src={iconSrc}
        alt={notification.type}
        className="notification-icon"
      />
      <div className="notifications-info-value">
        <p className="notifications-info-title">{notification.title}</p>
        <p className="notifications-info-time">{notification.time}</p>
      </div>
    </div>
  );
};
