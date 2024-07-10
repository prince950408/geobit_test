import { useEffect, useState } from "react";
import io from "socket.io-client";
import { generateUserId } from "./utils";

function App() {
  const server_url = process.env.REACT_APP_SERVER_URL;
  const socketInstance = io(server_url);

  const [msgList, setMsgList] = useState([]);
  const [currentMsg, setCurrentMsg] = useState('');
  const [userId, setUserId] = useState(localStorage.getItem('user_id') || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMsgList();

    if (!userId) {
      const newUserId = generateUserId();
      setUserId(newUserId);
      localStorage.setItem("user_id", newUserId);
    }

    socketInstance.on("receive_msg", (message) => {
      setMsgList((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketInstance.off("receive_msg");
    };
  }, []);

  const loadMsgList = async () => {
    try {
      const response = await fetch(server_url + "/msg_list");
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setMsgList(data);
    } catch (err) {
      setError("Failed to load messages");
    }
  };

  const sendMsg = (e) => {
    e.preventDefault();

    const msg = {
      user_id: userId,
      msg: currentMsg,
      time: new Date().toISOString(),
    };
    socketInstance.emit("send_msg", msg);
    setCurrentMsg("");
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col h-full w-screen-sm w-6/12 border-2">
        {error && <div className="bg-red-500 text-white p-2">{error}</div>}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {msgList.map((msg, index) => (
            <div key={index} className="flex items-start">
              <strong className="mr-2">{msg.user_id}:</strong>
              <span>{msg.message}</span>
            </div>
          ))}
        </div>
        <form onSubmit={sendMsg} className="flex items-center p-4 border-t border-gray-200">
          <input
            value={currentMsg}
            onChange={(e) => setCurrentMsg(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required  
          />
          <button type="submit" className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
