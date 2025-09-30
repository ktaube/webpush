import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { queryClient } from "../query-client";
import {
  getUserQueryOptions,
  subscribeMutationOptions,
  unsubscribeMutationOptions,
} from "./-queries";
import { useMutation, useQuery } from "@tanstack/react-query";
import PWABadge from "../components/PWABadge";
import { SubscriberList } from "../components/SubscriberList";
import { Fragment } from "react/jsx-runtime";

export const Route = createFileRoute("/users/$username")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      user: await queryClient.ensureQueryData(
        getUserQueryOptions(params.username)
      ),
    };
  },
});

function RouteComponent() {
  const { username } = Route.useParams();
  const initialData = Route.useLoaderData();
  const navigate = useNavigate();

  const { data: user, refetch } = useQuery({
    ...getUserQueryOptions(username),
    initialData: initialData.user,
  });

  const subscribeMutation = useMutation({
    ...subscribeMutationOptions(username),
    onSuccess: () => {
      refetch();
    },
  });
  const unsubscribeMutation = useMutation({
    ...unsubscribeMutationOptions(username),
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <main>
      <header>
        <h1>Push Notifications</h1>
        <p>Logged in as {user.username}</p>
      </header>
      <section>
        <p>Active subscriptions: {user.subscriptions.length}</p>
        <div className="flex flex-col gap-2 max-w-2xl">
          {user.subscriptions.map((subscription) => (
            <Fragment key={subscription.id}>
              <pre className="text-sm bg-amber-100 p-2 rounded-md border border-amber-200 break-all whitespace-pre-wrap">
                {subscription.endpoint}
              </pre>
              <button
                className="w-full"
                key={subscription.endpoint}
                onClick={() =>
                  unsubscribeMutation.mutate(undefined, {
                    onError: (error) => {
                      console.error(error);
                    },
                  })
                }
                disabled={unsubscribeMutation.isPending}
              >
                Unsubscribe
              </button>
            </Fragment>
          ))}
        </div>
      </section>
      <nav>
        <button onClick={() => navigate({ to: "/" })}>Logout</button>
        {user.subscriptions.length === 0 && (
          <button onClick={() => subscribeMutation.mutate(undefined)}>
            Subscribe
          </button>
        )}
      </nav>
      <SubscriberList />
      <PWABadge />
    </main>
  );
}
