import webpush, { type PushSubscription } from "web-push";
import { corsHeaders } from "./cors";
import { userByUsernameRoutes, userRoutes, messageRoutes } from "./users/users.routes";
import {
  subscribeRoutes,
  subscribersRoutes,
} from "./subscriptions/subscriptions.routes";

webpush.setVapidDetails(
  "mailto:edymusajev@gmail.com",
  process.env.VITE_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export type Subscriber = PushSubscription & { username: string };

Bun.serve({
  port: 8080,
  fetch: async (req) => {
    const res = new Response(null, {
      headers: corsHeaders,
    });

    return res;
  },
  routes: {
    "/api/subscribe": subscribeRoutes,
    "/api/subscribers": subscribersRoutes,
    "/api/message": messageRoutes,
    "/api/user": userRoutes,
    "/api/user/:username": userByUsernameRoutes,
  },
});

console.log("Hello via Bun!");
