import Link from "next/link";
import { Container, Row, Col, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { SidebarItem } from "./LayoutMessages copy";
import TrashIcon from "/components/TrashIcon";

export default function SideBar(props) {
  const SidebarItem = ({ channel, isActiveChannel, user, userRoles }) => (
    <>
      <div style={{ cursor: "pointer" }}>
        <li>
          <div onClick={() => props.setActiveChannel(channel.id)}>
            <a className={isActiveChannel ? "font-weight-bold " : ""}>
              {channel.slug}
            </a>
          </div>
          {channel.id !== 1 &&
            (channel.created_by === user?.id ||
              userRoles.includes("admin")) && (
              <button onClick={() => deleteChannel(channel.id)}>
                <TrashIcon />
              </button>
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
}
