import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Processo, TipoVerba } from '../types'
import { processosMock } from '../data/mockData'

export interface ParsedVerba {
  processoNumero: string
  tipo: string
  categoria: string
  nota: string
  valorCalculado?: number
  valorHomologado?: number
  valorPago?: number
}

interface ImportSummary {
  processosAtualizados: number
  processosCriados: number
  verbasImportadas: number
  processosImportados: number
}

interface DataContextValue {
  processos: Processo[]
  isImported: boolean
  summary: ImportSummary | null
  setProcessos: (p: Processo[], count: number) => void
  mergeVerbas: (parsed: ParsedVerba[]) => ImportSummary
  reset: () => void
}

const DataContext = createContext<DataContextValue | null>(null)
const LS_KEY = 'scc_processos_v2'
const LS_IMPORTED = 'scc_imported_v2'

function mapCategoria(cat: string): TipoVerba {
  const c = cat.trim().toLowerCase()
  if (c.includes('salarial')) return 'verba salarial'
  if (c.includes('indenizat')) return 'verba indenizatória'
  if (c.includes('honorár') && !c.includes('contábil') && !c.includes('médico')) return 'Honorários'
  return 'Encargos'
}

function createSkeleton(numero: string, verbas: ParsedVerba[]): Processo {
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
    verbas: verbas.map(v => ({
      tipo: v.tipo,
      descricao: mapCategoria(v.categoria),
      nota: v.nota || undefined,
      valorCalculado: v.valorCalculado,
      valorHomologado: v.valorHomologado,
      valorPago: v.valorPago,
    })),
  }
}

function loadSaved(): Processo[] {
  try {
    const s = localStorage.getItem(LS_KEY)
    return s ? JSON.parse(s) : processosMock
  } catch { return processosMock }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [processos, setProcessosState] = useState<Processo[]>(loadSaved)
  const [isImported, setIsImported]    = useState(() => localStorage.getItem(LS_IMPORTED) === 'true')
  const [summary, setSummary]          = useState<ImportSummary | null>(null)

  const persist = (p: Processo[]) => {
    localStorage.setItem(LS_KEY, JSON.stringify(p))
    localStorage.setItem(LS_IMPORTED, 'true')
    setIsImported(true)
    setProcessosState(p)
  }

  const setProcessos = (p: Processo[], count: number) => {
    persist(p)
    setSummary({ processosImportados: count, processosAtualizados: 0, processosCriados: count, verbasImportadas: 0 })
  }

  const mergeVerbas = (parsed: ParsedVerba[]): ImportSummary => {
    const byNum = new Map<string, ParsedVerba[]>()
    for (const v of parsed) {
      const k = v.processoNumero
      if (!byNum.has(k)) byNum.set(k, [])
      byNum.get(k)!.push(v)
    }

    let atualizados = 0, criados = 0
    const updated = [...processos]

    byNum.forEach((verbas, numero) => {
      const idx = updated.findIndex(p => p.numero === numero)
      const mappedVerbas = verbas.map(v => ({
        tipo: v.tipo,
        descricao: mapCategoria(v.categoria),
        nota: v.nota || undefined,
        valorCalculado: v.valorCalculado,
        valorHomologado: v.valorHomologado,
        valorPago: v.valorPago,
      }))
      if (idx >= 0) {
        updated[idx] = { ...updated[idx], verbas: mappedVerbas }
        atualizados++
      } else {
        updated.push(createSkeleton(numero, verbas))
        criados++
      }
    })

    persist(updated)
    const result: ImportSummary = {
      processosAtualizados: atualizados,
      processosCriados: criados,
      verbasImportadas: parsed.length,
      processosImportados: 0,
    }
    setSummary(result)
    return result
  }

  const reset = () => {
    setProcessosState(processosMock)
    setIsImported(false)
    setSummary(null)
    localStorage.removeItem(LS_KEY)
    localStorage.removeItem(LS_IMPORTED)
  }

  return (
    <DataContext.Provider value={{ processos, isImported, summary, setProcessos, mergeVerbas, reset }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
