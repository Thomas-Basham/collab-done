import { useRouter } from "next/router";
import { useAuth } from "../../contexts/auth";
import { useEffect } from "react";
import useResource from "../../hooks/useResource";
import Avatar from "../../components/Avatar";
import Socials from "../../components/socials";
export default function ForeignUserProfile() {
  const router = useRouter();
  const { getSocials, socials } = useResource();

  // if (!resources) return <h2>Loading...</h2>
  useEffect(() => {
    if (!socials) {
      const { id } = router.query;
      getSocials(id, 0);
    }
  });

  // let data = getSocials(username, 0 )

  // const resource = resources.find(item => item.id == id)

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
