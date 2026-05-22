export type RiscoNivel  = 'Provável' | 'Possível' | 'Remoto'
export type ProcessoStatus = 'Ativo' | 'Arquivado' | 'Encerrado'

export type ProcessoFase =
  | 'Inicial'
  | 'Recursal'
  | 'Liquidação'
  | 'Execução'
  | 'Embargos'
  | 'Pagamento de Execução'
  | 'Pagamento de Acordo'
  | 'Trânsito em Julgado'
  | 'Arquivado'

export type TipoVerba =
  | 'verba salarial'
  | 'verba indenizatória'
  | 'Encargos'
  | 'Honorários'

export type Unidade = 'ZS' | 'ZR' | 'ZT'

export interface Verba {
  tipo: string              // ex: "ADICIONAL DE INSALUBRIDADE"
  descricao: TipoVerba      // ex: "verba salarial"
  valorCalculado?: number
  valorHomologado?: number
  valorPago?: number
}

export interface Andamento {
  id: string
  data: string
  descricao: string
  fonte: string
}

export interface Audiencia {
  id: string
  data: string
  hora: string
  tipo: 'Inicial' | 'Instrução' | 'Julgamento' | 'Conciliação'
  status: 'Agendada' | 'Realizada' | 'Cancelada' | 'Redesignada'
  resultado?: string
  local: string
}

export interface Processo {
  id: string

  // Identificação
  numero: string
  reclamante: string
  cpf?: string
  cargo?: string
  setor?: string
  unidade?: Unidade
  ultimoSalario?: number

  // Partes
  advogadoReclamante: string
  advogadoPoloPassivo?: string
  partesPoloAtivo?: string
  partesPoloPassivo?: string
  empresasTerceiras?: string
  juiz?: string
  preposto?: string

  // Localização
  vara: string
  comarca: string
  tribunal: string
  uf?: string
  instancia?: string

  // Classificação
  fase: ProcessoFase
  status: ProcessoStatus
  risco: RiscoNivel
  desfecho?: string
  tiposRecursos?: string
  nulidadeBancoHoras?: boolean

  // Datas
  dataDistribuicao: string
  dataAdmissao?: string
  dataDemissao?: string
  dataSentenca?: string
  dataAcordo?: string
  dataArquivamento?: string
  dataAcordaoRO?: string
  dataAcordaoRR?: string
  dataTransitoJulgado?: string
  dataDepositoRecursal?: string
  dataRestituicaoDepositoRecursal?: string
  dataInicioPagamento?: string

  // Pedidos
  pedidos?: string[]
  pedidosJulgados?: number
  pedidosProcedentes?: number
  pedidosImprocedentes?: number

  // Valores financeiros
  valorCausa?: number
  valorAcordo?: number
  valorCondenacao?: number
  valorContingencia?: number
  valorCustas?: number
  valorCustasRO?: number
  valorCustasRR?: number
  valorDiferencaCustas?: number
  valorVariacaoCondenacao?: number
  depositoRecursalRO?: number
  depositoRecursalRR?: number
  restituicaoDepositoRecursal?: number

  // Decisões
  decisoesPorInstancia?: string

  // Histórico
  ultimoMovimento: string
  proximoEvento?: string
  proximoEventoData?: string
  andamentos: Andamento[]
  audiencias: Audiencia[]
  observacoes?: string

  // Verbas (Aba 2)
  verbas: Verba[]
}

export interface Usuario {
  id: string
  nome: string
  email: string
  empresa: string
}
