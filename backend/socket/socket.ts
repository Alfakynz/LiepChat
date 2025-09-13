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
      const existingUser = connectedUsers.find((u) => u.user_id === userData.user_id)
      if (existingUser) {
        if (!existingUser.socketIds.includes(socket.id)) {
          existingUser.socketIds.push(socket.id)
        }
      } else {
        const newUser: ConnectedUser = {
          user_id: userData.user_id,
          userColor: userData.userColor,
          userImage: userData.userImage,
          socketIds: [socket.id],
        }
        connectedUsers.push(newUser)
      }

      io.emit(
        'connectedUsers',
        connectedUsers.map(({ user_id, userColor, userImage }) => ({
          user_id,
          userColor,
          userImage,
        })),
      )
    })

    socket.on('joinRoom', (roomName: string, temporal: boolean, token: string = '') => {
      socket.join(roomName)
      console.log(`User ${socket.id} joined room ${roomName}`)
      socket.to(roomName).emit('message', `🔔 ${socket.id} has joined the room.`)

      if (!temporal) {
        const messages = getMessages(roomName, token)
        messages
          .then(async (msgs) => {
            if (msgs) {
              for (const msg of msgs) {
                msg.color = await getColorById(msg.user_id)
                msg.image = await getImageById(msg.user_id)
                msg.user_id = await getUsernameById(msg.user_id)
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
          io.emit('userDisconnected', { user_id: user.user_id })
        }
        io.emit(
          'connectedUsers',
          connectedUsers.map(({ user_id, userColor, userImage }) => ({
            user_id,
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
          io.emit('userDisconnected', { user_id: user.user_id })
        }
        io.emit(
          'connectedUsers',
          connectedUsers.map(({ user_id, userColor, userImage }) => ({
            user_id,
            userColor,
            userImage,
          })),
        )
      }
    })

    socket.on(
      'message',
      async (msg: MessagePayload, room: string, temporal: boolean, token: string) => {
        if (!temporal) {
          sendMessage(msg, room, token)
        }
        const message: MessagePayload = msg
        message.user_id = await getUsernameById(msg.user_id)
        io.to(room).emit('message', msg)
      },
    )

    socket.on('disconnect', () => {
      io.emit('userDisconnected', { id: socket.id })
    })
  })
}
