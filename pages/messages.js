import LayoutMessages from "../components/LayoutMessages copy";
import Message from "../components/Message";
import MessageInput from "../components/MessageInput";
import { useRouter } from "next/router";
import useStore from "../hooks/Store";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/auth";

export default function MessagesPage() {
  const router = useRouter();
  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  });

  const { session, username, absoluteAvatar_urlAuth } = useAuth();

  const user = session?.user;
  const messagesEndRef = useRef(null);

  const {
    addChannel,
    deleteChannel,
    messages,
    newMessage,
    channels,
    channelId,
    setChannelId,
    addMessage,
  } = useStore();

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
    console.log(messages)
  }, [messages]);




  // Render the channels and messages
  return (
    <>
      <LayoutMessages

      >
        <div className=" channel-container">
          <div className="Messages">
            <div className="">
              {messages.map((x) => (
                <Message key={x.id} message={x} />
              ))}
              <div ref={messagesEndRef} style={{ height: 0 }} />
            </div>
          </div>
        </div>
        <div className="">
          <MessageInput
            onSubmit={async (text) =>
              addMessage(
                text,
                channelId,
                user.id,
                username,
                absoluteAvatar_urlAuth
              )
            }
          />
        </div>
      </LayoutMessages>
    </>
  );
}
