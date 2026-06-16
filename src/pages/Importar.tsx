import { useRef, useState } from 'react'
import Header from '../components/Layout/Header'
import { T } from '../theme'
import { useData } from '../context/DataContext'
import { parseVerbaSheet, parseProcessoSheet, downloadProcessoTemplate, downloadVerbaTemplate } from '../utils/excelParser'
import type { Processo } from '../types'
import { Download, Trash2, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react'

type UploadState = 'idle' | 'loading' | 'success' | 'error'

interface ZoneState {
  state: UploadState
  fileName: string
  message: string
}

const defaultZone: ZoneState = { state: 'idle', fileName: '', message: '' }

export default function Importar() {
  const { processos, isImported, isLoading, summary, setProcessos, mergeVerbas, reset } = useData()
  const [processoZone, setProcessoZone] = useState<ZoneState>(defaultZone)
  const [verbaZone, setVerbaZone]       = useState<ZoneState>(defaultZone)
  const [showReset, setShowReset]       = useState(false)

  const processoRef = useRef<HTMLInputElement>(null)
  const verbaRef    = useRef<HTMLInputElement>(null)

  async function handleFile(
    file: File,
    type: 'processos' | 'verbas',
    setZone: (z: ZoneState) => void,
  ) {
    setZone({ state: 'loading', fileName: file.name, message: 'Lendo arquivo...' })
    try {
      const buffer = await file.arrayBuffer()

      if (type === 'processos') {
        const parsed = parseProcessoSheet(buffer)
        if (!parsed.length) throw new Error('Nenhum processo encontrado. Verifique o formato da planilha.')

        const full: Processo[] = parsed.map((p, i) => ({
          id:               p.numero ?? String(i),
          numero:           p.numero ?? '',
          reclamante:       p.reclamante ?? 'Não informado',
          advogadoReclamante: p.advogadoReclamante ?? 'Não informado',
          vara:             p.vara ?? 'Não informado',
          comarca:          p.comarca ?? 'Não informado',
          tribunal:         p.tribunal ?? 'Não informado',
          fase:             p.fase ?? 'Inicial',
          status:           p.status ?? 'Ativo',
          risco:            p.risco ?? 'Possível',
          dataDistribuicao: p.dataDistribuicao ?? new Date().toISOString().slice(0, 10),
          ultimoMovimento:  'Importado via planilha',
          andamentos:       [],
          audiencias:       [],
          verbas:           [],
          ...p,
        }))

        await setProcessos(full)
        setZone({ state: 'success', fileName: file.name, message: `${full.length} processo(s) importado(s) com sucesso.` })

      } else {
        const parsed = parseVerbaSheet(buffer)
        if (!parsed.length) throw new Error('Nenhuma verba encontrada. Verifique se a planilha segue o formato correto.')

        const result = await mergeVerbas(parsed)
        const msg = [
          `${result.verbasImportadas} verba(s) importada(s).`,
          result.processosAtualizados > 0 ? `${result.processosAtualizados} processo(s) atualizado(s).` : '',
          result.processosCriados > 0    ? `${result.processosCriados} processo(s) criado(s) automaticamente.` : '',
        ].filter(Boolean).join(' ')
        setZone({ state: 'success', fileName: file.name, message: msg })
      }
    } catch (e: any) {
      setZone({ state: 'error', fileName: file.name, message: e.message ?? 'Erro ao processar o arquivo.' })
    }
  }

  function onFileChange(type: 'processos' | 'verbas', setZone: (z: ZoneState) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      handleFile(file, type, setZone)
      e.target.value = ''
    }
  }

  function onDrop(type: 'processos' | 'verbas', setZone: (z: ZoneState) => void) {
    return (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files?.[0]
      if (file) handleFile(file, type, setZone)
    }
  }

  const handleReset = () => {
    reset()
    setProcessoZone(defaultZone)
    setVerbaZone(defaultZone)
    setShowReset(false)
  }

  return (
    <div>
      <Header title="Importar Dados" />

      <div className="p-8 max-w-4xl mx-auto space-y-8">

        {/* Status banner */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ background: isImported ? '#0A1A0A' : T.s1, border: `1px solid ${isImported ? T.green + '44' : T.b1}` }}>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full" style={{ background: isImported ? T.green : T.t4 }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: isImported ? T.green : T.t2 }}>
                {isImported ? 'Dados importados ativos' : 'Dados de demonstração ativos'}
              </p>
              <p className="text-xs mt-0.5" style={{ color: T.t4 }}>
                {isImported
                  ? `${processos.length} processo(s) na base — importados de planilha Excel`
                  : `${processos.length} processos de exemplo — importe sua planilha para substituir`}
              </p>
            </div>
          </div>
          {isImported && (
            <button onClick={() => setShowReset(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs"
              style={{ background: T.redBg, color: T.red, border: `1px solid ${T.red}44`, borderRadius: 3 }}>
              <Trash2 size={12} />
              Restaurar demo
            </button>
          )}
        </div>

        {/* Reset confirm */}
        {showReset && (
          <div className="px-5 py-4 flex items-center justify-between"
            style={{ background: T.redBg, border: `1px solid ${T.red}55` }}>
            <p className="text-xs" style={{ color: T.t2 }}>
              Isso removerá todos os dados importados e voltará para os dados de demonstração. Continuar?
            </p>
            <div className="flex gap-2 ml-4 flex-shrink-0">
              <button onClick={() => setShowReset(false)}
                className="px-3 py-1.5 text-xs" style={{ background: T.s2, color: T.t2, border: `1px solid ${T.b2}`, borderRadius: 3 }}>
                Cancelar
              </button>
              <button onClick={handleReset}
                className="px-3 py-1.5 text-xs font-semibold" style={{ background: T.red + '33', color: T.red, border: `1px solid ${T.red}66`, borderRadius: 3 }}>
                Restaurar
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: T.t3, letterSpacing: '0.12em' }}>
            Como importar
          </h2>
          <p className="text-xs leading-relaxed" style={{ color: T.t4 }}>
            Faça o upload de duas planilhas Excel (.xlsx): uma com os dados cadastrais dos processos e outra com o detalhamento de verbas.
            Use os templates abaixo como base. As verbas são vinculadas aos processos pelo número do processo (coluna A).
          </p>
        </div>

        {/* Upload Zones */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <UploadZone
            title="Planilha de Processos"
            description="Dados cadastrais: partes, datas, valores, fase e risco."
            zone={processoZone}
            onBrowse={() => processoRef.current?.click()}
            onDrop={onDrop('processos', setProcessoZone)}
            onDownloadTemplate={downloadProcessoTemplate}
            inputRef={processoRef}
            onChange={onFileChange('processos', setProcessoZone)}
          />
          <UploadZone
            title="Planilha de Verbas"
            description="Detalhamento de verbas por processo (formato Renk/SCC)."
            zone={verbaZone}
            onBrowse={() => verbaRef.current?.click()}
            onDrop={onDrop('verbas', setVerbaZone)}
            onDownloadTemplate={downloadVerbaTemplate}
            inputRef={verbaRef}
            onChange={onFileChange('verbas', setVerbaZone)}
          />
        </div>

        {/* Summary */}
        {summary && (
          <div className="px-5 py-4 space-y-1" style={{ background: '#0A180A', border: `1px solid ${T.green}44` }}>
            <p className="text-xs font-semibold" style={{ color: T.green }}>Última importação</p>
            {summary.processosImportados > 0 && (
              <p className="text-xs" style={{ color: T.t3 }}>{summary.processosImportados} processo(s) importado(s)</p>
            )}
            {summary.verbasImportadas > 0 && (
              <p className="text-xs" style={{ color: T.t3 }}>{summary.verbasImportadas} verba(s) importada(s)</p>
            )}
            {summary.processosAtualizados > 0 && (
              <p className="text-xs" style={{ color: T.t3 }}>{summary.processosAtualizados} processo(s) com verbas atualizadas</p>
            )}
            {summary.processosCriados > 0 && (
              <p className="text-xs" style={{ color: T.t3 }}>{summary.processosCriados} processo(s) criado(s) automaticamente a partir das verbas</p>
            )}
          </div>
        )}

        {/* Format reference */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: T.t3, letterSpacing: '0.12em' }}>
            Formato da planilha de verbas
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['ID Processo', 'Tipo Verba', 'Categoria', 'Descrição', 'Valor Calculado (R$)', 'Valor Homologado (R$)', 'Valor Pago (R$)'].map(h => (
                    <th key={h} className="text-left px-3 py-2"
                      style={{ background: T.s2, color: T.t3, border: `1px solid ${T.b1}`, fontWeight: 600 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {['0010221-76.2024.5.15.0125', 'ADICIONAL DE INSALUBRIDADE', 'Verba Salarial', 'NR-15', 'R$ 1.589,15', '', ''].map((v, i) => (
                    <td key={i} className="px-3 py-2" style={{ color: T.t2, border: `1px solid ${T.b1}` }}>{v || '—'}</td>
                  ))}
                </tr>
                <tr>
                  {['0010221-76.2024.5.15.0125', 'FGTS', 'Encargo', '', 'R$ 4.310,92', '', ''].map((v, i) => (
                    <td key={i} className="px-3 py-2" style={{ color: T.t2, border: `1px solid ${T.b1}`, background: T.s1 }}>{v || '—'}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-2" style={{ color: T.t4 }}>
            Linhas sem número de processo válido (catálogo de referência, linha em branco) são ignoradas automaticamente.
          </p>
        </div>

      </div>
    </div>
  )
}

interface UploadZoneProps {
  title: string
  description: string
  zone: ZoneState
  onBrowse: () => void
  onDrop: (e: React.DragEvent) => void
  onDownloadTemplate: () => void
  inputRef: React.RefObject<HTMLInputElement | null>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function UploadZone({ title, description, zone, onBrowse, onDrop, onDownloadTemplate, inputRef, onChange }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false)

  const borderColor = dragging ? T.copper
    : zone.state === 'success' ? T.green
    : zone.state === 'error'   ? T.red
    : T.b1

  const iconColor = zone.state === 'success' ? T.green
    : zone.state === 'error' ? T.red
    : T.t4

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold" style={{ color: T.t1 }}>{title}</p>
        <button onClick={onDownloadTemplate}
          className="flex items-center gap-1 text-xs px-2 py-1"
          style={{ color: T.copper, background: T.copper + '15', border: `1px solid ${T.copper}33`, borderRadius: 3 }}>
          <Download size={11} />
          Template
        </button>
      </div>

      <input ref={inputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={onChange} />

      <div
        onClick={zone.state !== 'loading' ? onBrowse : undefined}
        onDragEnter={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { setDragging(false); onDrop(e) }}
        className="flex flex-col items-center justify-center gap-3 px-4 py-8 cursor-pointer transition-colors"
        style={{
          border: `1px dashed ${borderColor}`,
          background: dragging ? T.copper + '08' : T.s1,
          borderRadius: 3,
        }}
      >
        {zone.state === 'loading' ? (
          <div className="text-xs" style={{ color: T.t3 }}>Processando...</div>
        ) : zone.state === 'success' ? (
          <>
            <CheckCircle size={22} style={{ color: iconColor }} />
            <div className="text-center">
              <p className="text-xs font-medium" style={{ color: T.t2 }}>{zone.fileName}</p>
              <p className="text-xs mt-1" style={{ color: T.green }}>{zone.message}</p>
            </div>
            <p className="text-xs" style={{ color: T.t4 }}>Clique para reimportar</p>
          </>
        ) : zone.state === 'error' ? (
          <>
            <AlertCircle size={22} style={{ color: iconColor }} />
            <div className="text-center">
              <p className="text-xs font-medium" style={{ color: T.red }}>{zone.message}</p>
            </div>
            <p className="text-xs" style={{ color: T.t4 }}>Clique para tentar novamente</p>
          </>
        ) : (
          <>
            <FileSpreadsheet size={22} style={{ color: iconColor }} />
            <div className="text-center">
              <p className="text-xs font-medium" style={{ color: T.t2 }}>Arraste o arquivo aqui</p>
              <p className="text-xs mt-1" style={{ color: T.t4 }}>ou clique para selecionar — .xlsx</p>
            </div>
          </>
        )}
      </div>

      {zone.state === 'idle' && (
        <p className="text-xs mt-1.5" style={{ color: T.t4 }}>{description}</p>
      )}
    </div>
  )
}
