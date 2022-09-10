import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../contexts/auth";
import { useRouter } from "next/router";

import { useState, useEffect } from "react";

export default function useResource() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [currentUserSongPosts, setCurrentUserSongPosts] = useState([]);
  const [musicPosts, setmusicPosts] = useState([]);
  const {
    session,
    signIn,
    signOut,
    username,
    setUsername,
    website,
    setWebsite,
    avatar_url,
    setAvatarUrl,
    getCurrentUser,
    getProfile,
    isLoading,
    setIsLoading,
    updateProfile,
  } = useAuth();

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
        setmusicPosts(data);
        // console.log(data);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  // function getCurrentUserSongPosts() {
  //   if (musicPosts){
  //     console.log(musicPosts)
  //     let fillteredPosts =  musicPosts.filter(post => post.artist === 'tommyb' )
  //     // console.log(fillteredPosts)
  //     setCurrentUserSongPosts(fillteredPosts)
  //     // console.log(currentUserSongPosts) 
  //   }
  // }

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
  return {
    createSongPost,
    getmusicPosts,
    loading,
    musicPosts,
    // getCurrentUserSongPosts,
    currentUserSongPosts,

    
  };
}
