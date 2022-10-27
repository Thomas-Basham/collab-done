import Message from "../components/Message";
import MessageInput from "../components/MessageInput";
import { useRouter } from "next/router";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/auth";
import { useRealtime } from "../contexts/RealTime";
import { Container, Modal } from "react-bootstrap";
import useResource from "../hooks/useResource";
import SideBar from "../components/SideBar";
import NewChannelModal from "../components/NewChannelModal";

export default function MessagesPage() {
  const router = useRouter();

  const {
    session,
    username,
    absoluteAvatar_urlAuth,
    errorMessageAuth,
    setErrorMessageAuth,
  } = useAuth();
  const {
    addChannel,
    messages,
    channelId,
    addMessage,
    deleteMessage,
    channels,
  } = useRealtime();
  const { allProfiles, getAllProfiles } = useResource();
  const user = session?.user;

  const [showNewChannelModal, setShowNewChannelModal] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
    if (username == null) {
      router.push("/profile?error=no-username");
      setErrorMessageAuth("You must have a name before you can send a message");
    }
    console.log(username);
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
  });

  function openNewChannelModal() {
    setShowNewChannelModal(true);
  }

  let currentChannel = channels.filter((chanel) => chanel.id == channelId);

  // Render the channels and messages
  return (
    <>
      {" "}
      <main>
        {/* Sidebar */}
        <div className="container">
          <div className="row">
            <div className="col-sm-3">
              <SideBar openNewChannelModal={openNewChannelModal} />
            </div>

            <div className="col-sm-9">
              {/* Messages */}

              <div className="channel-container">
                <div className="sticky-top message-header ">
                  <h3 id="message-from">
                    {currentChannel[0]?.message_to == user?.id ? (
                      <a href={`pr/${currentChannel[0]?.created_by}`}>
                        {currentChannel[0]?.created_by_username}
                      </a>
                    ) : (
                      <a href={`pr/${currentChannel[0]?.message_to}`}>
                        {currentChannel[0]?.slug}
                      </a>
                    )}
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
              <div className="position-relative bottom-0 col-md-12">
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
        </div>

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
