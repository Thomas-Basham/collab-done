import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import UserContext from "./lib/UserContext";
import { addChannel, deleteChannel } from "./lib/Store";
import TrashIcon from "/components/TrashIcon";
import { useAuth } from "../contexts/auth";
import { Col, Row, Container, Modal } from "react-bootstrap";
import { useRouter } from "next/router";
import useResource from "../hooks/useResource";
import SideBar from "./SideBar";

export default function LayoutMessages(props) {
  // const {  userRoles } = useContext(UserContext)
  const router = useRouter();

  const { signOut, session, userRoles } = useAuth();
  const { getAllProfiles, allProfiles } = useResource();

  const [showNewChannelModal, setShowNewChannelModal] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
    }
  });
  useEffect(() => {
    if (!allProfiles) {
      getAllProfiles();
    }
  }),
    [];

  // the value of the search field
  const [name, setName] = useState("");

  // the search result
  const [foundUsers, setFoundUsers] = useState(allProfiles);

  const filter = (e) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = allProfiles.filter((user) => {
        return user.username?.toLowerCase().startsWith(keyword.toLowerCase());
        // Use the toLowerCase() method to make it case-insensitive
      });
      setFoundUsers(results);
    } else {
      setFoundUsers(allProfiles);
      // If the text field is empty, show all users
    }

    setName(keyword);
  };

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

  const newChannel = async (channelName, user_id) => {
    if (channelName) {
      addChannel(channelName, user.id, user_id);
      setShowNewChannelModal(false);
    }
  };

  function openNewChannelModal() {
    setShowNewChannelModal(true);
  }
  const size = 100;

  return (
    <main>
      {/* Sidebar */}
      <Container>
        <div className="row">
          <SideBar
            channels={props.channels}
            openNewChannelModal={() => openNewChannelModal()}
            user={user}
            userRoles={userRoles}
            setActiveChannel={props.setActiveChannel}
          />

          <div className="col">
            {/* Messages */}
            <div>{props.children}</div>
          </div>
        </div>
      </Container>

      <Modal
        show={showNewChannelModal}
        onHide={() => setShowNewChannelModal(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Search for a new user here</Modal.Title>
        </Modal.Header>
        <br></br>
        <br></br>

        <input
          type="search"
          value={name}
          onChange={filter}
          className="input"
          placeholder="Filter"
        />
        <br></br>

        <div className="user-list">
          {foundUsers && foundUsers.length > 0 ? (
            foundUsers.map((user) => (
              <div
                key={user.id}
                className="user"
                onClick={() => newChannel(user.username, user.id)}
                style={{ cursor: "pointer" }}
              >
                {user.absolute_avatar_url ? (
                  <img
                    src={user.absolute_avatar_url}
                    alt={user.username}
                    className="avatar image"
                    style={{ height: size, width: size }}
                  />
                ) : (
                  <>
                    <br></br>
                    <div
                      className="avatar no-image"
                      style={{ height: size, width: size }}
                    />
                  </>
                )}
                <span className="user-name">{user.username}</span>
                <span className="user-age">{user.age} </span>
                <br></br>
              </div>
            ))
          ) : (
            <h5>No results found!</h5>
          )}
        </div>
      </Modal>
    </main>
  );
}
export const SidebarItem = ({ channel, isActiveChannel, user, userRoles }) => (
  <>
    <div style={{ cursor: "pointer" }}>
      <li>
        <div onClick={() => props.setActiveChannel(channel.id)}>
          <a className={isActiveChannel ? "font-weight-bold " : ""}>
            {channel.slug}
          </a>
        </div>
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
