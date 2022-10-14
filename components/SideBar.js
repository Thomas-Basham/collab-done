import Link from "next/link";
import { Container, Row, Col, Nav, Navbar, NavDropdown } from "react-bootstrap";
import TrashIcon from "/components/TrashIcon";

export default function SideBar(props) {
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
                <button onClick={() => props.deleteChannel(channel.id)}>
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
            {props.channels.map((x) => (
              <SidebarItem
                channel={x}
                key={x.id}
                isActiveChannel={x.id === props.activeChannelId}
                setActiveChannel={props.setActiveChannel}
                user={props.user}
                userRoles={props.userRoles}
              />
            ))}
          </ul>
        </div>
      </>
    );
  } else {
    const SidebarItem = ({ channel, isActiveChannel, user, userRoles }) => (
      <>
        <div style={{ cursor: "pointer" }}>
          <li>
            <div onClick={() => props.setActiveChannel(channel.id)}>
              <p
                className={
                  isActiveChannel ? "font-weight-bold text-capitalize" : ""
                }
              >
                {channel.slug}
              </p>
            </div>

            {channel.id !== 1 &&
              (channel.created_by === user?.id ||
                userRoles.includes("admin")) && (
                <span onClick={() => props.deleteChannel(channel.id)}>
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
            {props.channels.map((x) => (
              <SidebarItem
                channel={x}
                key={x.id}
                isActiveChannel={x.id == props.activeChannelId}
                setActiveChannel={props.setActiveChannel}
                user={props.user}
                deleteChannel={props.deleteChannel}
                userRoles={props.userRoles}
              />
            ))}
          </ul>
        </div>
      </>
    );
  }
}
