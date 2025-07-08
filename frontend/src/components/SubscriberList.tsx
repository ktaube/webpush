import { SendMessage } from "./SendMessage";
import { useSubscribers } from "../hooks/useSubscribers";

export const SubscriberList = () => {
  const { subscribers, isLoading } = useSubscribers();

  if (isLoading) return <div>Loading subscribers...</div>;

  return (
    <div>
      {subscribers.map((subscriber) => (
        <div key={subscriber.endpoint}>
          <span>{subscriber.username}</span>
          <SendMessage to={subscriber.username} />
        </div>
      ))}
    </div>
  );
};
