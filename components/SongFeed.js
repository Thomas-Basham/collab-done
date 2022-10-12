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
    fileName,
    uploading,
    uploadSong,
    loading,
    songUrl,
    setFileName,
    getCollaborators,
    potentialCollaborators,
    absoluteSongUrl,
    setAbsoluteSongUrl,
    updateSongPost,
    deleteSongPost,
  } = useResource();
  const { session, username } = useAuth();
  const [postData, setPostData] = useState(null);

  const [showPotentialCollabsModal, setShowPotentialCollabsModal] =
    useState(false);
  const [showAddCollabsModal, setShowAddCollabsModal] = useState(false);
  const [songPostData, SetSongPostData] = useState(null);
  const [genre, setGenre] = useState(null);
  const [description, setDescription] = useState(null);
  const [needs, setNeeds] = useState(null);
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (playSong == true) {
    audio.play();
  }
  if (playSong == false) {
    audio.pause();
  }
  const size = 150;

  function collabButton(data) {
    let userIDs = potentialCollaborators?.map((data) => {
      return data.user;
    });

    let handleAddCollaborator = (id) => {
      addCollaborator(id);
      setShowAddCollabsModal(false);
    };

    if (session?.user && !userIDs?.includes(session.user.id)) {
      return (
        <button onClick={() => handleAddCollaborator(data.id)}>
          LET'S COLLAB
        </button>
      );
    }
    if (session?.user && userIDs?.includes(session.user.id)) {
      return (
        <button onClick={() => setShowAddCollabsModal(false)}>
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

  const handleShowPotentialCollabsModal = async (id) => {
    await getCollaborators(id);
    setShowPotentialCollabsModal(true);
  };

  const handleShowAddCollabModal = async (data) => {
    await getCollaborators(data.id);

    await setPostData(data);
    setShowAddCollabsModal(true);
  };

  function handleOpenModal(data) {
    setShow(true);
    setGenre(data.genre);
    setDescription(data.description);
    setNeeds(data.needs);
    SetSongPostData(data);
    setFileName(data.song_url);
    setAbsoluteSongUrl(data.absolute_song_url);
  }

  function handleOpenDeleteModal(data) {
    setShowDeleteModal(true);
    SetSongPostData(data);
  }
  function handleDelete() {
    setShowDeleteModal(false);
    deleteSongPost(songPostData.id);
  }

  function handleSubmit() {
    const values = {
      artist: username,
      artist_id: session.user.id,
      song_url: fileName,
      absolute_song_url: absoluteSongUrl,
      genre,
      description,
      needs,
    };
    updateSongPost(values, songPostData.id);
    setShow(false);
  }

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
            song_id={data.id}
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
          <p>{data.finished_song && ""}</p>
        </div>
      );
    });
  }

  const songPostFeedProfilePage = () => {
    let filteredPosts = musicPosts.filter(
      (post) => post.artist_id === session?.user.id
    );

    const sortedMusicPosts = filteredPosts.sort(
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
          <div className="edit-delete-buttons">
            <svg
              cursor={"pointer"}
              onClick={() => handleOpenDeleteModal(data)}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 trash-icon"
              width={25}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
            &nbsp;
            <svg
              cursor={"pointer"}
              onClick={() => handleOpenModal(data)}
              width={25}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 edit-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </div>

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
            song_id={data.id}
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
          <button
            onClick={() => handleShowPotentialCollabsModal(data.id)}
            className="brand-text"
          >
            POTENTIAL COLLABORATORS
          </button>
          <br></br>
          <br></br>
          <br></br>
          <p>{data.finished_song && ""}</p>
        </div>
      );
    });
  };
  return (
    <>
      {profilePage === false && (
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
        </>
      )}

      {profilePage === true && (
        <>
          <div>{songPostFeedProfilePage()} </div>

          <Modal
            show={show}
            onHide={() => setShow(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Click Submit To Update This Post</Modal.Title>
            </Modal.Header>
            <div className="row flex-center flex">
              <div className="col-6 form-widget">
                <div>
                  <label htmlFor="artist">Artist</label>
                  <input id="artist" type="text" value={username} disabled />
                </div>
                <div>
                  <p>
                    {fileName ? (
                      fileName
                    ) : (
                      <small style={{ color: "grey" }}>no file uploaded</small>
                    )}
                  </p>
                  <div style={{ width: size }}>
                    <label
                      className="button primary block"
                      htmlFor="audio-file"
                    >
                      {uploading ? "Uploading ..." : "Upload"}
                    </label>
                    <input
                      style={{
                        visibility: "hidden",
                        position: "absolute",
                      }}
                      type="file"
                      id="audio-file"
                      accept="audio/*"
                      onChange={uploadSong}
                      disabled={uploading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="genre">Genre</label>
                  <input
                    id="genre"
                    type="text"
                    value={genre || ""}
                    onChange={(e) => setGenre(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="website">Description</label>
                  <input
                    id="description"
                    type="text"
                    value={description || ""}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="needs">Needs</label>
                  <input
                    id="needs"
                    type="text"
                    value={needs || ""}
                    onChange={(e) => setNeeds(e.target.value)}
                  />
                </div>

                <div>
                  <button
                    className="button primary block"
                    onClick={() => handleSubmit()}
                    disabled={loading}
                  >
                    {loading ? "Loading ..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </Modal>

          <Modal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Are you sure you want to delete this post?
              </Modal.Title>
            </Modal.Header>

            <button
              className="bg-danger delete-button"
              onClick={() => handleDelete()}
            >
              Delete Post
            </button>

            <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
          </Modal>
        </>
      )}

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
        <br></br>

        {potentialCollaborators &&
          potentialCollaborators.map((collaborator, i) => {
            return (
              <Link key={i} href={`/pr/${collaborator.user}`}>
                <div style={{ cursor: "pointer" }}>
                  <img
                    alt={collaborator.username}
                    src={collaborator.absolute_avatar_url}
                    className="avatar image d-inline"
                    style={{ height: "4vh", width: "4vh" }}
                  />
                  &nbsp; &nbsp;
                  {collaborator.username}
                </div>
              </Link>
            );
          })}
      </Modal>
    </>
  );
}
