import clientPromise, { DB_NAME } from '../lib/mongodb.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { processos } = req.body
    if (!Array.isArray(processos) || processos.length === 0) {
      return res.status(400).json({ error: 'Array de processos vazio ou inválido' })
    }

    const client = await clientPromise
    const col = client.db(DB_NAME).collection('processos')

    await col.deleteMany({})
    await col.insertMany(processos)

    res.status(200).json({ ok: true, count: processos.length })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
