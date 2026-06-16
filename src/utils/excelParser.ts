import * as XLSX from 'xlsx'
import type { Processo } from '../types'
import type { ParsedVerba } from '../context/DataContext'

const PROCESSO_NUM_RE = /^\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}$/

function parseMoney(s: unknown): number | undefined {
  if (s === null || s === undefined || s === '') return undefined
  // SheetJS returns raw numeric values — use directly
  if (typeof s === 'number') return isNaN(s) ? undefined : s
  const str = String(s).trim()
  if (!str) return undefined
  // Strip R$ symbol and spaces
  const noSymbol = str.replace(/R\$\s*/g, '').trim()
  // Already US decimal format (e.g. "1589.15")
  if (/^\d+(\.\d+)?$/.test(noSymbol)) return parseFloat(noSymbol)
  // Brazilian format: dot = thousands separator, comma = decimal
  const clean = noSymbol.replace(/\./g, '').replace(',', '.')
  const n = parseFloat(clean)
  return isNaN(n) ? undefined : n
}

function parseDate(s: string): string | undefined {
  if (!s) return undefined
  const str = String(s).trim()
  const parts = str.split('/')
  if (parts.length === 3 && parts[2].length === 4) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str
  return undefined
}

// Parse the VERBAS sheet (client's existing format)
// Columns: ID Processo | Tipo Verba | Categoria | Descrição | Valor Calculado | Valor Homologado | Valor Pago
export function parseVerbaSheet(buffer: ArrayBuffer): ParsedVerba[] {
  const wb = XLSX.read(buffer, { type: 'array' })
  const shName = wb.SheetNames.find(n => /verba/i.test(n)) ?? wb.SheetNames[0]
  const sh = wb.Sheets[shName]
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sh, { header: 1, defval: '' }) as string[][]

  // Find header row (contains "ID Processo")
  let dataStart = 2
  for (let i = 0; i < Math.min(rows.length, 5); i++) {
    if (rows[i].some(c => String(c).includes('ID Processo'))) {
      dataStart = i + 1
      break
    }
  }

  const result: ParsedVerba[] = []
  for (let i = dataStart; i < rows.length; i++) {
    const row = rows[i]
    const id = String(row[0] ?? '').trim()
    if (!PROCESSO_NUM_RE.test(id)) continue

    const tipo = String(row[1] ?? '').trim()
    if (!tipo) continue

    result.push({
      processoNumero: id,
      tipo,
      categoria: String(row[2] ?? '').trim(),
      nota: String(row[3] ?? '').trim(),
      valorCalculado:  parseMoney(row[4]),
      valorHomologado: parseMoney(row[5]),
      valorPago:       parseMoney(row[6]),
    })
  }
  return result
}

// Parse the PROCESSOS sheet (Awer template format)
export function parseProcessoSheet(buffer: ArrayBuffer): Partial<Processo>[] {
  const wb = XLSX.read(buffer, { type: 'array' })
  const shName = wb.SheetNames.find(n => /processo/i.test(n)) ?? wb.SheetNames[0]
  const sh = wb.Sheets[shName]
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sh, { header: 1, defval: '' }) as string[][]

  if (rows.length < 2) return []
  const headers = rows[0].map(h => String(h).trim())

  const col = (row: string[], name: string): string => {
    const idx = headers.indexOf(name)
    return idx >= 0 ? String(row[idx] ?? '').trim() : ''
  }
  const colNum = (row: string[], name: string): number | undefined => {
    const idx = headers.indexOf(name)
    return idx >= 0 ? parseMoney(row[idx]) : undefined
  }
  const colInt = (row: string[], name: string): number | undefined => {
    const n = colNum(row, name)
    return n !== undefined ? Math.round(n) : undefined
  }

  const result: Partial<Processo>[] = []
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].map(c => String(c))
    const numero = row[0]?.trim()
    if (!numero || numero.startsWith('-') || numero.startsWith('---')) continue

    result.push({
      numero,
      reclamante:           col(row, 'Reclamante')           || 'Não informado',
      cpf:                  col(row, 'CPF')                  || undefined,
      cargo:                col(row, 'Cargo')                || undefined,
      setor:                col(row, 'Setor')                || undefined,
      unidade:              (col(row, 'Unidade') as any)     || undefined,
      advogadoReclamante:   col(row, 'Adv. Reclamante')      || 'Não informado',
      advogadoPoloPassivo:  col(row, 'Adv. Réu')             || undefined,
      vara:                 col(row, 'Vara')                 || 'Não informado',
      comarca:              col(row, 'Comarca')              || 'Não informado',
      tribunal:             col(row, 'Tribunal')             || 'Não informado',
      uf:                   col(row, 'UF')                   || undefined,
      fase:                 (col(row, 'Fase') as any)        || 'Inicial',
      status:               (col(row, 'Status') as any)      || 'Ativo',
      risco:                (col(row, 'Risco') as any)       || 'Possível',
      dataDistribuicao:     parseDate(col(row, 'Data Distribuição')) ?? new Date().toISOString().slice(0, 10),
      dataAdmissao:         parseDate(col(row, 'Data Admissão')),
      dataDemissao:         parseDate(col(row, 'Data Demissão')),
      dataSentenca:         parseDate(col(row, 'Data Sentença')),
      dataAcordo:           parseDate(col(row, 'Data Acordo')),
      dataTransitoJulgado:  parseDate(col(row, 'Data Trânsito em Julgado')),
      ultimoSalario:        colNum(row, 'Último Salário'),
      valorCausa:           colNum(row, 'Valor Causa'),
      valorAcordo:          colNum(row, 'Valor Acordo'),
      valorCondenacao:      colNum(row, 'Valor Condenação'),
      valorContingencia:    colNum(row, 'Valor Contingência'),
      pedidos:              col(row, 'Pedidos') ? col(row, 'Pedidos').split(';').map(s => s.trim()).filter(Boolean) : [],
      pedidosJulgados:      colInt(row, 'Pedidos Julgados') ?? 0,
      pedidosProcedentes:   colInt(row, 'Pedidos Procedentes') ?? 0,
      pedidosImprocedentes: colInt(row, 'Pedidos Improcedentes') ?? 0,
      observacoes:          col(row, 'Observações') || undefined,
      ultimoMovimento:      'Importado via planilha',
      andamentos:           [],
      audiencias:           [],
      verbas:               [],
    })
  }
  return result
}

