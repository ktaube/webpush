import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getPushManagerSubscriptionQueryOptions,
  sendMessageMutationOptions,
  unsubscribeMutationOptions,
} from "../-queries";
import { Subscription } from "../../types";
import { cn } from "../../utils/cn";
import { useRef } from "react";

type Props = {
  username: string;
  subscription: Subscription;
  onUnsubscribe: () => void;
};

export const SubscriptionItem = ({
  subscription,
  onUnsubscribe,
  username,
}: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const { data: pushManagerSubscription } = useQuery({
    ...getPushManagerSubscriptionQueryOptions(),
  });

  const unsubscribeMutation = useMutation({
    ...unsubscribeMutationOptions(),
    onSuccess: () => {
      onUnsubscribe();
    },
  });

  const sendMessageMutation = useMutation({
    ...sendMessageMutationOptions(),
    onSuccess: () => {
      dialogRef.current?.close();
    },
  });

  const isLocal = pushManagerSubscription?.endpoint === subscription.endpoint;
  const disabledClassNames = "w-full opacity-50 cursor-not-allowed";

  const send = async (formData: FormData) => {
    const message = formData.get("message") as string;
    await sendMessageMutation.mutateAsync({ to: username, message });
  };

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
      <button className="w-full" onClick={() => dialogRef.current?.showModal()}>
        Send message
      </button>
      <dialog ref={dialogRef} onClose={() => dialogRef.current?.close()}>
        <h2>Send message to {username}</h2>
        <form action={send}>
          <textarea name="message" placeholder="Message" />
          <button type="submit">Send</button>
        </form>
      </dialog>
    </>
  );
};
