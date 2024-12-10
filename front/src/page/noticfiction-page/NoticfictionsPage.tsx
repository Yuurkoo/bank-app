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

  const parseDate = (date: string): number => {
    const parsedDate = new Date(date);

    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.getTime();
    }

    const parts = date.match(
      /(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})/
    );

    if (parts) {
      const [, day, month, year, hour, minute, second] = parts.map(Number);
      return new Date(year, month - 1, day, hour, minute, second).getTime();
    }

    return 0;
  };

  useEffect(() => {
    const storedWarnings: Notification[] = JSON.parse(
      localStorage.getItem("signInNotifications") || "[]"
    );

    const storedTransactions: Transaction[] = JSON.parse(
      localStorage.getItem("transactions") || "[]"
    );

    const transactionNotifications: Notification[] = storedTransactions.map(
      (transaction) => ({
        type: "info",
        title: transaction.email
          ? `Sent to ${transaction.email}`
          : `Received via ${transaction.method}`,
        time: transaction.date,
      })
    );

    // Об'єднуємо всі повідомлення
    const allNotifications = [...storedWarnings, ...transactionNotifications];

    // Змінна для контролю чергування типів
    let lastType: "info" | "warning" | null = null;

    // Чергування повідомлень
    const orderedNotifications = allNotifications.reduce<Notification[]>(
      (acc, curr) => {
        // Якщо це перше повідомлення, просто додаємо
        if (lastType === null) {
          acc.push(curr);
          lastType = curr.type;
        } else {
          // Якщо тип повідомлення відрізняється від попереднього, додаємо його
          if (curr.type !== lastType) {
            acc.push(curr);
            lastType = curr.type;
          } else {
            // Якщо тип однаковий, додаємо після іншого типу
            const oppositeType = lastType === "info" ? "warning" : "info";
            const oppositeIndex = acc.findIndex(
              (notif) => notif.type === oppositeType
            );
            if (oppositeIndex !== -1) {
              acc.splice(oppositeIndex + 1, 0, curr);
            } else {
              acc.push(curr);
            }
          }
        }
        return acc;
      },
      []
    );

    setNotifications(orderedNotifications);
  }, []);

  const formatDate = (time: string): string => {
    const date = new Date(parseDate(time));

    // Формат дати: dd.MM.yyyy
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Місяць від 0 до 11, тому додаємо 1
    const year = date.getFullYear();

    // Форматуємо дату як день.місяць.рік
    const formattedDate = `${day}.${month}.${year}`;

    // Форматуємо час
    const formattedTime = date.toLocaleTimeString();

    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <div className="notif-head">
      <div className="notifications-page">
        <div className="notifications-title">
          <h2>Notifications</h2>
        </div>
        <div className="notifications-container">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className={`notification-item ${
                notification.type === "info"
                  ? "notifications-info"
                  : "notifications-warning"
              }`}
            >
              <img
                src={
                  notification.type === "info"
                    ? "/img/notification.svg"
                    : "/img/warning.svg"
                }
                alt={notification.type}
                className="notification-icon"
              />
              <div className="notifications-info-value">
                <p className="notifications-info-title">{notification.title}</p>
                <p className="notifications-info-time">
                  {formatDate(notification.time)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
