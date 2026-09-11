// server: entrypoint — connect to MongoDB, then start the HTTP server.
import 'dotenv/config'
import { createServer } from 'http'
import app from './app.js'
import connectDB from './config/db.js'
import { initSocket } from './socket.js'
import { startReminders } from './services/reminder.service.js'

const port = process.env.PORT || 5000

const start = async () => {
  await connectDB()
  const server = createServer(app)
  initSocket(server)
  startReminders()
  server.listen(port, () => console.log(`Backend :${port}`))
}

start()
