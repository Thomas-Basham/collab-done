import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../contexts/auth";
import { useRouter } from "next/router";

import { useState, useEffect } from "react";

export default function useResource() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [musicPosts, setmusicPosts] = useState([]);

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
        // console.log(data);
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
      .from('songs')
      .delete()
      .match({ id: id })
      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      getmusicPosts()
      router.push("/profile");
      setLoading(false);
    }
  }

  async function updateSongPost(values, id) {
    try {
      setLoading(true);

      let { error } = await supabase.from("songs").update(values).match({id: id});

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      getmusicPosts()
      setLoading(false);
    }
  }


  return {
    createSongPost,
    getmusicPosts,
    loading,
    musicPosts,
    deleteSongPost,
    updateSongPost,


  };
}
