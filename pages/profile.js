import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import Avatar from "../components/Avatar";
import { useAuth } from "../contexts/auth";
import { useRouter } from "next/router";
import useResource from "../hooks/useResource";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function Profile() {
  const {
    musicPosts,
    getUserData,
    downloadSong,
    audio,
    handlePlayMusic,
    playSong,
    deleteSongPost,
    loading,
    setLoading,
  } = useResource();

  if (playSong == true) {
    audio.play();
  }
  if (playSong == false) {
    audio.pause();
  }
  const [currentUserSongPosts, setCurrentUserSongPosts] = useState([]);
  const { createSongPost } = useResource();

  const [songPostData, SetSongPostData] = useState(null);
  const [genre, setGenre] = useState(null);
  const [description, setDescription] = useState(null);
  const [needs, setNeeds] = useState(null);
  // const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {
    session,
    signIn,
    signOut,
    username,
    setUsername,
    website,
    setWebsite,
    avatar_url,
    setAvatarUrl,
    instagram_url,
    setInstagram_url,
    twitter_url,
    setTwitter_url,
    spotify_url,
    setSpotify_url,
    soundcloud_url,
    setSoundcloud_url,
    getProfile,
    isLoading,
    setIsLoading,
    updateProfile,
  } = useAuth();


  function handleOpenModal(data) {
    setShow(true);
    setGenre(data.genre);
    setDescription(data.description);
    setNeeds(data.needs);
    SetSongPostData(data);
    return;
  }

  function handleSubmit() {
    const values = {
      artist: username,
      artist_id: session.user.id,
      genre,
      description,
      needs,
    };
    updateSongPost(values, songPostData.id);
    setShow(false);
  }
  let fillteredPosts = musicPosts.filter(
    (post) => post.artist_id === session.user.id
  );
  const userFeed = fillteredPosts.map((data, i) => {
    return (
      <div className="music-post" key={i}>
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

        <p>{data.genre}</p>
        <p>{data.description}</p>
        <p>{data.needs}</p>
        <span className="brand-text">POTENTIAL COLLABORATORS</span>          {/* <p>{data.potential_collaborators}</p> */}
        <br></br>

        {data.potential_collaborators.map((data, i) => {
            return (
              <>
              <a key={i} >{data}</a>
              <br></br>
              </>
              
            )
          })}        
        <p>{data.finished_song && ""}</p>
        <svg
          cursor={"pointer"}
          onClick={() => deleteSongPost(data.id)}
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
    );
  });

  return (
    <div className="row flex-center flex">
      <div className="col-6 form-widget">
        <Avatar
          url={avatar_url}
          size={150}
          onUpload={(url) => {
            setAvatarUrl(url);
            updateProfile({ avatar_url: url }); // username, website,
          }}
        />
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="text" value={session?.user.email} disabled />
        </div>
        <div>
          <label htmlFor="username">Artist Name</label>
          <input
            id="username"
            type="text"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            value={website || ""}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="instagram">Instagram username</label>
          <input
            id="instagram"
            type="text"
            value={instagram_url || ""}
            onChange={(e) => setInstagram_url(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="twitter">Twitter username</label>
          <input
            id="twitter"
            type="text"
            value={twitter_url || ""}
            onChange={(e) => setTwitter_url(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="soundcloud">Soundcloud username</label>
          <input
            id="soundcloud"
            type="website"
            value={soundcloud_url || ""}
            onChange={(e) => setSoundcloud_url(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="Spotify">Spotify artist id</label>
          <input
            id="Spotify"
            type="website"
            value={spotify_url || ""}
            onChange={(e) => setSpotify_url(e.target.value)}
          />
        </div>

        <div>
          <button
            className="button primary block"
            onClick={(e) =>
              updateProfile({
                
                username,
                website,
                avatar_url,
                instagram_url,
                twitter_url,
                spotify_url,
                soundcloud_url,
              })
            }
            disabled={isLoading}
          >
            {isLoading ? "Loading ..." : "Update"}
          </button>
        </div>

        <div>
          <button className="button block" onClick={signOut()}>
            Sign Out
          </button>
        </div>
        {userFeed}
      </div>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <div className="row flex-center flex">
          <div className="col-6 form-widget">
            <div>
              <label htmlFor="artist">Artist</label>
              <input id="artist" type="text" value={username} disabled />
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
    </div>
  );
}
