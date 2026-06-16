import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { formatCurrency, formatDate, riscoColor, faseColor } from '../data/mockData'
import { useData } from '../context/DataContext'
import Header from '../components/Layout/Header'
import { T } from '../theme'
import { ArrowLeft } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

type Tab = 'dados' | 'andamentos' | 'audiencias' | 'verbas'
const tabs: { key: Tab; label: string }[] = [
  { key: 'dados',      label: 'Dados Gerais' },
  { key: 'andamentos', label: 'Andamentos'   },
  { key: 'audiencias', label: 'Audiências'   },
  { key: 'verbas',     label: 'Verbas'       },
]

const TT = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 text-xs" style={{ background: T.s2, border: `1px solid ${T.b2}`, borderRadius: 3 }}>
      {payload.map((p: any) => <p key={p.name} style={{ color: T.t1 }}>{p.name}: {formatCurrency(Number(p.value))}</p>)}
    </div>
  )
}

function Field({ label, value }: { label: string; value?: string | number }) {
  if (!value && value !== 0) return null
  return (
    <div>
      <p className="text-xs uppercase tracking-widest mb-1" style={{ color: T.t3, letterSpacing: '0.08em', fontSize: 10 }}>{label}</p>
      <p className="text-sm" style={{ color: T.t1 }}>{value}</p>
    </div>
  )
}

function MoneyField({ label, value, color }: { label: string; value?: number; color?: string }) {
  if (!value) return null
  return (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: `1px solid ${T.b1}` }}>
      <p className="text-xs" style={{ color: T.t3 }}>{label}</p>
      <p className="text-xs font-semibold" style={{ color: color || T.t1 }}>{formatCurrency(value)}</p>
    </div>
  )
}

const VERBA_COLORS: Record<string, string> = {
  'verba salarial':      T.copper,
  'verba indenizatória': '#9080C8',
  'Encargos':            '#8090B0',
  'Honorários':          '#C07070',
}

