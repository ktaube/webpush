import { useEffect, useState } from "react";
import { getSubscribers, Subscriber } from "../api/subscribers";

export const useSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSubscribers = async () => {
      setIsLoading(true);
      try {
        const data = await getSubscribers();
        setSubscribers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  return {
    subscribers,
    isLoading,
  };
};
