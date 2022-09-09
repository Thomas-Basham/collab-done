import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../contexts/auth";
import SongFeed from "../components/SongFeed";
export default function Home(props) {
  return (
    <div className="container">
      <SongFeed />
    </div>
  );
}
