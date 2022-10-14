import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// /**
//  * @param {number} channelId the currently selected Channel
//  */
export default function useStore() {
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users] = useState(new Map());
  const [newMessage, handleNewMessage] = useState(null);
  const [newChannel, handleNewChannel] = useState(null);
  const [newOrUpdatedUser, handleNewOrUpdatedUser] = useState(null);
  const [deletedChannel, handleDeletedChannel] = useState(null);
  const [deletedMessage, handleDeletedMessage] = useState(null);
  const [channelId, setChannelId] = useState(channelId);
  const [incomingChannelId, setIncomingChannelId] = useState(null);
  // Load initial data and set up listeners
  // console.log(channelId)
  useEffect(() => {
    const handleAsync =  () => {
      // Get Channels
      fetchChannels(setChannels);
      // Listen for new and deleted messages
      supabase // const messageListener =
        .channel("public:messages")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
           (payload) => {
            console.log({payload});
            console.log([payload.new.channel_id]);

            setIncomingChannelId(payload.new.channel_id)
            handleNewMessage(payload.new);
            // fetchMessages(payload.new.channel_id);

          }
        )
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "messages" },
          (payload) => {
            console.log(payload);
            handleDeletedMessage(payload.old);
          }
        )
        .subscribe();
      // Listen for changes to our users
      supabase //const userListener =
        .channel("public:profiles")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "profiles" },
          (payload) => {
            console.log(payload);

            handleNewOrUpdatedUser(payload.new);
          }
        )
        .subscribe();
      // Listen for new and deleted channels
      supabase //const channelListener =
        .channel("public:channels")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "channels" },
          (payload) => {
            console.log(payload);

            handleNewChannel(payload.new);
          }
        )
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "channels" },
          (payload) => {
            console.log(payload);

            handleDeletedChannel(payload.old);
          }
        )
        .subscribe();
    };
    handleAsync();

    // Cleanup on unmount
    // return () => {
    //   supabase.removeChannel('public:messages')
    //   supabase.removeChannel('public:profiles')
    //   supabase.removeChannel('public:channels')
    // }
    // console.log(newMessage);
  }, []);

  // console.log(channelId);
  // Update when the route changes
  useEffect(() => {
    if (channelId) {
      fetchMessages(channelId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);
  useEffect(() => {
    if (newMessage) {
      fetchMessages(incomingChannelId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMessage]);

  // // New message received from Postgres
  // useEffect(() => {
  //   if (newMessage && newMessage.channel_id == Number(channelId)) {
  //     const handleAsync = async () => {
  //       let authorId = newMessage.user_id;
  //       if (!users.get(authorId))
  //         await fetchUser(authorId, (user) => handleNewOrUpdatedUser(user));
  //       setMessages(messages.concat(newMessage));
  //     };
  //     handleAsync();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // } , [newMessage]); //
  // New message received from Postgres
  useEffect(() => {
    if (newMessage && newMessage.channel_id == channelId) {
      const handleAsync = async () => {
        setMessages(messages.concat(newMessage));
      console.log({newMessage})
      };
      handleAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMessage]); //

  // Deleted message received from postgres
  useEffect(() => {
    if (deletedMessage)
      setMessages(
        messages.filter((message) => message.id !== deletedMessage.id)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedMessage]);

  // New channel received from Postgres
  useEffect(() => {
    if (newChannel) setChannels(channels.concat(newChannel));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newChannel]);

  // Deleted channel received from postgres
  useEffect(() => {
    if (deletedChannel)
      setChannels(
        channels.filter((channel) => channel.id !== deletedChannel.id)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedChannel]);

  // New or updated user received from Postgres
  useEffect(() => {
    if (newOrUpdatedUser) users.set(newOrUpdatedUser.id, newOrUpdatedUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newOrUpdatedUser]);

  /**
   * Fetch all channels
   * @param {function} setState Optionally pass in a hook or callback to set the state
   */
  const fetchChannels = async (setState) => {
    try {
      let { data } = await supabase.from("channels").select("*");
      if (setState) setState(data);
      return data;
    } catch (error) {
      console.log("error", error);
    }
  };

  /**
   * Fetch a single user
   * @param {number} userId
   * @param {function} setState Optionally pass in a hook or callback to set the state
   */
  const fetchUser = async (userId, setState) => {
    try {
      let { data } = await supabase
        .from("profiles")
        .select(`*`)
        .eq("id", userId);
      let user = data[0];
      if (setState) setState(user);
      return user;
    } catch (error) {
      console.log("error", error);
    }
  };

  /**
   * Fetch all roles for the current user
   * @param {function} setState Optionally pass in a hook or callback to set the state
   */
  const fetchUserRoles = async (setState) => {
    try {
      let { data } = await supabase.from("user_roles").select(`*`);
      if (setState) setState(data);
      return data;
    } catch (error) {
      console.log("error", error);
    }
  };

  // /**
  //  * Fetch all messages and their authors
  //  * @param {number} channelId
  //  * @param {function} setState Optionally pass in a hook or callback to set the state
  //  */
  const fetchMessages = async (id) => {
    try {
      let { data } = await supabase
        .from("messages")
        .select(`*`)
        .eq("channel_id", id)
        .order("inserted_at", true);
      if (data) {
        console.log(data);
        setMessages(data);
      }
      return data;
    } catch (error) {
      console.log("error", error);
    }
  };

  /**
   * Insert a new channel into the DB
   * @param {string} slug The channel name
   * @param {number} user_id The channel creator
   */
  const addChannel = async (slug, user_id, message_to) => {
    try {
      let { data } = await supabase
        .from("channels")
        .insert([{ slug, created_by: user_id, message_to }])
        .select();
      return data;
    } catch (error) {
      console.log("error", error);
    }
  };

  /**
   * Insert a new message into the DB
   * @param {string} message The message text
   * @param {number} channel_id
   * @param {number} user_id The author
   */
  const addMessage = async (
    message,
    channel_id,
    user_id,
    username,
    absolute_avatar_url
  ) => {
    try {
      let { data } = await supabase
        .from("messages")
        .insert([
          { message, channel_id, user_id, username, absolute_avatar_url },
        ])
        .select();
      return data;
    } catch (error) {
      console.log("error", error);
    }
  };

  /**
   * Delete a channel from the DB
   * @param {number} channel_id
   */
  const deleteChannel = async (channel_id) => {
    try {
      let { data } = await supabase
        .from("channels")
        .delete()
        .match({ id: channel_id });
      return data;
    } catch (error) {
      console.log("error", error);
    }
  };

  /**
   * Delete a message from the DB
   * @param {number} message_id
   */
  const deleteMessage = async (message_id) => {
    try {
      let { data } = await supabase
        .from("messages")
        .delete()
        .match({ id: message_id });
      return data;
    } catch (error) {
      console.log("error", error);
    }
  };
  return {
    // We can export computed values here to map the authors to each message
    messages: messages.map((x) => ({ ...x })),
    channels:
      channels !== null
        ? channels.sort((a, b) => a.slug.localeCompare(b.slug))
        : [],
    users,
    channelId,
    addChannel,
    setChannelId,
    fetchUserRoles,
    deleteChannel,
    addMessage,
    newMessage,
    deleteMessage,
  };
}