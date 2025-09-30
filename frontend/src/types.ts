export type Subscription = {
  id: number;
  endpoint: string;
};

export type User = {
  id: string;
  username: string;
  subscriptions: Subscription[];
};
