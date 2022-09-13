import { useRouter } from "next/router";
import { useAuth } from "../../contexts/auth";
import { useEffect } from "react";
import useResource from "../../hooks/useResource";
import Avatar from "../../components/Avatar";
import Socials from "../../components/socials";
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
    <div >
      <h1>{socials?.username}</h1>
      <div className="d-flex ">
        <Avatar url={socials?.avatar_url} size={150} />
        <Socials data={socials} />
      </div>
      </div>
    </>
  );
}
