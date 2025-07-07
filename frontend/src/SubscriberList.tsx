import { useEffect, useState } from "react";
import { API_URL } from "./api";
import { SendMessage } from "./SendMessage";

type Subscriber = PushSubscription & { userId: string };

export const SubscriberList = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  useEffect(() => {
    fetch(`${API_URL}/subscribers`, {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    })
      .then((res) => res.json())
      .then((data) => setSubscribers(data));
  }, []);
  return (
    <div>
      {subscribers.map((subscriber) => (
        <div key={subscriber.endpoint}>
          <span>{subscriber.userId}</span>
          <SendMessage to={subscriber.userId} />
        </div>
      ))}
    </div>
  );
};
