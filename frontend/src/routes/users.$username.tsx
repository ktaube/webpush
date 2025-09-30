import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { queryClient } from "../query-client";
import {
  getUserQueryOptions,
  subscribeMutationOptions,
  unsubscribeMutationOptions,
} from "./-queries";
import { useMutation } from "@tanstack/react-query";
import PWABadge from "../components/PWABadge";

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
  const { user } = Route.useLoaderData();
  const navigate = useNavigate();

  const subscribeMutation = useMutation(subscribeMutationOptions(username));
  const unsubscribeMutation = useMutation(unsubscribeMutationOptions(username));

  return (
    // <main>
    //   <header>
    //     <h1>Push Notifications</h1>
    //     <p>Logged in as {user.username}</p>
    //   </header>
    //   <section>
    //     <p>Active subscriptions: {user.subscriptions.length}</p>
    //     <ul>
    //       {user.subscriptions.map((subscription) => (
    //         <li key={subscription.endpoint}>{subscription.endpoint}</li>
    //       ))}
    //     </ul>
    //   </section>
    //   <nav>
    //     <button onClick={onLogout}>Logout</button>
    //     {isSubscribed ? (
    //       <button onClick={unsubscribe}>unsubscribe</button>
    //     ) : (
    //       <button
    //         onClick={async () => {
    //           const permission = await Notification.requestPermission();
    //           console.log(permission);
    //           if (permission !== "granted") return;
    //           await subscribe();
    //         }}
    //       >
    //         subscribe
    //       </button>
    //     )}
    //   </nav>
    //   <SubscriberList />
    //   <PWABadge />
    // </main>
    <main>
      <header>
        <h1>Push Notifications</h1>
        <p>Logged in as {user.username}</p>
      </header>
      <section>
        <p>Active subscriptions: {user.subscriptions.length}</p>
        <ul>
          {user.subscriptions.map((subscription) => (
            <li key={subscription.endpoint}>{subscription.endpoint}</li>
          ))}
        </ul>
      </section>
      <nav>
        <button onClick={() => navigate({ to: "/" })}>Logout</button>
        {subscribeMutation.data?.isSubscribed ? (
          <button
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
        ) : (
          <button
            onClick={() =>
              subscribeMutation.mutate(undefined, {
                onError: (error) => {
                  console.error(error);
                },
              })
            }
            disabled={subscribeMutation.isPending}
          >
            Subscribe
          </button>
        )}
      </nav>
      <PWABadge />
    </main>
  );
}