// Download blank PROCESSOS template
export function downloadProcessoTemplate(): void {
  const headers = [
    'Nº Processo', 'Reclamante', 'CPF', 'Cargo', 'Setor', 'Unidade',
    'Adv. Reclamante', 'Adv. Réu', 'Vara', 'Comarca', 'Tribunal', 'UF',
    'Fase', 'Status', 'Risco',
    'Data Distribuição', 'Data Admissão', 'Data Demissão',
    'Data Sentença', 'Data Acordo', 'Data Trânsito em Julgado',
    'Último Salário', 'Valor Causa', 'Valor Acordo', 'Valor Condenação', 'Valor Contingência',
    'Pedidos', 'Pedidos Julgados', 'Pedidos Procedentes', 'Pedidos Improcedentes', 'Observações',
  ]
  const example = [
    '0001234-45.2023.5.02.0381', 'Nome Reclamante', '000.000.000-00', 'Operador', 'Produção',
    'ZS', 'Dr. Advogado Reclamante', 'Dr. Roberto Alves',
    '1ª Vara do Trabalho', 'Cidade', 'TRT 2ª Região', 'SP',
    'Inicial', 'Ativo', 'Possível',
    '15/03/2023', '01/06/2018', '30/11/2022', '', '', '',
    '3850,00', '185000,00', '', '', '80000,00',
    'Horas extras; FGTS; Danos morais', '0', '0', '0', 'Observações opcionais',
  ]
  const legend = [
    '', '', '', '', '', '', '', '', '', '', '', '',
    'Fases: Inicial | Recursal | Liquidação | Execução | Embargos | Pagamento de Execução | Pagamento de Acordo | Trânsito em Julgado | Arquivado',
    'Status: Ativo | Arquivado | Encerrado', 'Risco: Provável | Possível | Remoto',
  ]

  const ws = XLSX.utils.aoa_to_sheet([headers, example, legend])
  ws['!cols'] = headers.map(() => ({ wch: 24 }))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'PROCESSOS')
  XLSX.writeFile(wb, 'template_processos_scc.xlsx')
}

// Download blank VERBAS template (same format as client's spreadsheet)
export function downloadVerbaTemplate(): void {
  const headers = [
    'PLANILHA DE VERBAS — SCC',
  ]
  const subHeader = [
    'ID Processo', 'Tipo Verba', 'Categoria', 'Descrição',
    'Valor Calculado (R$)', 'Valor Homologado (R$)', 'Valor Pago (R$)',
  ]
  const example = [
    '0001234-45.2023.5.02.0381', 'ADICIONAL DE INSALUBRIDADE', 'Verba Salarial', 'NR-15',
    'R$ 1.589,15', '', '',
  ]
  const catalog = [
    [], [], ['--- CATÁLOGO DE TIPOS DE VERBAS (referência) ---'],
    ['', 'ADICIONAL DE INSALUBRIDADE', 'Verba Salarial'],
    ['', 'ADICIONAL DE PERICULOSIDADE', 'Verba Salarial'],
    ['', 'DIFERENÇAS DE HORAS EXTRAS', 'Verba Salarial'],
    ['', 'ADICIONAL NOTURNO', 'Verba Salarial'],
    ['', 'HORAS DE SOBREAVISO', 'Verba Salarial'],
    ['', 'INTERVALO INTRAJORNADA', 'Verba Salarial'],
    ['', 'DIFERENÇA SALARIAIS (MENSALISTA)', 'Verba Salarial'],
    ['', 'DANO MORAL', 'Verba Indenizatória'],
    ['', 'DANO EXISTENCIAL', 'Verba Indenizatória'],
    ['', 'ESTABILIDADE', 'Verba Indenizatória'],
    ['', 'FGTS', 'Encargo'],
    ['', 'CONTRIBUIÇÃO SOCIAL (INSS)', 'Encargo'],
    ['', 'HONOR. ENGENHARIA', 'Honorários'],
    ['', 'HONOR. ADVOC. SUCUMBÊNCIA', 'Honorários'],
  ]

  const ws = XLSX.utils.aoa_to_sheet([headers, subHeader, example, ...catalog])
  ws['!cols'] = [{ wch: 34 }, { wch: 34 }, { wch: 22 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 18 }]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'VERBAS')
  XLSX.writeFile(wb, 'template_verbas_scc.xlsx')
}
