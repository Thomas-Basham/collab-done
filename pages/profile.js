import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import Avatar from "../components/Avatar";
import { useAuth } from "../contexts/auth";
import { useRouter } from "next/router";
import useResource from "../hooks/useResource";

export default function Profile() {
  const { musicPosts } = useResource();
  const [currentUserSongPosts, setCurrentUserSongPosts] = useState([]);

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

    getProfile,
    isLoading,
    setIsLoading,
    updateProfile,
  } = useAuth();

  let fillteredPosts =  musicPosts.filter(post => post.artist === 'tommyb' )
  const userFeed = fillteredPosts.map((data, i) => {
    return (
      <div key={i}>
        <p>{data.artist}</p>
        <p>{Date(data.created_at)}</p>
        <p>{data.genre}</p>
        <p>{data.description}</p>
        <p>{data.needs}</p>
        <p>{data.potential_collaborators}</p>
        <p>{data.finished_song && ""}</p>
      </div>
    );
  });


  
  return (
    <div className="row flex-center flex">



      <div className="col-6 form-widget">
        <Avatar
          url={avatar_url}
          size={150}
          onUpload={(url) => {
            setAvatarUrl(url);
            updateProfile({ username, website, avatar_url: url });
          }}
        />
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="text" value={session?.user.email} disabled />
        </div>
        <div>
          <label htmlFor="username">Name</label>
          <input
            id="username"
            type="text"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="website"
            value={website || ""}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div>
          <button
            className="button primary block"
            onClick={() => updateProfile({ username, website, avatar_url })}
            disabled={isLoading}
          >
            {isLoading ? "Loading ..." : "Update"}
          </button>
        </div>

        <div>
          <button className="button block" onClick={signOut()}>
            Sign Out
          </button>
        </div>
        {userFeed}

      </div>
    </div>
  );
}
