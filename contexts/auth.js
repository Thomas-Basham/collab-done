import React, { useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [session, setSession] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [instagram_url, setInstagram_url] = useState(null);
  const [twitter_url, setTwitter_url] = useState(null);
  const [spotify_url, setSpotify_url] = useState(null);
  const [soundcloud_url, setSoundcloud_url] = useState(null);

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


  async function getProfile() {
    if (session){
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

  async function updateProfile({ e, username, website, avatar_url, instagram_url, twitter_url, spotify_url, soundcloud_url }) {
    e.preventDefault()
    try {

      setIsLoading(true);
      const user = await getCurrentUser();

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        instagram_url,
        twitter_url,
        spotify_url,
        soundcloud_url,
        updated_at: new Date(),
      };

      //   let { error } = await supabase.from("profiles").upsert(updates);
        let { error } = await supabase.from("profiles").update(updates).eq('id', user.id);
      
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
    await supabase.auth.signOut();
  }
  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => signOut,
    session,
    getProfile,
    username,
    setUsername,
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
