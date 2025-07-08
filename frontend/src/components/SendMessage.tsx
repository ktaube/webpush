import { useRef } from "react";
import { API_URL } from "../api";

export const SendMessage = ({ to }: { to: string }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const send = async (formData: FormData) => {
    const message = formData.get("message");
    await fetch(`${API_URL}/message`, {
      method: "POST",
      body: JSON.stringify({ message, to }),
    });
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
