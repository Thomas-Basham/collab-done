import useResource from '../hooks/useResource';
import { useAuth } from "../contexts/auth";
import { useState, useEffect } from "react";

export default function UploadSong(){
  const { session, signIn, signOut } = useAuth();
  const { createSongPost } = useResource();
  const [genre, setGenre] = useState(null);
  const [description, setDescription] = useState(null);
  const [needs, setNeeds] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log("sesssss", session)
  function handleSubmit(){
    const values = {
      // id: user.id,
      artist: session.user.id,
      genre,
      description,
      needs,
    };
    createSongPost(values)
  }

  return(
    <div className="row flex-center flex">
      <div className="col-6 form-widget">

        <div>
          <label htmlFor="artist">Artist</label>
          <input id="artist" type="text" value={session?.user.email} disabled />
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
            {loading ? "Loading ..." : "Upload"}
          </button>
        </div>


      </div>
    </div>

  )
}