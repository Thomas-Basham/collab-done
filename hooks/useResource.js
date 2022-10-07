import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../contexts/auth";
import { useRouter } from "next/router";

import { useState, useEffect } from "react";

export default function useResource() {
  const router = useRouter();
  const { session, username, absoluteAvatar_urlAuth } = useAuth();

  const [loading, setLoading] = useState(true);
  const [musicPosts, setmusicPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [songUrl, setSongUrl] = useState(null);
  const [playSong, setPlaySong] = useState(false);
  const [audio, setAudio] = useState(new Audio());
  const [currentKey, setCurrentKey] = useState(null);
  const [socials, setSocials] = useState(null);
  const [allAvatars, setAllAvatars] = useState(null);
  const [selectedPostKey, setSelectedPostKey] = useState();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [absoluteSongUrl, setAbsoluteSongUrl] = useState(null);
  const [absoluteAvatar_url, setAbsoluteAvatar_Url] = useState(null);
  const [potentialCollaborators, setPotentialCollaborators] = useState(null);

  useEffect(() => {
    getmusicPosts();
  }, []);

  useEffect(() => {
    getComments();
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

  async function getComments() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase.from("comments").select("*");

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setComments(data);
        return data;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }
  async function createComment(values) {
    try {
      setLoading(true);

      let { error } = await supabase.from("comments").insert(values);

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteComment(id) {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("comments")
        .delete()
        .match({ id: id });
      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      getComments();
      setLoading(false);
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

  async function addCollaborator(id) {
    if (!session) {
      router.push("/login");
    }
    try {
      setLoading(true);
      let values = {
        songID: id,
        user: session.user.id,
        username: username,
        absolute_avatar_url: absoluteAvatar_urlAuth,
      };
      let { error } = await supabase
        .from("potentialCollaborators")
        .insert(values);

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function getCollaborators(id) {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("potentialCollaborators")
        .select("*")
        .eq("songID", id);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setPotentialCollaborators(data);

        return data;
      }
    } catch (error) {
      alert(error.message);
    } finally {
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
      if (data) {
        const url = URL.createObjectURL(data);
        setAudio(new Audio(url));
        setAudioUrl(url);

        setLoading(false);
        return url;
      }
    } catch (error) {
      console.log("Error downloading Audio File: ", error.message);
    }
  }

  async function getAbsoluteSongUrl(path) {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from("songs")
        .getPublicUrl(path);
      if (error) {
        throw error;
      }
      if (data) {
        setAbsoluteSongUrl(data.publicUrl);

        setLoading(false);
        // return(data)
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

  async function getSocials(id, i) {
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
        setSocials(data);
        setSelectedPostKey(i);
        setAvatarUrl(data.avatar_url);

        return data;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }
  async function getProfileByID(id) {
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
        return data;
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

  async function getAbsoluteAvatarUrl(path) {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from("avatars")
        .getPublicUrl(path);
      if (error) {
        throw error;
      }
      if (data) {
        setAbsoluteAvatar_Url(data.publicUrl);
        setLoading(false);
        return data.publicUrl;
      }
    } catch (error) {
      console.log("Error downloading Audio File: ", error.message);
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
    audioUrl,
    getAbsoluteSongUrl,
    absoluteSongUrl,
    getAbsoluteAvatarUrl,
    absoluteAvatar_url,
    setAbsoluteAvatar_Url,
    getComments,
    createComment,
    comments,
    setComments,
    getSocials,
    deleteComment,
    getCollaborators,
    potentialCollaborators,
  };
}
