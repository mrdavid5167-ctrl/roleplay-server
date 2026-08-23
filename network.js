const socket = io("https://roleplay-server-gog2.onrender.com");

socket.on("connect", () => {
  console.log("Connected to RP server:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Server connection failed:", err.message);
});

socket.on("disconnect", () => {
  console.log("Disconnected from RP server");
});

export { socket };