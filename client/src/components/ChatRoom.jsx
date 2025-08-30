import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function ChatRoom({ username, room }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingMessage, setTypingMessage] = useState("");
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    socket.emit("join_room", room);
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("user_typing", (username) => {
      setTypingMessage(`${username} is typing...`);
      setTimeout(() => {
        setTypingMessage("");
      }, 2000);
    });

    // cleanup listener on unmount
    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
    };
  }, [room]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      // Use setTimeout to ensure DOM has fully updated
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 50);
    }
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const msgData = {
        room,
        author: username,
        message,
        time: new Date().toLocaleTimeString(),
        id: Date.now(),
      };

      socket.emit("send_message", msgData);
      setMessages((prevMessages) => [...prevMessages, msgData]);
      setMessage("");
    }
  };

  const handleTyping = () => {
    socket.emit("typing", { room, username });
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4 bg-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Chat Room: {room} | User: {username}
      </h2>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow-md mb-4 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 mb-3 rounded-lg break-words ${
                msg.author === username
                  ? "bg-blue-100 ml-auto text-right"
                  : "bg-gray-200 mr-auto text-left"
              } max-w-[70%]`}
            >
              <div className="mb-1">
                <strong className="text-gray-900">{msg.author}: </strong>
                <span className="text-gray-800">{msg.message}</span>
              </div>
              <em className="text-gray-500 text-xs">({msg.time})</em>
            </div>
          ))
        )}
      </div>
      <p className="h-5 text-gray-500 italic mb-2">{typingMessage}</p>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={sendMessage}
          disabled={message.trim() === ""}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}

ChatRoom.propTypes = {
  username: PropTypes.string.isRequired,
  room: PropTypes.string.isRequired,
};

export default ChatRoom;
