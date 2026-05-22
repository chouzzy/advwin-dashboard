import { useNavigate } from 'react-router-dom'
import { processosMock, formatCurrency, formatDate, riscoColor, faseColor } from '../data/mockData'
import Header from '../components/Layout/Header'
import { T } from '../theme'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, CartesianGrid,
} from 'recharts'
import { ArrowUpRight, ChevronRight } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 text-xs" style={{ background: T.s2, border: `1px solid ${T.b2}`, borderRadius: 3 }}>
      {label && <p className="mb-1" style={{ color: T.t3 }}>{label}</p>}
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: T.t1 }}>
          {p.name}: {typeof p.value === 'number' && p.value > 999 ? formatCurrency(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

function KpiCard({ label, value, sub, delta }: { label: string; value: string | number; sub?: string; delta?: string }) {
  return (
    <div className="p-6" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
      <p className="text-xs tracking-widest uppercase mb-5" style={{ color: T.t3, letterSpacing: '0.12em' }}>{label}</p>
      <p className="text-4xl font-light" style={{ color: T.t1, letterSpacing: '-1px' }}>{value}</p>
      {sub && <p className="text-xs mt-2" style={{ color: T.t3 }}>{sub}</p>}
      {delta && (
        <div className="flex items-center gap-1 mt-3">
          <ArrowUpRight size={11} style={{ color: T.copper }} />
          <p className="text-xs" style={{ color: T.copper }}>{delta}</p>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()

  const ativos      = processosMock.filter(p => p.status === 'Ativo')
  const encerrados  = processosMock.filter(p => p.status === 'Encerrado')
  const audiencias  = processosMock.flatMap(p => p.audiencias).filter(a => a.status === 'Agendada')

  // Próximos eventos
  const proximosEventos = processosMock
    .filter(p => p.proximoEventoData)
    .sort((a, b) => a.proximoEventoData! > b.proximoEventoData! ? 1 : -1)
    .slice(0, 6)

  // Financeiro — soma de valorContingencia
  const totalCausa       = processosMock.reduce((s, p) => s + (p.valorCausa || 0), 0)
  const totalContingencia = processosMock.reduce((s, p) => s + (p.valorContingencia || 0), 0)

  // Verbas calculadas total
  const totalVerbaCalc = processosMock.flatMap(p => p.verbas).reduce((s, v) => s + (v.valorCalculado || 0), 0)

  // Distribuições
  const faseData = ['Inicial','Recursal','Liquidação','Execução','Embargos','Pagamento de Execução','Pagamento de Acordo','Arquivado']
    .map(f => ({ name: f, value: processosMock.filter(p => p.fase === f).length }))
    .filter(d => d.value > 0)

  const riscoBarData = [
    { name: 'Provável', value: processosMock.filter(p => p.risco === 'Provável').length },
    { name: 'Possível', value: processosMock.filter(p => p.risco === 'Possível').length },
    { name: 'Remoto',   value: processosMock.filter(p => p.risco === 'Remoto').length },
  ]

  const evolucao = [
    { m: 'Jan', causa: 620, contingencia: 250 },
    { m: 'Fev', causa: 650, contingencia: 268 },
    { m: 'Mar', causa: 720, contingencia: 290 },
    { m: 'Abr', causa: 890, contingencia: 380 },
    { m: 'Mai', causa: 1060, contingencia: 481 },
  ]

  return (
    <div>
      <Header title="Dashboard" subtitle="Visão geral do contencioso" />

      <div className="p-8 space-y-5">

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard label="Processos Ativos"  value={ativos.length}     sub={`de ${processosMock.length} total`} />
          <KpiCard label="Audiências Agendadas" value={audiencias.length} sub="próximos eventos" />
          <KpiCard label="Encerrados"        value={encerrados.length} sub="concluídos" />
          <KpiCard label="Próximos Eventos"  value={proximosEventos.length} sub="agendados" delta="monitorar" />
        </div>

        {/* Financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-6" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: T.t3, letterSpacing: '0.12em' }}>Total de Causas</p>
            <p className="text-3xl font-light" style={{ color: T.t1, letterSpacing: '-0.5px' }}>{formatCurrency(totalCausa)}</p>
            <p className="text-xs mt-2" style={{ color: T.t3 }}>soma dos valores de causa</p>
          </div>
          <div className="p-6" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: T.t3, letterSpacing: '0.12em' }}>Total de Contingência</p>
            <p className="text-3xl font-light" style={{ color: T.copper, letterSpacing: '-0.5px' }}>{formatCurrency(totalContingencia)}</p>
            <p className="text-xs mt-2" style={{ color: T.t3 }}>
              {totalCausa > 0 ? `${((totalContingencia / totalCausa) * 100).toFixed(0)}% das causas` : '—'} · verbas calculadas: {formatCurrency(totalVerbaCalc)}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Fase */}
          <div className="p-6" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
            <p className="text-xs tracking-widest uppercase mb-5" style={{ color: T.t3, letterSpacing: '0.12em' }}>Por Fase</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={faseData} cx="50%" cy="50%" innerRadius={48} outerRadius={72}
                  paddingAngle={2} dataKey="value" stroke="none">
                  {faseData.map(d => <Cell key={d.name} fill={faseColor(d.name)} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-4">
              {faseData.map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: faseColor(d.name) }} />
                    <span className="text-xs" style={{ color: T.t2 }}>{d.name}</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: T.t1 }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risco */}
          <div className="p-6" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
            <p className="text-xs tracking-widest uppercase mb-5" style={{ color: T.t3, letterSpacing: '0.12em' }}>Por Risco</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={riscoBarData} barSize={32}>
                <CartesianGrid vertical={false} stroke={T.b1} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: T.t3 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: T.t3 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Processos" radius={[3, 3, 0, 0]}>
                  {riscoBarData.map(d => <Cell key={d.name} fill={riscoColor(d.name) + '33'} stroke={riscoColor(d.name)} strokeWidth={1} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-3">
              {riscoBarData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: riscoColor(d.name) }} />
                  <span className="text-xs" style={{ color: T.t2 }}>
                    {d.name[0]}: <strong style={{ color: T.t1 }}>{d.value}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Evolução */}
          <div className="p-6" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
            <p className="text-xs tracking-widest uppercase mb-5" style={{ color: T.t3, letterSpacing: '0.12em' }}>Evolução (R$ mil)</p>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={evolucao}>
                <defs>
                  <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={T.copper} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={T.copper} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={T.red} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={T.red} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={T.b1} />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: T.t3 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: T.t3 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="causa"        name="Causa"        stroke={T.copper} strokeWidth={2} fill="url(#gC)" />
                <Area type="monotone" dataKey="contingencia" name="Contingência" stroke={T.red}    strokeWidth={2} fill="url(#gR)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Próximos eventos */}
          <div style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${T.b1}` }}>
              <p className="text-xs tracking-widest uppercase" style={{ color: T.t3, letterSpacing: '0.12em' }}>Próximos Eventos</p>
              <button onClick={() => navigate('/processos')}
                className="flex items-center gap-1 text-xs"
                style={{ color: T.t3 }}
                onMouseEnter={e => (e.currentTarget.style.color = T.copper)}
                onMouseLeave={e => (e.currentTarget.style.color = T.t3)}>
                ver todos <ChevronRight size={11} />
              </button>
            </div>
            {proximosEventos.map((p, i) => {
              const dias = Math.ceil((new Date(p.proximoEventoData!).getTime() - new Date().getTime()) / 86400000)
              const urgente = dias <= 14
              return (
                <div key={p.id} onClick={() => navigate(`/processos/${p.id}`)}
                  className="flex items-center justify-between px-6 py-3.5 cursor-pointer"
                  style={{ borderBottom: i < proximosEventos.length - 1 ? `1px solid ${T.b1}` : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = T.s2)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-xs font-medium truncate" style={{ color: T.t1 }}>{p.proximoEvento}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: T.t3 }}>{p.reclamante}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium" style={{ color: T.t2 }}>{formatDate(p.proximoEventoData!)}</p>
                    <p className="text-xs mt-0.5 font-semibold" style={{ color: urgente ? T.red : T.t3 }}>
                      {dias <= 0 ? 'hoje' : `${dias}d`}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Maior contingência */}
          <div style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${T.b1}` }}>
              <p className="text-xs tracking-widest uppercase" style={{ color: T.t3, letterSpacing: '0.12em' }}>Maior Contingência</p>
              <button onClick={() => navigate('/verbas')}
                className="flex items-center gap-1 text-xs"
                style={{ color: T.t3 }}
                onMouseEnter={e => (e.currentTarget.style.color = T.copper)}
                onMouseLeave={e => (e.currentTarget.style.color = T.t3)}>
                verbas <ChevronRight size={11} />
              </button>
            </div>
            {processosMock
              .filter(p => p.status === 'Ativo' && p.valorContingencia)
              .sort((a, b) => (b.valorContingencia || 0) - (a.valorContingencia || 0))
              .slice(0, 6)
              .map((p, i, arr) => (
                <div key={p.id} onClick={() => navigate(`/processos/${p.id}`)}
                  className="flex items-center justify-between px-6 py-3.5 cursor-pointer"
                  style={{ borderBottom: i < arr.length - 1 ? `1px solid ${T.b1}` : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = T.s2)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-xs font-medium truncate" style={{ color: T.t1 }}>{p.reclamante}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs" style={{ color: T.t3 }}>{p.fase}</span>
                      <span className="text-xs font-medium" style={{ color: riscoColor(p.risco) }}>· {p.risco}</span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold flex-shrink-0" style={{ color: T.copper }}>
                    {formatCurrency(p.valorContingencia!)}
                  </p>
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  )
}
