const express = require('express')
const app = express()
const server = require('http').createServer(app)
const socket = require('socket.io')
const io = socket(server)
// const { addUser, removeUser, getUser, getUsersInRoom, getAllUsers } = require('./utils/users_local')
const { addUser, removeUser, getUser, getUsersInRoom, getAllUsers } = require('./utils/users_db')
const { connectDB } = require("./utils/db");

connectDB();

app.get('/', (req, res) => {
    res.send("server started")
})

io.on("connection", (socket) => {
    socket.on("userJoined", async (data) => {
        const {username, roomId, userId} = data;
        socket.join(roomId);
        const user = {username, roomId, userId, socketId: socket.id}
        const users = await addUser(user);

        socket.emit("userIsJoined", {success: true, users, user});
        socket.broadcast.to(roomId).emit("userJoinedMessageBroadcasted", username)
        socket.broadcast.to(roomId).emit("allUsers", users);
    })

    socket.on("disconnect", async () => {
        const user = await getUser(socket.id);
        
        if (user) {
            await removeUser(socket.id);
            const users = await getUsersInRoom(user.roomId);
            socket.broadcast.to(user.roomId).emit("userLeftMessageBroadcasted", {user, users})
        }
    })

    socket.on("validateRoom", async (rid) => {
        const users = await getAllUsers();
        const exists = users.some((user) => user.roomId === rid);
        socket.emit("roomValidated", exists)
    })
})

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log("server is listening on http://localhost:5000");
})