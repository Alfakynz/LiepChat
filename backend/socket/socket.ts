import { Server, Socket } from 'socket.io'
import { ConnectedUser, MessagePayload } from '../types'
import { getUsernameById } from '../utils/getUsernameById'
import { getColorById } from '../utils/getColorById'
import { getImageById } from '../utils/getImageById'
import { sendMessage } from '../utils/sendMessage'
import { getMessages } from '../utils/getMessages'

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

      if (roomName !== 'temporal') {
        const messages = getMessages(roomName)
        messages
          .then(async (msgs) => {
            if (msgs) {
              for (const msg of msgs) {
                msg.color = await getColorById(msg.userId)
                msg.image = await getImageById(msg.userId)
                msg.userId = await getUsernameById(msg.userId)
                socket.emit('message', msg)
              }
            }
          })
          .catch((error) => {
            console.error('Error fetching messages:', error)
          })
      }
    })

    socket.on('unregisterUser', () => {
      const user = connectedUsers.find((u) => u.socketIds.includes(socket.id))
      if (user) {
        user.socketIds = user.socketIds.filter((id) => id !== socket.id)
        if (user.socketIds.length === 0) {
          connectedUsers.splice(connectedUsers.indexOf(user), 1)
          io.emit('userDisconnected', { userId: user.userId })
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
          io.emit('userDisconnected', { userId: user.userId })
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
      if (room !== 'temporal') {
        sendMessage(msg, room)
      }
      const message: MessagePayload = msg
      message.userId = await getUsernameById(msg.userId)
      io.to(room).emit('message', msg)
    })

    socket.on('disconnect', () => {
      io.emit('userDisconnected', { id: socket.id })
    })
  })
}
