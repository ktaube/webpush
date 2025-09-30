export type Subscription = {
  id: string;
  endpoint: string;
};

export type User = {
  id: string;
  username: string;
  subscriptions: Subscription[];
};
