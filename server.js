const express = require('express');

const app = express();

const {Server} = require('socket.io')

const http = require('http');

const ACTIONS = require('./src/Actions');

const server = http.createServer(app)

const io = new Server(server) // this initializes a new instance of socket.io for the server

const userSocketMap = {}

function getAllConnectedClients(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(socketId => {
        return {
            socketId,
            userName: userSocketMap[socketId]
        }
    })
}

io.on('connection', (socket) => {
    console.log('Socket Connected', socket.id)
    socket.on(ACTIONS.JOIN, ({roomId, userName})=> {
        userSocketMap[socket.id] = userName // store the socket id and user name in the map for server side reference
        socket.join(roomId) // join the room
        const clients = getAllConnectedClients(roomId) // get the clients in the room
        console.log('Clients', clients)
    })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
