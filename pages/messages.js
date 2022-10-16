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

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [messages]);

  const { session, username, absoluteAvatar_urlAuth } = useAuth();
  const { addChannel, messages, channelId, addMessage, deleteMessage } =
    useStore();
  const { allProfiles, getAllProfiles } = useResource();

  const [showNewChannelModal, setShowNewChannelModal] = useState(false);

  const user = session?.user;
  const messagesEndRef = useRef(null);

  function openNewChannelModal() {
    setShowNewChannelModal(true);
  }
  const size = 100;

  // Render the channels and messages
  return (
    <>
      {" "}
      <main>
        {/* Sidebar */}

        <Container fluid>
          <div className="row">
            <SideBar openNewChannelModal={openNewChannelModal} />

            <div className="col">
              {/* Messages */}

              <div className="channel-container">
                <div className="Messages">
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
