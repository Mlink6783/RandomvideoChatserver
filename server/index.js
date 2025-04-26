
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get("/", (req, res) => {
  res.send("Rando Chat Server Running");
});

let users = [];
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("newUser", (user) => {
    users.push({ id: socket.id, ...user });
    socket.emit("usersList", users);
  });

  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    users = users.filter(user => user.id !== socket.id);
    console.log("user disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
    
