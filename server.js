const express = require('express');

const app = express();

const {Server} = require('socket.io')

const http = require('http');

const ACTIONS = require('./src/Actions');
const { use } = require('react');
const path = require('path');

const server = http.createServer(app)

const io = new Server(server) // this initializes a new instance of socket.io for the server

app.use(express.static('build')) // this serves the build folder of the react app

app.use((req, res, next)=>{
    res.sendFile(path.join(__dirname, 'build', 'index.html')) // this serves the index.html file of the react app on every request.
})

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
        clients.forEach(({socketId}) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                userName,
                socketId: socket.id
            })// emit the joined event to all the clients in the room
        })
    })

    socket.on(ACTIONS.CODE_CHANGE, ({roomId, code}) => {
        //io.to(roomId).emit(ACTIONS.CODE_CHANGE, {code}) // this line shows code change to all the clients in the room
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {code}) // this line shows code change to all the clients in the room except the sender
    })

    socket.on(ACTIONS.CODE_SYNC, ({socketId, code}) => {
        //io.to(roomId).emit(ACTIONS.CODE_CHANGE, {code}) // this line shows code change to all the clients in the room
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, {code}) // this line shows code change to all the clients in the room except the sender
    })


    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms]
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id, 
                userName: userSocketMap[socket.id]
            }) // emit the disconnected event to all the clients in the room
        })
        delete userSocketMap[socket.id] // remove the user from the map
        socket.leave() // leave the room
    })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
