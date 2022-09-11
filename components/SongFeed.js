import { supabase } from "../utils/supabaseClient";
import { useState, useEffect } from "react";
import useResource from "../hooks/useResource";
export default function SongFeed() {
  const { musicPosts, getUserData } = useResource();
  // const [songUrl, setSongUrl] = useState(null);
  const [playSong, setPlaySong] = useState(false);
  const [audio, setAudio] = useState( new Audio());
  const [currentKey, setCurrentKey] = useState( null );
  

    if (playSong == true) {audio.play();}
    if (playSong == false) {audio.pause();}
    


  async function downloadSong(path) {
    try {
      const { data, error } = await supabase.storage
        .from("songs")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      if (data) {
        setAudio(new Audio(url))
        console.log(audio);
      }
    } catch (error) {
      console.log("Error downloading Audio File: ", error.message);
    }
  }

  async function handlePlayMusic(data, key) {
    setCurrentKey(key)
    if (key != currentKey){
      setPlaySong(false);
      await downloadSong(data.song_url);
      setPlaySong(true);

    } else{
      setPlaySong(false);

    }

    console.log(playSong)

  }
  function songPostFeed() {
    let feed = musicPosts.map((data, i) => {
      return (
        <div className="music-post col-6" key={i}>
          <h1>{data.artist}</h1>
          <svg
            cursor="pointer"
            // onClick={() => downloadSong(data.song_url)}
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
          <small>{data.created_at}</small>
          <p>{data.genre}</p>
          <p>{data.description}</p>
          <p>{data.needs}</p>
          <p>{data.potential_collaborators}</p>
          <p>{data.finished_song && ""}</p>
        </div>
      );
    });

    return feed;
  }

  return <>{songPostFeed()}</>;
}
