import { supabase } from "../utils/supabaseClient";

import { useState, useEffect } from "react";
import useResource from "../hooks/useResource";
export default function SongFeed() {
  const { musicPosts, getUserData } = useResource();

  const feed = musicPosts.map((data, i) => {
    return (
      <div className="music-post" key={i}>
        <h1>{data.artist}</h1>
        <small>{data.created_at}</small>
        <p>{data.genre}</p>
        <p>{data.description}</p>
        <p>{data.needs}</p>
        <p>{data.potential_collaborators}</p>
        <p>{data.finished_song && ""}</p>
      </div>
    );
  });

  return <>{feed}</>;
}
