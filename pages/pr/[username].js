import { useRouter } from "next/router";
import { useAuth } from "../../contexts/auth";
import { useEffect } from "react";
import useResource from "../../hooks/useResource";
import Avatar from "../../components/Avatar";

export default function ForeignUserProfile() {
  const router = useRouter();
  const { getProfileByID, socials } = useResource();

  // if (!resources) return <h2>Loading...</h2>
  useEffect(() => {
    if (!socials) {
      const { username } = router.query;
      getProfileByID(username, 0);
    }
  });

  // let data = getProfileByID(username, 0 )
  // console.log(data)

  // const resource = resources.find(item => item.id == id)

  return (
    <>
              <Avatar
          url={socials?.avatar_url}
          size={150}
          onUpload={(url) => {
            setAvatarUrl(url);
            updateProfile({ avatar_url: url }); // username, website,
          }}
        />
      <h1>{socials?.username}</h1>
      <p>{socials?.website}</p>  
      <p>{socials?.website}</p>  
      <p>{socials?.website}</p>  
      <p>{socials?.website}</p>  

    </>
  );
}
