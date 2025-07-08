import { useEffect, useState } from "react";
import { API_URL } from "../../api";
import App from "../../App";
import { User } from "../../types";

const CreateUser = ({
  setUsername,
}: {
  setUsername: (username: string) => void;
}) => {
  const send = async (formData: FormData) => {
    try {
      const username = formData.get("username");
      const res = await fetch(`${API_URL}/user`, {
        method: "POST",
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      localStorage.setItem("user", data.username);
      setUsername(data.username);
    } catch (error) {
      console.error(error);
      alert("Failed to create user");
    }
  };

  return (
    <form action={send}>
      <h2>Create username or login with existing one!</h2>
      <p>
        Push notification subscription will be associated with your username.
      </p>
      <label>Username</label>
      <input name="username" type="text" />
      <button>Login</button>
    </form>
  );
};

const Authenticated = ({ username }: { username: string }) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${API_URL}/user/${username}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      console.log(data);
      setUser(data);
    };
    fetchUser();
  }, [username]);

  if (!user) return <div>Loading...</div>;
  return <App user={user} />;
};

export const Login = () => {
  const [username, setUsername] = useState(localStorage.getItem("user"));

  if (!username) return <CreateUser setUsername={setUsername} />;
  return <Authenticated username={username} />;
};
