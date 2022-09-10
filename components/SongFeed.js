import { supabase } from "../utils/supabaseClient";

import { useState, useEffect } from "react";
import useResource from "../hooks/useResource";
export default function SongFeed() {
  const { musicPosts, getUserData } = useResource();

  async function downloadSong(path) {
    try {
      const { data, error } = await supabase.storage
        .from("songs")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      console.log(typeof url)
      if (data) {
        return url
      }
    } catch (error) {
      console.log("Error downloading Audio File: ", error.message);
    }
  }
  const feed = musicPosts.map((data, i) => {
     let mp3 = data.song_url && downloadSong(data.song_url) 
      console.log(mp3)
    return (
      <div className="music-post" key={i}>
        <h1>{data.artist}</h1>
        {/* <p>{mp3}</p> */}
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
