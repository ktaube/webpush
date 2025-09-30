import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getPushManagerSubscriptionQueryOptions,
  unsubscribeMutationOptions,
} from "../-queries";
import { Subscription } from "../../types";
import { cn } from "../../utils/cn";

type Props = {
  subscription: Subscription;
  onUnsubscribe: () => void;
};

export const Subscriber = ({ subscription, onUnsubscribe }: Props) => {
  const { data: pushManagerSubscription } = useQuery({
    ...getPushManagerSubscriptionQueryOptions(),
  });

  console.log("pushManagerSubscription", pushManagerSubscription);

  const unsubscribeMutation = useMutation({
    ...unsubscribeMutationOptions(),
    onSuccess: () => {
      onUnsubscribe();
    },
  });

  const isLocal = pushManagerSubscription?.endpoint === subscription.endpoint;
  console.log(
    "isLocal",
    isLocal,
    pushManagerSubscription?.endpoint,
    subscription.endpoint
  );

  const disabledClassNames = "w-full opacity-50 cursor-not-allowed";

  return (
    <>
      <pre className="text-sm bg-amber-100 p-2 rounded-md border border-amber-200 break-all whitespace-pre-wrap">
        {subscription.endpoint}
      </pre>
      <button
        className={cn("w-full", !isLocal ? disabledClassNames : "")}
        key={subscription.id}
        onClick={() =>
          unsubscribeMutation.mutate(subscription.id, {
            onError: (error) => {
              console.error(error);
            },
          })
        }
        disabled={unsubscribeMutation.isPending || !isLocal}
      >
        Unsubscribe
      </button>
    </>
  );
};
