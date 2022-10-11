import Header from "./header";
import Footer from "./footer";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/auth";
import ErrorModal from './ErrorModal'

export default function Layout({ children }) {
  const { signOut, session, errorMessageAuth, setErrorMessageAuth } = useAuth();

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

      <ErrorModal errorMessageAuth={errorMessageAuth} setErrorMessageAuth={setErrorMessageAuth} />
    </div>
  );
}
