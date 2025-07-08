import App from "../../App";
import { useAuth } from "../../hooks/useAuth";

const CreateUser = ({ onLogin }: { onLogin: (username: string) => void }) => {
  const send = async (formData: FormData) => {
    try {
      const username = formData.get("username") as string;
      onLogin(username);
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

export const Login = () => {
  const { username, user, isLoading, login, logout } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!username) return <CreateUser onLogin={login} />;

  if (!user) return <div>Loading...</div>;

  return <App user={user} onLogout={logout} />;
};
