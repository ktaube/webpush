import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:kristaps@ktaube.com",
  process.env.VITE_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export default webpush;
