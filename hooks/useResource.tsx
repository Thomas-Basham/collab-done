import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../contexts/auth";
import { useRouter } from "next/router";
import { useState } from "react";

interface Song {
  id: number;
}

interface Comment {
  id: number;
  user: number;
  comment: string;
  song_id: number;
  commentPosition: number;
  avatarUrl: string;
}

interface Profile {
  id: string;
  username: string;
  bio: string;
  website: string;
  avatar_url: string;
  absolute_avatar_url: string;
  instagram_url: string;
  twitter_url: string;
  spotify_url: string;
  soundcloud_url: string;
}

interface PotentialCollaborator {
  // Add potential collaborator properties
}

export default function useResource() {
  const router = useRouter();
  const { session, username, absoluteAvatar_urlAuth } = useAuth();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [musicPosts, setmusicPosts] = useState<Song[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [songUrl, setSongUrl] = useState<string | null>(null);
  const [playSong, setPlaySong] = useState<boolean>(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(new Audio());
  const [currentKey, setCurrentKey] = useState<number | null>(null);
  const [socials, setSocials] = useState<Profile | null>(null);
  const [allAvatars, setAllAvatars] = useState<any>(null);
  const [selectedPostKey, setSelectedPostKey] = useState<number>();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [absoluteSongUrl, setAbsoluteSongUrl] = useState<string | null>(null);
  const [absoluteAvatar_url, setAbsoluteAvatar_Url] = useState<string | null>(
    null
  );
  const [potentialCollaborators, setPotentialCollaborators] = useState<
    PotentialCollaborator[] | null
  >(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [allProfiles, setAllProfiles] = useState<Profile[] | null>(null);

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
  async function uploadSong(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an audio file to upload.");
      }

      const file = event.target.files[0];
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("songs")
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      setFileName(fileName);
    } catch (error) {
      setErrorMessage(error.message);
      console.log(error.message);
    } finally {
      setUploading(false);
    }
  }

  /**
   * Create a new song post
   */
  async function createSongPost(song: Song) {
    try {
      setLoading(true);

      const { error } = await supabase.from("songs").insert([song]);

      if (error) {
        throw error;
      }

      // Refresh the music posts
      await getMusicPosts();
    } catch (error) {
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
    } finally {
      setLoading(false);
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
      }
    } catch (error) {
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function createComment(comment: Comment) {
    try {
      setLoading(true);

      const { error } = await supabase.from("comments").insert([comment]);

      if (error) {
        throw error;
      }

      // Refresh the comments
      await getComments(comment.song_id);
    } catch (error) {
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteComment(id: number) {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("comments")
        .delete()
        .match({ id: id });

      if (error) {
        throw error;
      }

      // Refresh the comments
      await getComments();
    } catch (error) {
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSongPost(song: Song) {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("songs")
        .delete()
        .match({ id: song.id });

      if (error) {
        throw error;
      }

      // Refresh the music posts
      await getMusicPosts();
    } catch (error) {
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateSongPost(song: Song) {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("songs")
        .update(song)
        .match({ id: song.id });

      if (error) {
        throw error;
      }

      // Refresh the music posts
      await getMusicPosts();
    } catch (error) {
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function addCollaborator(songId: number, collaboratorId: string) {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("potential_collaborators")
        .upsert([{ song_id: songId, collaborator_id: collaboratorId }]);

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

  async function removeCollaborator(songId: number, collaboratorId: string) {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("potential_collaborators")
        .delete()
        .match({ song_id: songId, collaborator_id: collaboratorId });

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

  async function getPotentialCollaborators(songId: number) {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("potential_collaborators")
        .select("*")
        .eq("song_id", songId);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setPotentialCollaborators(data);
      }
    } catch (error) {
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(profile: Profile) {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert([profile]);

      if (error) {
        throw error;
      }

      // Refresh the socials
      await getProfile();
    } catch (error) {
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function getProfile() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session?.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setSocials(data);
      }
    } catch (error) {
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProfile() {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("profiles")
        .delete()
        .match({ id: socials?.id });

      if (error) {
        throw error;
      }

      // Refresh the socials
      await getProfile();
    } catch (error) {
      setErrorMessage(generalErrorMessage);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }
  async function getProfileByID(id: number) {
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

  return {
    errorMessage,
    loading,
    musicPosts,
    comments,
    setComments,
    songUrl,
    playSong,
    audio,
    currentKey,
    socials,
    allAvatars,
    selectedPostKey,
    avatarUrl,
    audioUrl,
    absoluteSongUrl,
    absoluteAvatar_url,
    potentialCollaborators,
    uploading,
    fileName,
    allProfiles,
    getAllProfiles,
    getMusicPosts,
    uploadSong,
    createSongPost,
    getComments,
    createComment,
    deleteComment,
    deleteSongPost,
    updateSongPost,
    addCollaborator,
    removeCollaborator,
    getPotentialCollaborators,
    updateProfile,
    getProfile,
    deleteProfile,
    getProfileByID,
    downloadImage,
    getSocials
  };
}
