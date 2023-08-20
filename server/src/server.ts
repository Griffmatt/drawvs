import { Server } from 'socket.io'
import express from 'express'
import cors from 'cors'
import http from 'http'
import dotenv from 'dotenv'

import { type Rooms } from './types'

dotenv.config()
const app = express()

app.use(cors())
const rooms: Rooms = new Map()

const usersRoom = new Map<string, string>()

const server = http.createServer(app)

const io = new Server(server)

const removeUser = (rooms: Rooms, roomId: string, userId: string) => {
  const room = rooms.get(roomId)
  if (room) {
    const users = room.filter((user) => user.id !== userId)
    return users
  }
  return
}

io.on('connection', (socket) => {
  socket.on('create-room', (data) => {
    if (rooms.has(data.code)) return
    rooms.set(data.code, [{ name: data.name, id: socket.id, isAdmin: true }])
    usersRoom.set(socket.id, data.code)
    socket.join(data.code)
    socket.emit('user-joined', [
      { name: data.name, id: socket.id, isAdmin: true }
    ])
  })

  socket.on('join-room', (data) => {
    const room = rooms.get(data.code)
    if (room && room.length < 8) {
      socket.join(data.code)

      const nameExists = room.some(
        (user) => user.name.toLowerCase() === data.name.toLowerCase()
      )

      if (nameExists) {
        socket.emit('name-taken', {
          message: 'Oops! Name is already taken.'
        })
        return
      }

      const userData = [
        ...room,
        { name: data.name, id: socket.id, isAdmin: false }
      ]
      rooms.set(data.code, userData)
      usersRoom.set(socket.id, data.code)

      const admin = rooms.get(data.code)?.filter((user) => user.isAdmin)[0]
      if (admin) {
        socket.to(admin.id).emit('request-data', socket.id)
        socket.to(data.code).emit('update-users', userData)
        socket.emit('user-joined', userData)
      }
      return
    }
    socket.emit('room-not-found', {
      message: "Oops! The Room ID you entered hasn't been created yet."
    })
  })

  socket.on('send-data', (data) => {
    socket.to(data.id).emit('receive-data', data.data)
  })

  socket.on('game-change', (data) => {
    socket.to(data.roomId).emit('update-name', data.mode)
  })

  socket.on('starting-game', (data) => {
    socket.to(data.code).emit('start-game')
    socket.emit('start-game')
  })

  socket.on('user-left', (data) => {
    const users = removeUser(rooms, data.code, socket.id)
    if (users) {
      const hasAdmin = users.some((user) => user.isAdmin)
      socket.leave(data.code)
      if (!hasAdmin && users[0]) {
        users[0].isAdmin = true
        rooms.set(data.code, users)
        socket.to(data.code).emit('update-users', users)
        return
      }
      if (hasAdmin) {
        rooms.set(data.code, users)
        socket.to(data.code).emit('update-users', users)
        return
      }
      rooms.delete(data.code)
      usersRoom.delete(socket.id)
    }
  })

  socket.on('kick-player', (data) => {
    const users = removeUser(rooms, data.code, data.id)
    if (users) {
      socket.to(data.id).socketsLeave(data.code)
      socket.to(data.id).emit('kicked')
      socket.to(data.code).emit('update-users', users)
      rooms.set(data.code, users)
      usersRoom.delete(socket.id)
    }
  })

  socket.on('disconnect', () => {
    const roomId = usersRoom.get(socket.id)
    if (roomId) {
      const users = removeUser(rooms, roomId, socket.id)
      if (users) {
        const hasAdmin = users.some((user) => user.isAdmin)
        socket.leave(roomId)
        if (!hasAdmin && users[0]) {
          users[0].isAdmin = true
          rooms.set(roomId, users)
          socket.to(roomId).emit('update-users', users)
          return
        }
        if (hasAdmin) {
          rooms.set(roomId, users)
          socket.to(roomId).emit('update-users', users)
          return
        }
        rooms.delete(roomId)
        usersRoom.delete(socket.id)
      }
    }
  })

})

const port = process.env.PORT || 3000

server.listen(port, () => console.log(`Hello World! ${port}`))
