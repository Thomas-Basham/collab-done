import { useState } from "react";
import { useStore } from "../contexts/Store";

const MessageInput = ({ onSubmit, channelId }) => {
  const [messageText, setMessageText] = useState("");

  // const {

  //   channelId,

  // } = useStore();
  const submitOnEnter = (event) => {
    // Watch for enter key
    if (event.keyCode === 13) {
      onSubmit(messageText);
      setMessageText("");
    }
  };

  console.log(channelId);
  return (
    <>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
