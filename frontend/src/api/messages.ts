import { API_URL } from "./config";

export const sendMessage = async (to: string, message: string) => {
  const res = await fetch(`${API_URL}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ message, to }),
  });
  
  if (!res.ok) throw new Error("Failed to send message");
};