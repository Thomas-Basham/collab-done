import { supabase } from "../utils/supabaseClient";
import { useState, useEffect } from "react";
import useResource from "../hooks/useResource";
import { useAuth } from "../contexts/auth";
import { FiTwitter, FiInstagram } from "react-icons/fi";
import { RiSpotifyLine } from "react-icons/ri";
import { GrSoundcloud } from "react-icons/gr";

import Link from "next/link";
export default function SongFeed({ profilePage }) {
  const {
    musicPosts,
    getUserData,
    downloadSong,
    audio,
    handlePlayMusic,
    playSong,
    getProfileByID,
    socials,
    selectedPostKey,
    addCollaborator,
  } = useResource();
  const { session, username } = useAuth();

  if (playSong == true) {
    audio.play();
  }
  if (playSong == false) {
    audio.pause();
  }

  function songPostFeed() {
    let feed = musicPosts.map((data, i) => {
      return (
        <div on className="music-post col-6" key={i}>
          <image href="" />
          {selectedPostKey != i && (
            <button
              className="socials-container"
              onClick={() => getProfileByID(data.artist_id, i)}
            >
              CONNECT
            </button>
          )}
          {selectedPostKey == i && ( // displays socials when button is collected.
            <div className="socials-container">
              {socials && (
                <Link href={socials.instagram_url}>
                  <a target="blank" rel="noopener noreferrer">
                    <FiInstagram />
                  </a>
                </Link>
              )}
              <br></br>

              {socials && (
                <a
                  href={socials.twitter_url}
                  target="blank"
                  rel="noopener noreferrer"
                >
                  <FiTwitter />
                </a>
              )}

              <br></br>
              {socials && (
                <a
                  href={socials.spotify_url}
                  target="blank"
                  rel="noopener noreferrer"
                >
                  <RiSpotifyLine />
                </a>
              )}
              <br></br>

              {socials && (
                <a
                  target="blank"
                  href={socials.soundcloud_url}
                  rel="noopener noreferrer"
                >
                  <GrSoundcloud />
                </a>
              )}
            </div>
          )}
          <h1>{data.artist}</h1>
          <small>{new Date(data.created_at).toLocaleDateString()}</small>
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
          {!data.potential_collaborators?.includes(username) && (
            <>
              <button
                className="collab-button"
                onClick={() =>
                  addCollaborator(data.potential_collaborators, data.id)
                }
              >
                LET'S COLLAB
              </button>
              <br></br>
              <br></br>
              <br></br>
            </>
          )}
          <span className="brand-text">POTENTIAL COLLABORATORS</span>{" "}
          {/* <p>{data.potential_collaborators}</p> */}
          {data.potential_collaborators.map((collaborator, i) => {
            if (collaborator) {
              return (
                <Link key={i} href={`/pr/${data.artist_id}`}  >  
                  {collaborator}
                </Link>
              );
            }
          })}
          <p>{data.finished_song && ""}</p>
        </div>
      );
    });

    return feed;
  }

  return <>{songPostFeed()}</>;
}
