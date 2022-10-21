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
import { useStore } from "../contexts/RealTime";
import { TiMessages } from "react-icons/ti";

export default function Layout({ children }) {
  const { signOut, session, errorMessageAuth, setErrorMessageAuth, userRoles } =
    useAuth();
  const { errorMessage, setErrorMessage } = useResource();
  const [showNewChannelModal, setShowNewChannelModal] = useState(false);

  function openNewChannelModal() {
    setShowNewChannelModal(true);
  }
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

      <DropdownButton
        className="mb-2 d-flex justify-content-end fixed-bottom"
        key={"up"}
        id={`dropdown-button-drop-up`}
        drop={"up"}
        variant="none"
        title={` Messages `}
      >
        <Dropdown.Item eventKey="up">
          <SideBar openNewChannelModal={openNewChannelModal} global={true} />
        </Dropdown.Item>
      </DropdownButton>
    </div>
  );
}
