import { execSync } from 'child_process'
import { createConnection } from 'net'

const PORT = 3001

// TCP connect is reliable across IPv4/IPv6 — if something answers, the port is in use
const inUse = await new Promise(resolve => {
  const c = createConnection({ port: PORT, host: '127.0.0.1' })
  c.on('connect', () => { c.destroy(); resolve(true) })
  c.on('error', () => resolve(false))
})

if (!inUse) process.exit(0)

console.log(`[predev] Porta ${PORT} em uso — liberando...`)
try {
  if (process.platform === 'win32') {
    const out = execSync(`netstat -ano | findstr ":${PORT} "`, { encoding: 'utf8' })
    const pids = [...new Set(
      out.trim().split('\n')
        .map(l => l.trim().split(/\s+/).at(-1))
        .filter(p => p && /^\d+$/.test(p) && p !== '0')
    )]
    for (const pid of pids) {
      try { execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' }) } catch {}
    }
  } else {
    execSync(`kill -9 $(lsof -ti:${PORT}) 2>/dev/null || true`, { shell: true, stdio: 'ignore' })
  }
  console.log(`[predev] Porta ${PORT} liberada.`)
} catch {
  // noop
}
