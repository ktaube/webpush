export function urlBase64ToUint8Array(base64String: string) {
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

export const getServiceWorkerRegistration = async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) throw new Error("No service worker registration found");
  return registration;
};

export const getPushNotificationSubscription = async () => {
  const registration = await getServiceWorkerRegistration();
  const subscribed = await registration.pushManager.getSubscription();
  return subscribed;
};
