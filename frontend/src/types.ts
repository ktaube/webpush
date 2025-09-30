export type Subscription = {
  endpoint: string;
};

export type User = {
  username: string;
  subscriptions: Subscription[];
};
