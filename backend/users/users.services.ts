import type { Subscriber } from "..";
import { corsHeaders } from "../cors";
import db from "../lib/db";

export const insertUser = async (username: string) => {
  const user = (await db
    .query("SELECT * FROM users WHERE username = ?")
    .get(username)) as { username: string };
  if (user) {
    return Response.json({ username: user.username }, { headers: corsHeaders });
  } else {
    db.query("INSERT INTO users (username) VALUES (?)").run(username);
  }
};

export const getUserByUsername = async (username: string) => {
  const user = (await db
    .query("SELECT * FROM users WHERE username = ?")
    .get(username)) as { id: number; username: string };
  if (!user) {
    return new Response(null, { status: 404, headers: corsHeaders });
  }
  const subscriptions = db
    .query("SELECT * FROM subscriptions WHERE username = ?")
    .all(user.username) as Subscriber[];
  return { id: user.id, username: user.username, subscriptions };
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
