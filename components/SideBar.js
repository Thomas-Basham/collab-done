import Link from "next/link";
import TrashIcon from "/components/TrashIcon";
import { useStore } from "../contexts/Store";
import { useAuth } from "../contexts/auth";
import { useRouter } from "next/router";

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
  const router = useRouter();

  const { session, username, absoluteAvatar_urlAuth, userRoles } = useAuth();

  let filteredChannels = channels.filter(
    (chanel) =>
      chanel.message_to === session?.user?.id ||
      chanel.created_by === session?.user?.id
  );

  // GLOBAL SIDEBAR ON BOTTOM OF SCREEN
  if (props.global == true) {
    function handleGoToMessages(id) {
      setChannelId(id);
      const query = router.pathname;
      console.log(query);
      if (query != "/messages") {
        router.push("/messages");
      }
    }

    const SidebarItem = ({ user, userRoles, isActiveChannel, channel }) => (
      <>
        <div className="side-bar-global">
          <div className="row">
            <div className="col" onClick={() => handleGoToMessages(channel.id)}>
              <p
                className={isActiveChannel ? "active-channel" : ""}
                style={{ cursor: "pointer" }}
              >
                {channel.message_to == user?.id
                  ? channel.created_by_username
                  : channel.slug}
              </p>
            </div>
            <div className="col">
              {(channel.created_by === user?.id ||
                userRoles.includes("admin")) |
                (channel.message_to === user?.id) && (
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteChannel(channel.id)}
                >
                  <TrashIcon />
                </span>
              )}
            </div>
          </div>
        </div>
      </>
    );
    return (
      <>
        <div className="side-bar col">
          <div>
            <button onClick={() => router.push("/messages")}>
              New Message
            </button>{" "}
          </div>
          <hr />
          <h4>Messages</h4>
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
  } else {
    const SidebarItem = ({ user, userRoles, isActiveChannel, channel }) => (
      <>
        <div className="side-bar">
          <div className={isActiveChannel ? " active-channel row " : " row"}>
            <div className="col" onClick={() => setChannelId(channel.id)}>
              <p
                className={isActiveChannel ? " active-channel  " : " "}
                style={{ cursor: "pointer" }}
              >
                {channel.message_to == user?.id
                  ? channel.created_by_username
                  : channel.slug}
              </p>
            </div>
            <div className="col">
              {(channel.created_by === user?.id ||
                userRoles.includes("admin")) |
                (channel.message_to === user?.id) && (
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteChannel(channel.id)}
                >
                  <TrashIcon />
                </span>
              )}
            </div>
          </div>
        </div>
      </>
    );

    return (
      <>
        <div className="side-bar ">
          <div>
            {/* <button onClick={() => newChannel()}>New Channel</button> */}
            <button onClick={props.openNewChannelModal}>New Message</button>
          </div>

          <hr />
          <h4>Messages</h4>
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
