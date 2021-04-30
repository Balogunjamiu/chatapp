const path = require('path')
const http = require('http')
const express = require('express')
 const sockectio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generatedLocationMessage} = require('./utils/messages')
const app = express()
const server = http.createServer(app)
const io = sockectio(server)
const { addUser, removeUser, getUser , getUsersInRoom} = require('./utils/users')

const publicDirectories = path.join(__dirname, '../public')
app.use(express.static(publicDirectories))

io.on('connection', (socket)=>{
    console.log('new websocket connection')

     
        socket.on('join', ({ username , room}, callback)=>{
            const {error, user} = addUser({ id: socket.id, username , room})

             if(error){
                 return callback(error)
             }
            socket.join(user.room)
            socket.emit('message', generateMessage('Admin','welcome'))
            socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined the room `) )
            io.to(user.room).emit('roomData', {
                room: user.room,
                users:getUsersInRoom(user.room)
            })
            callback()
            //socket.emit, io.emit,broadcast.emit
            //io.to.emit, socket.broadcast.to.emit
        })
        socket.on('sendMessage', (message, callback)=>{
            const filter = new Filter()

            if(filter.isProfane(message)){
                return callback(' Profanity is not allowed')
            }
            const user = getUser(socket.id)

            io.to(user.room).emit('message', generateMessage(user.username, message))
            callback()
        })
        socket.on('sendLocation', (coords, callback)=>{
            const user = getUser(socket.id)
            io.to(user.room).emit('locationMessage', generatedLocationMessage(user.username, `https://google.com/maps?q=:${coords.latitude},${coords.longitude}`))
            callback()

        })
        socket.on('disconnect', ()=>{
            const user = removeUser(socket.id)
            if (user){
                io.to(user.room).emit('message', generateMessage(`${user.username} has left!`))
                io.to(user.room).emit('roomData', {
                    room: user.room,
                    users: getUsersInRoom(user.room)
                })
            }
        })
})
const port = process.env.PORT || 3000


server.listen(port,()=>{
    console.log('this app is running on server '+ port)
})