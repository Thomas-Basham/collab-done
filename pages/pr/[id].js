import { useRouter } from "next/router";
import { useAuth } from "../../contexts/auth";
import { useEffect, useState } from "react";
import useResource from "../../hooks/useResource";
import Avatar from "../../components/Avatar";
import Socials from "../../components/socials";
export default function ForeignUserProfile() {
  const router = useRouter();
  const { getSocials } = useResource();
  const { session } = useAuth();
  const [socials, setSocials] = useState(null);

  // if (!resources) return <h2>Loading...</h2>
  useEffect(() => {
    handleGetSocials()
  }, []);

  const handleGetSocials = async () => {

    const { id } = router.query;
    let data = await getSocials(id, 0);
     setSocials(data)
  }
  // let data = getProfileByID(username, 0 )

  // const resource = resources.find(item => item.id == id)
console.log(session.user)
  return (
    <>
      <div>
        <h1>{socials?.username}</h1>
        <div className="d-flex ">
          <Avatar url={socials?.avatar_url} size={150} />
          <Socials data={socials} />
        </div>
      </div>
    </>
  );
}
