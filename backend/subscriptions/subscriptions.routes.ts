import { corsHeaders } from "../cors";
import { createSubscriber, removeSubscriber, getSubscribers } from "./subscriptions.services";
import type { Subscriber } from "..";

export const subscribeRoutes = {
  POST: async (req: Bun.BunRequest<"/api/subscribe">) => {
    const body = (await req.json()) as {
      username: string;
      endpoint: string;
      keys: { p256dh: string; auth: string };
    };
    const user = await createSubscriber(body);

    if (!user) {
      return new Response(null, { status: 404, headers: corsHeaders });
    }

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
  DELETE: async (req: Bun.BunRequest<"/api/subscribe">) => {
    const body = await req.json();
    await removeSubscriber(body as Subscriber);
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  },
};

export const subscribersRoutes = {
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
};
