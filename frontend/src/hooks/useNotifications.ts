import { useEffect, useState } from "react";
import {
  subscribeToNotifications,
  unsubscribeFromNotifications,
} from "../api/subscriptions";
import {
  urlBase64ToUint8Array,
  getPushNotificationSubscription,
  getServiceWorkerRegistration,
} from "../utils/push";
import { getStoredUser } from "../utils/storage";

export const useNotifications = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (isSubscribed) return;
    const init = async () => {
      const subscription = await getPushNotificationSubscription();
      setIsSubscribed(!!subscription);
    };
    init();
  }, [isSubscribed]);

  const subscribe = async () => {
    try {
      const registration = await getServiceWorkerRegistration();
      const subscription = await registration?.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY,
        ),
      });
      if (!subscription) return;
      const { endpoint, keys } = subscription.toJSON();
      if (!endpoint || !keys) return;

      const username = getStoredUser();
      if (!username) return;

      await subscribeToNotifications(username, endpoint, {
        p256dh: keys.p256dh,
        auth: keys.auth,
      });

      setIsSubscribed(true);
    } catch (error) {
      console.error(error);
    }
  };

  const unsubscribe = async () => {
    try {
      const subscription = await getPushNotificationSubscription();
      if (!subscription) return;

      await unsubscribeFromNotifications(subscription);
      await subscription.unsubscribe();
      setIsSubscribed(false);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    isSubscribed,
    subscribe,
    unsubscribe,
  };
};
