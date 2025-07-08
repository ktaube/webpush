import type { Subscriber } from "..";
import { corsHeaders } from "../cors";
import db from "../lib/db";
import webpush from "../lib/vapid";
import { type PushSubscription } from "web-push";

export const getSubscribers = async () => {
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

export const sendNotificationToAll = async (message: string) => {
  const subscribers = await getSubscribers();
  for (const subscription of subscribers) {
    await sendNotification(subscription, message);
  }
};

export const sendNotification = async (subscriber: Subscriber, message: string) => {
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

export const createSubscriber = async (body: {
  username: string;
  endpoint: string;
  keys: { p256dh: string; auth: string };
}) => {
  const user = (await db
    .query("SELECT * FROM users WHERE username = ?")
    .get(body.username)) as { username: string };

  const subscriber = db
    .query(
      "INSERT INTO subscriptions (username, endpoint, keys) VALUES (?, ?, ?)"
    )
    .run(body.username, body.endpoint, JSON.stringify(body.keys));

  if (!subscriber) return null;

  await sendNotificationToAll(
    `Say hello to ${(body as PushSubscription).endpoint.slice(-3)}!`
  );

  return subscriber;
};

export const removeSubscriber = async (subscriber: Subscriber) => {
  db.query("DELETE FROM subscriptions WHERE endpoint = ?").run(
    subscriber.endpoint
  );
};
