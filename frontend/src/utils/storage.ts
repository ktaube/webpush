export const getStoredUser = (): string | null => {
  return localStorage.getItem("user");
};

export const setStoredUser = (username: string): void => {
  localStorage.setItem("user", username);
};

export const removeStoredUser = (): void => {
  localStorage.removeItem("user");
};
