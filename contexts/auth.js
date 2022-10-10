import React, { useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import useResource from "../hooks/useResource";

const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const router = useRouter();

  const [errorMessageAuth, setErrorMessageAuth] = useState(true);
  const [session, setSession] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [bio, setBio] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [instagram_url, setInstagram_url] = useState(null);
  const [twitter_url, setTwitter_url] = useState(null);
  const [spotify_url, setSpotify_url] = useState(null);
  const [soundcloud_url, setSoundcloud_url] = useState(null);
  const [absoluteAvatar_urlAuth, setAbsoluteAvatar_UrlAuth] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // only update the react state if the component is still mounted
      if (mounted) {
        if (session) {
          setSession(session);
        }

        setIsLoading(false);
      }
    }

    getInitialSession();

    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      mounted = false;

      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    getProfile();
  }, [session]);


  const registerUser = async (email, password) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) throw error;
      if (data.user){
        setErrorMessageAuth('There is already an account associated with this email address. Forgot your password? Click here')
      }
    } catch (error) {
      setErrorMessageAuth( error.message || error.error_description );
      // alert( error.message || error.error_description );

    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({email, password});

      if (error) throw error;
      if (data)router.push("/");
    } catch (error) {
      setErrorMessageAuth(error.message || error.error_description)
      // alert(error.message || error.error_description);
    } finally {
      setIsLoading(false);
    }
  };

  async function getProfile() {
    if (session) {
      try {
        setIsLoading(true);
        const user = await getCurrentUser();

        let { data, error, status } = await supabase
          .from("profiles")
          // .select(`username, website, avatar_url`)
          .select(`*`)
          .eq("id", user.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUsername(data.username);
          setWebsite(data.website);
          setAvatarUrl(data.avatar_url);
          setInstagram_url(data.instagram_url);
          setTwitter_url(data.twitter_url);
          setSpotify_url(data.spotify_url);
          setSoundcloud_url(data.soundcloud_url);
          setAbsoluteAvatar_UrlAuth(data.absolute_avatar_url);
          setBio(data.bio);
          // return(data)
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function getCurrentUser() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    if (!session?.user) {
      router.push("/");

      // throw new Error("User not logged in");
    }

    return session.user;
  }
  async function getMusicPosts() {
    try {
      setIsLoading(true);

      let { data, error, status } = await supabase.from("songs").select("*");

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        return data.reverse();
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateSongPost(values, id) {
    try {
      setIsLoading(true);

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
      setIsLoading(false);
    }
  }

  async function updatePotentialCollaborator(values, id) {
    try {
      setIsLoading(true);

      let { error } = await supabase
        .from("potentialCollaborators")
        .update(values)
        .match({ id: id });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function getCollaborators() {
    try {
      setIsLoading(true);

      let { data, error, status } = await supabase
        .from("potentialCollaborators")
        .select("*");

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        return data;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateProfile({
    username,
    bio,
    website,
    avatar_url,
    absolute_avatar_url,
    instagram_url,
    twitter_url,
    spotify_url,
    soundcloud_url,
  }) {
    try {
      setIsLoading(true);
      const user = await getCurrentUser();

      const updates = {
        id: user.id,
        username,
        bio,
        website,
        avatar_url,
        absolute_avatar_url,
        instagram_url,
        twitter_url,
        spotify_url,
        soundcloud_url,
        updated_at: new Date(),
      };

      let { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      // UPDATE ALL MUSIC POSTS WITH USERNAME AND AVATAR URL

      let collaborators = await getCollaborators();

      let fillteredCollabPosts = collaborators.filter(
        (post) => post.user === user.id
      );

      const collabvalues = {
        username,
        absolute_avatar_url: absoluteAvatar_urlAuth,
      };

      await Promise.all(
        fillteredCollabPosts.map(async (post) => {
          return updatePotentialCollaborator(collabvalues, post.id);
        })
      );

      // UPDATE ALL MUSIC POSTS WITH USERNAME AND AVATAR URL
      let musicPosts = await getMusicPosts();

      let fillteredPosts = musicPosts.filter(
        (post) => post.artist_id === user.id
      );

      const values = {
        artist: username,
        absolute_avatar_url,
      };

      await Promise.all(
        fillteredPosts.map(async (post) => {
          return updateSongPost(values, post.id);
        })
      );

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut() {
    // Ends user session
    // router.push("/");
    setSession(null);
    setUsername(null);
    await supabase.auth.signOut();
  }
  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signInOauth: async (provider) =>
      await supabase.auth.signInWithOAuth({
        provider,
      }),
    signOut: () => signOut,
    errorMessageAuth,
    registerUser,
    handleLogin,
    session,
    getProfile,
    username,
    setUsername,
    bio,
    setBio,
    website,
    setWebsite,
    avatar_url,
    setAvatarUrl,
    updateProfile,
    isLoading,
    setIsLoading,
    instagram_url,
    setInstagram_url,
    twitter_url,
    setTwitter_url,
    spotify_url,
    setSpotify_url,
    soundcloud_url,
    setSoundcloud_url,
    absoluteAvatar_urlAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
