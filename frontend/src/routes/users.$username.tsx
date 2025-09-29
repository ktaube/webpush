import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users/$username")({
  component: RouteComponent,
});

function RouteComponent() {
  const { username } = Route.useParams();
  return <div>Hello "/users/$username" {username}!</div>;
}
