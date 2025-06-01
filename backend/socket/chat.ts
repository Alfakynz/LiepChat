import { Server, Socket } from 'socket.io'
import { MessagePayload } from '../types'

export function handleChatEvents(io: Server, socket: Socket) {
  socket.on('message', (msg: MessagePayload) => {
    console.log(`Received message from ${msg.user}: ${msg.content}`)
    io.emit('message', msg) // broadcast à tous les clients
  })
}
