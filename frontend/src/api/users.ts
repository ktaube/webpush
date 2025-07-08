import { API_URL } from "./config";
import { User } from "../types";

export const createUser = async (username: string) => {
  const res = await fetch(`${API_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ username }),
  });
  
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
};

export const getUser = async (username: string): Promise<User> => {
  const res = await fetch(`${API_URL}/user/${username}`, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });
  
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};