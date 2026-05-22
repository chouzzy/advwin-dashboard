import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { processosMock, formatCurrency, formatDate } from '../data/mockData'
import Header from '../components/Layout/Header'
import { T } from '../theme'
import { ArrowLeft } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const riscoText: Record<string, string> = { 'Provável': T.red, 'Possível': T.amber, 'Remoto': T.green }
const RUBRICA_COLORS = [T.copper, '#9080C8', '#C07070', '#8090B0', '#78C498', '#C08090']
type Tab = 'dados' | 'andamentos' | 'audiencias' | 'prazos' | 'verbas'
const tabs: { key: Tab; label: string }[] = [
  { key: 'dados', label: 'Dados Gerais' }, { key: 'andamentos', label: 'Andamentos' },
  { key: 'audiencias', label: 'Audiências' }, { key: 'prazos', label: 'Prazos' },
  { key: 'verbas', label: 'Verbas' },
]

const TT = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 text-xs" style={{ background: T.s2, border: `1px solid ${T.b2}`, borderRadius: 3 }}>
      {payload.map((p: any) => <p key={p.name} style={{ color: T.t1 }}>{formatCurrency(Number(p.value))}</p>)}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs tracking-widest uppercase mb-1.5" style={{ color: T.t3, letterSpacing: '0.1em', fontSize: 10 }}>{label}</p>
      <p className="text-sm" style={{ color: T.t1 }}>{value}</p>
    </div>
  )
}

