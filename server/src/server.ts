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
    const users = room.users.filter((user) => user.id !== userId)
    return { ...room, users }
  }
  return
}

io.on('connection', (socket) => {
  socket.on('create-room', (data) => {
    if (rooms.has(data.code)) return
    const userData = [
      { name: data.name, id: socket.id, isAdmin: true, done: false }
    ]
    rooms.set(data.code, {
      users: userData,
      gameStarted: false
    })
    usersRoom.set(socket.id, data.code)
    socket.join(data.code)
    socket.emit('user-joined', userData)
  })

  socket.on('join-room', (data: { name: string; code: string }) => {
    const room = rooms.get(data.code)
    if (room && room.users.length < 8) {
      socket.join(data.code)

      const nameExists = room.users.some(
        (user) => user.name.toLowerCase() === data.name.toLowerCase()
      )

      if (nameExists) {
        socket.emit('name-taken', {
          message: 'Oops! Name is already taken.'
        })
        return
      }

      const roomData = {
        ...room,
        users: [
          ...room.users,
          { name: data.name, id: socket.id, isAdmin: false, done: false }
        ]
      }
      rooms.set(data.code, roomData)
      usersRoom.set(socket.id, data.code)

      const admin = rooms
        .get(data.code)
        ?.users.filter((user) => user.isAdmin)[0]
      if (admin) {
        socket.to(admin.id).emit('request-data', socket.id)
        socket.to(data.code).emit('update-users', roomData.users)
        socket.emit('user-joined', roomData.users)
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

  socket.on('starting-game', () => {
    const roomId = usersRoom.get(socket.id)
    if (!roomId) return
    const room = rooms.get(roomId)
    if (!room) return
    rooms.set(roomId, { ...room, gameStarted: true })
    socket.to(roomId).emit('start-game')
    socket.emit('start-game')
  })

  socket.on('kick-player', (data) => {
    const roomId = usersRoom.get(socket.id)
    if (!roomId) return
    const room = removeUser(rooms, roomId, data.id)
    if (!room) return
    socket.to(data.id).socketsLeave(roomId)
    socket.to(data.id).emit('kicked')
    socket.to(roomId).emit('update-users', room.users)
    rooms.set(roomId, room)
    usersRoom.delete(socket.id)
  })

  socket.on('done', () => {
    const roomId = usersRoom.get(socket.id)
    if (!roomId) return
    const room = rooms.get(roomId)
    if (!room) return
    const updated = room.users.map((user) => {
      if (socket.id === user.id) {
        return { ...user, done: true }
      }
      return user
    })
    rooms.set(roomId, { ...room, users: updated })

    if (updated.some((user) => !user.done)) return

    const undo = room.users.map((user) => {
      return { ...user, done: false }
    })
    rooms.set(roomId, { ...room, users: undo })
    socket.to(roomId).emit('round-done')
    socket.emit('round-done')
  })

  socket.on('send-image', (data) => {
    const roomId = usersRoom.get(socket.id)

    if (!roomId) return

    socket.to(roomId).emit('receive-image', data)
  })

  socket.on("next-set", () => {
    const roomId = usersRoom.get(socket.id)
    if (!roomId) return
    socket.to(roomId).emit("next-set-res")
  });
  socket.on("next-image", () => {
    const roomId = usersRoom.get(socket.id)
    if (!roomId) return
    socket.to(roomId).emit("next-image-res")
  });

  socket.on('leave-room', () => {
    const roomId = usersRoom.get(socket.id)
    if (!roomId) return

    const room = removeUser(rooms, roomId, socket.id)
    if (!room) return

    const hasAdmin = room.users.some((user) => user.isAdmin)
    socket.leave(roomId)
    if (!hasAdmin && room.users[0]) {
      room.users[0].isAdmin = true
      rooms.set(roomId, { ...room, users: room.users })
      socket.to(roomId).emit('update-users', room.users)
      return
    }
    if (hasAdmin) {
      rooms.set(roomId, room)
      socket.to(roomId).emit('update-users', room.users)
      return
    }
    rooms.delete(roomId)
    usersRoom.delete(socket.id)
  })

  //find way for someone to rejoin as well as steps to take when final round is done
  socket.on('disconnect', () => {
    const roomId = usersRoom.get(socket.id)
    if (!roomId) return
    const roomUpdated = removeUser(rooms, roomId, socket.id)
    if (roomUpdated) {
      const hasAdmin = roomUpdated.users.some((user) => user.isAdmin)
      socket.leave(roomId)
      if (!hasAdmin && roomUpdated.users[0]) {
        roomUpdated.users[0].isAdmin = true
        rooms.set(roomId, roomUpdated)
        socket.to(roomId).emit('update-users', roomUpdated.users)
        return
      }
      if (hasAdmin) {
        rooms.set(roomId, roomUpdated)
        socket.to(roomId).emit('update-users', roomUpdated.users)
        return
      }
      rooms.delete(roomId)
      usersRoom.delete(socket.id)
    }
  })
})

const port = process.env.PORT || 3000

server.listen(port, () => console.log(`Hello World! ${port}`))
