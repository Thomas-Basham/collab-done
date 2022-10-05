import { supabase } from "../utils/supabaseClient";
import { useState, useEffect } from "react";
import useResource from "../hooks/useResource";
import { useAuth } from "../contexts/auth";
import Avatar from "./Avatar";
import Socials from "./socials";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
const Waveform = dynamic(() => import("../components/WaveForm"), {
  ssr: false,
});
export default function SongFeed({ profilePage }) {
  const {
    musicPosts,
    getUserData,
    downloadSong,
    audio,
    handlePlayMusic,
    playSong,
    getSocials,
    socials,
    selectedPostKey,
    addCollaborator,
    allAvatars,
    downloadImage,
    avatarUrl,
    audioUrl,
  } = useResource();
  const { session, username } = useAuth();
  const [postUserData, setPostUserData] = useState(null);

  if (playSong == true) {
    audio.play();
  }
  if (playSong == false) {
    audio.pause();
  }

  function collabButton(data) {
    if (
      !data.potential_collaborators?.includes(username) &&
      data.artist_id != session.user.id
    ) {
      return (
        <button
          className="collab-button"
          onClick={() => addCollaborator(data.potential_collaborators, data.id)}
        >
          LET'S COLLAB
        </button>
      );
    }
  }

  function songPostFeed() {
    const sortedMusicPosts = musicPosts.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    return sortedMusicPosts.map((data, i) => {
      console.log(data)
      return (
        <div
          // with this feature uncommented, each photo will be rendered upon mouse enter
          // onMouseEnter={() => downloadImage(getSocials(data.artist_id, i))}
          className="music-post "
          key={i}
        >


          <img
            src={data.absolute_avatar_url}
            alt="Avatar"
            className="avatar image"
            style={{ height: 150, width: 150 }}
          />

          {selectedPostKey != i && (
            <button
              className="socials-container"
              onClick={() => getSocials(data.artist_id, i)}
            >
              CONNECT
            </button>
          )}
          {selectedPostKey == i && ( // displays socials when button is collected.
            <Socials data={socials} />
          )}
          <Link href={`/pr/${data.artist_id}`}>
            <h1 style={{ cursor: "pointer" }}>{data.artist}</h1>
          </Link>
          <small>{new Date(data.created_at).toLocaleDateString()}</small>
          <br></br>

          {/* SAVE THIS FOR BACKUP AUDIO PLAYER */}
          {/* <svg
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
          </svg> */}

          {/* WAVESURFER-JS */}
          <Waveform
            url={data.absolute_song_url}
            indexNumber={data.id.toString()}
            songID= {data.id}
          />
          <br></br>
          <div className="d-inline-flex">
            <span className="brand-text">GENRE</span>

            <p>{data.genre}</p>
          </div>
          <br></br>
          <div className="d-inline-flex">
            <span className="brand-text">NEEDS</span>
            <p>{data.needs}</p>
          </div>
          <p>{data.description}</p>

          {collabButton(data)}
          <span className="brand-text">POTENTIAL COLLABORATORS</span>
          <br></br>

          {data.potential_collaborators.map((collaborator, i) => {
            if (collaborator) {
              return (
                <Link key={i} href={`/pr/${data.artist_id}`}>
                  {collaborator}
                </Link>
              );
            }
          })}
          <p>{data.finished_song && ""}</p>
        </div>
      );
    });

  }

  return (
    <>
      <div>{songPostFeed()}</div>
    </>
  );
}
