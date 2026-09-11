// app: express wiring — security, CORS, body parsing, health check,
// API routers, and centralized error handling.
import exp from 'express'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import router from './APIs/index.js'
import { notFound, errorHandler } from './middlewares/errorHandler.js'

const app = exp()
app.set('trust proxy', 1) // Render terminates TLS upstream
app.use(helmet())

const frontendUrls = (process.env.FRONTEND_URL || '').split(',').map((o) => o.trim()).filter(Boolean)
if (process.env.NODE_ENV === 'production' && frontendUrls.length === 0) {
  throw new Error('FRONTEND_URL must be set in production (comma-separated allowlist)')
}
app.use(cors({ origin: frontendUrls.length ? frontendUrls : true, credentials: true }))

app.use(exp.json({ limit: '12mb' })) // base64 prescriptions
app.use(cookieParser())
app.use('/api/', rateLimit({ windowMs: 60_000, max: 120 }))

const bootAt = Date.now()
app.get('/health', async (_req, res) => {
  const mongo = mongoose.connection.readyState === 1 ? 'up' : 'down'
  let ml = 'unknown'
  if (process.env.ML_SERVICE_URL) {
    try {
      const r = await fetch(`${process.env.ML_SERVICE_URL}/health`, { signal: AbortSignal.timeout(5000) })
      ml = r.ok ? 'up' : 'down'
    } catch {
      ml = 'down'
    }
  }
  const body = { ok: mongo === 'up', uptime: Math.round((Date.now() - bootAt) / 1000),
    version: '1.0.0', mongo, ml }
  res.status(mongo === 'up' ? 200 : 503).json(body)
})

app.use('/api/v1', router)

app.use(notFound)
app.use(errorHandler)

export default app
