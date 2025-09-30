import type { Subscriber } from "..";
import { corsHeaders } from "../cors";
import db from "../lib/db";
import webpush from "../lib/vapid";

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

export const sendNotification = async (
  subscriber: Subscriber,
  message: string,
  options?: { title?: string; fromUsername?: string }
) => {
  const title = options?.title || "New user subscribed";
  const body = options?.fromUsername ? message : message;

  console.log("🥦 subscriber", subscriber, body);

  await webpush.sendNotification(
    {
      ...subscriber,
      keys: JSON.parse(subscriber.keys) as { p256dh: string; auth: string },
    },
    JSON.stringify({
      title,
      body,
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

  await sendNotificationToAll(`Say hello to ${body.username}!`);

  return subscriber;
};

export const removeSubscriber = async (subscriptionId: number) => {
  db.query("DELETE FROM subscriptions WHERE id = ?").run(subscriptionId);
};
