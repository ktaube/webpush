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

    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/pwa-192x192.png",
      }).then(() => {
        console.log("✅ Notification shown successfully");
      }).catch((error) => {
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
