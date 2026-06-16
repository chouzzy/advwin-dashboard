import clientPromise, { DB_NAME } from '../lib/mongodb.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const client = await clientPromise
    const col = client.db(DB_NAME).collection('processos')

    if (req.method === 'GET') {
      const docs = await col.find({}).toArray()
      const processos = docs.map(({ _id, ...rest }) => rest)
      return res.status(200).json({ processos, isEmpty: processos.length === 0 })
    }

    if (req.method === 'DELETE') {
      await col.deleteMany({})
      return res.status(200).json({ ok: true })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
