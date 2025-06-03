import { Server, Socket } from 'socket.io'
import { ConnectedUser, MessagePayload } from '../types'
import { supabase } from '../supabaseClient'

const connectedUsers: ConnectedUser[] = []

export function setupSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.on('registerUser', (userData: Omit<ConnectedUser, 'socketIds'>) => {
      const existingUser = connectedUsers.find((u) => u.userId === userData.userId)
      if (existingUser) {
        if (!existingUser.socketIds.includes(socket.id)) {
          existingUser.socketIds.push(socket.id)
        }
      } else {
        const newUser: ConnectedUser = {
          userId: userData.userId,
          userColor: userData.userColor,
          userImage: userData.userImage,
          socketIds: [socket.id],
        }
        connectedUsers.push(newUser)
      }

      io.emit(
        'connectedUsers',
        connectedUsers.map(({ userId, userColor, userImage }) => ({
          userId,
          userColor,
          userImage,
        })),
      )
    })

    socket.on('joinRoom', (roomName) => {
      socket.join(roomName)
      console.log(`User ${socket.id} joined room ${roomName}`)
      socket.to(roomName).emit('message', `🔔 ${socket.id} has joined the room.`)
    })

    socket.on('unregisterUser', () => {
      const user = connectedUsers.find((u) => u.socketIds.includes(socket.id))
      if (user) {
        user.socketIds = user.socketIds.filter((id) => id !== socket.id)
        if (user.socketIds.length === 0) {
          connectedUsers.splice(connectedUsers.indexOf(user), 1)
          io.emit('userDisconnected', { username: user.userId })
        }
        io.emit(
          'connectedUsers',
          connectedUsers.map(({ userId, userColor, userImage }) => ({
            userId,
            userColor,
            userImage,
          })),
        )
      }
    })

    socket.on('disconnect', () => {
      const user = connectedUsers.find((u) => u.socketIds.includes(socket.id))
      if (user) {
        user.socketIds = user.socketIds.filter((id) => id !== socket.id)
        if (user.socketIds.length === 0) {
          connectedUsers.splice(connectedUsers.indexOf(user), 1)
          io.emit('userDisconnected', { username: user.userId })
        }
        io.emit(
          'connectedUsers',
          connectedUsers.map(({ userId, userColor, userImage }) => ({
            userId,
            userColor,
            userImage,
          })),
        )
      }
    })

    socket.on('message', async (msg: MessagePayload, room: string) => {
      if (room == 'main') {
        const { data, error } = await supabase
          .from('main-chat')
          .insert([{ userId: msg.userId, content: msg.content, date: msg.date }])

        if (error) {
          console.error("Erreur d'insertion :", error)
        } else {
          console.log('Données insérées :', data)
        }
      }
      io.to(room).emit('message', msg) // broadcast à tous les clients
    })

    socket.on('disconnect', () => {
      io.emit('userDisconnected', { id: socket.id })
    })
  })
}
