import PWABadge from "./components/PWABadge.tsx";
import "./App.css";
import { SubscriberList } from "./components/SubscriberList.tsx";
import { User } from "./types.ts";
import { useNotifications } from "./hooks/useNotifications";

function App({ user, onLogout }: { user: User; onLogout: () => void }) {
  const { isSubscribed, subscribe, unsubscribe } = useNotifications();

  return (
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
        <button onClick={onLogout}>Logout</button>
        {isSubscribed ? (
          <button onClick={unsubscribe}>unsubscribe</button>
        ) : (
          <button
            onClick={async () => {
              const permission = await Notification.requestPermission();
              console.log(permission);
              if (permission !== "granted") return;
              await subscribe();
            }}
          >
            subscribe
          </button>
        )}
      </nav>
      <SubscriberList />
      <PWABadge />
    </main>
  );
}

export default App;
