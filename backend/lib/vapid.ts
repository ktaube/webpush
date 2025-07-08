import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:edymusajev@gmail.com",
  process.env.VITE_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export default webpush;