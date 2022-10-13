import LayoutMessages from "../../components/LayoutMessages";
import Message from "../../components/Message";
import MessageInput from "../../components/MessageInput";
import { useRouter } from "next/router";
import { useStore, addMessage } from "../../components/lib/Store";
import {  useEffect, useRef } from "react";
import { useAuth } from "../../contexts/auth";

const ChannelsPage = () => {
  const router = useRouter();
  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  });

  const { session, username, absoluteAvatar_urlAuth } = useAuth();

  const user = session?.user;
  // const { user, authLoaded, signOut } = useContext(UserContext)
  const messagesEndRef = useRef(null);

  // Else load up the page
  const { id: channelId } = router.query;
  const { messages, channels } = useStore({ channelId });

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [messages]);

  // redirect to public channel when current channel is deleted
  useEffect(() => {
    if (!channels.some((channel) => channel.id === Number(channelId))) {
      router.push("/channels/1");
    }
  }), [channels, channelId];


  let filteredChannels = channels.filter(chanel => chanel.message_to || chanel.created_by == session.user.id);

  // Render the channels and messages
  return (
    <LayoutMessages channels={filteredChannels} activeChannelId={channelId}>
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
          onSubmit={async (text) => addMessage(text, channelId, user.id, username, absoluteAvatar_urlAuth)}
        />
      </div>
    </LayoutMessages>
  );
};

export default ChannelsPage;
