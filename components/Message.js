import { useContext } from "react";
import UserContext from "./lib/UserContext";
import { deleteMessage } from "./lib/Store";
import TrashIcon from "./TrashIcon";
import { useAuth } from "../contexts/auth";

const Message = ({ message }) => {
  // const { userRoles } = useContext(UserContext)

  const { signOut, session, userRoles } = useAuth();
  const user = session.user;

  console.log(userRoles);
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
          <h6 className="">{message.user_id}</h6>
        </header>
        <p className="">{message.message}</p>
      </div>
    </div>
  );
};

export default Message;