export default function ProcessoDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { processos } = useData()
  const [tab, setTab] = useState<Tab>('dados')

  const p = processos.find(x => x.id === id)
  if (!p) return (
    <div className="p-8 text-center">
      <p className="text-xs" style={{ color: T.t3 }}>Processo não encontrado.</p>
      <button onClick={() => navigate('/processos')} className="text-xs mt-4" style={{ color: T.copper }}>Voltar</button>
    </div>
  )

  const totalCalculado  = p.verbas.reduce((s, v) => s + (v.valorCalculado  || 0), 0)
  const totalHomologado = p.verbas.reduce((s, v) => s + (v.valorHomologado || 0), 0)
  const totalPago       = p.verbas.reduce((s, v) => s + (v.valorPago       || 0), 0)

  return (
    <div>
      <Header title={p.reclamante} subtitle={p.numero} />
      <div className="p-8 space-y-5">

        <button onClick={() => navigate('/processos')}
          className="flex items-center gap-2 text-xs transition-colors"
          style={{ color: T.t3 }}
          onMouseEnter={e => (e.currentTarget.style.color = T.t2)}
          onMouseLeave={e => (e.currentTarget.style.color = T.t3)}>
          <ArrowLeft size={13} /> Voltar
        </button>

        {/* Header card */}
        <div className="p-6" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <span className="text-xs font-semibold" style={{ color: riscoColor(p.risco) }}>● Risco {p.risco}</span>
                <span className="text-xs font-medium" style={{ color: faseColor(p.fase) }}>{p.fase}</span>
                <span className="text-xs" style={{ color: p.status === 'Ativo' ? T.green : T.t3 }}>{p.status}</span>
                {p.unidade && <span className="text-xs px-2 py-0.5 rounded-sm" style={{ background: T.s3, color: T.t2 }}>{p.unidade}</span>}
              </div>
              <p className="text-xs" style={{ color: T.t2 }}>{p.vara} · {p.comarca}</p>
              {p.cargo && <p className="text-xs mt-1" style={{ color: T.t3 }}>{p.cargo} — {p.setor}</p>}
              {p.ultimoMovimento && (
                <p className="text-xs mt-3 leading-relaxed max-w-xl" style={{ color: T.t3 }}>
                  Último: {p.ultimoMovimento}
                </p>
              )}
            </div>
            <div className="flex gap-px" style={{ background: T.b1 }}>
              {[
                { l: 'Causa',        v: p.valorCausa,       c: T.t2 },
                { l: 'Contingência', v: p.valorContingencia, c: T.copper },
                { l: p.valorAcordo ? 'Acordo' : p.valorCondenacao ? 'Condenação' : undefined,
                  v: p.valorAcordo || p.valorCondenacao,
                  c: p.valorAcordo ? T.green : T.red },
              ].filter(x => x.l && x.v).map(x => (
                <div key={x.l} className="px-5 py-4" style={{ background: T.s1 }}>
                  <p className="text-xs mb-2" style={{ color: T.t3 }}>{x.l}</p>
                  <p className="text-lg font-light whitespace-nowrap" style={{ color: x.c }}>{formatCurrency(x.v!)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto" style={{ borderBottom: `1px solid ${T.b1}` }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="px-5 py-3 text-xs tracking-widest uppercase whitespace-nowrap transition-colors"
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

        {/* Dados Gerais */}
        {tab === 'dados' && (
          <div className="space-y-3">
            {/* Identificação + Partes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-6 space-y-4" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
                <p className="text-xs uppercase tracking-widest" style={{ color: T.t3, letterSpacing: '0.12em' }}>Identificação</p>
                <Field label="Número CNJ"     value={p.numero} />
                <Field label="Tribunal"       value={p.tribunal} />
                <Field label="Vara"           value={p.vara} />
                <Field label="Comarca / UF"   value={`${p.comarca} — ${p.uf || 'SP'}`} />
                <Field label="Instância"      value={p.instancia} />
                <Field label="Juiz(a)"        value={p.juiz} />
                <Field label="Distribuição"   value={formatDate(p.dataDistribuicao)} />
                <Field label="Tipo de Recurso" value={p.tiposRecursos} />
              </div>
              <div className="p-6 space-y-4" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
                <p className="text-xs uppercase tracking-widest" style={{ color: T.t3, letterSpacing: '0.12em' }}>Reclamante</p>
                <Field label="Nome"           value={p.reclamante} />
                <Field label="CPF"            value={p.cpf} />
                <Field label="Cargo"          value={p.cargo} />
                <Field label="Setor"          value={p.setor} />
                <Field label="Unidade"        value={p.unidade} />
                <Field label="Último salário" value={p.ultimoSalario ? formatCurrency(p.ultimoSalario) : undefined} />
                <Field label="Admissão"       value={p.dataAdmissao ? formatDate(p.dataAdmissao) : undefined} />
                <Field label="Demissão"       value={p.dataDemissao ? formatDate(p.dataDemissao) : undefined} />
                <Field label="Adv. Reclamante" value={p.advogadoReclamante} />
                <Field label="Adv. Polo Passivo" value={p.advogadoPoloPassivo} />
                {p.empresasTerceiras && <Field label="Empresa Terceira" value={p.empresasTerceiras} />}
              </div>
            </div>

            {/* Datas-chave */}
            <div className="p-6" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: T.t3, letterSpacing: '0.12em' }}>Cronograma</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { l: 'Distribuição',         v: p.dataDistribuicao },
                  { l: 'Sentença',              v: p.dataSentenca },
                  { l: 'Acórdão RO',            v: p.dataAcordaoRO },
                  { l: 'Acórdão RR (TST)',      v: p.dataAcordaoRR },
                  { l: 'Trânsito em Julgado',   v: p.dataTransitoJulgado },
                  { l: 'Acordo',                v: p.dataAcordo },
                  { l: 'Depósito Recursal',     v: p.dataDepositoRecursal },
                  { l: 'Início Pagamento',      v: p.dataInicioPagamento },
                ].filter(x => x.v).map(x => (
                  <div key={x.l} className="px-4 py-3 rounded-sm" style={{ background: T.s2 }}>
                    <p className="text-xs mb-1" style={{ color: T.t3 }}>{x.l}</p>
                    <p className="text-xs font-semibold" style={{ color: T.t1 }}>{formatDate(x.v!)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pedidos + Valores financeiros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-6" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
                <p className="text-xs uppercase tracking-widest mb-4" style={{ color: T.t3, letterSpacing: '0.12em' }}>Pedidos</p>
                {p.pedidos && p.pedidos.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.pedidos.map(pd => (
                      <span key={pd} className="text-xs px-2.5 py-1 rounded-sm" style={{ background: T.s2, color: T.t2 }}>{pd}</span>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {[
                    { l: 'Julgados',      v: p.pedidosJulgados,      c: T.t2 },
                    { l: 'Procedentes',   v: p.pedidosProcedentes,   c: T.green },
                    { l: 'Improcedentes', v: p.pedidosImprocedentes, c: T.red },
                  ].map(x => (
                    <div key={x.l} className="px-3 py-3 rounded-sm text-center" style={{ background: T.s2 }}>
                      <p className="text-2xl font-light" style={{ color: x.c }}>{x.v ?? '—'}</p>
                      <p className="text-xs mt-1" style={{ color: T.t3 }}>{x.l}</p>
                    </div>
                  ))}
                </div>
                {p.decisoesPorInstancia && (
                  <p className="text-xs mt-4 leading-relaxed" style={{ color: T.t3 }}>{p.decisoesPorInstancia}</p>
                )}
              </div>

              <div className="p-6" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
                <p className="text-xs uppercase tracking-widest mb-4" style={{ color: T.t3, letterSpacing: '0.12em' }}>Valores Financeiros</p>
                <div>
                  <MoneyField label="Valor de Causa"           value={p.valorCausa} color={T.t2} />
                  <MoneyField label="Valor da Contingência"    value={p.valorContingencia} color={T.copper} />
                  <MoneyField label="Valor da Condenação"      value={p.valorCondenacao} color={T.red} />
                  <MoneyField label="Valor do Acordo"          value={p.valorAcordo} color={T.green} />
                  <MoneyField label="Valor das Custas"         value={p.valorCustas} color={T.t3} />
                  <MoneyField label="Custas RO"                value={p.valorCustasRO} color={T.t3} />
                  <MoneyField label="Custas RR"                value={p.valorCustasRR} color={T.t3} />
                  <MoneyField label="Dif. de Custas"           value={p.valorDiferencaCustas} color={T.t3} />
                  <MoneyField label="Variação da Condenação"   value={p.valorVariacaoCondenacao} color={T.amber} />
                  <MoneyField label="Depósito Recursal RO"     value={p.depositoRecursalRO} color={T.t2} />
                  <MoneyField label="Depósito Recursal RR"     value={p.depositoRecursalRR} color={T.t2} />
                  <MoneyField label="Restituição Dep. Recursal" value={p.restituicaoDepositoRecursal} color={T.green} />
                </div>
              </div>
            </div>

            {p.observacoes && (
              <div className="p-5" style={{ background: '#1E1208', border: `1px solid ${T.copper}22` }}>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: T.copper, letterSpacing: '0.1em' }}>Observações SCC</p>
                <p className="text-xs leading-relaxed" style={{ color: T.t2 }}>{p.observacoes}</p>
              </div>
            )}
          </div>
        )}

        {/* Andamentos */}
        {tab === 'andamentos' && (
          <div style={{ border: `1px solid ${T.b1}` }}>
            <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.b1}`, background: T.s2 }}>
              <p className="text-xs uppercase tracking-widest" style={{ color: T.t3, letterSpacing: '0.12em' }}>Histórico de Andamentos</p>
            </div>
            {[...p.andamentos].reverse().map((a, i) => (
              <div key={a.id} className="flex gap-5 px-6 py-4"
                style={{ borderBottom: i < p.andamentos.length - 1 ? `1px solid ${T.b1}` : 'none' }}>
                <div className="w-20 flex-shrink-0 pt-0.5">
                  <p className="text-xs font-mono" style={{ color: T.t2 }}>{formatDate(a.data)}</p>
                  <p className="text-xs mt-0.5" style={{ color: T.t4 }}>{a.fonte}</p>
                </div>
                <div className="w-0.5 self-stretch" style={{ background: i === 0 ? T.copper : T.b1 }} />
                <p className="text-xs leading-relaxed flex-1" style={{ color: i === 0 ? T.t1 : T.t2 }}>{a.descricao}</p>
              </div>
            ))}
          </div>
        )}

        {/* Audiências */}
        {tab === 'audiencias' && (
          <div style={{ border: `1px solid ${T.b1}` }}>
            <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.b1}`, background: T.s2 }}>
              <p className="text-xs uppercase tracking-widest" style={{ color: T.t3, letterSpacing: '0.12em' }}>Audiências</p>
            </div>
            {p.audiencias.length === 0 ? (
              <div className="py-16 text-center"><p className="text-xs" style={{ color: T.t4 }}>Nenhuma audiência registrada</p></div>
            ) : p.audiencias.map((a, i) => (
              <div key={a.id} className="flex items-center gap-5 px-6 py-4"
                style={{ borderBottom: i < p.audiencias.length - 1 ? `1px solid ${T.b1}` : 'none' }}>
                <div className="w-0.5 self-stretch" style={{ background: a.status === 'Agendada' ? T.copper : T.b2 }} />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-xs font-semibold" style={{ color: T.t1 }}>{a.tipo}</p>
                    <span className="text-xs" style={{ color: a.status === 'Agendada' ? T.copper : T.t3 }}>{a.status}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: T.t3 }}>{a.local}</p>
                  {a.resultado && <p className="text-xs mt-1" style={{ color: T.t2 }}>{a.resultado}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold" style={{ color: T.t1 }}>{formatDate(a.data)}</p>
                  <p className="text-xs mt-0.5" style={{ color: T.t3 }}>{a.hora}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Verbas */}
        {tab === 'verbas' && (
          <div className="space-y-3">
            {/* Totais */}
            <div className="grid grid-cols-3 gap-px" style={{ background: T.b1 }}>
              {[
                { l: 'Total Calculado',  v: totalCalculado,  c: T.t1 },
                { l: 'Total Homologado', v: totalHomologado, c: T.copper },
                { l: 'Total Pago',       v: totalPago,       c: T.green },
              ].map(x => (
                <div key={x.l} className="px-6 py-5" style={{ background: T.s1 }}>
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ color: T.t3, letterSpacing: '0.1em' }}>{x.l}</p>
                  <p className="text-2xl font-light" style={{ color: x.c }}>{x.v ? formatCurrency(x.v) : '—'}</p>
                </div>
              ))}
            </div>

            {/* Tabela de verbas */}
            <div style={{ border: `1px solid ${T.b1}` }}>
              <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.b1}`, background: T.s2 }}>
                <p className="text-xs uppercase tracking-widest" style={{ color: T.t3, letterSpacing: '0.12em' }}>Detalhamento por Verba</p>
              </div>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T.b1}`, background: T.s2 }}>
                    {['Verba', 'Descrição', 'Valor Calculado', 'Valor Homologado', 'Valor Pago'].map(h => (
                      <th key={h} className="px-5 py-3 text-left">
                        <span className="text-xs uppercase tracking-widest" style={{ color: T.t3, letterSpacing: '0.08em' }}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {p.verbas.map((v, i) => (
                    <tr key={i} style={{ borderBottom: i < p.verbas.length - 1 ? `1px solid ${T.b1}` : 'none' }}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: VERBA_COLORS[v.descricao] || T.t3 }} />
                          <p className="text-xs font-medium" style={{ color: T.t1 }}>{v.tipo}</p>
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
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Gráfico por tipo */}
              <div className="px-6 py-5" style={{ borderTop: `1px solid ${T.b1}` }}>
                <p className="text-xs uppercase tracking-widest mb-4" style={{ color: T.t3, letterSpacing: '0.1em' }}>Por Tipo de Verba</p>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={p.verbas.filter(v => v.valorCalculado)} layout="vertical" barSize={12}>
                    <XAxis type="number" tick={{ fontSize: 10, fill: T.t3 }} axisLine={false} tickLine={false}
                      tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="tipo" tick={{ fontSize: 10, fill: T.t2 }}
                      axisLine={false} tickLine={false} width={160} />
                    <Tooltip content={<TT />} />
                    <Bar dataKey="valorCalculado" name="Calculado" radius={[0, 2, 2, 0]}>
                      {p.verbas.filter(v => v.valorCalculado).map((v, i) => (
                        <Cell key={i} fill={VERBA_COLORS[v.descricao] || T.t3} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
