import type { Subscriber } from "..";
import { corsHeaders } from "../cors";
import db from "../db";

export const login = async (username: string) => {
  const user = (await db
    .query("SELECT * FROM users WHERE username = ?")
    .get(username)) as { username: string };
  if (user) {
    return Response.json({ username: user.username }, { headers: corsHeaders });
  } else {
    db.query("INSERT INTO users (username) VALUES (?)").run(username);
  }
};

export const getUserSubscriptions = async (username: string) => {
  const user = (await db
    .query("SELECT * FROM users WHERE username = ?")
    .get(username)) as { username: string };
  if (!user) {
    return new Response(null, { status: 404, headers: corsHeaders });
  }
  const subscriptions = db
    .query("SELECT * FROM subscriptions WHERE username = ?")
    .all(user.username) as Subscriber[];
  return subscriptions;
};

export const getSubscriptionsByUsername = async (username: string) => {
  const user = (await db
    .query("SELECT * FROM users WHERE username = ?")
    .get(username)) as { username: string };
  if (!user) return [];
  const subscriptions = db
    .query("SELECT * FROM subscriptions WHERE username = ?")
    .all(user.username) as Subscriber[];
  return subscriptions;
};
