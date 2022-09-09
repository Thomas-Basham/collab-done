import Header from "./header";
import Footer from "./footer";
import Head from "next/head";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

import { useAuth } from "../contexts/auth";

export default function Layout({ children }) {
  const { signIn, signUp, signOut, session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

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
    </div>
  );
}
