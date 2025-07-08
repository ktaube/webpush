import { useRef } from "react";
import { sendMessage } from "../api/messages";

export const SendMessage = ({ to }: { to: string }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const send = async (formData: FormData) => {
    const message = formData.get("message") as string;
    await sendMessage(to, message);
    dialogRef.current?.close();
  };
  return (
    <>
      <button onClick={() => dialogRef.current?.showModal()}>
        Send message
      </button>
      <dialog ref={dialogRef} onClose={() => dialogRef.current?.close()}>
        <h2>Send message to {to}</h2>
        <form action={send}>
          <textarea name="message" placeholder="Message" />
          <button type="submit">Send</button>
        </form>
      </dialog>
    </>
  );
};
