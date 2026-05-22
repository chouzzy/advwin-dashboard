import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { processosMock, formatCurrency } from '../data/mockData'
import Header from '../components/Layout/Header'
import { T } from '../theme'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, CartesianGrid, PieChart, Pie
} from 'recharts'
import { ChevronRight } from 'lucide-react'
import type { TipoVerba } from '../types'

const TIPO_COLORS: Record<TipoVerba, string> = {
  'verba salarial':      T.copper,
  'verba indenizatória': '#9080C8',
  'Encargos':            '#8090B0',
  'Honorários':          '#C07070',
}

const TT = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 text-xs" style={{ background: T.s2, border: `1px solid ${T.b2}`, borderRadius: 3 }}>
      {label && <p className="mb-1" style={{ color: T.t3 }}>{label}</p>}
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: T.t1 }}>
          {p.name}: {typeof p.value === 'number' ? formatCurrency(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

type FilterTipo = TipoVerba | ''

export default function Verbas() {
  const navigate = useNavigate()
  const [filterTipo,    setFilterTipo]    = useState<FilterTipo>('')
  const [filterRisco,   setFilterRisco]   = useState('')
  const [filterUnidade, setFilterUnidade] = useState('')
  const [coluna,        setColuna]        = useState<'valorCalculado' | 'valorHomologado' | 'valorPago'>('valorCalculado')

  // Todas as verbas de todos os processos (flat)
  const todasVerbas = useMemo(() => {
    return processosMock.flatMap(p =>
      p.verbas
        .filter(v => !filterTipo || v.descricao === filterTipo)
        .filter(() => !filterRisco || p.risco === filterRisco)
        .filter(() => !filterUnidade || p.unidade === filterUnidade)
        .map(v => ({ ...v, processo: p }))
    )
  }, [filterTipo, filterRisco, filterUnidade])

  // Totais globais
  const totalCalculado  = todasVerbas.reduce((s, v) => s + (v.valorCalculado  || 0), 0)
  const totalHomologado = todasVerbas.reduce((s, v) => s + (v.valorHomologado || 0), 0)
  const totalPago       = todasVerbas.reduce((s, v) => s + (v.valorPago       || 0), 0)

  // Agrupamento por tipo de verba (nome)
  const porTipoVerba = useMemo(() => {
    const map: Record<string, { calc: number; hom: number; pago: number }> = {}
    todasVerbas.forEach(v => {
      if (!map[v.tipo]) map[v.tipo] = { calc: 0, hom: 0, pago: 0 }
      map[v.tipo].calc += v.valorCalculado  || 0
      map[v.tipo].hom  += v.valorHomologado || 0
      map[v.tipo].pago += v.valorPago       || 0
    })
    return Object.entries(map)
      .sort((a, b) => b[1].calc - a[1].calc)
      .map(([tipo, vals]) => ({ tipo, ...vals }))
  }, [todasVerbas])

  // Agrupamento por descrição (categoria)
  const porDescricao = useMemo(() => {
    const map: Record<string, number> = {}
    todasVerbas.forEach(v => {
      map[v.descricao] = (map[v.descricao] || 0) + (v[coluna] || 0)
    })
    return Object.entries(map).filter(([, v]) => v > 0).map(([desc, valor]) => ({ desc, valor }))
  }, [todasVerbas, coluna])

  // Verbas por processo (totais)
  const porProcesso = useMemo(() => {
    return processosMock
      .filter(p => !filterRisco || p.risco === filterRisco)
      .filter(p => !filterUnidade || p.unidade === filterUnidade)
      .map(p => ({
        processo: p,
        calc: p.verbas.filter(v => !filterTipo || v.descricao === filterTipo).reduce((s, v) => s + (v.valorCalculado || 0), 0),
        hom:  p.verbas.filter(v => !filterTipo || v.descricao === filterTipo).reduce((s, v) => s + (v.valorHomologado || 0), 0),
        pago: p.verbas.filter(v => !filterTipo || v.descricao === filterTipo).reduce((s, v) => s + (v.valorPago || 0), 0),
      }))
      .filter(x => x.calc > 0)
      .sort((a, b) => b.calc - a.calc)
  }, [filterTipo, filterRisco, filterUnidade])

  const tipos: TipoVerba[] = ['verba salarial', 'verba indenizatória', 'Encargos', 'Honorários']

  return (
    <div>
      <Header title="Verbas" subtitle="Análise financeira por tipo e processo" />

      <div className="p-8 space-y-5">

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 px-5 py-4" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
          {[
            { label: 'Tipo de Verba', value: filterTipo, set: setFilterTipo,
              opts: tipos.map(t => ({ v: t, l: t })) },
            { label: 'Risco', value: filterRisco, set: setFilterRisco,
              opts: ['Provável', 'Possível', 'Remoto'].map(r => ({ v: r, l: r })) },
            { label: 'Unidade', value: filterUnidade, set: setFilterUnidade,
              opts: ['ZS', 'ZR', 'ZT'].map(u => ({ v: u, l: u })) },
            { label: 'Exibir coluna', value: coluna, set: setColuna,
              opts: [
                { v: 'valorCalculado', l: 'Calculado' },
                { v: 'valorHomologado', l: 'Homologado' },
                { v: 'valorPago', l: 'Pago' },
              ]},
          ].map(f => (
            <div key={f.label}>
              <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: T.t3, letterSpacing: '0.1em' }}>{f.label}</p>
              <select value={f.value} onChange={e => (f.set as any)(e.target.value)}
                className="text-xs px-3 py-2 outline-none rounded-sm"
                style={{ background: T.s2, border: `1px solid ${T.b1}`, color: T.t2 }}>
                <option value="">Todos</option>
                {f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-px" style={{ background: T.b1 }}>
          {[
            { l: 'Total Calculado',  v: totalCalculado,  note: `${todasVerbas.length} verbas`, c: T.t1 },
            { l: 'Total Homologado', v: totalHomologado, note: totalCalculado ? `${((totalHomologado / totalCalculado) * 100).toFixed(0)}% do calculado` : '—', c: T.copper },
            { l: 'Total Pago',       v: totalPago,       note: totalHomologado ? `${((totalPago / totalHomologado) * 100).toFixed(0)}% do homologado` : '—', c: T.green },
          ].map(kpi => (
            <div key={kpi.l} className="p-6" style={{ background: T.s1 }}>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: T.t3, letterSpacing: '0.12em' }}>{kpi.l}</p>
              <p className="text-2xl font-light" style={{ color: kpi.c }}>{formatCurrency(kpi.v)}</p>
              <p className="text-xs mt-2" style={{ color: T.t3 }}>{kpi.note}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Pizza por descrição */}
          <div className="p-6" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
            <p className="text-xs uppercase tracking-widest mb-5" style={{ color: T.t3, letterSpacing: '0.12em' }}>Por Categoria</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={porDescricao} cx="50%" cy="50%" innerRadius={48} outerRadius={72}
                  paddingAngle={2} dataKey="valor" nameKey="desc" stroke="none">
                  {porDescricao.map(d => (
                    <Cell key={d.desc} fill={TIPO_COLORS[d.desc as TipoVerba] || T.t3} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => [formatCurrency(Number(v))]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {porDescricao.map(d => (
                <div key={d.desc} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: TIPO_COLORS[d.desc as TipoVerba] || T.t3 }} />
                    <span className="text-xs" style={{ color: T.t2 }}>{d.desc}</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: T.t1 }}>{formatCurrency(d.valor)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Barras por verba */}
          <div className="lg:col-span-2 p-6" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
            <p className="text-xs uppercase tracking-widest mb-5" style={{ color: T.t3, letterSpacing: '0.12em' }}>
              Ranking de Verbas — {coluna === 'valorCalculado' ? 'Calculado' : coluna === 'valorHomologado' ? 'Homologado' : 'Pago'}
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={porTipoVerba.slice(0, 8)} layout="vertical" barSize={14}>
                <XAxis type="number" tick={{ fontSize: 10, fill: T.t3 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="tipo" tick={{ fontSize: 10, fill: T.t2 }}
                  axisLine={false} tickLine={false} width={160} />
                <CartesianGrid horizontal={false} stroke={T.b1} />
                <Tooltip content={<TT />} />
                <Bar dataKey={coluna === 'valorCalculado' ? 'calc' : coluna === 'valorHomologado' ? 'hom' : 'pago'}
                  name={coluna === 'valorCalculado' ? 'Calculado' : coluna === 'valorHomologado' ? 'Homologado' : 'Pago'}
                  fill={T.copper} fillOpacity={0.8} radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabela flat de todas as verbas */}
        <div style={{ border: `1px solid ${T.b1}` }}>
          <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.b1}`, background: T.s2 }}>
            <p className="text-xs uppercase tracking-widest" style={{ color: T.t3, letterSpacing: '0.12em' }}>
              Detalhamento — {todasVerbas.length} verbas
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.b1}`, background: T.s2 }}>
                  {['Processo / Reclamante', 'Verba', 'Descrição', 'Calculado', 'Homologado', 'Pago', ''].map(h => (
                    <th key={h} className="px-5 py-3 text-left">
                      <span className="text-xs uppercase tracking-widest" style={{ color: T.t3, letterSpacing: '0.08em' }}>{h}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {todasVerbas.map((v, i) => (
                  <tr key={i}
                    onClick={() => navigate(`/processos/${v.processo.id}`)}
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: i < todasVerbas.length - 1 ? `1px solid ${T.b1}` : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = T.s1)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-semibold" style={{ color: T.t1 }}>{v.processo.reclamante}</p>
                      <p className="text-xs mt-0.5 font-mono" style={{ color: T.t4, fontSize: 10 }}>{v.processo.numero}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: TIPO_COLORS[v.descricao] || T.t3 }} />
                        <p className="text-xs" style={{ color: T.t2 }}>{v.tipo}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs" style={{ color: T.t3 }}>{v.descricao}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-medium" style={{ color: T.t2 }}>{v.valorCalculado ? formatCurrency(v.valorCalculado) : '—'}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-medium" style={{ color: v.valorHomologado ? T.copper : T.t4 }}>
                        {v.valorHomologado ? formatCurrency(v.valorHomologado) : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-semibold" style={{ color: v.valorPago ? T.green : T.t4 }}>
                        {v.valorPago ? formatCurrency(v.valorPago) : '—'}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <ChevronRight size={13} style={{ color: T.b2 }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totais do rodapé */}
          <div className="px-5 py-3 grid grid-cols-3 gap-4" style={{ borderTop: `1px solid ${T.b1}`, background: T.s2 }}>
            <div><p className="text-xs" style={{ color: T.t3 }}>Calculado</p><p className="text-xs font-semibold mt-0.5" style={{ color: T.t1 }}>{formatCurrency(totalCalculado)}</p></div>
            <div><p className="text-xs" style={{ color: T.t3 }}>Homologado</p><p className="text-xs font-semibold mt-0.5" style={{ color: T.copper }}>{formatCurrency(totalHomologado)}</p></div>
            <div><p className="text-xs" style={{ color: T.t3 }}>Pago</p><p className="text-xs font-semibold mt-0.5" style={{ color: T.green }}>{formatCurrency(totalPago)}</p></div>
          </div>
        </div>

        {/* Tabela por processo */}
        <div style={{ border: `1px solid ${T.b1}` }}>
          <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.b1}`, background: T.s2 }}>
            <p className="text-xs uppercase tracking-widest" style={{ color: T.t3, letterSpacing: '0.12em' }}>Por Processo</p>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.b1}`, background: T.s2 }}>
                {['Reclamante', 'Unidade', 'Risco', 'Calculado', 'Homologado', 'Pago', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-left">
                    <span className="text-xs uppercase tracking-widest" style={{ color: T.t3, letterSpacing: '0.08em' }}>{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {porProcesso.map((x, i) => (
                <tr key={x.processo.id}
                  onClick={() => navigate(`/processos/${x.processo.id}`)}
                  className="cursor-pointer transition-colors"
                  style={{ borderBottom: i < porProcesso.length - 1 ? `1px solid ${T.b1}` : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = T.s1)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td className="px-5 py-3.5">
                    <p className="text-xs font-semibold" style={{ color: T.t1 }}>{x.processo.reclamante}</p>
                    <p className="text-xs mt-0.5" style={{ color: T.t3 }}>{x.processo.fase}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-medium" style={{ color: T.t2 }}>{x.processo.unidade || '—'}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-semibold" style={{ color: { 'Provável': T.red, 'Possível': T.amber, 'Remoto': T.green }[x.processo.risco] }}>
                      {x.processo.risco}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs" style={{ color: T.t2 }}>{x.calc ? formatCurrency(x.calc) : '—'}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-medium" style={{ color: x.hom ? T.copper : T.t4 }}>{x.hom ? formatCurrency(x.hom) : '—'}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-semibold" style={{ color: x.pago ? T.green : T.t4 }}>{x.pago ? formatCurrency(x.pago) : '—'}</span>
                  </td>
                  <td className="px-3 py-3.5">
                    <ChevronRight size={13} style={{ color: T.b2 }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
