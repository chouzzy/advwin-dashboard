import express from 'express'

const app = express()
app.use(express.json({ limit: '20mb' }))

// Route each /api path to the corresponding Vercel handler
// Dynamic import = module is cached after first call (same as cold start behavior)
app.all('/api/processos/import', async (req, res) => {
  const { default: h } = await import('./api/processos/import.js')
  return h(req, res)
})
app.all('/api/verbas/import', async (req, res) => {
  const { default: h } = await import('./api/verbas/import.js')
  return h(req, res)
})
app.all('/api/processos', async (req, res) => {
  const { default: h } = await import('./api/processos/index.js')
  return h(req, res)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`\x1b[36m[API local]\x1b[0m http://localhost:${PORT}`)
})
