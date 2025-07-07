import { useState } from "react";
import { API_URL } from "./api";
import App from "./App";

const CreateUser = ({ setUser }: { setUser: (user: string) => void }) => {
  const send = async (formData: FormData) => {
    try {
      const username = formData.get("username");
      const res = await fetch(`${API_URL}/user`, {
        method: "POST",
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      localStorage.setItem("user", data.username);
      setUser(data.username);
    } catch (error) {
      console.error(error);
      alert("Failed to create user");
    }
  };

  return (
    <form action={send}>
      <h2>Create username or login with existing one</h2>
      <p>
        Push notification subscription will be associated with your username.
      </p>
      <label>Username</label>
      <input name="username" type="text" />
      <button>Login</button>
    </form>
  );
};

export const User = () => {
  const [user, setUser] = useState(localStorage.getItem("user"));

  if (!user) return <CreateUser setUser={setUser} />;
  return <App user={user} />;
};
