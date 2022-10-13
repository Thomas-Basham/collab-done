import Header from "./header";
import Footer from "./footer";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/auth";
import useResource from "../hooks/useResource";
import ErrorModal from "./ErrorModal";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

export default function Layout({ children }) {
  const { signOut, session, errorMessageAuth, setErrorMessageAuth } = useAuth();
  const { errorMessage, setErrorMessage } = useResource();

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

      <div className="mb-2 d-flex justify-content-end`">
        <DropdownButton
          key={"up"}
          id={`dropdown-button-drop-up`}
          drop={"up"}
          variant="none"
          title={` Messages `}
        >
          <Dropdown.Item eventKey="up">Action</Dropdown.Item>
        </DropdownButton>
      </div>
    </div>
  );
}
