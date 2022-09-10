import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../contexts/auth";
import { useRouter } from "next/router";

import { useState, useEffect } from "react";

export default function useResource() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const { signIn, signUp, signOut, session } = useAuth();
  const [musicPosts, setmusicPosts] = useState([]);
  
  useEffect(() => {
    getmusicPosts();
  }, []);



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
  async function getUserData(id) {
    try {

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        // console.log(data.username.toString())
        // data = JSON.stringify(data.username);
        // return data.username
      }
      // console.log(data)
      return data.username

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }


  async function getmusicPosts() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("songs")
        .select('*')

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setmusicPosts(data);
        console.log(data)
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
  return {
    createSongPost,
    getmusicPosts,
    loading,
    musicPosts,
    // getCurrentUser,
    getUserData,


  };
}
