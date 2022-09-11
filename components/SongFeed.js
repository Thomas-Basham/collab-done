import { supabase } from "../utils/supabaseClient";
import { useState, useEffect } from "react";
import useResource from "../hooks/useResource";
import Link from "next/link";
export default function SongFeed({ profilePage }) {
  const {
    musicPosts,
    getUserData,
    downloadSong,
    audio,
    handlePlayMusic,
    playSong,
  } = useResource();
  const [songUrl, setSongUrl] = useState(null);

  if (playSong == true) {
    audio.play();
  }
  if (playSong == false) {
    audio.pause();
  }

  function songPostFeed() {
    let feed = musicPosts.map((data, i) => {
      return (
        <div className="music-post col-6" key={i}>
          <h1>{data.artist}</h1>
          <small>{data.created_at}</small>
          <br></br>

          <svg
            cursor="pointer"
            onClick={() => handlePlayMusic(data, i)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
            width={100}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811z"
            />
          </svg>
          <br></br>
          <p>{data.genre}</p>
          <p>{data.description}</p>
          <p>{data.needs}</p>
          <p>{data.potential_collaborators}</p>
          <p>{data.finished_song && ""}</p>

          {data.instagram_url && (
            <a
              href={data.instagram_url}
              target="blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          )}
          <br></br>

          {data.twitter_url && (
            <a
              href={data.instagram_url}
              target="blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
          )}

          <br></br>
          {data.spotify_url && (
            <a
              href={data.instagram_url}
              target="blank"
              rel="noopener noreferrer"
            >
              Spotify
            </a>
          )}
          <br></br>

          {data.soundcloud_url && (
            <a
              href={data.instagram_url}
              target="blank"
              rel="noopener noreferrer"
            >
              Soundcloud
            </a>
          )}
        </div>
      );
    });

    return feed;
  }

  return <>{songPostFeed()}</>;
}
