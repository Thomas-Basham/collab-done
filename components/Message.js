import { useContext } from 'react'
import UserContext from './lib/UserContext'
import { deleteMessage } from './lib/Store'
import TrashIcon from './TrashIcon'
import { useAuth } from "../contexts/auth";


const Message = ({ message }) => {
  // const { userRoles } = useContext(UserContext)
  
  const { signOut, session, userRoles } = useAuth();
  const user = session.user

  console.log(userRoles)
  return (
    <div className="flex items-center py-1 space-x-2">
      <div className="w-4 text-gray-100">
        {(user?.id === message.user_id ||
          userRoles.some((role) => ['admin', 'moderator'].includes(role))) && (
          <button onClick={() => deleteMessage(message.id)}>
            <TrashIcon />
          </button>
        )}
      </div>
      <div>
        <p className="font-bold text-blue-700">{message.user_id}</p>
        <p className="text-white">{message.message}</p>
      </div>
    </div>
  )
}

export default Message
