import PWABadge from "./PWABadge.tsx";
import "./App.css";
import { useEffect, useState } from "react";
import { API_URL } from "./api.ts";
import { SubscriberList } from "./SubscriberList.tsx";

// Taken from https://www.npmjs.com/package/web-push
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

const getServiceWorkerRegistration = async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) throw new Error("No service worker registration found");
  return registration;
};

const getPushNotificationSubscription = async () => {
  const registration = await getServiceWorkerRegistration();
  const subscribed = await registration.pushManager.getSubscription();
  return subscribed;
};

const subscribe = async () => {
  try {
    const registration = await getServiceWorkerRegistration();
    const subscription = await registration?.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        import.meta.env.VITE_VAPID_PUBLIC_KEY
      ),
    });
    if (!subscription) return;
    const { endpoint, keys } = subscription.toJSON();
    if (!endpoint || !keys) return;

    // send subscription to backend
    const res = await fetch(`${API_URL}/subscribe`, {
      method: "POST",
      body: JSON.stringify({
        endpoint,
        keys: {
          p256dh: keys.p256dh,
          auth: keys.auth,
        },
      }),
    });
    if (!res.ok) throw new Error("Failed to send subscription to backend");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const unsubscribe = async () => {
  const subscription = await getPushNotificationSubscription();
  console.log("??", subscription);
  await fetch(`${API_URL}/subscribe`, {
    method: "DELETE",
    body: JSON.stringify(subscription),
  });
  await subscription?.unsubscribe();
};

function App({ user }: { user: string }) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (isSubscribed) return;
    const init = async () => {
      const subscription = await getPushNotificationSubscription();
      setIsSubscribed(!!subscription);
    };
    init();
  }, [isSubscribed]);

  return (
    <>
      <h1>Push Notifications</h1>
      <p>Logged in as {user}</p>
      <button
        onClick={() => {
          localStorage.removeItem("user");
          window.location.reload();
        }}
      >
        Logout
      </button>
      {isSubscribed ? (
        <button
          onClick={async () => {
            await unsubscribe();
            setIsSubscribed(false);
          }}
        >
          unsubscribe
        </button>
      ) : (
        <button
          onClick={async () => {
            const permission = await Notification.requestPermission();
            console.log(permission);
            if (permission !== "granted") return;
            await subscribe();
            setIsSubscribed(true);
          }}
        >
          subscribe
        </button>
      )}
      <SubscriberList />
      <PWABadge />
    </>
  );
}

export default App;
