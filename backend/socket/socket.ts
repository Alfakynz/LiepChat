import { Server, Socket } from 'socket.io'
import { handleChatEvents } from './chat'
import { handleConnectionEvents } from './connection'

export function setupSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`)

    handleChatEvents(io, socket)
    handleConnectionEvents(io, socket)
  })
}
