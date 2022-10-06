import { supabase } from "../utils/supabaseClient";
import { useState, useEffect } from "react";
import useResource from "../hooks/useResource";
import { useAuth } from "../contexts/auth";
import Avatar from "./Avatar";
import Socials from "./socials";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Modal } from "react-bootstrap";
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
    getCollaborators,
    potentialCollaborators,
  } = useResource();
  const { session, username } = useAuth();
  const [postData, setPostData] = useState(null);

  const [showPotentialCollabsModal, setShowPotentialCollabsModal] =
    useState(false);
  const [showAddCollabsModal, setShowAddCollabsModal] = useState(false);

  if (playSong == true) {
    audio.play();
  }
  if (playSong == false) {
    audio.pause();
  }

  function collabButton(data) {
    let userIDs = potentialCollaborators?.map((data) => {
      return data.user;
    });

    let handleAddCollaborator = (id) => {
      addCollaborator(data.id);
      setShowAddCollabsModal(false);
    };

    if (session?.user && !userIDs?.includes(session.user.id)) {
      return (
        <button
          className="collab-button"
          onClick={() => handleAddCollaborator(data.id)}
        >
          LET'S COLLAB
        </button>
      );
    }
    if (session?.user && userIDs?.includes(session.user.id)) {
      return (
        <button
          className="collab-button"
          onClick={() => setShowAddCollabsModal(false)}
        >
          REQUEST SENT
        </button>
      );
    }

    if (username == null) {
      return (
        <Link href={"/profile"}>
          <button className="collab-button">
            Complete your profile to collaborate
          </button>
        </Link>
      );
    }
  }
  console.log(potentialCollaborators);

  const handleShowPotentialCollabsModal = async (id) => {
    await getCollaborators(id);
    setShowPotentialCollabsModal(true);
  };

  const handleShowAddCollabModal = async (data) => {
    await getCollaborators(data.id);

    await setPostData(data);
    setShowAddCollabsModal(true);
  };

  function songPostFeed() {
    const sortedMusicPosts = musicPosts.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    return sortedMusicPosts.map((data, i) => {
      return (
        <div
          // with this feature uncommented, each photo will be rendered upon mouse enter
          // onMouseEnter={() => downloadImage(getSocials(data.artist_id, i))}
          className="music-post "
          key={i}
        >
          {" "}
          {selectedPostKey != i && (
            <button
              className="socials-container"
              onClick={() => getSocials(data.artist_id, i)}
            >
              CONNECT
            </button>
          )}
          <Link href={`/pr/${data.artist_id}`}>
            <div style={{ cursor: "pointer" }}>
              <img
                src={data.absolute_avatar_url}
                alt="Avatar"
                className="avatar image"
                style={{ height: 150, width: 150 }}
              />

              {selectedPostKey == i && ( // displays socials when button is collected.
                <Socials data={socials} />
              )}
              <h1>{data.artist}</h1>
            </div>
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
            songID={data.id}
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
          {session?.user.id != data.artist_id && (
            <button
              className="collab-button"
              onClick={() => handleShowAddCollabModal(data)}
            >
              LET'S COLLAB{" "}
            </button>
          )}
          <button
            onClick={() => handleShowPotentialCollabsModal(data.id)}
            className="brand-text"
          >
            POTENTIAL COLLABORATORS
          </button>
          <br></br>
          {/* {data.potential_collaborators_uuid &&
            getCollaborators.map((collaborator, i) => {
              if (collaborator) {
                return (
                  <Link key={i} href={`/pr/${collaborator}`}>
                    {collaborator}
                  </Link>
                );
              }
            })} */}
          <p>{data.finished_song && ""}</p>
        </div>
      );
    });
  }

  return (
    <>
      <div>{songPostFeed()}</div>

      <Modal
        show={showAddCollabsModal}
        onHide={() => setShowAddCollabsModal(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Let user know you want to connect</Modal.Title>
        </Modal.Header>
        {collabButton(postData)}
      </Modal>

      <Modal
        show={showPotentialCollabsModal}
        onHide={() => setShowPotentialCollabsModal(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Potential Collaborators</Modal.Title>
        </Modal.Header>

        {potentialCollaborators &&
          potentialCollaborators.map((collaborator, i) => {
            return (
              <Link key={i} href={`/pr/${collaborator.user}`}>
                {collaborator.username}
              </Link>
            );
          })}
      </Modal>
    </>
  );
}
