import Header from "./header";
import Footer from "./footer";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/auth";
import useResource from "../hooks/useResource";
import ErrorModal from "./ErrorModal";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import SideBar from "./SideBar";
import { addChannel, deleteChannel, useStore, addMessage } from "./lib/Store";

export default function Layout({ children }) {
  const { signOut, session, errorMessageAuth, setErrorMessageAuth, userRoles } =
    useAuth();
  const { errorMessage, setErrorMessage } = useResource();
  const [channelId, setChannelId] = useState(null);
  const { messages, channels } = useStore({ channelId });
  const [showNewChannelModal, setShowNewChannelModal] = useState(false);
  const user = session?.user;

  function openNewChannelModal() {
    setShowNewChannelModal(true);
  }
  let filteredChannels = channels.filter(
    (chanel) => chanel.message_to || chanel.created_by == session.user.id
  );

  return (
    <div>
      <Head>
        <title>Collab Done</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:title"
          content="Connecting musicians, finishing collabs"
        />
      </Head>

      <Header session={session} signOut={signOut} />
      <main className="main">{children}</main>
      <Footer />

      <ErrorModal
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        errorMessageAuth={errorMessageAuth}
        setErrorMessageAuth={setErrorMessageAuth}
      />

      <div className="mb-2 d-flex justify-content-end fixed-bottom">
        <DropdownButton
          key={"up"}
          id={`dropdown-button-drop-up`}
          drop={"up"}
          variant="none"
          title={` Messages `}
        >
          <Dropdown.Item eventKey="up">
            <SideBar
              channels={filteredChannels}
              openNewChannelModal={openNewChannelModal}
              user={user}
              userRoles={userRoles}
              setActiveChannel={setChannelId}
              deleteChannel={deleteChannel}
              global={true}
            />
          </Dropdown.Item>
        </DropdownButton>
      </div>
    </div>
  );
}
