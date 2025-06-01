import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes'
import { setupSocket } from './socket/socket'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: '*' },
})

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(express.json())

// Use external routes
app.use('/', routes)

// Socket.IO
setupSocket(io)

// Start server
const PORT = 3000
httpServer.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
