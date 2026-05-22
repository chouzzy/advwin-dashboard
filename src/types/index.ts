export type RiscoNivel = 'Possível' | 'Provável' | 'Remoto'
export type ProcessoStatus = 'Ativo' | 'Suspenso' | 'Arquivado' | 'Encerrado'
export type ProcessoFase = 'Conhecimento' | 'Recursal' | 'Execução' | 'Liquidação'
export type AudienciaTipo = 'Inicial' | 'Instrução' | 'Julgamento' | 'Conciliação'
export type AudienciaStatus = 'Agendada' | 'Realizada' | 'Cancelada' | 'Redesignada'
export type PrazoStatus = 'Pendente' | 'Cumprido' | 'Vencido'

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
  tipo: AudienciaTipo
  status: AudienciaStatus
  resultado?: string
  local: string
}

export interface Prazo {
  id: string
  descricao: string
  dataFatal: string
  responsavel: string
  status: PrazoStatus
}

export interface Verbas {
  pedidoReclamante: number
  riscoSCC: number
  tipoRisco: RiscoNivel
  provisaoRecomendada: number
  valorAcordo?: number
  valorCondenacao?: number
  depositoRecursal?: number
  honorarios?: number
  rubricas: Rubrica[]
}

export interface Rubrica {
  descricao: string
  valor: number
}

export interface Processo {
  id: string
  numero: string
  vara: string
  tribunal: string
  comarca: string
  reclamante: string
  advogadoReclamante: string
  preposto?: string
  fase: ProcessoFase
  status: ProcessoStatus
  risco: RiscoNivel
  dataDistribuicao: string
  ultimoAndamento: string
  proximoEvento?: string
  proximoEventoData?: string
  andamentos: Andamento[]
  audiencias: Audiencia[]
  prazos: Prazo[]
  verbas: Verbas
  observacoes?: string
}

export interface Usuario {
  id: string
  nome: string
  email: string
  empresa: string
  avatar?: string
}
