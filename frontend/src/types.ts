export type Subscription = {
  endpoint: string;
};

export type User = {
  username: string;
  createdAt: string;
  updatedAt: string;
  subscriptions: Subscription[];
};
