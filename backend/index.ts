import webpush, { type PushSubscription } from "web-push";
import { corsHeaders } from "./cors";
import db from "./db";

webpush.setVapidDetails(
  "mailto:edymusajev@gmail.com",
  "BJfExTPgtIEQijkCKExuIbZpYsIcft-RK88y9JJMJdHByfa5whISLNDqOgsmnlvgPZBlgQRSBMwq7ooKfsHJRvQ",
  "0e55cJrdHkF16CHx7vCNQemv_ux1AyvFDbBL9vN6nDE"
);

type Subscriber = PushSubscription & { userId: string };

const getSubscribers = async () => {
  try {
    const subscribers = Bun.file("subscribers.json");
    if (subscribers.size === 0) return [];
    return (await subscribers.json()) as Subscriber[];
  } catch (error) {
    console.error("Error loading subscribers:", error);
    return [];
  }
};
const getSubscriberById = async (id: string) => {
  const subscribers = await getSubscribers();
  return subscribers.find((s) => s.userId === id);
};
const addSubscriber = async (subscriber: Subscriber) => {
  const subscribers = await getSubscribers();
  subscribers.push(subscriber);
  await Bun.file("subscribers.json").write(JSON.stringify(subscribers));
};
const removeSubscriber = async (subscriber: Subscriber) => {
  const subscribers = await getSubscribers();
  const filteredSubscribers = subscribers.filter(
    (s) => s.endpoint !== subscriber.endpoint
  );
  await Bun.file("subscribers.json").write(JSON.stringify(filteredSubscribers));
};

const sendNotificationToAll = async (message: string) => {
  const subscribers = await getSubscribers();
  for (const subscription of subscribers) {
    await sendNotification(subscription, message);
  }
};

const sendNotification = async (subscriber: Subscriber, message: string) => {
  console.log(subscriber);
  await webpush.sendNotification(
    subscriber,
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
        const body = await req.json();
        console.log(body);
        await addSubscriber({
          ...(body as PushSubscription),
          userId: (body as PushSubscription).endpoint.slice(-3),
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
        const subscriber = await getSubscriberById(body.to);
        if (!subscriber) {
          return new Response(null, { status: 404, headers: corsHeaders });
        }
        await sendNotification(subscriber, body.message);
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
  },
});

console.log("Hello via Bun!");
