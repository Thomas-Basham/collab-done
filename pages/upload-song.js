import useResource from "../hooks/useResource";
import { useAuth } from "../contexts/auth";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export default function UploadSong() {
  const {
    session,
    username,
    instagram_url,
    twitter_url,
    spotify_url,
    soundcloud_url,
    absoluteAvatar_urlAuth
  } = useAuth();
  const { createSongPost,getAbsoluteSongUrl, absoluteSongUrl} = useResource();

  const [genre, setGenre] = useState(null);
  const [description, setDescription] = useState(null);
  const [needs, setNeeds] = useState(null);
  const [loading, setLoading] = useState(false);
  const [songUrl, setSongUrl] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [uploading, setUploading] = useState(false);
  console.log(absoluteAvatar_urlAuth)
  async function uploadSong(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an audio file to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("songs")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      await getAbsoluteSongUrl(filePath)
      setSongUrl(filePath);
      setFileName(file.name);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }
  function handleSubmit() {
    const values = {
      artist: username,
      artist_id: session.user.id,
      genre,
      description,
      needs,
      song_url: songUrl,
      absolute_song_url:absoluteSongUrl, 
      potential_collaborators: [null],
      absolute_avatar_url: absoluteAvatar_urlAuth,
      // instagram_url,
      // twitter_url,
      // spotify_url,
      // soundcloud_url,
    };
    createSongPost(values);
  }
  let size = 150;

  return (
    <div className="row flex-center flex">
      <div className="col-6 form-widget">
        <div>
          <label htmlFor="artist">Artist</label>
          <input id="artist" type="text" value={username} disabled />
        </div>
        <p>{fileName}</p>
        <div style={{ width: size }}>
          <label className="button primary block" htmlFor="single">
            {uploading ? "Uploading ..." : "Upload"}
          </label>
          <input
            style={{
              visibility: "hidden",
              position: "absolute",
            }}
            type="file"
            id="single"
            accept="audio/*"
            onChange={uploadSong}
            disabled={uploading}
          />
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
  );
}
