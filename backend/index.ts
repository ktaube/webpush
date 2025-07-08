import { type PushSubscription } from "web-push";
import { corsHeaders } from "./cors";
import { userByUsernameRoutes, userRoutes, messageRoutes } from "./users/users.routes";
import {
  subscribeRoutes,
  subscribersRoutes,
} from "./subscriptions/subscriptions.routes";
import "./lib/vapid";

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
