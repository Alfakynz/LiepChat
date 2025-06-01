import { Server, Socket } from 'socket.io'
import { MessagePayload } from '../types'

export function handleChatEvents(io: Server, socket: Socket) {
  socket.on('message', (msg: MessagePayload) => {
    io.emit('message', msg) // broadcast à tous les clients
  })
}
