import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from '../contexts/auth';
import SongFeed from "../components/SongFeed";
export default function Home(props) {
  const { signIn, signUp, signOut, session   } = useAuth();

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
        <SongFeed/>
    </div>
  );
}
