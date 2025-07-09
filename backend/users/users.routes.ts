import { corsHeaders } from "../cors";
import { getUserSubscriptions, login, getSubscriptionsByUsername } from "./users.services";
import { sendNotification } from "../subscriptions/subscriptions.services";

export const userRoutes = {
  POST: async (req: Bun.BunRequest<"/api/user">) => {
    const body = (await req.json()) as { username: string };
    await login(body.username);
    return Response.json({ username: body.username }, { headers: corsHeaders });
  },
};

export const userByUsernameRoutes = {
  GET: async (req: Bun.BunRequest<"/api/user/:username">) => {
    const subscriptions = await getUserSubscriptions(req.params.username);
    return Response.json({ subscriptions }, { headers: corsHeaders });
  },
};

export const messageRoutes = {
  POST: async (req: Bun.BunRequest<"/api/message">) => {
    const body = (await req.json()) as { to: string; message: string; from?: string };
    const subscribers = await getSubscriptionsByUsername(body.to);
    console.log(subscribers);
    if (subscribers.length === 0) {
      return new Response(null, { status: 404, headers: corsHeaders });
    }
    for (const subscriber of subscribers) {
      const title = body.from ? `Message from ${body.from}` : "New message";
      await sendNotification(subscriber, body.message, { title, fromUsername: body.from });
    }
    return new Response(null, { status: 204, headers: corsHeaders });
  },
};
