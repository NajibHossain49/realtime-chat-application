import { useState } from "react";
import ChatRoom from "./components/ChatRoom";

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  const joinRoom = () => {
    if (username && room) {
      setJoined(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {!joined ? (
          <div className="bg-white rounded-xl shadow-2xl p-8 transition-all duration-300 hover:shadow-xl">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Join Chat Room
            </h3>
            <p className="text-center text-gray-600 mb-6">
              Connect with others in real-time
            </p>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="room"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Room
                </label>
                <input
                  id="room"
                  type="text"
                  placeholder="Enter room name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </div>

              <button
                onClick={joinRoom}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  username && room
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!username || !room}
              >
                Join Room
              </button>
            </div>
          </div>
        ) : (
          <ChatRoom username={username} room={room} />
        )}
      </div>
    </div>
  );
}

export default App;
