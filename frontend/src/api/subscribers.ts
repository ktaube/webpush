import { API_URL } from "./config";

export type Subscriber = PushSubscription & { username: string };

export const getSubscribers = async (): Promise<Subscriber[]> => {
  const res = await fetch(`${API_URL}/subscribers`, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });
  
  if (!res.ok) throw new Error("Failed to fetch subscribers");
  return res.json();
};