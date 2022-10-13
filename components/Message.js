import { deleteMessage } from "./lib/Store";
import TrashIcon from "./TrashIcon";
import { useAuth } from "../contexts/auth";

const Message = ({ message }) => {
  // const { userRoles } = useContext(UserContext)

  const { signOut, session, userRoles } = useAuth();
  const user = session.user;

  const size = 60;
  return (
    <div className="w-100 row">
      <div className="col-1">
        {(user?.id === message.user_id ||
          userRoles.some((role) => ["admin", "moderator"].includes(role))) && (
          <button onClick={() => deleteMessage(message.id)}>
            <TrashIcon />
          </button>
        )}
      </div>
      <div className="col ">
        <header>
          {message.absolute_avatar_url ? (
            <img
              src={message.absolute_avatar_url}
              alt={message.username}
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
          <h6 className="">{message.username}</h6>
        </header>
        <p className="">{message.message}</p>
      </div>
    </div>
  );
};

export default Message;
