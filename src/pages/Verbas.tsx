import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { processosMock, formatCurrency } from '../data/mockData'
import Header from '../components/Layout/Header'
import { T } from '../theme'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid, AreaChart, Area, Line
} from 'recharts'
import { ChevronRight } from 'lucide-react'

const riscoText: Record<string, string> = { 'Provável': T.red, 'Possível': T.amber, 'Remoto': T.green }
const riscoBg:   Record<string, string> = { 'Provável': T.redBg, 'Possível': T.amberBg, 'Remoto': T.greenBg }

const TT = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 text-xs" style={{ background: T.s2, border: `1px solid ${T.b2}`, borderRadius: 3 }}>
      {label && <p className="mb-1" style={{ color: T.t3 }}>{label}</p>}
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: T.t1 }}>
          {p.name}: {typeof p.value === 'number' && p.value > 100 ? formatCurrency(p.value) : `${p.value}k`}
        </p>
      ))}
    </div>
  )
}

export default function Verbas() {
  const navigate = useNavigate()
  const [filterRisco, setFilterRisco] = useState('')

  const totalPedido    = processosMock.reduce((s, p) => s + p.verbas.pedidoReclamante, 0)
  const totalRisco     = processosMock.reduce((s, p) => s + p.verbas.riscoSCC, 0)
  const totalProvisao  = processosMock.reduce((s, p) => s + p.verbas.provisaoRecomendada, 0)
  const totalAcordos   = processosMock.filter(p => p.verbas.valorAcordo).reduce((s, p) => s + (p.verbas.valorAcordo || 0), 0)
  const totalCondenac  = processosMock.filter(p => p.verbas.valorCondenacao).reduce((s, p) => s + (p.verbas.valorCondenacao || 0), 0)
  const totalDepositos = processosMock.filter(p => p.verbas.depositoRecursal).reduce((s, p) => s + (p.verbas.depositoRecursal || 0), 0)

  const porRisco = [
    { name: 'Provável', value: processosMock.filter(p => p.risco === 'Provável').reduce((s, p) => s + p.verbas.riscoSCC, 0) },
    { name: 'Possível', value: processosMock.filter(p => p.risco === 'Possível').reduce((s, p) => s + p.verbas.riscoSCC, 0) },
    { name: 'Remoto',   value: processosMock.filter(p => p.risco === 'Remoto').reduce((s, p)   => s + p.verbas.riscoSCC, 0) },
  ]

  const rubricasData = Object.entries(
    processosMock.flatMap(p => p.verbas.rubricas)
      .reduce((acc, r) => { acc[r.descricao] = (acc[r.descricao] || 0) + r.valor; return acc }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]).slice(0, 7)
    .map(([d, v]) => ({ descricao: d.length > 25 ? d.slice(0, 25) + '…' : d, valor: v }))

  const evolucao = [
    { m: 'Jan', pedidos: 620, risco: 250, acordos: 28 },
    { m: 'Fev', pedidos: 650, risco: 268, acordos: 28 },
    { m: 'Mar', pedidos: 720, risco: 290, acordos: 28 },
    { m: 'Abr', pedidos: 890, risco: 380, acordos: 56 },
    { m: 'Mai', pedidos: 1060, risco: 481, acordos: 56 },
  ]

  const processosFiltrados = filterRisco ? processosMock.filter(p => p.risco === filterRisco) : processosMock

  const kpis = [
    { l: 'Total em Pedidos',  v: totalPedido,              note: `${processosMock.length} processos`, c: T.t1 },
    { l: 'Risco Estimado',    v: totalRisco,               note: `${((totalRisco / totalPedido) * 100).toFixed(0)}% dos pedidos`, c: T.copper },
    { l: 'Provisão',          v: totalProvisao,            note: 'estimativa contábil', c: T.amber },
    { l: 'Desembolsado',      v: totalAcordos + totalCondenac, note: 'acordos + condenações', c: T.green },
  ]

  return (
    <div>
      <Header title="Verbas" subtitle="Exposição financeira e provisões" />

      <div className="p-8 space-y-5">

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpis.map(kpi => (
            <div key={kpi.l} className="p-6" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: T.t3, letterSpacing: '0.12em' }}>{kpi.l}</p>
              <p className="text-2xl font-light" style={{ color: kpi.c, letterSpacing: '-0.5px' }}>{formatCurrency(kpi.v)}</p>
              <p className="text-xs mt-2" style={{ color: T.t3 }}>{kpi.note}</p>
            </div>
          ))}
        </div>

        {/* Secondary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { l: 'Acordos Firmados',    v: totalAcordos,   n: processosMock.filter(p => p.verbas.valorAcordo).length,    c: T.green },
            { l: 'Condenações',         v: totalCondenac,  n: processosMock.filter(p => p.verbas.valorCondenacao).length, c: T.red },
            { l: 'Depósitos Recursais', v: totalDepositos, n: processosMock.filter(p => p.verbas.depositoRecursal).length,c: T.t2 },
          ].map(item => (
            <div key={item.l} className="px-6 py-5 flex items-center justify-between"
              style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
              <div>
                <p className="text-xs tracking-widest uppercase mb-2" style={{ color: T.t3, letterSpacing: '0.1em' }}>{item.l}</p>
                <p className="text-xl font-light" style={{ color: item.c }}>{formatCurrency(item.v)}</p>
              </div>
              <p className="text-5xl font-light" style={{ color: T.b2 }}>{item.n}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="p-6" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
            <p className="text-xs tracking-widest uppercase mb-5" style={{ color: T.t3, letterSpacing: '0.12em' }}>Risco por Nível</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={porRisco} cx="50%" cy="50%" innerRadius={48} outerRadius={72}
                  paddingAngle={2} dataKey="value" stroke="none">
                  {porRisco.map(d => <Cell key={d.name} fill={riscoBg[d.name]} stroke={riscoText[d.name]} strokeWidth={1.5} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [formatCurrency(Number(v))]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {porRisco.map(r => (
                <div key={r.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: riscoText[r.name] }} />
                    <span className="text-xs font-medium" style={{ color: T.t2 }}>{r.name}</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: riscoText[r.name] }}>{formatCurrency(r.value)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 p-6" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
            <p className="text-xs tracking-widest uppercase mb-5" style={{ color: T.t3, letterSpacing: '0.12em' }}>Evolução (R$ mil)</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={evolucao}>
                <defs>
                  <linearGradient id="gP2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.copper} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={T.copper} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gR2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.red} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={T.red} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={T.b1} />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: T.t3 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: T.t3 }} axisLine={false} tickLine={false} />
                <Tooltip content={<TT />} />
                <Area type="monotone" dataKey="pedidos" name="Pedidos" stroke={T.copper} strokeWidth={2} fill="url(#gP2)" />
                <Area type="monotone" dataKey="risco"   name="Risco"   stroke={T.red}    strokeWidth={2} fill="url(#gR2)" />
                <Line type="monotone" dataKey="acordos" name="Acordos" stroke={T.green} strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rubricas */}
        <div className="p-6" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
          <p className="text-xs tracking-widest uppercase mb-5" style={{ color: T.t3, letterSpacing: '0.12em' }}>
            Pedidos por Rubrica Trabalhista
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={rubricasData} layout="vertical" barSize={16}>
              <XAxis type="number" tick={{ fontSize: 10, fill: T.t3 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="descricao" tick={{ fontSize: 11, fill: T.t2 }}
                axisLine={false} tickLine={false} width={165} />
              <Tooltip formatter={(v: any) => [formatCurrency(Number(v))]} />
              <Bar dataKey="valor" fill={T.copper} fillOpacity={0.75} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabela */}
        <div style={{ border: `1px solid ${T.b1}` }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${T.b1}`, background: T.s2 }}>
            <p className="text-xs tracking-widest uppercase" style={{ color: T.t3, letterSpacing: '0.12em' }}>Exposição por Processo</p>
            <select value={filterRisco} onChange={e => setFilterRisco(e.target.value)}
              className="text-xs px-3 py-1.5 outline-none rounded-sm"
              style={{ background: T.s3, border: `1px solid ${T.b1}`, color: T.t2 }}>
              <option value="">Todos os riscos</option>
              {['Provável', 'Possível', 'Remoto'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.b1}`, background: T.s2 }}>
                {['Reclamante', 'Fase', 'Risco', 'Pedido', 'Risco SCC', 'Provisão', 'Desfecho'].map(h => (
                  <th key={h} className="px-5 py-3 text-left">
                    <span className="text-xs tracking-widest uppercase" style={{ color: T.t3, letterSpacing: '0.1em' }}>{h}</span>
                  </th>
                ))}
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {processosFiltrados.sort((a, b) => b.verbas.riscoSCC - a.verbas.riscoSCC).map((p, i, arr) => {
                const desfecho = p.verbas.valorAcordo || p.verbas.valorCondenacao
                return (
                  <tr key={p.id} onClick={() => navigate(`/processos/${p.id}`)}
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: i < arr.length - 1 ? `1px solid ${T.b1}` : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = T.s1)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-semibold" style={{ color: T.t1 }}>{p.reclamante}</p>
                      <p className="text-xs mt-0.5" style={{ color: T.t3 }}>{p.comarca}</p>
                    </td>
                    <td className="px-5 py-3.5"><span className="text-xs" style={{ color: T.t2 }}>{p.fase}</span></td>
                    <td className="px-5 py-3.5"><span className="text-xs font-semibold" style={{ color: riscoText[p.risco] }}>{p.risco}</span></td>
                    <td className="px-5 py-3.5"><span className="text-xs" style={{ color: T.t2 }}>{formatCurrency(p.verbas.pedidoReclamante)}</span></td>
                    <td className="px-5 py-3.5"><span className="text-xs font-semibold" style={{ color: T.copper }}>{formatCurrency(p.verbas.riscoSCC)}</span></td>
                    <td className="px-5 py-3.5"><span className="text-xs" style={{ color: T.amber }}>{formatCurrency(p.verbas.provisaoRecomendada)}</span></td>
                    <td className="px-5 py-3.5">
                      {desfecho
                        ? <span className="text-xs font-medium" style={{ color: T.green }}>{formatCurrency(desfecho)}</span>
                        : <span style={{ color: T.t4 }}>—</span>}
                    </td>
                    <td className="px-3 py-3.5"><ChevronRight size={13} style={{ color: T.b2 }} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="px-5 py-3 grid grid-cols-4 gap-4" style={{ borderTop: `1px solid ${T.b1}`, background: T.s2 }}>
            {[
              { l: 'Pedidos',     v: processosFiltrados.reduce((s, p) => s + p.verbas.pedidoReclamante, 0), c: T.t2 },
              { l: 'Risco',       v: processosFiltrados.reduce((s, p) => s + p.verbas.riscoSCC, 0),         c: T.copper },
              { l: 'Provisão',    v: processosFiltrados.reduce((s, p) => s + p.verbas.provisaoRecomendada, 0), c: T.amber },
              { l: 'Desembolsado', v: processosFiltrados.filter(p => p.verbas.valorAcordo || p.verbas.valorCondenacao)
                .reduce((s, p) => s + (p.verbas.valorAcordo || p.verbas.valorCondenacao || 0), 0), c: T.green },
            ].map(item => (
              <div key={item.l}>
                <p className="text-xs" style={{ color: T.t3 }}>{item.l}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: item.c }}>{formatCurrency(item.v)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
