import { useRealtime } from "../contexts/RealTime";
import TrashIcon from "./TrashIcon";
import { useAuth } from "../contexts/auth";

const Message = ({ message, deleteMessage }) => {
  // const { userRoles } = useContext(UserContext)

  const { session, userRoles } = useAuth();
  const user = session?.user;
  // const { deleteMessage } = useRealtime();

  const size = 60;
  return (
    <div className="w-100 row">
      <div className="col-1">
        {(user?.id == message.user_id ||
          userRoles.some((role) => ["admin", "moderator"].includes(role))) && (
          <span
            style={{ cursor: "pointer" }}
            onClick={() => deleteMessage(message.id)}
          >
            <TrashIcon />
          </span>
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
