import { useRouter } from "next/router";
import { useAuth } from "../../contexts/auth";
import { useEffect, useState } from "react";
import useResource from "../../hooks/useResource";
import Avatar from "../../components/Avatar";
import Socials from "../../components/socials";
import { RiArrowGoBackFill } from "react-icons/ri";
import { useStore } from "../../contexts/Store";
export default function ForeignUserProfilePage() {
  const router = useRouter();
  const { getSocials } = useResource();
  const { session, username } = useAuth();
  const {
    addChannel,

    setChannelId,

  } = useStore();
  const handleNewChannel = async () => {
    if (socials) {
      let channel = await addChannel(
        socials?.username,
        session.user.id,
        socials?.id,
        username
      );

      if (channel[0]?.id) {
        setChannelId(channel[0].id);
        router.push('/messages')
      }
    }
  };

  const [socials, setSocials] = useState(null);

  // if (!resources) return <h2>Loading...</h2>
  useEffect(() => {
    handleGetSocials();
  }, []);

  const handleGetSocials = async () => {
    const { id } = router.query;
    let data = await getSocials(id, 0);
    setSocials(data);
  };

  return (
    <>
      <button className="rounded bio" onClick={() => router.back()}>
        <RiArrowGoBackFill />
      </button>
      <br></br>

      <div className="bio">
  
          <button className="socials-container" onClick={() => handleNewChannel(socials?.username, socials?.id)}>Send Message</button>
        <h1>{socials?.username}</h1>
        <a
          href={`https://${socials?.website}`}
          target="_blank"
          rel="noreferrer"
        >
          <h6>{socials?.website}</h6>
        </a>
        <div className="d-flex ">
          <Avatar url={socials?.avatar_url} size={150} />
          <Socials data={socials} />
        </div>
        <div>
          <div>
            <br></br>
            <label htmlFor="bio">Bio</label>
            <p className="bio" style={{ width: "95%" }} type="text">
              {socials?.bio}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
