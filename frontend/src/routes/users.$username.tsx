import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import PWABadge from "../components/PWABadge";
import { queryClient } from "../query-client";
import { Subscriber } from "./-components/Subscriber";
import { getUserQueryOptions, subscribeMutationOptions } from "./-queries";

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

  return (
    <main>
      <header>
        <h1>Push Notifications</h1>
        <p>Logged in as {user.username}</p>
      </header>
      <section>
        <p>Active subscriptions: {user.subscriptions.length}</p>
        <div className="flex flex-col gap-1 max-w-2xl">
          {user.subscriptions.map((subscription) => (
            <Subscriber
              key={subscription.id}
              username={user.username}
              subscription={subscription}
              onUnsubscribe={() => refetch()}
            />
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
      <PWABadge />
    </main>
  );
}
