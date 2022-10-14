import React, { useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
// import  useStore  from "../hooks/Store";
const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  // const {fetchUserRoles} = useStore()
  const [errorMessageAuth, setErrorMessageAuth] = useState(null);
  const [session, setSession] = useState();
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

  const [userLoaded, setUserLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState(null);

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
          signIn();
        }

        setIsLoading(false);
      }
    }

    getInitialSession();

    // const { subscription } = supabase.auth.onAuthStateChange(
    //   (_event, session) => {
    //     setSession(session);
    //   }
    // );

    const { subscription: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        const currentUser = session?.user;
        setUser(currentUser ?? null);
        setUserLoaded(!!currentUser);
        if (currentUser) {
          signIn(currentUser.id, currentUser.email);
          router.push("/messages");
        }
      }
    );

    return () => {
      mounted = false;

      // subscription?.unsubscribe();
      authListener.unsubscribe();
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

  const registerUser = async (email, password) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) throw error;
      if (data.user) {
        setErrorMessageAuth(
          "There is already an account associated with this email address. Forgot your password? Click here"
        );
      }
    } catch (error) {
      setErrorMessageAuth(error.message || error.error_description);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email, password) => {
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
        setErrorMessageAuth(generalErrorMessage);
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function getCurrentUser() {
    try {
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
    } catch (error) {}
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
      setErrorMessageAuth(generalErrorMessage);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  async function updateComment(values, id) {
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
      setErrorMessageAuth(generalErrorMessage);
      console.log(error.message);
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
      setErrorMessageAuth(generalErrorMessage);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  async function getMusicPosts() {
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
      setIsLoading(true);
      false;
    }
  }

  async function getComments() {
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
        absolute_avatar_url,
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

      // UPDATE ALL COMMENTS WITH USERNAME AND AVATAR URL
      let comments = await getComments();

      let fillteredComments = comments.filter(
        (comment) => comment.user === user.id
      );

      const commentValues = {
        avatarURl: absolute_avatar_url,
      };

      await Promise.all(
        fillteredComments.map(async (post) => {
          return updateComment(commentValues, post.id);
        })
      );

      // ERROR HANDLING
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

  async function signOut() {
    // Ends user session
    router.push("/");
    await supabase.auth.signOut();
    setSession(null);
    setUsername(null);
  }


/**
 * Fetch all roles for the current user
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
 const fetchUserRoles = async (setState) => {
  try {
    let { data } = await supabase.from("user_roles").select(`*`);
    if (setState) setState(data);
    return data;
  } catch (error) {
    console.log("error", error);
  }
};


  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signInOauth: async (provider) =>
      await supabase.auth.signInWithOAuth({
        provider,
      }),
    signOut: () => signOut,
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