export default function ProcessoDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('dados')

  const p = processosMock.find(x => x.id === id)
  if (!p) return (
    <div className="p-8 text-center">
      <p className="text-xs" style={{ color: T.t3 }}>Processo não encontrado.</p>
      <button onClick={() => navigate('/processos')} className="text-xs mt-4" style={{ color: T.copper }}>Voltar</button>
    </div>
  )

  return (
    <div>
      <Header title={p.reclamante} subtitle={p.numero} />
      <div className="p-8 space-y-5">

        {/* Back */}
        <button onClick={() => navigate('/processos')}
          className="flex items-center gap-2 text-xs transition-colors"
          style={{ color: T.t3 }}
          onMouseEnter={e => (e.currentTarget.style.color = T.t2)}
          onMouseLeave={e => (e.currentTarget.style.color = T.t3)}>
          <ArrowLeft size={13} /> Voltar para Processos
        </button>

        {/* Header card */}
        <div className="p-6" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <span className="text-xs font-semibold" style={{ color: riscoText[p.risco] }}>● Risco {p.risco}</span>
                <span className="text-xs font-medium" style={{ color: T.t2 }}>{p.fase}</span>
                <span className="text-xs" style={{ color: p.status === 'Ativo' ? T.green : T.t3 }}>{p.status}</span>
              </div>
              <p className="text-xs" style={{ color: T.t2 }}>{p.vara}</p>
              {p.ultimoAndamento && (
                <p className="text-xs mt-3 leading-relaxed max-w-xl" style={{ color: T.t3 }}>
                  <span style={{ color: T.t4 }}>Último: </span>{p.ultimoAndamento}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <div className="px-5 py-4" style={{ background: T.s2, border: `1px solid ${T.b1}` }}>
                <p className="text-xs mb-2" style={{ color: T.t3 }}>Pedido</p>
                <p className="text-xl font-light" style={{ color: T.t1 }}>{formatCurrency(p.verbas.pedidoReclamante)}</p>
              </div>
              <div className="px-5 py-4" style={{ background: '#1E1208', border: `1px solid ${T.copper}33` }}>
                <p className="text-xs mb-2" style={{ color: T.t3 }}>Risco SCC</p>
                <p className="text-xl font-light" style={{ color: T.copper }}>{formatCurrency(p.verbas.riscoSCC)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex" style={{ borderBottom: `1px solid ${T.b1}` }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="px-5 py-3 text-xs tracking-widest uppercase transition-colors"
              style={{
                letterSpacing: '0.1em',
                color: tab === t.key ? T.copper : T.t3,
                borderBottom: tab === t.key ? `1px solid ${T.copper}` : '1px solid transparent',
                marginBottom: -1,
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Dados */}
        {tab === 'dados' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-6 space-y-5" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
              <p className="text-xs tracking-widest uppercase" style={{ color: T.t3, letterSpacing: '0.12em' }}>Processo</p>
              <Field label="Número CNJ"  value={p.numero} />
              <Field label="Tribunal"    value={p.tribunal} />
              <Field label="Vara"        value={p.vara} />
              <Field label="Comarca"     value={p.comarca} />
              <Field label="Distribuído" value={formatDate(p.dataDistribuicao)} />
              <Field label="Fase"        value={p.fase} />
            </div>
            <div className="space-y-3">
              <div className="p-6 space-y-5" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
                <p className="text-xs tracking-widest uppercase" style={{ color: T.t3, letterSpacing: '0.12em' }}>Partes</p>
                <Field label="Reclamante"      value={p.reclamante} />
                <Field label="Adv. Reclamante" value={p.advogadoReclamante} />
                <Field label="Preposto"        value={p.preposto || '—'} />
              </div>
              {p.observacoes && (
                <div className="p-5" style={{ background: '#1A1208', border: `1px solid ${T.copper}22` }}>
                  <p className="text-xs tracking-widest uppercase mb-3" style={{ color: T.copper, letterSpacing: '0.1em' }}>Observações SCC</p>
                  <p className="text-xs leading-relaxed" style={{ color: T.t2 }}>{p.observacoes}</p>
                </div>
              )}
              {p.proximoEvento && (
                <div className="p-5" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
                  <p className="text-xs tracking-widest uppercase mb-2" style={{ color: T.t3, letterSpacing: '0.1em' }}>Próximo Evento</p>
                  <p className="text-sm font-semibold" style={{ color: T.copper }}>{p.proximoEvento}</p>
                  <p className="text-xs mt-1" style={{ color: T.t3 }}>{formatDate(p.proximoEventoData!)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Andamentos */}
        {tab === 'andamentos' && (
          <div style={{ border: `1px solid ${T.b1}` }}>
            <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.b1}`, background: T.s2 }}>
              <p className="text-xs tracking-widest uppercase" style={{ color: T.t3, letterSpacing: '0.12em' }}>Histórico de Andamentos</p>
            </div>
            {[...p.andamentos].reverse().map((a, i) => (
              <div key={a.id} className="flex gap-5 px-6 py-4"
                style={{ borderBottom: i < p.andamentos.length - 1 ? `1px solid ${T.b1}` : 'none' }}>
                <div className="flex-shrink-0 w-20 pt-0.5">
                  <p className="text-xs font-mono" style={{ color: T.t2 }}>{formatDate(a.data)}</p>
                  <p className="text-xs mt-0.5" style={{ color: T.t4 }}>{a.fonte}</p>
                </div>
                <div className="w-px self-stretch" style={{ background: i === 0 ? T.copper : T.b1 }} />
                <p className="text-xs leading-relaxed flex-1" style={{ color: i === 0 ? T.t1 : T.t2 }}>{a.descricao}</p>
              </div>
            ))}
          </div>
        )}

        {/* Audiências */}
        {tab === 'audiencias' && (
          <div style={{ border: `1px solid ${T.b1}` }}>
            <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.b1}`, background: T.s2 }}>
              <p className="text-xs tracking-widest uppercase" style={{ color: T.t3, letterSpacing: '0.12em' }}>Audiências</p>
            </div>
            {p.audiencias.length === 0 ? (
              <div className="py-16 text-center"><p className="text-xs" style={{ color: T.t4 }}>Nenhuma audiência registrada</p></div>
            ) : p.audiencias.map((a, i) => {
              const ag = a.status === 'Agendada'
              return (
                <div key={a.id} className="flex items-center gap-5 px-6 py-4"
                  style={{ borderBottom: i < p.audiencias.length - 1 ? `1px solid ${T.b1}` : 'none' }}>
                  <div className="w-0.5 self-stretch" style={{ background: ag ? T.copper : T.b2 }} />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="text-xs font-semibold" style={{ color: T.t1 }}>{a.tipo}</p>
                      <span className="text-xs" style={{ color: ag ? T.copper : T.t3 }}>{a.status}</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: T.t3 }}>{a.local}</p>
                    {a.resultado && <p className="text-xs mt-1" style={{ color: T.t2 }}>{a.resultado}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold" style={{ color: T.t1 }}>{formatDate(a.data)}</p>
                    <p className="text-xs mt-0.5" style={{ color: T.t3 }}>{a.hora}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Prazos */}
        {tab === 'prazos' && (
          <div style={{ border: `1px solid ${T.b1}` }}>
            <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.b1}`, background: T.s2 }}>
              <p className="text-xs tracking-widest uppercase" style={{ color: T.t3, letterSpacing: '0.12em' }}>Prazos Pendentes</p>
            </div>
            {p.prazos.length === 0 ? (
              <div className="py-16 text-center"><p className="text-xs" style={{ color: T.t4 }}>Nenhum prazo pendente</p></div>
            ) : p.prazos.map((pr, i) => {
              const dias = Math.ceil((new Date(pr.dataFatal).getTime() - new Date().getTime()) / 86400000)
              const urgente = dias <= 7
              return (
                <div key={pr.id} className="flex items-center gap-5 px-6 py-4"
                  style={{ borderBottom: i < p.prazos.length - 1 ? `1px solid ${T.b1}` : 'none' }}>
                  <div className="w-0.5 self-stretch" style={{ background: urgente ? T.red : T.amber }} />
                  <div className="flex-1">
                    <p className="text-xs font-semibold" style={{ color: T.t1 }}>{pr.descricao}</p>
                    <p className="text-xs mt-1" style={{ color: T.t3 }}>Resp.: {pr.responsavel}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold" style={{ color: T.t1 }}>{formatDate(pr.dataFatal)}</p>
                    <p className="text-xs mt-0.5 font-bold" style={{ color: urgente ? T.red : T.amber }}>
                      {dias <= 0 ? 'vencido' : `${dias}d`}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Verbas */}
        {tab === 'verbas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-6" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
              <p className="text-xs tracking-widest uppercase mb-5" style={{ color: T.t3, letterSpacing: '0.12em' }}>Valores</p>
              <div className="space-y-0">
                {[
                  { l: 'Pedido do Reclamante', v: p.verbas.pedidoReclamante, c: T.t2 },
                  { l: 'Risco Estimado SCC',   v: p.verbas.riscoSCC,         c: T.copper },
                  { l: 'Provisão Recomendada', v: p.verbas.provisaoRecomendada, c: T.amber },
                  ...(p.verbas.valorAcordo    ? [{ l: 'Valor do Acordo',   v: p.verbas.valorAcordo,    c: T.green }] : []),
                  ...(p.verbas.valorCondenacao ? [{ l: 'Condenação',        v: p.verbas.valorCondenacao, c: T.red }] : []),
                  ...(p.verbas.depositoRecursal ? [{ l: 'Depósito Recursal', v: p.verbas.depositoRecursal, c: T.t2 }] : []),
                  ...(p.verbas.honorarios      ? [{ l: 'Honorários',        v: p.verbas.honorarios,      c: T.t3 }] : []),
                ].map((item, i, arr) => (
                  <div key={item.l} className="flex items-center justify-between py-3"
                    style={{ borderBottom: i < arr.length - 1 ? `1px solid ${T.b1}` : 'none' }}>
                    <p className="text-xs" style={{ color: T.t3 }}>{item.l}</p>
                    <p className="text-xs font-semibold" style={{ color: item.c }}>{formatCurrency(item.v)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 px-4 py-2.5" style={{ background: T.s2, border: `1px solid ${T.b1}` }}>
                <p className="text-xs font-medium" style={{ color: riscoText[p.verbas.tipoRisco] }}>
                  Tipo de Risco: {p.verbas.tipoRisco}
                </p>
              </div>
            </div>

            <div className="p-6" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
              <p className="text-xs tracking-widest uppercase mb-5" style={{ color: T.t3, letterSpacing: '0.12em' }}>Por Rubrica</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={p.verbas.rubricas} layout="vertical" barSize={14}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: T.t3 }} axisLine={false} tickLine={false}
                    tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="descricao" tick={{ fontSize: 10, fill: T.t2 }}
                    axisLine={false} tickLine={false} width={105} />
                  <Tooltip content={<TT />} />
                  <Bar dataKey="valor" radius={[0, 2, 2, 0]}>
                    {p.verbas.rubricas.map((_, i) => (
                      <Cell key={i} fill={RUBRICA_COLORS[i % RUBRICA_COLORS.length]} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {p.verbas.rubricas.map((r, i) => (
                  <div key={r.descricao} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: RUBRICA_COLORS[i % RUBRICA_COLORS.length] }} />
                      <span className="text-xs" style={{ color: T.t2 }}>{r.descricao}</span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: T.t1 }}>{formatCurrency(r.valor)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
