import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { processosMock, formatCurrency, formatDate } from '../data/mockData'
import Header from '../components/Layout/Header'
import { T } from '../theme'
import { Search, ChevronRight, ArrowUpDown, X, SlidersHorizontal } from 'lucide-react'
import type { ProcessoFase, ProcessoStatus, RiscoNivel } from '../types'

const riscoText: Record<string, string> = { 'Provável': T.red, 'Possível': T.amber, 'Remoto': T.green }
const faseText:  Record<string, string>  = { 'Conhecimento': T.copper, 'Recursal': '#9080C8', 'Execução': '#C07070', 'Liquidação': '#8090B0' }

type SortKey = 'reclamante' | 'dataDistribuicao' | 'risco' | 'fase' | 'riscoSCC'

export default function Processos() {
  const navigate = useNavigate()
  const [search, setSearch]             = useState('')
  const [filterFase, setFilterFase]     = useState<ProcessoFase | ''>('')
  const [filterStatus, setFilterStatus] = useState<ProcessoStatus | ''>('')
  const [filterRisco, setFilterRisco]   = useState<RiscoNivel | ''>('')
  const [sortKey, setSortKey]           = useState<SortKey>('dataDistribuicao')
  const [sortAsc, setSortAsc]           = useState(false)
  const [showFilters, setShowFilters]   = useState(false)

  const filtrados = useMemo(() => {
    let list = [...processosMock]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.numero.toLowerCase().includes(q) || p.reclamante.toLowerCase().includes(q) ||
        p.vara.toLowerCase().includes(q) || p.comarca.toLowerCase().includes(q)
      )
    }
    if (filterFase)   list = list.filter(p => p.fase === filterFase)
    if (filterStatus) list = list.filter(p => p.status === filterStatus)
    if (filterRisco)  list = list.filter(p => p.risco === filterRisco)
    const ro = { 'Provável': 0, 'Possível': 1, 'Remoto': 2 }
    list.sort((a, b) => {
      let va: any, vb: any
      if (sortKey === 'reclamante')      { va = a.reclamante;       vb = b.reclamante }
      else if (sortKey === 'dataDistribuicao') { va = a.dataDistribuicao; vb = b.dataDistribuicao }
      else if (sortKey === 'risco')      { va = ro[a.risco];        vb = ro[b.risco] }
      else if (sortKey === 'fase')       { va = a.fase;             vb = b.fase }
      else                               { va = a.verbas.riscoSCC;  vb = b.verbas.riscoSCC }
      if (va < vb) return sortAsc ? -1 : 1
      if (va > vb) return sortAsc ? 1  : -1
      return 0
    })
    return list
  }, [search, filterFase, filterStatus, filterRisco, sortKey, sortAsc])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
  }

  const activeFilters = [filterFase, filterStatus, filterRisco].filter(Boolean).length

  const colHeader = (key: SortKey | null, label: string) => (
    key ? (
      <button onClick={() => handleSort(key)}
        className="flex items-center gap-1.5 text-xs tracking-widest uppercase"
        style={{ color: sortKey === key ? T.copper : T.t3, letterSpacing: '0.1em' }}>
        {label} <ArrowUpDown size={10} style={{ color: sortKey === key ? T.copper : T.b2 }} />
      </button>
    ) : (
      <span className="text-xs tracking-widest uppercase" style={{ color: T.t3, letterSpacing: '0.1em' }}>{label}</span>
    )
  )

  return (
    <div>
      <Header title="Processos" subtitle={`${filtrados.length} processo${filtrados.length !== 1 ? 's' : ''}`} />

      <div className="p-8 space-y-4">
        {/* Toolbar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.t3 }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Reclamante, número CNJ, vara, comarca..."
              className="w-full pl-9 pr-9 py-2.5 text-xs rounded-sm outline-none transition-all"
              style={{ background: T.s1, border: `1px solid ${T.b1}`, color: T.t1 }}
              onFocus={e => (e.target.style.borderColor = T.copper + '55')}
              onBlur={e => (e.target.style.borderColor = T.b1)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: T.t3 }}>
                <X size={12} />
              </button>
            )}
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs rounded-sm transition-all"
            style={{
              background: showFilters || activeFilters > 0 ? '#1E1208' : T.s1,
              border: `1px solid ${showFilters || activeFilters > 0 ? T.copper + '55' : T.b1}`,
              color: showFilters || activeFilters > 0 ? T.copper : T.t2,
            }}>
            <SlidersHorizontal size={13} />
            Filtros
            {activeFilters > 0 && (
              <span style={{ background: T.copper, color: '#0C0C0C', fontSize: 10,
                fontWeight: 700, padding: '1px 5px', borderRadius: 2 }}>{activeFilters}</span>
            )}
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-5 px-5 py-4 rounded-sm"
            style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
            {[
              { label: 'Fase', value: filterFase, set: setFilterFase, opts: ['Conhecimento', 'Recursal', 'Execução', 'Liquidação'] },
              { label: 'Status', value: filterStatus, set: setFilterStatus, opts: ['Ativo', 'Suspenso', 'Arquivado', 'Encerrado'] },
              { label: 'Risco', value: filterRisco, set: setFilterRisco, opts: ['Provável', 'Possível', 'Remoto'] },
            ].map(f => (
              <div key={f.label}>
                <p className="text-xs tracking-widest uppercase mb-2" style={{ color: T.t3, letterSpacing: '0.1em' }}>{f.label}</p>
                <select value={f.value} onChange={e => (f.set as any)(e.target.value)}
                  className="text-xs px-3 py-2 outline-none rounded-sm"
                  style={{ background: T.s2, border: `1px solid ${T.b1}`, color: T.t2 }}>
                  <option value="">Todos</option>
                  {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
            {activeFilters > 0 && (
              <div className="flex items-end">
                <button onClick={() => { setFilterFase(''); setFilterStatus(''); setFilterRisco('') }}
                  className="flex items-center gap-1 text-xs px-2 py-1"
                  style={{ color: T.t3 }}
                  onMouseEnter={e => (e.currentTarget.style.color = T.red)}
                  onMouseLeave={e => (e.currentTarget.style.color = T.t3)}>
                  <X size={11} /> Limpar
                </button>
              </div>
            )}
          </div>
        )}

        {/* Table */}
        <div style={{ border: `1px solid ${T.b1}` }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.b1}`, background: T.s2 }}>
                  <th className="px-5 py-3 text-left">{colHeader('reclamante', 'Reclamante')}</th>
                  <th className="px-5 py-3 text-left hidden md:table-cell">{colHeader(null, 'Vara')}</th>
                  <th className="px-5 py-3 text-left">{colHeader('fase', 'Fase')}</th>
                  <th className="px-5 py-3 text-left">{colHeader('risco', 'Risco')}</th>
                  <th className="px-5 py-3 text-left hidden lg:table-cell">{colHeader('riscoSCC', 'Exposição')}</th>
                  <th className="px-5 py-3 text-left hidden lg:table-cell">{colHeader(null, 'Próximo Evento')}</th>
                  <th className="px-5 py-3 text-left">{colHeader(null, 'Status')}</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p, i) => (
                  <tr key={p.id}
                    onClick={() => navigate(`/processos/${p.id}`)}
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: i < filtrados.length - 1 ? `1px solid ${T.b1}` : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = T.s1)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-5 py-4">
                      <p className="text-xs font-semibold" style={{ color: T.t1 }}>{p.reclamante}</p>
                      <p className="text-xs mt-0.5 font-mono" style={{ color: T.t3, fontSize: 10 }}>{p.numero}</p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <p className="text-xs" style={{ color: T.t2 }}>{p.comarca}</p>
                      <p className="text-xs mt-0.5" style={{ color: T.t3 }}>{p.tribunal}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium" style={{ color: faseText[p.fase] || T.copper }}>{p.fase}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold" style={{ color: riscoText[p.risco] }}>{p.risco}</span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-xs font-semibold" style={{ color: T.copper }}>{formatCurrency(p.verbas.riscoSCC)}</span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      {p.proximoEvento ? (
                        <div>
                          <p className="text-xs" style={{ color: T.t2 }}>{p.proximoEvento}</p>
                          <p className="text-xs mt-0.5" style={{ color: T.t3 }}>{formatDate(p.proximoEventoData!)}</p>
                        </div>
                      ) : <span style={{ color: T.t4 }}>—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium" style={{
                        color: p.status === 'Ativo' ? T.t1 : p.status === 'Encerrado' ? T.t3 : T.amber
                      }}>{p.status}</span>
                    </td>
                    <td className="px-3 py-4">
                      <ChevronRight size={13} style={{ color: T.b2 }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtrados.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-xs tracking-widest uppercase" style={{ color: T.t4, letterSpacing: '0.12em' }}>
                  Nenhum processo encontrado
                </p>
              </div>
            )}
          </div>
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: `1px solid ${T.b1}`, background: T.s2 }}>
            <p className="text-xs" style={{ color: T.t3 }}>
              {filtrados.length} de {processosMock.length} processos
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: T.t3 }}>Risco filtrado:</span>
              <span className="text-xs font-semibold" style={{ color: T.copper }}>
                {formatCurrency(filtrados.reduce((s, p) => s + p.verbas.riscoSCC, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
