import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../contexts/auth";
import { useRouter } from "next/router";

import { useState, useEffect } from "react";

export default function useResource() {
  const router = useRouter();
  const { session, username } = useAuth();

  const [loading, setLoading] = useState(true);
  const [musicPosts, setmusicPosts] = useState([]);
  const [songUrl, setSongUrl] = useState(null);
  const [playSong, setPlaySong] = useState(false);
  const [audio, setAudio] = useState(new Audio());
  const [currentKey, setCurrentKey] = useState(null);
  const [socials, setSocials] = useState(null);
  const [allAvatars, setAllAvatars] = useState(null);
  const [selectedPostKey, setSelectedPostKey] = useState();
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    getmusicPosts();
  }, []);

  async function getmusicPosts() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase.from("songs").select("*");

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setmusicPosts(data.reverse());
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }
  async function getAllAvatars() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase.from("avatars").select("*");

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setAllAvatars(data);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function createSongPost(values) {
    try {
      setLoading(true);

      let { error } = await supabase.from("songs").insert(values);

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
      router.push("/profile");
    }
  }

  async function deleteSongPost(id) {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("songs")
        .delete()
        .match({ id: id });
      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      getmusicPosts();
      router.push("/profile");
      setLoading(false);
    }
  }

  async function updateSongPost(values, id) {
    try {
      setLoading(true);

      let { error } = await supabase
        .from("songs")
        .update(values)
        .match({ id: id });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      getmusicPosts();
      setLoading(false);
    }
  }

  async function addCollaborator(oldCollabsArray, id) {
    if (!session){
      router.push('/login')
    }
    try {
      setLoading(true);
      if (oldCollabsArray == null) {
        let newCollabsArray = [username, null];

        let { error } = await supabase
          .from("songs")
          .update([{ potential_collaborators: newCollabsArray }])
          .match({ id: id });

        if (error) {
          throw error;
        }
      } else {
        console.log({ oldCollabsArray });
        oldCollabsArray.push(username);
        // console.log({newCollabsArray})
        let { error } = await supabase
          .from("songs")
          .update({ potential_collaborators: oldCollabsArray })
          .match({ id: id });

        if (error) {
          throw error;
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      getmusicPosts();
      setLoading(false);
    }
  }

  async function downloadSong(path) {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from("songs")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      if (data) {
        setAudio(new Audio(url));
        setLoading(false);
        console.log(audio);
      }
    } catch (error) {
      console.log("Error downloading Audio File: ", error.message);
    }
  }
  async function handlePlayMusic(data, key) {
    setCurrentKey(key);
    if (key != currentKey) {
      setPlaySong(false);
      await downloadSong(data.song_url);
      setPlaySong(true);
    } else {
      setPlaySong(!playSong);
    }
  }

  async function getProfileByID(id, i) {

      try {
        setLoading(true);

        let { data, error, status } = await supabase
          .from("profiles")
          // .select(`username, website, avatar_url`)
          .select(`*`)
          .eq("id", id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          console.log(data) 
          setSocials(data);
          setSelectedPostKey(i);
          setAvatarUrl(data.avatar_url);

          return(data)
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    
  }

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
  }
  return {
    createSongPost,
    getmusicPosts,
    loading,
    musicPosts,
    deleteSongPost,
    updateSongPost,
    downloadSong,
    audio,
    handlePlayMusic,
    playSong,
    setCurrentKey,
    getProfileByID,
    socials,
    selectedPostKey,
    addCollaborator,
    allAvatars,
    downloadImage,
    avatarUrl,

  };
}
