import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../contexts/auth";
import { useRouter } from "next/router";
import { useState } from "react";

export default function useResource() {
  const router = useRouter();
  const { session, username, absoluteAvatar_urlAuth } = useAuth();

  const [errorMessage, setErrorMessage] = useState(null);
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
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [allProfiles, setAllProfiles] = useState(null);

  const generalErrorMessage =
    "Our servers are currently down. Please try again soon.";

  async function getAllProfiles() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase.from("profiles").select("*");

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setAllProfiles(data);
        return data;
      }
    } catch (error) {
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function getMusicPosts() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase.from("songs").select("*");

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setmusicPosts(data);
      }
    } catch (error) {
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }
  /**
   * Upload an audio file to Supabase Storage
   */
  async function uploadSong(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an audio file to upload.");
      }

      const file = event.target.files[0];

      // USE THIS TO MASK THE FILE NAME. NOT USED FOR AUDIO FILES
      // const fileExt = file.name.split(".").pop();
      const fileName = `${file.name}.${new Date()}`;
      // const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("songs")
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }
      await getAbsoluteSongUrl(fileName);
      setSongUrl(fileName);
      setFileName(file.name);
    } catch (error) {
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
    } finally {
      setUploading(false);
    }
  }

  /**
   * upload song to feed
   * @param {object} values
   */
  async function createSongPost(values) {
    try {
      setLoading(true);

      let { error } = await supabase.from("songs").insert(values);

      if (error) {
        throw error;
      }
    } catch (error) {
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
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
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * post a comment to a song
   * @param {object} values
   */
  async function createComment(values) {
    try {
      setLoading(true);

      let { error } = await supabase.from("comments").insert(values);

      if (error) {
        throw error;
      }
    } catch (error) {
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Delete a comment that belongs to the user
   * @param {number} id The id of the comment
   */
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
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
    } finally {
      getComments();
      setLoading(false);
    }
  }

  /**
   * Delete a song post that belongs to the user
   * @param {number} id The id of the song post
   */
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
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
    } finally {
      getMusicPosts();
      setLoading(false);
    }
  }

  /**
   * Update a comment that belongs to the user
   * @param {object} values The values to be updated
   * @param {number} id The id of the song post
   */
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
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
    } finally {
      getMusicPosts();
      setLoading(false);
    }
  }

  /**
   * Add yourself as a potential collaborator to a song post
   * @param {number} id The id of the song post you are adding to
   */
  async function addCollaborator(id) {
    if (!session) {
      router.push("/login");
    }
    try {
      setLoading(true);
      let values = {
        song_id: id,
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
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * See the potential collaborators for a song post
   * @param {number} id The id of the song post
   */
  async function getCollaborators(id) {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("potentialCollaborators")
        .select("*")
        .eq("song_id", id);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setPotentialCollaborators(data);

        return data;
      }
    } catch (error) {
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Download a song from Supase storage
   * @param {string} path
   */
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

  /**
   * Retrieve a mp3 src from the path
   * @param {string} path
   */
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

  /**
   * Backup audio player
   * @param {object} data
   * @param {Number} key
   */
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

  /**
   * Get socials link from profile id, and key
   * @param {string} id
   * @param {number} key key of the song post
   */
  async function getSocials(id, key) {
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
        setSelectedPostKey(key);
        setAvatarUrl(data.avatar_url);

        return data;
      }
    } catch (error) {
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Get profile from profile id
   * @param {string} id
   */
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
      setErrorMessage(error.message);
      console.log(error.message);
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
      setErrorMessage(`Error downloading Audio File: , ${error.message}`);
      console.log("Error downloading Audio File: ", error.message);
    }
  }

  /**
   * Get avatar img src from path
   * @param {string} path
   */
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
      setErrorMessage(`Error downloading Audio File: , ${error.message}`);
      console.log("Error downloading Audio File: ", error.message);
    }
  }
  return {
    errorMessage,
    setErrorMessage,
    createSongPost,
    getMusicPosts,
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
    setAbsoluteSongUrl,
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
    uploadSong,
    uploading,
    songUrl,
    fileName,
    setFileName,
    getAllProfiles,
    allProfiles,
  };
}
