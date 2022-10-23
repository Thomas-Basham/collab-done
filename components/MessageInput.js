import { useState } from "react";
import { useStore } from "../contexts/RealTime";

const MessageInput = ({ onSubmit, channelId }) => {
  const [messageText, setMessageText] = useState("");

  const submitOnEnter = (e) => {
    e.preventDefault();
    
    onSubmit(messageText);
    setMessageText("");
  };

  return (
    <>
      <form onSubmit={(e) => submitOnEnter(e)}>
        <input
          className="border rounded px-3 "
          type="text"
          placeholder="Send a message"
          disabled={!channelId}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button hidden type="submit">
          Submit
        </button>
      </form>
    </>
  );
};

export default MessageInput;
