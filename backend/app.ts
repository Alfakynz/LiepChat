import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.use('/api', authRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
