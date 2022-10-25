import { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "./auth";

const MessageContext = createContext();

export function RealTimeProvider({ children }) {
  const { session } = useAuth();

  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users] = useState(new Map());
  const [newMessage, handleNewMessage] = useState(null);
  const [newChannel, handleNewChannel] = useState(null);
  const [newOrUpdatedUser, handleNewOrUpdatedUser] = useState(null);
  const [deletedChannel, handleDeletedChannel] = useState(null);
  const [deletedMessage, handleDeletedMessage] = useState(null);
  const [channelId, setChannelId] = useState(null);
  const [incomingChannelId, setIncomingChannelId] = useState(null);

  // Load initial data and set up listeners
  useEffect(() => {
    // Get Channels
    fetchChannels(setChannels);
    // Listen for new and deleted messages
    supabase // const messageListener =
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setIncomingChannelId(payload.new.channel_id);
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
          console.log("PROFILES!", payload);

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
    // Cleanup on unmount
    return () => {
      supabase.removeAllChannels();
    };
  }, []);

  // Update when the route changes
  useEffect(() => {
    if (channelId > 0) {
      const handleAsync = async () => {
        await fetchMessages(channelId, setMessages);
      };
      handleAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  // New message received from Postgres
  useEffect(() => {
    if (newMessage && incomingChannelId == channelId) {
      fetchMessages(incomingChannelId);

      setMessages(messages.concat(newMessage));
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

  /**
   * Fetch all messages for given channel
   * @param {number} channel_id
   * @param {function} setState Optionally pass in a hook or callback to set the state
   */
  async function fetchMessages(channel_id, setState) {
    try {
      let { data, error, status } = await supabase
        .from("messages")
        .select(`*`)
        .eq("channel_id", channel_id)
        .order("inserted_at", true);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setState(data);
        console.log(data, "FETCH MESSAGES DATA");
        // return data;
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  /**
   * Insert a new channel into the DB with creator and receiver's id
   * @param {string} slug The receiver's username
   * @param {number} user_id The channel creator's id
   * @param {string} message_to The receiver's id
   * @param {string} created_by_username The channel creator's username
   */
  const addChannel = async (slug, user_id, message_to, created_by_username) => {
    let filteredChannels = channels.filter(
      (chanel) =>
        chanel.message_to === session?.user?.id ||
        chanel.created_by === session?.user?.id
    );
    let existingChannel = filteredChannels.filter(
      (chanel) =>
        chanel.message_to === message_to &&
        chanel.created_by === created_by_username
    );
    if (existingChannel.length < 1) {
      try {
        let { data } = await supabase
          .from("channels")
          .insert([
            { slug, created_by: user_id, message_to, created_by_username },
          ])
          .select();
        return data;
      } catch (error) {
        console.log("error", error);
      }
    } else {
      console.log({ existingChannel });
      setChannelId(existingChannel[0]?.id);
    }
  };

  /**
   * Insert a new message into the DB
   * @param {string} message The message text
   * @param {number} channel_id
   * @param {number} user_id The author's id
   * @param {string} username The author's username
   * @param {string} absolute_avatar_url src of author's avatar
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

  const value = {
    messages,
    setMessages,
    channels:
      channels !== null
        ? channels.sort((a, b) => a.slug.localeCompare(b.slug))
        : [],
    users,
    channelId,
    addChannel,
    setChannelId,
    fetchUserRoles,
    fetchMessages,
    deleteChannel,
    addMessage,
    newMessage,
    deleteMessage,
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
}

export function useRealtime() {
  return useContext(MessageContext);
}
