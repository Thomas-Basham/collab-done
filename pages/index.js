import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../contexts/auth";
import SongFeed from "../components/SongFeed";
export default function Home(props) {
  return (
    <>
    <div className='container d-flex flex-row'>

    <div className="container row">
      <SongFeed profilePage={false} />
    </div>
    <div className="container row  ">
      Messaging coming soon
    </div>
    </div>
    
    </>
  );
}
