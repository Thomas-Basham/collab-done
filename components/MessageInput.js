import { useState } from "react";
import { useStore } from "../contexts/Store";

const MessageInput = ({ onSubmit, channelId }) => {
  const [messageText, setMessageText] = useState("");

  const submitOnEnter = (event) => {
    // Watch for enter key
    if (event.keyCode === 13) {
      onSubmit(messageText);
      setMessageText("");
    }
  };

  return (
    <>
      <input
        className="border rounded px-3 "
        type="text"
        placeholder="Send a message"
        disabled={!channelId}
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyDown={(e) => submitOnEnter(e)}
      />
    </>
  );
};

export default MessageInput;
