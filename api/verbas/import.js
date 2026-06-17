import clientPromise, { DB_NAME } from '../lib/mongodb.js'

function mapCategoria(cat) {
  const c = (cat ?? '').trim().toLowerCase()
  if (c.includes('salarial')) return 'verba salarial'
  if (c.includes('indenizat')) return 'verba indenizatória'
  if (c.includes('honorár') && !c.includes('contábil') && !c.includes('médico')) return 'Honorários'
  return 'Encargos'
}

function skeletonProcesso(numero, verbas) {
  return {
    id: numero,
    numero,
    reclamante: 'Não informado',
    advogadoReclamante: 'Não informado',
    vara: 'Não informado',
    comarca: 'Não informado',
    tribunal: 'Não informado',
    fase: 'Inicial',
    status: 'Ativo',
    risco: 'Possível',
    dataDistribuicao: new Date().toISOString().slice(0, 10),
    ultimoMovimento: 'Importado via planilha',
    andamentos: [],
    audiencias: [],
    verbas,
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { verbas } = req.body
    if (!Array.isArray(verbas) || verbas.length === 0) {
      return res.status(400).json({ error: 'Array de verbas vazio ou inválido' })
    }

    const client = await clientPromise
    const col = client.db(DB_NAME).collection('processos')

    // Group verbas by process number
    const byNum = new Map()
    for (const v of verbas) {
      if (!byNum.has(v.processoNumero)) byNum.set(v.processoNumero, [])
      byNum.get(v.processoNumero).push({
        tipo: v.tipo,
        descricao: mapCategoria(v.categoria),
        nota: v.nota || undefined,
        valorCalculado: v.valorCalculado,
        valorHomologado: v.valorHomologado,
        valorPago: v.valorPago,
      })
    }

    // Ensure unique index to prevent duplicate skeleton processes
    await col.createIndex({ numero: 1 }, { unique: true, background: true }).catch(() => {})

    let atualizados = 0
    let criados = 0

    for (const [numero, mappedVerbas] of byNum) {
      const skeleton = skeletonProcesso(numero, mappedVerbas)
      const { verbas: _v, ultimoMovimento: _u, ...insertFields } = skeleton
      const result = await col.updateOne(
        { numero },
        {
          $set: { verbas: mappedVerbas, ultimoMovimento: 'Importado via planilha' },
          $setOnInsert: insertFields,
        },
        { upsert: true }
      )
      if (result.upsertedCount > 0) criados++
      else atualizados++
    }

    res.status(200).json({
      ok: true,
      verbasImportadas: verbas.length,
      processosAtualizados: atualizados,
      processosCriados: criados,
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
