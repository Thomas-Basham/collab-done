import Link from "next/link";
import { Container, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useStore } from "../contexts/Store";

export default function NewChannelModal(props) {
  // the value of the search field
  const [name, setName] = useState("");

  // the search result
  const [foundUsers, setFoundUsers] = useState(props.allProfiles);
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

  const newChannel = async (channelName, user_id) => {
    if (channelName) {
      let channel = await addChannel(channelName, props.user.id, user_id, props.username);

      props.setShowNewChannelModal(false);
      if (channel[0]?.id) {
        setChannelId(channel[0].id);
      }
    }
  };

  function openNewChannelModal() {
    props.setShowNewChannelModal(true);
  }
  const size = 100;

  const filter = (e) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = props.allProfiles.filter((user) => {
        return user.username?.toLowerCase().startsWith(keyword.toLowerCase());
        // Use the toLowerCase() method to make it case-insensitive
      });
      setFoundUsers(results);
    } else {
      setFoundUsers(props.allProfiles);
      // If the text field is empty, show all users
    }

    setName(keyword);
  };

  return (
    <>
      <Modal
        show={props.showNewChannelModal}
        onHide={() => props.setShowNewChannelModal(false)}
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
    </>
  );
}
