import { Server, Socket } from 'socket.io'

export function handleConnectionEvents(io: Server, socket: Socket) {
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
  })
}
