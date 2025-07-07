import webpush, { type PushSubscription } from "web-push";
import { corsHeaders } from "./cors";
import db from "./db";

webpush.setVapidDetails(
  "mailto:edymusajev@gmail.com",
  "BJfExTPgtIEQijkCKExuIbZpYsIcft-RK88y9JJMJdHByfa5whISLNDqOgsmnlvgPZBlgQRSBMwq7ooKfsHJRvQ",
  "0e55cJrdHkF16CHx7vCNQemv_ux1AyvFDbBL9vN6nDE"
);

type Subscriber = PushSubscription & { username: string };

const getSubscribers = async () => {
  try {
    const subscribers = db
      .query("SELECT * FROM subscriptions")
      .all() as Subscriber[];
    return subscribers;
  } catch (error) {
    console.error("Error loading subscribers:", error);
    return [];
  }
};
const getSubscriptionsByUsername = async (username: string) => {
  const user = (await db
    .query("SELECT * FROM users WHERE username = ?")
    .get(username)) as { username: string };
  if (!user) return [];
  const subscriptions = db
    .query("SELECT * FROM subscriptions WHERE username = ?")
    .all(user.username) as Subscriber[];
  return subscriptions;
};
const addSubscriber = async (subscriber: Subscriber) => {
  db.query(
    "INSERT INTO subscriptions (username, endpoint, keys) VALUES (?, ?, ?)"
  ).run(
    subscriber.username,
    subscriber.endpoint,
    JSON.stringify(subscriber.keys)
  );
};
const removeSubscriber = async (subscriber: Subscriber) => {
  db.query("DELETE FROM subscriptions WHERE endpoint = ?").run(
    subscriber.endpoint
  );
};

const sendNotificationToAll = async (message: string) => {
  const subscribers = await getSubscribers();
  for (const subscription of subscribers) {
    await sendNotification(subscription, message);
  }
};

const sendNotification = async (subscriber: Subscriber, message: string) => {
  await webpush.sendNotification(
    {
      ...subscriber,
      keys: JSON.parse(subscriber.keys) as { p256dh: string; auth: string },
    },
    JSON.stringify({
      title: "New user subscribed",
      body: message,
    })
  );
};

Bun.serve({
  port: 8080,
  fetch: async (req) => {
    const res = new Response(null, {
      headers: corsHeaders,
    });

    return res;
  },
  routes: {
    "/api/subscribe": {
      GET: async () => new Response("Hello from Bun!"),
      POST: async (req) => {
        const body = (await req.json()) as {
          username: string;
          endpoint: string;
          keys: { p256dh: string; auth: string };
        };
        const user = (await db
          .query("SELECT * FROM users WHERE username = ?")
          .get(body.username)) as { username: string };
        if (!user) {
          return new Response(null, { status: 404, headers: corsHeaders });
        }
        await addSubscriber({
          ...(body as PushSubscription),
          username: user.username,
        } as Subscriber);

        await sendNotificationToAll(
          `Say hello to ${(body as PushSubscription).endpoint.slice(-3)}!`
        );

        const res = new Response(
          JSON.stringify({
            message: "Subscription created",
          }),
          {
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );

        return res;
      },
      DELETE: async (req) => {
        const body = await req.json();
        await removeSubscriber(body as Subscriber);
        return new Response(null, {
          status: 204,
          headers: corsHeaders,
        });
      },
    },
    "/api/subscribers": {
      GET: async () => {
        const subscribers = await getSubscribers();
        const res = new Response(JSON.stringify(subscribers), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });

        return res;
      },
    },
    "/api/message": {
      POST: async (req) => {
        const body = (await req.json()) as { to: string; message: string };
        const subscribers = await getSubscriptionsByUsername(body.to);
        console.log(subscribers);
        if (subscribers.length === 0) {
          return new Response(null, { status: 404, headers: corsHeaders });
        }
        for (const subscriber of subscribers) {
          await sendNotification(subscriber, body.message);
        }
        return new Response(null, { status: 204, headers: corsHeaders });
      },
    },
    "/api/user": {
      POST: async (req) => {
        const body = (await req.json()) as { username: string };
        // check if user exists
        const user = (await db
          .query("SELECT * FROM users WHERE username = ?")
          .get(body.username)) as { username: string };
        if (user) {
          return Response.json(
            { username: user.username },
            { headers: corsHeaders }
          );
        }
        // create user
        db.query("INSERT INTO users (username) VALUES (?)").run(body.username);
        return Response.json(
          { username: body.username },
          { headers: corsHeaders }
        );
      },
    },
    "/api/user/:username": {
      GET: async (req) => {
        const user = (await db
          .query("SELECT * FROM users WHERE username = ?")
          .get(req.params.username)) as { username: string };
        if (!user) {
          return new Response(null, { status: 404, headers: corsHeaders });
        }
        const subscriptions = await getSubscriptionsByUsername(user.username);
        return new Response(
          JSON.stringify({
            ...user,
            subscriptions,
          }),
          {
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      },
    },
  },
});

console.log("Hello via Bun!");
