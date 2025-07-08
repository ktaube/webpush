import { API_URL } from "./config";

export const subscribeToNotifications = async (
  username: string,
  endpoint: string,
  keys: { p256dh?: string; auth?: string }
) => {
  const res = await fetch(`${API_URL}/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({
      username,
      endpoint,
      keys: {
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    }),
  });
  
  if (!res.ok) throw new Error("Failed to send subscription to backend");
  return res.json();
};

export const unsubscribeFromNotifications = async (subscription: PushSubscription) => {
  const res = await fetch(`${API_URL}/subscribe`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify(subscription),
  });
  
  if (!res.ok) throw new Error("Failed to unsubscribe from notifications");
  return res;
};