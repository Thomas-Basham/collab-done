import Link from "next/link";
import TrashIcon from "/components/TrashIcon";
import {useStore} from "../contexts/Store";
import { useAuth } from "../contexts/auth";
export default function SideBar(props) {
  const {
    addChannel,
    deleteChannel,
    messages,
    newMessage,
    channels,
    channelId,
    setChannelId,
    addMessage,
  } = useStore();
  const { session, username, absoluteAvatar_urlAuth, userRoles } = useAuth();

  let filteredChannels = channels.filter(
    (chanel) => chanel.message_to || chanel.created_by == session.user.id
  );

  if (props.global == true) {
    const SidebarItem = ({ channel, isActiveChannel, user, userRoles }) => (
      <>
        <div style={{ cursor: "pointer" }}>
          <li>
            <Link href={`/messages`}>
              <a className={isActiveChannel ? "font-weight-bold " : ""}>
                {channel.slug}
              </a>
            </Link>
            {/* {channel.id !== 1 &&
              (channel.created_by === user?.id ||
                userRoles.includes("admin")) && (
                <button onClick={() => deleteChannel(channel.id)}>
                  <TrashIcon />
                </button>
              )} */}
          </li>
        </div>
      </>
    );
    return (
      <>
        <div className="side-bar col">
          <div>
            <button>New Message</button>{" "}
          </div>
          <hr />
          <h4>Channels</h4>
          <ul className="channel-list">
            {filteredChannels.map((x) => (
              <SidebarItem
                channel={x}
                key={x.id}
                isActiveChannel={x.id === channelId}
              />
            ))}
          </ul>
        </div>
      </>
    );
  } else {
    const SidebarItem = ({ user, userRoles, isActiveChannel, channel }) => (
      <>
        <div style={{ cursor: "pointer" }}>
          <li>
            <div onClick={() => setChannelId(channel.id)}>
              <p
                className={
                  isActiveChannel
                    ? "font-weight-bold text-decoration-underline"
                    : ""
                }
              >
                {channel.slug}
              </p>
            </div>

            {channel.id !== 1 &&
              (channel.created_by === user?.id || userRoles.includes("admin")) |
                (channel.message_to === user?.id) && (
                <span onClick={() => deleteChannel(channel.id)}>
                  <TrashIcon />
                </span>
              )}
          </li>
        </div>
      </>
    );

    return (
      <>
        <div className="side-bar col">
          <div>
            {/* <button onClick={() => newChannel()}>New Channel</button> */}
            <button onClick={props.openNewChannelModal}>New Message</button>
          </div>

          <hr />
          <h4>Channels</h4>
          <ul className="channel-list">
            {filteredChannels.map((x) => (
              <SidebarItem
                channel={x}
                key={x.id}
                isActiveChannel={x.id == channelId}
                user={session?.user}
                userRoles={userRoles}
              />
            ))}
          </ul>
        </div>
      </>
    );
  }
}
