import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency, formatDate, riscoColor, faseColor } from '../data/mockData'
import { useData } from '../context/DataContext'
import Header from '../components/Layout/Header'
import { T } from '../theme'
import { Search, ChevronRight, ArrowUpDown, X, SlidersHorizontal } from 'lucide-react'
import type { ProcessoFase, ProcessoStatus, RiscoNivel } from '../types'

type SortKey = 'reclamante' | 'dataDistribuicao' | 'risco' | 'fase' | 'contingencia'

const FASES: ProcessoFase[] = ['Inicial','Recursal','Liquidação','Execução','Embargos','Pagamento de Execução','Pagamento de Acordo','Trânsito em Julgado','Arquivado']
const RISCOS: RiscoNivel[]  = ['Provável','Possível','Remoto']
const STATUS: ProcessoStatus[] = ['Ativo','Arquivado','Encerrado']

export default function Processos() {
  const navigate = useNavigate()
  const { processos } = useData()
  const [search, setSearch]             = useState('')
  const [filterFase, setFilterFase]     = useState<ProcessoFase | ''>('')
  const [filterStatus, setFilterStatus] = useState<ProcessoStatus | ''>('')
  const [filterRisco, setFilterRisco]   = useState<RiscoNivel | ''>('')
  const [filterUnidade, setFilterUnidade] = useState('')
  const [sortKey, setSortKey]           = useState<SortKey>('dataDistribuicao')
  const [sortAsc, setSortAsc]           = useState(false)
  const [showFilters, setShowFilters]   = useState(false)

  const filtrados = useMemo(() => {
    let list = [...processos]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.numero.toLowerCase().includes(q) || p.reclamante.toLowerCase().includes(q) ||
        p.vara.toLowerCase().includes(q) || p.comarca.toLowerCase().includes(q) ||
        (p.cargo || '').toLowerCase().includes(q)
      )
    }
    if (filterFase)    list = list.filter(p => p.fase === filterFase)
    if (filterStatus)  list = list.filter(p => p.status === filterStatus)
    if (filterRisco)   list = list.filter(p => p.risco === filterRisco)
    if (filterUnidade) list = list.filter(p => p.unidade === filterUnidade)

    const ro = { 'Provável': 0, 'Possível': 1, 'Remoto': 2 }
    list.sort((a, b) => {
      let va: any, vb: any
      if (sortKey === 'reclamante')      { va = a.reclamante;       vb = b.reclamante }
      else if (sortKey === 'dataDistribuicao') { va = a.dataDistribuicao; vb = b.dataDistribuicao }
      else if (sortKey === 'risco')      { va = ro[a.risco];        vb = ro[b.risco] }
      else if (sortKey === 'fase')       { va = a.fase;             vb = b.fase }
      else                               { va = a.valorContingencia || 0; vb = b.valorContingencia || 0 }
      if (va < vb) return sortAsc ? -1 : 1
      if (va > vb) return sortAsc ? 1  : -1
      return 0
    })
    return list
  }, [search, filterFase, filterStatus, filterRisco, filterUnidade, sortKey, sortAsc])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
  }

  const activeFilters = [filterFase, filterStatus, filterRisco, filterUnidade].filter(Boolean).length

  const ColH = ({ k, label }: { k: SortKey; label: string }) => (
    <button onClick={() => handleSort(k)}
      className="flex items-center gap-1.5 text-xs uppercase tracking-widest"
      style={{ color: sortKey === k ? T.copper : T.t3, letterSpacing: '0.1em' }}>
      {label} <ArrowUpDown size={10} style={{ color: sortKey === k ? T.copper : T.b2 }} />
    </button>
  )

  const totalContingencia = filtrados.reduce((s, p) => s + (p.valorContingencia || 0), 0)

  return (
    <div>
      <Header title="Processos" subtitle={`${filtrados.length} processo${filtrados.length !== 1 ? 's' : ''}`} />

      <div className="p-8 space-y-4">
        {/* Toolbar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.t3 }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Reclamante, nº CNJ, vara, cargo..."
              className="w-full pl-9 pr-9 py-2.5 text-xs rounded-sm outline-none"
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
            className="flex items-center gap-2 px-4 py-2.5 text-xs rounded-sm"
            style={{
              background: showFilters || activeFilters > 0 ? '#1E1208' : T.s1,
              border: `1px solid ${showFilters || activeFilters > 0 ? T.copper + '55' : T.b1}`,
              color: showFilters || activeFilters > 0 ? T.copper : T.t2,
            }}>
            <SlidersHorizontal size={13} />
            Filtros
            {activeFilters > 0 && (
              <span style={{ background: T.copper, color: '#0C0C0C', fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 2 }}>
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        {/* Painel de filtros */}
        {showFilters && (
          <div className="flex flex-wrap gap-5 px-5 py-4 rounded-sm"
            style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
            {[
              { label: 'Fase',    value: filterFase,    set: setFilterFase,    opts: FASES },
              { label: 'Status',  value: filterStatus,  set: setFilterStatus,  opts: STATUS },
              { label: 'Risco',   value: filterRisco,   set: setFilterRisco,   opts: RISCOS },
              { label: 'Unidade', value: filterUnidade, set: setFilterUnidade, opts: ['ZS','ZR','ZT'] },
            ].map(f => (
              <div key={f.label}>
                <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: T.t3, letterSpacing: '0.1em' }}>{f.label}</p>
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
                <button onClick={() => { setFilterFase(''); setFilterStatus(''); setFilterRisco(''); setFilterUnidade('') }}
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

        {/* Tabela */}
        <div style={{ border: `1px solid ${T.b1}` }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.b1}`, background: T.s2 }}>
                  <th className="px-5 py-3 text-left"><ColH k="reclamante" label="Reclamante" /></th>
                  <th className="px-5 py-3 text-left hidden md:table-cell">
                    <span className="text-xs uppercase tracking-widest" style={{ color: T.t3, letterSpacing: '0.1em' }}>Cargo / Unidade</span>
                  </th>
                  <th className="px-5 py-3 text-left hidden md:table-cell">
                    <span className="text-xs uppercase tracking-widest" style={{ color: T.t3, letterSpacing: '0.1em' }}>Comarca</span>
                  </th>
                  <th className="px-5 py-3 text-left"><ColH k="fase" label="Fase" /></th>
                  <th className="px-5 py-3 text-left"><ColH k="risco" label="Risco" /></th>
                  <th className="px-5 py-3 text-left hidden lg:table-cell"><ColH k="contingencia" label="Contingência" /></th>
                  <th className="px-5 py-3 text-left hidden lg:table-cell">
                    <span className="text-xs uppercase tracking-widest" style={{ color: T.t3, letterSpacing: '0.1em' }}>Próximo Evento</span>
                  </th>
                  <th className="px-5 py-3 text-left">
                    <span className="text-xs uppercase tracking-widest" style={{ color: T.t3, letterSpacing: '0.1em' }}>Status</span>
                  </th>
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
                      <p className="text-xs mt-0.5 font-mono" style={{ color: T.t4, fontSize: 10 }}>{p.numero}</p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <p className="text-xs" style={{ color: T.t2 }}>{p.cargo || '—'}</p>
                      <p className="text-xs mt-0.5" style={{ color: T.t3 }}>{p.unidade || '—'} · {p.setor || ''}</p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <p className="text-xs" style={{ color: T.t2 }}>{p.comarca}</p>
                      <p className="text-xs mt-0.5" style={{ color: T.t3 }}>{p.tribunal}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium" style={{ color: faseColor(p.fase) }}>{p.fase}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold" style={{ color: riscoColor(p.risco) }}>{p.risco}</span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-xs font-semibold" style={{ color: T.copper }}>
                        {p.valorContingencia ? formatCurrency(p.valorContingencia) : '—'}
                      </span>
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
                        color: p.status === 'Ativo' ? T.t1 : p.status === 'Encerrado' ? T.green : T.t3
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
                <p className="text-xs uppercase tracking-widest" style={{ color: T.t4, letterSpacing: '0.12em' }}>Nenhum processo encontrado</p>
              </div>
            )}
          </div>
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: `1px solid ${T.b1}`, background: T.s2 }}>
            <p className="text-xs" style={{ color: T.t3 }}>{filtrados.length} de {processos.length} processos</p>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: T.t3 }}>Contingência filtrada:</span>
              <span className="text-xs font-semibold" style={{ color: T.copper }}>{formatCurrency(totalContingencia)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
