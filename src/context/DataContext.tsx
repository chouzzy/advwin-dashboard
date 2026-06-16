import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Processo } from '../types'
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

export interface ImportSummary {
  processosAtualizados: number
  processosCriados: number
  verbasImportadas: number
  processosImportados: number
}

interface DataContextValue {
  processos: Processo[]
  isImported: boolean
  isLoading: boolean
  error: string | null
  summary: ImportSummary | null
  reload: () => Promise<void>
  setProcessos: (p: Processo[]) => Promise<void>
  mergeVerbas: (parsed: ParsedVerba[]) => Promise<ImportSummary>
  reset: () => Promise<void>
}

const DataContext = createContext<DataContextValue | null>(null)

async function apiFetch(path: string, opts?: RequestInit) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `HTTP ${res.status}`)
  }
  return res.json()
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [processos, setProcessosState] = useState<Processo[]>(processosMock)
  const [isImported, setIsImported]    = useState(false)
  const [isLoading, setIsLoading]      = useState(true)
  const [error, setError]              = useState<string | null>(null)
  const [summary, setSummary]          = useState<ImportSummary | null>(null)

  const reload = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { processos: data, isEmpty } = await apiFetch('/api/processos')
      if (isEmpty) {
        setProcessosState(processosMock)
        setIsImported(false)
      } else {
        setProcessosState(data as Processo[])
        setIsImported(true)
      }
    } catch (e: any) {
      setError(e.message)
      // fallback to mock data so UI still renders
      setProcessosState(processosMock)
      setIsImported(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { reload() }, [reload])

  const setProcessos = async (p: Processo[]) => {
    setIsLoading(true)
    try {
      await apiFetch('/api/processos/import', {
        method: 'POST',
        body: JSON.stringify({ processos: p }),
      })
      setProcessosState(p)
      setIsImported(true)
      setSummary({ processosImportados: p.length, processosAtualizados: 0, processosCriados: p.length, verbasImportadas: 0 })
    } finally {
      setIsLoading(false)
    }
  }

  const mergeVerbas = async (parsed: ParsedVerba[]): Promise<ImportSummary> => {
    const data = await apiFetch('/api/verbas/import', {
      method: 'POST',
      body: JSON.stringify({ verbas: parsed }),
    })
    const result: ImportSummary = {
      verbasImportadas: data.verbasImportadas,
      processosAtualizados: data.processosAtualizados,
      processosCriados: data.processosCriados,
      processosImportados: 0,
    }
    setSummary(result)
    await reload()
    return result
  }

  const reset = async () => {
    setIsLoading(true)
    try {
      await apiFetch('/api/processos', { method: 'DELETE' })
      setProcessosState(processosMock)
      setIsImported(false)
      setSummary(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DataContext.Provider value={{ processos, isImported, isLoading, error, summary, reload, setProcessos, mergeVerbas, reset }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
