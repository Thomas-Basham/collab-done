import Message from "../components/Message";
import MessageInput from "../components/MessageInput";
import { useRouter } from "next/router";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/auth";
import { useStore } from "../contexts/Store";
import { Container, Modal } from "react-bootstrap";
import useResource from "../hooks/useResource";
import SideBar from "../components/SideBar";
import NewChannelModal from "../components/NewChannelModal";

export default function MessagesPage() {
  const router = useRouter();
  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  });
  useEffect(() => {
    if (!allProfiles) {
      getAllProfiles();
    }
  }, []);

  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [messages]);

  const { session, username, absoluteAvatar_urlAuth } = useAuth();
  const {
    addChannel,
    messages,
    channelId,
    addMessage,
    deleteMessage,
    channels,
  } = useStore();
  const { allProfiles, getAllProfiles } = useResource();

  const [showNewChannelModal, setShowNewChannelModal] = useState(false);

  const user = session?.user;

  function openNewChannelModal() {
    setShowNewChannelModal(true);
  }

  let currentChannel = channels.filter((chanel) => chanel.id == channelId);
  console.log({channelId})
  console.log({currentChannel})
  // Render the channels and messages
  return (
    <>
      {" "}
      <main>
        {/* Sidebar */}

        <Container  >
          <div className="row">
          <div className="col">

            <SideBar openNewChannelModal={openNewChannelModal} />
            </div>

            <div className="col">
              {/* Messages */}

              <div className="channel-container">
                <div className="sticky-top message-header ">
                  <h3 className="">
                    {" "}
                    {currentChannel[0]?.message_to == user?.id
                      ? currentChannel[0]?.created_by_username
                      : currentChannel[0]?.slug}
                  </h3>
                </div>
                <div className="messages">
                  <div className="">
                    {messages.map((x) => (
                      <Message
                        key={x.id}
                        message={x}
                        deleteMessage={deleteMessage}
                      />
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
                  channelId={channelId}
                />
              </div>
            </div>
          </div>
        </Container>

        <NewChannelModal
          setShowNewChannelModal={setShowNewChannelModal}
          showNewChannelModal={showNewChannelModal}
          addChannel={addChannel}
          allProfiles={allProfiles}
          user={user}
          username={username}
        />
      </main>
    </>
  );
}
