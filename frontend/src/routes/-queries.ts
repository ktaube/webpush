import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { API_URL } from "../api/config";
import { User } from "../types";

export const getUserQueryOptions = (username: string) =>
  queryOptions<User>({
    queryKey: ["user", username],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/user/${username}`, {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
  });

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = `${base64String}${padding}`
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i)
    outputArray[i] = rawData.charCodeAt(i);

  return outputArray;
}

const subscribeToNotifications = async (
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

export const subscribeMutationOptions = (username: string) =>
  mutationOptions({
    mutationKey: ["subscribe", username],
    mutationFn: async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        throw new Error("No service worker registration found");
      }
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY
        ),
      });
      const { endpoint, keys } = subscription.toJSON();

      if (!endpoint || !keys) {
        throw new Error("No endpoint or keys found");
      }

      const subscribeToNotificationsRes = await subscribeToNotifications(
        username,
        endpoint,
        {
          p256dh: keys.p256dh,
          auth: keys.auth,
        }
      );

      console.log(
        "🥦 subscribeToNotificationsRes",
        JSON.stringify(subscribeToNotificationsRes, null, 2)
      );

      return { isSubscribed: true };
    },
  });

const unsubscribeFromNotifications = async (subscription: PushSubscription) => {
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

export const unsubscribeMutationOptions = (username: string) =>
  mutationOptions({
    mutationKey: ["unsubscribe", username],
    mutationFn: async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        throw new Error("No service worker registration found");
      }
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY
        ),
      });

      const res = await unsubscribeFromNotifications(subscription);

      console.log(
        "🥦 unsubscribeFromNotificationsRes",
        JSON.stringify(res, null, 2)
      );

      const unsubscribeRes = await subscription.unsubscribe();

      console.log("🥦 unsubscribeRes", JSON.stringify(unsubscribeRes, null, 2));

      return { isSubscribed: false };
    },
  });
