/// <reference lib="webworker" />
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

declare let self: ServiceWorkerGlobalScope;

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});
self.addEventListener("push", (event) => {
  console.log("🔔 Push event received:", event);

  try {
    const data = event.data?.json();
    console.log("📦 Push data:", data);

    const notificationOptions = {
      body: data.body,
      icon: "/pwa-192x192.png",
      badge: "/pwa-64x64.png",
      tag: "notification-" + Date.now(),
      requireInteraction: true,
      silent: false,
      vibrate: [200, 100, 200],
      actions: [],
      timestamp: Date.now(),
    };

    console.log("📢 Showing notification with options:", notificationOptions);

    event.waitUntil(
      self.registration.showNotification(data.title, notificationOptions)
        .then(() => {
          console.log("✅ Notification shown successfully");
        })
        .catch((error) => {
          console.error("❌ Failed to show notification:", error);
        })
    );
  } catch (error) {
    console.error("❌ Error in push event handler:", error);
  }
});

// self.__WB_MANIFEST is the default injection point
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

/** @type {RegExp[] | undefined} */
let allowlist;
// in dev mode, we disable precaching to avoid caching issues
if (import.meta.env.DEV) allowlist = [/^\/$/];

// to allow work offline
registerRoute(
  new NavigationRoute(createHandlerBoundToURL("index.html"), { allowlist })
);
