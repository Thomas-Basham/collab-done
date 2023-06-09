import React, { useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import { User as SupabaseUser } from "@supabase/supabase-js";
interface User extends SupabaseUser {
  // Add any additional properties or overrides here
}

interface UserProfile {
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

interface AuthContextProps {
  signUp: (data: { email: string; password: string }) => Promise<any>;
  signInOauth: (provider: string) => Promise<any>;
  signOut: () => void;
  errorMessageAuth: string | null;
  setErrorMessageAuth: (message: string | null) => void;
  registerUser: (email: string, password: string) => void;
  handleLogin: (email: string, password: string) => void;
  session: any;
  getProfile: () => void;
  username: string;
  setUsername: (username: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  website: string;
  setWebsite: (website: string) => void;
  avatar_url: string;
  setAvatarUrl: (avatarUrl: string) => void;
  updateProfile: (values: UserProfile) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  instagram_url: string;
  setInstagram_url: (url: string) => void;
  twitter_url: string;
  setTwitter_url: (url: string) => void;
  spotify_url: string;
  setSpotify_url: (url: string) => void;
  soundcloud_url: string;
  setSoundcloud_url: (url: string) => void;
  absoluteAvatar_urlAuth: string;
  userRoles: string[] | null;
}

const AuthContext = React.createContext<AuthContextProps>(
  {} as AuthContextProps
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [errorMessageAuth, setErrorMessageAuth] = useState<string | null>(null);
  const [session, setSession] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [avatar_url, setAvatarUrl] = useState("");
  const [instagram_url, setInstagram_url] = useState("");
  const [twitter_url, setTwitter_url] = useState("");
  const [spotify_url, setSpotify_url] = useState("");
  const [soundcloud_url, setSoundcloud_url] = useState("");
  const [absoluteAvatar_urlAuth, setAbsoluteAvatar_UrlAuth] = useState("");
  const [userRoles, setUserRoles] = useState<string[] | null>(null);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const { data: session } = await supabase.auth.getSession();

      // only update the react state if the component is still mounted
      if (mounted) {
        if (session) {
          setSession(session);
          signIn();
        }

        setIsLoading(false);
      }
    }

    getInitialSession();

    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      const currentUser = session?.user;
      if (currentUser) {
        // signIn(currentUser.id, currentUser.email);
        signIn();
      }
    });

    return () => {
      mounted = false;
      authListener.data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    getProfile();
  }, [session]);

  const signIn = async () => {
    await fetchUserRoles((userRoles) =>
      setUserRoles(userRoles.map((userRole) => userRole.role))
    );
  };

  const generalErrorMessage = "There seems to be an error with our servers";

  const registerUser = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,

        options: {
          data: {
            username: email,
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      console.log(error);
      setErrorMessageAuth(error.message || error.error_description);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data) router.push("/");
    } catch (error) {
      setErrorMessageAuth(error.message || error.error_description);
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
        }
      } catch (error) {
        setErrorMessageAuth(generalErrorMessage);
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function getCurrentUser(): Promise<User> {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      if (!data?.session?.user) {
        router.push("/");
      }

      return data.session.user;
    } catch (error) {
      console.error(error);
    }
  }

  async function updateSongPost(values: any, id: string) {
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
      setErrorMessageAuth(generalErrorMessage);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateComment(values: any, id: string) {
    try {
      setIsLoading(true);

      let { error } = await supabase
        .from("comments")
        .update(values)
        .match({ id: id });

      if (error) {
        throw error;
      }
    } catch (error) {
      setErrorMessageAuth(generalErrorMessage);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function updatePotentialCollaborator(values: any, id: string) {
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
      setErrorMessageAuth(generalErrorMessage);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function getCollaborators(): Promise<any[]> {
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
      setErrorMessageAuth(generalErrorMessage);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function getMusicPosts(): Promise<any[]> {
    try {
      setIsLoading(true);

      let { data, error, status } = await supabase.from("songs").select("*");

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        return data;
      }
    } catch (error) {
      setErrorMessageAuth(generalErrorMessage);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function getComments(): Promise<any[]> {
    try {
      setIsLoading(true);

      let { data, error, status } = await supabase.from("comments").select("*");

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        return data;
      }
    } catch (error) {
      setErrorMessageAuth(error.message);
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
  }: UserProfile) {
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

      let collaborators = await getCollaborators();

      let fillteredCollabPosts = collaborators.filter(
        (post) => post.user === user.id
      );

      const collabvalues = {
        username,
        absolute_avatar_url,
      };

      await Promise.all(
        fillteredCollabPosts.map(async (post) => {
          return updatePotentialCollaborator(collabvalues, post.id);
        })
      );

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

      let comments = await getComments();

      let fillteredComments = comments.filter(
        (comment) => comment.user_id === user.id
      );

      const commentValues = {
        username,
        absolute_avatar_url,
      };

      await Promise.all(
        fillteredComments.map(async (comment) => {
          return updateComment(commentValues, comment.id);
        })
      );

      if (error) {
        throw error;
      }
    } catch (error) {
      setErrorMessageAuth(generalErrorMessage);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchUserRoles(callback: (userRoles: any) => void) {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", session.user.id)
        .limit(1);

      if (error) {
        throw error;
      }

      callback(data);
    } catch (error) {
      console.error(error);
    }
  }

  const signUp = async (data: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp(data);
      if (error) throw error;
    } catch (error) {
      console.log(error);
      setErrorMessageAuth(error.message || error.error_description);
    } finally {
      setIsLoading(false);
    }
  };
  type Provider = "google" | "github" | "facebook" | "twitter";

  const signInOauth = async (provider: Provider) => {
    try {
      setIsLoading(true);
      await supabase.auth.signInWithOAuth({ provider: provider });
    } catch (error) {
      console.log(error);
      setErrorMessageAuth(error.message || error.error_description);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    supabase.auth.signOut();
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        signUp,
        signInOauth,
        signOut,
        errorMessageAuth,
        setErrorMessageAuth,
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
        userRoles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
