import Link from "next/link";
import { FiTwitter, FiInstagram } from "react-icons/fi";
import { RiSpotifyLine } from "react-icons/ri";
import { GrSoundcloud } from "react-icons/gr";

export default function Socials({ data }) {

  return (
    <div className="socials-container">
    {data && (
      <Link href={data.instagram_url}>
        <a target="blank" rel="noopener noreferrer">
          <FiInstagram />
        </a>
      </Link>
    )}
    <br></br>

    {data && (
      <a
        href={data.twitter_url}
        target="blank"
        rel="noopener noreferrer"
      >
        <FiTwitter />
      </a>
    )}

    <br></br>
    {data && (
      <a
        href={data.spotify_url}
        target="blank"
        rel="noopener noreferrer"
      >
        <RiSpotifyLine />
      </a>
    )}
    <br></br>

    {data && (
      <a
        target="blank"
        href={data.soundcloud_url}
        rel="noopener noreferrer"
      >
        <GrSoundcloud />
      </a>
    )}

    <button>MESSAGE</button>
  </div>
);
}
