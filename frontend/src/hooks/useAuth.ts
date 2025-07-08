import { useEffect, useState } from "react";
import { createUser, getUser } from "../api/users";
import {
  getStoredUser,
  setStoredUser,
  removeStoredUser,
} from "../utils/storage";
import { User } from "../types";

export const useAuth = () => {
  const [username, setUsername] = useState<string | null>(getStoredUser());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!username) return;
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const userData = await getUser(username);
        setUser(userData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [username]);

  const login = async (usernameInput: string) => {
    setIsLoading(true);
    try {
      const userData = await createUser(usernameInput);
      setStoredUser(userData.username);
      setUsername(userData.username);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeStoredUser();
    setUsername(null);
    setUser(null);
  };

  return {
    username,
    user,
    isLoading,
    login,
    logout,
  };
};
