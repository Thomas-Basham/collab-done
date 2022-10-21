import { useRouter } from "next/router";
import { useAuth } from "../../contexts/auth";
import { useEffect, useState } from "react";
import useResource from "../../hooks/useResource";
import Avatar from "../../components/Avatar";
import Socials from "../../components/socials";
import { RiArrowGoBackFill } from "react-icons/ri";
import { Container } from "react-bootstrap";
export default function ForeignUserProfilePage() {
  const router = useRouter();
  const { getSocials } = useResource();
  const { session, username } = useAuth();

  const [socials, setSocials] = useState(null);

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
    <Container >
      <button className="rounded bio" onClick={() => router.back()}>
        <RiArrowGoBackFill />
      </button>
      <br></br>

      <div className="bio">
        <div className="socials-container">
          <Socials
            data={socials}
            currentUser={session?.user}
            username={username}
          />
        </div>
        <h1>{socials?.username}</h1>
        <a
          href={`https://${socials?.website}`}
          target="_blank"
          rel="noreferrer"
        >
          <h6>{socials?.website}</h6>
        </a>
        <Avatar url={socials?.avatar_url} size={150} />
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
      </Container>
    </>
  );
}
