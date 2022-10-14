import {  useEffect, useState } from "react";

import { useAuth } from "../contexts/auth";
import {  Container, Modal } from "react-bootstrap";
import { useRouter } from "next/router";
import useResource from "../hooks/useResource";
import SideBar from "./SideBar";
import NewChannelModal from "./NewChannelModal";
import useStore from "../hooks/Store";
export default function LayoutMessages(props) {
  // const {  userRoles } = useContext(UserContext)
  const router = useRouter();
  const { signOut, session, userRoles } = useAuth();
  const { getAllProfiles, allProfiles } = useResource();

  const [showNewChannelModal, setShowNewChannelModal] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const {addChannel,deleteChannel, newMessage, channels, channelId, setChannelId, addMessage } = useStore();

  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
    }
  });
  useEffect(() => {
    if (!allProfiles) {
      getAllProfiles();
    }
  }, []);

    const user = session?.user;




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
            openNewChannelModal={openNewChannelModal}
            user={user}
            userRoles={userRoles}

          />

          <div className="col">
            {/* Messages */}
            <div>{props.children}</div>
          </div>
        </div>
      </Container>


      <NewChannelModal
      setShowNewChannelModal={setShowNewChannelModal}
      showNewChannelModal={showNewChannelModal}
      addChannel={addChannel}
      allProfiles={allProfiles}
      user={user}
      />


      {/* <Modal
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
      </Modal> */}
    </main>
  );
}
