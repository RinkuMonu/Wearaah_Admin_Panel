import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  if (socket && socket.connected) {
    socket.emit("join", userId); // 🔥 ensure correct room
    return socket;
  }

  socket = io("http://localhost:5000", {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    socket.emit("join", userId);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("connect_error", (err) => {
    console.error("Socket error:", err.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners(); // ✅ clean
    socket.disconnect();
    socket = null;
  }
};
