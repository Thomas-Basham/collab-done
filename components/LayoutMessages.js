import Link from "next/link";
import { useContext, useEffect } from "react";
import UserContext from "./lib/UserContext";
import { addChannel, deleteChannel } from "./lib/Store";
import TrashIcon from "/components/TrashIcon";
import { useAuth } from "../contexts/auth";
import { Col, Row, Container } from "react-bootstrap";
import { useRouter } from "next/router";
export default function LayoutMessages(props) {
  // const {  userRoles } = useContext(UserContext)

  const { signOut, session, userRoles, errorMessageAuth, setErrorMessageAuth } =
    useAuth();

    const router = useRouter();
    useEffect(() => {
      if (!session?.user) {
        router.push("/");
      }
    });
  const user = session?.user;

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  };

  const newChannel = async () => {
    const slug = prompt("Please enter your name");
    if (slug) {
      addChannel(slugify(slug), user.id);
    }
  };

  return (
    <main>
      {/* Sidebar */}
      <Container >
          <div className="row" >
              <div className="side-bar col">
                <div>
                  <button onClick={() => newChannel()}>New Channel</button>
                </div>

                <hr />
                <h4>Channels</h4>
                <ul className="channel-list">
                  {props.channels.map((x) => (
                    <SidebarItem
                      channel={x}
                      key={x.id}
                      isActiveChannel={x.id === props.activeChannelId}
                      user={user}
                      userRoles={userRoles}
                    />
                  ))}
                </ul>
              </div>
          <div className="col" >
            {/* Messages */}
            <div>{props.children}</div>
          </div>
          </div>
      </Container>
    </main>
  );
}

const SidebarItem = ({ channel, isActiveChannel, user, userRoles }) => (
  <>
    <div>
      <li>
        <Link href="/channels/[id]" as={`/channels/${channel.id}`}>
          <a className={isActiveChannel ? "font-bold" : ""}>{channel.slug}</a>
        </Link>
        {channel.id !== 1 &&
          (channel.created_by === user?.id || userRoles.includes("admin")) && (
            <button onClick={() => deleteChannel(channel.id)}>
              <TrashIcon />
            </button>
          )}
      </li>
    </div>
  </>
);
