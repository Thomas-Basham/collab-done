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
    (chanel) => chanel.message_to === session?.user?.id || chanel.created_by === session?.user?.id
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
        <div >
          <li>
            <div onClick={() => setChannelId(channel.id)}>
              <p
                className={
                  isActiveChannel
                    ? "text-decoration-underline px-2"
                    : ""
                }
                style={{ cursor: "pointer" }}
              >
                
                {channel.message_to == user?.id ? channel.created_by_username : channel.slug}
              </p>
            </div>

            {(channel.created_by === user?.id || userRoles.includes("admin")) |
                (channel.message_to === user?.id) && (
                <span style={{ cursor: "pointer" }} onClick={() => deleteChannel(channel.id)}>
                  <TrashIcon  />
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
