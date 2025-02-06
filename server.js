const express = require('express');

const app = express();

const {Server} = require('socket.io')

const http = require('http')

const server = http.createServer(app)

const io = new Server(server) // this initializes a new instance of socket.io for the server

io.on('connection', (socket) => {
    console.log('Socket Connected', socket.id)
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
