import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  return (
    <div className="container w-full flex flex-col">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!username.trim().length) return;
          navigate({ to: "/users/$username", params: { username } });
        }}
      >
        <input
          type="text"
          placeholder="Username"
          className="w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
