import Link from "next/link";
import { FiTwitter, FiInstagram } from "react-icons/fi";
import { RiSpotifyLine } from "react-icons/ri";
import { GrSoundcloud } from "react-icons/gr";

export default function Socials({ data }) {
  return (
    <div className="socials-container">
      {data && (
        <Link href={`https://www.instagram.com/${data.instagram_url}`}>
          <a target="blank" rel="noopener noreferrer">
            <FiInstagram className="brand-hover" />
          </a>
        </Link>
      )}
      <br></br>

      {data && (
        <a
          href={`https://twitter.com/${data.twitter_url}`}
          target="blank"
          rel="noopener noreferrer"
        >
          <FiTwitter className="brand-hover" />
        </a>
      )}

      <br></br>
      {data && (
        <a
          href={`https://open.spotify.com/artist/${data.spotify_url}`}
          target="blank"
          rel="noopener noreferrer"
        >
          <RiSpotifyLine className="brand-hover" />
        </a>
      )}
      <br></br>

      {data && (
        <a
          target="blank"
          href={`https://soundcloud.com/${data.soundcloud_url}`}
          rel="noopener noreferrer"
        >
          <GrSoundcloud className="brand-hover" />
        </a>
      )}
      {/* TODO: button for messaging  */}
      {/* <button>MESSAGE</button> */}
    </div>
  );
}
