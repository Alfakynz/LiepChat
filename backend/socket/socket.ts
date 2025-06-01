import { Server, Socket } from 'socket.io'
import { handleChatEvents } from './chat'
import { handleConnectionEvents } from './connection'
import { ConnectedUser } from '../types'

const connectedUsers: ConnectedUser[] = []

export function setupSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    // Ici, on attend que le client envoie ses infos
    socket.on('registerUser', (userData: Omit<ConnectedUser, 'socketIds'>) => {
      const existingUser = connectedUsers.find((u) => u.username === userData.username)
      if (existingUser) {
        if (!existingUser.socketIds.includes(socket.id)) {
          existingUser.socketIds.push(socket.id)
        }
      } else {
        const newUser: ConnectedUser = {
          username: userData.username,
          userColor: userData.userColor,
          userImage: userData.userImage,
          socketIds: [socket.id],
        }
        connectedUsers.push(newUser)
      }

      io.emit(
        'connectedUsers',
        connectedUsers.map(({ username, userColor, userImage }) => ({
          username,
          userColor,
          userImage,
        })),
      )
    })

    socket.on('unregisterUser', () => {
      const user = connectedUsers.find((u) => u.socketIds.includes(socket.id))
      if (user) {
        user.socketIds = user.socketIds.filter((id) => id !== socket.id)
        if (user.socketIds.length === 0) {
          connectedUsers.splice(connectedUsers.indexOf(user), 1)
          io.emit('userDisconnected', { username: user.username })
        }
        io.emit(
          'connectedUsers',
          connectedUsers.map(({ username, userColor, userImage }) => ({
            username,
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
          io.emit('userDisconnected', { username: user.username })
        }
        io.emit(
          'connectedUsers',
          connectedUsers.map(({ username, userColor, userImage }) => ({
            username,
            userColor,
            userImage,
          })),
        )
      }
    })

    handleChatEvents(io, socket)
    handleConnectionEvents(io, socket)
  })
}
