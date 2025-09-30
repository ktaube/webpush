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
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Notification permission denied");
      }

      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        throw new Error("No service worker registration found");
      }

      // Check for existing subscription and unsubscribe first
      const existingSubscription =
        await registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log(
          "🥦 Unsubscribing existing subscription before creating new one"
        );
        await existingSubscription.unsubscribe();
        // Small delay to ensure cleanup completes
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const vapidKey = urlBase64ToUint8Array(
        import.meta.env.VITE_VAPID_PUBLIC_KEY
      );

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });
      console.log("🥦 subscription", subscription);
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
        "Subscribe to notifications response",
        JSON.stringify(subscribeToNotificationsRes, null, 2)
      );

      return { isSubscribed: true };
    },
  });

const unsubscribeFromNotifications = async (subscriptionId: number) => {
  const res = await fetch(`${API_URL}/subscribe`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: subscriptionId }),
  });

  if (!res.ok) throw new Error("Failed to unsubscribe from notifications");
  return res;
};

export const unsubscribeMutationOptions = () =>
  mutationOptions({
    mutationKey: ["unsubscribe"],
    mutationFn: async (subscriptionId: number) => {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        throw new Error("No service worker registration found");
      }

      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        console.log("No active subscription found");
      } else {
        const unsubscribeRes = await subscription.unsubscribe();
        console.log(
          "Unsubscribe from notifications response",
          JSON.stringify(unsubscribeRes, null, 2)
        );
      }

      const res = await unsubscribeFromNotifications(subscriptionId);

      console.log(
        "Unsubscribe from notifications delete response",
        JSON.stringify(res, null, 2)
      );

      return { isSubscribed: false };
    },
  });

export const getPushManagerSubscriptionQueryOptions = () =>
  queryOptions({
    queryKey: ["pushManagerSubscription"],
    queryFn: async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      return registration?.pushManager.getSubscription();
    },
  });
