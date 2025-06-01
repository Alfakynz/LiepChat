import { Server, Socket } from 'socket.io'

export function handleConnectionEvents(io: Server, socket: Socket) {
  socket.on('disconnect', () => {
    io.emit('userDisconnected', { id: socket.id })
  })
}
