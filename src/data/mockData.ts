import type { Processo, Usuario } from '../types'

export const usuarioMock: Usuario = {
  id: '1',
  nome: 'Construtora Meridional Ltda',
  email: 'juridico@meridional.com.br',
  empresa: 'Construtora Meridional Ltda',
}

export const processosMock: Processo[] = [
  {
    id: '1',
    numero: '0001234-45.2023.5.02.0381',
    vara: '1ª Vara do Trabalho de Santo André',
    tribunal: 'TRT 2ª Região',
    comarca: 'Santo André',
    reclamante: 'Carlos Eduardo Moreira',
    advogadoReclamante: 'Dr. Paulo Henrique Souza',
    preposto: 'Ana Paula Lima',
    fase: 'Conhecimento',
    status: 'Ativo',
    risco: 'Provável',
    dataDistribuicao: '2023-03-15',
    ultimoAndamento: 'Audiência de instrução realizada em 10/04/2026',
    proximoEvento: 'Sentença',
    proximoEventoData: '2026-06-20',
    andamentos: [
      { id: 'a1', data: '2023-03-15', descricao: 'Distribuição da ação trabalhista', fonte: 'PJe' },
      { id: 'a2', data: '2023-05-10', descricao: 'Citação do reclamado', fonte: 'PJe' },
      { id: 'a3', data: '2023-07-18', descricao: 'Audiência inicial – proposta de conciliação rejeitada', fonte: 'PJe' },
      { id: 'a4', data: '2024-02-12', descricao: 'Depoimento do preposto da empresa', fonte: 'PJe' },
      { id: 'a5', data: '2026-04-10', descricao: 'Audiência de instrução realizada. Encerrada a instrução processual.', fonte: 'PJe' },
    ],
    audiencias: [
      { id: 'au1', data: '2023-07-18', hora: '09:00', tipo: 'Inicial', status: 'Realizada', resultado: 'Conciliação frustrada', local: '1ª VT Santo André' },
      { id: 'au2', data: '2024-02-12', hora: '14:00', tipo: 'Instrução', status: 'Realizada', resultado: 'Depoimentos colhidos', local: '1ª VT Santo André' },
      { id: 'au3', data: '2026-04-10', hora: '10:30', tipo: 'Julgamento', status: 'Realizada', resultado: 'Encerrada instrução', local: '1ª VT Santo André' },
    ],
    prazos: [
      { id: 'p1', descricao: 'Memoriais finais', dataFatal: '2026-05-30', responsavel: 'Dr. Roberto Alves', status: 'Pendente' },
    ],
    verbas: {
      pedidoReclamante: 185000,
      riscoSCC: 72000,
      tipoRisco: 'Provável',
      provisaoRecomendada: 80000,
      depositoRecursal: 0,
      honorarios: 8640,
      rubricas: [
        { descricao: 'Horas extras e reflexos', valor: 68000 },
        { descricao: 'Adicional de insalubridade', valor: 32000 },
        { descricao: 'FGTS + multa 40%', valor: 41000 },
        { descricao: 'Aviso prévio indenizado', valor: 18000 },
        { descricao: 'Férias + 1/3', valor: 14000 },
        { descricao: 'Danos morais', valor: 12000 },
      ],
    },
    observacoes: 'Reclamante era operador de máquinas em área com ruído acima do limite legal. Risco de condenação em insalubridade é alto.',
  },
  {
    id: '2',
    numero: '0004567-12.2023.5.02.0072',
    vara: '2ª Vara do Trabalho de São Bernardo do Campo',
    tribunal: 'TRT 2ª Região',
    comarca: 'São Bernardo do Campo',
    reclamante: 'Fernanda Oliveira Santos',
    advogadoReclamante: 'Dra. Carla Mendes Ribeiro',
    fase: 'Recursal',
    status: 'Ativo',
    risco: 'Possível',
    dataDistribuicao: '2023-06-20',
    ultimoAndamento: 'Recurso ordinário interposto pela empresa em 15/03/2026',
    proximoEvento: 'Julgamento TRT',
    proximoEventoData: '2026-07-08',
    andamentos: [
      { id: 'a1', data: '2023-06-20', descricao: 'Distribuição da ação', fonte: 'PJe' },
      { id: 'a2', data: '2024-01-15', descricao: 'Sentença procedente em parte – condenação em R$ 38.500,00', fonte: 'PJe' },
      { id: 'a3', data: '2026-03-15', descricao: 'Interposição de Recurso Ordinário pela empresa', fonte: 'PJe' },
    ],
    audiencias: [
      { id: 'au1', data: '2023-10-05', hora: '08:30', tipo: 'Inicial', status: 'Realizada', resultado: 'Conciliação frustrada', local: '2ª VT SBC' },
      { id: 'au2', data: '2023-11-20', hora: '14:00', tipo: 'Instrução', status: 'Realizada', resultado: 'Instrução encerrada', local: '2ª VT SBC' },
    ],
    prazos: [],
    verbas: {
      pedidoReclamante: 95000,
      riscoSCC: 38500,
      tipoRisco: 'Possível',
      provisaoRecomendada: 42000,
      valorCondenacao: 38500,
      depositoRecursal: 9625,
      honorarios: 4620,
      rubricas: [
        { descricao: 'Horas extras', valor: 42000 },
        { descricao: 'FGTS + multa 40%', valor: 28000 },
        { descricao: 'Férias + 1/3', valor: 15000 },
        { descricao: '13º salário proporcional', valor: 10000 },
      ],
    },
  },
  {
    id: '3',
    numero: '0007891-33.2024.5.02.0441',
    vara: '3ª Vara do Trabalho de Mauá',
    tribunal: 'TRT 2ª Região',
    comarca: 'Mauá',
    reclamante: 'José Antônio Pereira',
    advogadoReclamante: 'Dr. Marcelo Figueiredo',
    fase: 'Execução',
    status: 'Ativo',
    risco: 'Provável',
    dataDistribuicao: '2024-01-08',
    ultimoAndamento: 'Penhora de conta bancária em 05/05/2026',
    proximoEvento: 'Leilão judicial',
    proximoEventoData: '2026-06-15',
    andamentos: [
      { id: 'a1', data: '2024-01-08', descricao: 'Distribuição', fonte: 'PJe' },
      { id: 'a2', data: '2024-08-22', descricao: 'Sentença – condenação total', fonte: 'PJe' },
      { id: 'a3', data: '2025-02-10', descricao: 'Trânsito em julgado', fonte: 'PJe' },
      { id: 'a4', data: '2025-04-15', descricao: 'Início da fase de execução', fonte: 'PJe' },
      { id: 'a5', data: '2026-05-05', descricao: 'Penhora on-line via BACENJUD – R$ 55.000,00', fonte: 'PJe' },
    ],
    audiencias: [],
    prazos: [
      { id: 'p1', descricao: 'Embargos à execução', dataFatal: '2026-05-26', responsavel: 'Dr. Roberto Alves', status: 'Pendente' },
    ],
    verbas: {
      pedidoReclamante: 120000,
      riscoSCC: 55000,
      tipoRisco: 'Provável',
      provisaoRecomendada: 60000,
      valorCondenacao: 55000,
      depositoRecursal: 0,
      honorarios: 6600,
      rubricas: [
        { descricao: 'Adicional de periculosidade', valor: 38000 },
        { descricao: 'Horas extras', valor: 32000 },
        { descricao: 'FGTS + multa 40%', valor: 26000 },
        { descricao: 'Danos morais', valor: 24000 },
      ],
    },
  },
  {
    id: '4',
    numero: '0002345-78.2024.5.02.0058',
    vara: '1ª Vara do Trabalho de Diadema',
    tribunal: 'TRT 2ª Região',
    comarca: 'Diadema',
    reclamante: 'Marcos Vinícius Teixeira',
    advogadoReclamante: 'Dra. Beatriz Castro',
    fase: 'Conhecimento',
    status: 'Ativo',
    risco: 'Remoto',
    dataDistribuicao: '2024-03-22',
    ultimoAndamento: 'Contestação apresentada em 20/05/2024',
    proximoEvento: 'Audiência de instrução',
    proximoEventoData: '2026-06-03',
    andamentos: [
      { id: 'a1', data: '2024-03-22', descricao: 'Distribuição', fonte: 'PJe' },
      { id: 'a2', data: '2024-05-20', descricao: 'Contestação apresentada com documentos', fonte: 'PJe' },
      { id: 'a3', data: '2024-09-14', descricao: 'Audiência inicial – frustrada conciliação', fonte: 'PJe' },
    ],
    audiencias: [
      { id: 'au1', data: '2024-09-14', hora: '10:00', tipo: 'Inicial', status: 'Realizada', resultado: 'Frustrada', local: '1ª VT Diadema' },
      { id: 'au2', data: '2026-06-03', hora: '09:00', tipo: 'Instrução', status: 'Agendada', local: '1ª VT Diadema' },
    ],
    prazos: [],
    verbas: {
      pedidoReclamante: 48000,
      riscoSCC: 12000,
      tipoRisco: 'Remoto',
      provisaoRecomendada: 15000,
      honorarios: 1440,
      rubricas: [
        { descricao: 'Horas extras', valor: 28000 },
        { descricao: 'Diferenças salariais', valor: 20000 },
      ],
    },
  },
  {
    id: '5',
    numero: '0009876-54.2022.5.02.0381',
    vara: '4ª Vara do Trabalho de Santo André',
    tribunal: 'TRT 2ª Região',
    comarca: 'Santo André',
    reclamante: 'Luciana Ferreira Alves',
    advogadoReclamante: 'Dr. Fernando Rocha',
    fase: 'Conhecimento',
    status: 'Encerrado',
    risco: 'Possível',
    dataDistribuicao: '2022-11-03',
    ultimoAndamento: 'Acordo homologado em 10/02/2026 – R$ 28.000,00',
    andamentos: [
      { id: 'a1', data: '2022-11-03', descricao: 'Distribuição', fonte: 'PJe' },
      { id: 'a2', data: '2023-04-18', descricao: 'Audiência inicial', fonte: 'PJe' },
      { id: 'a3', data: '2026-02-10', descricao: 'Acordo homologado em audiência de conciliação', fonte: 'PJe' },
    ],
    audiencias: [
      { id: 'au1', data: '2023-04-18', hora: '08:00', tipo: 'Inicial', status: 'Realizada', resultado: 'Frustrada', local: '4ª VT Santo André' },
      { id: 'au2', data: '2026-02-10', hora: '11:00', tipo: 'Conciliação', status: 'Realizada', resultado: 'Acordo homologado', local: '4ª VT Santo André' },
    ],
    prazos: [],
    verbas: {
      pedidoReclamante: 72000,
      riscoSCC: 28000,
      tipoRisco: 'Possível',
      provisaoRecomendada: 30000,
      valorAcordo: 28000,
      honorarios: 3360,
      rubricas: [
        { descricao: 'Horas extras e reflexos', valor: 35000 },
        { descricao: 'FGTS + multa 40%', valor: 22000 },
        { descricao: 'Danos morais', valor: 15000 },
      ],
    },
  },
  {
    id: '6',
    numero: '0003456-90.2024.5.02.0072',
    vara: '5ª Vara do Trabalho de São Bernardo do Campo',
    tribunal: 'TRT 2ª Região',
    comarca: 'São Bernardo do Campo',
    reclamante: 'Rafael Augusto Monteiro',
    advogadoReclamante: 'Dr. Gustavo Pinheiro',
    fase: 'Conhecimento',
    status: 'Ativo',
    risco: 'Provável',
    dataDistribuicao: '2024-07-10',
    ultimoAndamento: 'Citação do réu realizada em 22/08/2024',
    proximoEvento: 'Audiência inicial',
    proximoEventoData: '2026-05-28',
    andamentos: [
      { id: 'a1', data: '2024-07-10', descricao: 'Distribuição', fonte: 'PJe' },
      { id: 'a2', data: '2024-08-22', descricao: 'Citação realizada', fonte: 'PJe' },
    ],
    audiencias: [
      { id: 'au1', data: '2026-05-28', hora: '14:30', tipo: 'Inicial', status: 'Agendada', local: '5ª VT SBC' },
    ],
    prazos: [
      { id: 'p1', descricao: 'Apresentar documentos para audiência', dataFatal: '2026-05-25', responsavel: 'Dr. Roberto Alves', status: 'Pendente' },
    ],
    verbas: {
      pedidoReclamante: 210000,
      riscoSCC: 95000,
      tipoRisco: 'Provável',
      provisaoRecomendada: 100000,
      honorarios: 11400,
      rubricas: [
        { descricao: 'Adicional de insalubridade e reflexos', valor: 78000 },
        { descricao: 'Horas extras', valor: 55000 },
        { descricao: 'FGTS + multa 40%', valor: 42000 },
        { descricao: 'Danos morais e materiais', valor: 35000 },
      ],
    },
  },
  {
    id: '7',
    numero: '0005678-11.2023.5.02.0441',
    vara: '2ª Vara do Trabalho de Mauá',
    tribunal: 'TRT 2ª Região',
    comarca: 'Mauá',
    reclamante: 'Adriana Cristina Barbosa',
    advogadoReclamante: 'Dra. Renata Lopes',
    fase: 'Liquidação',
    status: 'Ativo',
    risco: 'Provável',
    dataDistribuicao: '2023-09-05',
    ultimoAndamento: 'Perito apresentou laudo de liquidação em 28/04/2026',
    proximoEvento: 'Impugnação ao laudo',
    proximoEventoData: '2026-06-10',
    andamentos: [
      { id: 'a1', data: '2023-09-05', descricao: 'Distribuição', fonte: 'PJe' },
      { id: 'a2', data: '2024-05-20', descricao: 'Sentença – procedente em parte', fonte: 'PJe' },
      { id: 'a3', data: '2024-11-15', descricao: 'Trânsito em julgado parcial', fonte: 'PJe' },
      { id: 'a4', data: '2025-03-10', descricao: 'Nomeação de perito para liquidação', fonte: 'PJe' },
      { id: 'a5', data: '2026-04-28', descricao: 'Laudo pericial de liquidação apresentado – R$ 44.200,00', fonte: 'PJe' },
    ],
    audiencias: [],
    prazos: [
      { id: 'p1', descricao: 'Impugnar laudo pericial de liquidação', dataFatal: '2026-06-10', responsavel: 'Dr. Roberto Alves', status: 'Pendente' },
    ],
    verbas: {
      pedidoReclamante: 88000,
      riscoSCC: 44200,
      tipoRisco: 'Provável',
      provisaoRecomendada: 48000,
      valorCondenacao: 44200,
      honorarios: 5304,
      rubricas: [
        { descricao: 'Horas extras', valor: 44000 },
        { descricao: 'FGTS + multa 40%', valor: 26000 },
        { descricao: 'Adicional noturno', valor: 18000 },
      ],
    },
  },
  {
    id: '8',
    numero: '0008765-22.2024.5.02.0058',
    vara: '2ª Vara do Trabalho de Diadema',
    tribunal: 'TRT 2ª Região',
    comarca: 'Diadema',
    reclamante: 'Thiago Almeida Cruz',
    advogadoReclamante: 'Dr. Leonardo Soares',
    fase: 'Conhecimento',
    status: 'Ativo',
    risco: 'Remoto',
    dataDistribuicao: '2024-11-18',
    ultimoAndamento: 'Contestação apresentada em 15/01/2025',
    proximoEvento: 'Audiência inicial',
    proximoEventoData: '2026-07-22',
    andamentos: [
      { id: 'a1', data: '2024-11-18', descricao: 'Distribuição', fonte: 'PJe' },
      { id: 'a2', data: '2025-01-15', descricao: 'Contestação apresentada', fonte: 'PJe' },
    ],
    audiencias: [
      { id: 'au1', data: '2026-07-22', hora: '10:30', tipo: 'Inicial', status: 'Agendada', local: '2ª VT Diadema' },
    ],
    prazos: [],
    verbas: {
      pedidoReclamante: 35000,
      riscoSCC: 8000,
      tipoRisco: 'Remoto',
      provisaoRecomendada: 10000,
      honorarios: 960,
      rubricas: [
        { descricao: 'Horas extras', valor: 20000 },
        { descricao: '13º salário', valor: 8000 },
        { descricao: 'Férias + 1/3', valor: 7000 },
      ],
    },
  },
  {
    id: '9',
    numero: '0001122-67.2025.5.02.0381',
    vara: '2ª Vara do Trabalho de Santo André',
    tribunal: 'TRT 2ª Região',
    comarca: 'Santo André',
    reclamante: 'Patrícia Gonçalves Nunes',
    advogadoReclamante: 'Dra. Simone Araújo',
    fase: 'Conhecimento',
    status: 'Ativo',
    risco: 'Possível',
    dataDistribuicao: '2025-02-14',
    ultimoAndamento: 'Citação realizada em 28/03/2025',
    proximoEvento: 'Audiência inicial',
    proximoEventoData: '2026-08-05',
    andamentos: [
      { id: 'a1', data: '2025-02-14', descricao: 'Distribuição', fonte: 'PJe' },
      { id: 'a2', data: '2025-03-28', descricao: 'Citação realizada', fonte: 'PJe' },
    ],
    audiencias: [
      { id: 'au1', data: '2026-08-05', hora: '08:00', tipo: 'Inicial', status: 'Agendada', local: '2ª VT Santo André' },
    ],
    prazos: [],
    verbas: {
      pedidoReclamante: 62000,
      riscoSCC: 25000,
      tipoRisco: 'Possível',
      provisaoRecomendada: 28000,
      honorarios: 3000,
      rubricas: [
        { descricao: 'Diferenças salariais', valor: 28000 },
        { descricao: 'Horas extras', valor: 20000 },
        { descricao: 'FGTS + multa 40%', valor: 14000 },
      ],
    },
  },
  {
    id: '10',
    numero: '0004433-88.2023.5.02.0072',
    vara: '3ª Vara do Trabalho de São Bernardo do Campo',
    tribunal: 'TRT 2ª Região',
    comarca: 'São Bernardo do Campo',
    reclamante: 'Wellington Rodrigues Lima',
    advogadoReclamante: 'Dr. André Bittencourt',
    fase: 'Recursal',
    status: 'Ativo',
    risco: 'Provável',
    dataDistribuicao: '2023-04-30',
    ultimoAndamento: 'Acórdão publicado – parcialmente favorável em 02/05/2026',
    proximoEvento: 'Embargos de declaração',
    proximoEventoData: '2026-05-16',
    andamentos: [
      { id: 'a1', data: '2023-04-30', descricao: 'Distribuição', fonte: 'PJe' },
      { id: 'a2', data: '2024-03-10', descricao: 'Sentença – condenação parcial R$ 67.000,00', fonte: 'PJe' },
      { id: 'a3', data: '2024-06-05', descricao: 'Interposição de Recurso Ordinário', fonte: 'PJe' },
      { id: 'a4', data: '2026-05-02', descricao: 'Acórdão publicado – mantida condenação em R$ 61.000,00', fonte: 'PJe' },
    ],
    audiencias: [],
    prazos: [
      { id: 'p1', descricao: 'Embargos de declaração ao acórdão', dataFatal: '2026-05-16', responsavel: 'Dr. Roberto Alves', status: 'Pendente' },
    ],
    verbas: {
      pedidoReclamante: 145000,
      riscoSCC: 61000,
      tipoRisco: 'Provável',
      provisaoRecomendada: 65000,
      valorCondenacao: 61000,
      depositoRecursal: 15250,
      honorarios: 7320,
      rubricas: [
        { descricao: 'Adicional de insalubridade', valor: 58000 },
        { descricao: 'Horas extras', valor: 48000 },
        { descricao: 'FGTS + multa 40%', valor: 24000 },
        { descricao: 'Danos morais', valor: 15000 },
      ],
    },
  },
]

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

export const getRiscoColor = (risco: string) => {
  switch (risco) {
    case 'Provável': return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' }
    case 'Possível': return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' }
    case 'Remoto': return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' }
    default: return { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' }
  }
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Ativo': return { bg: 'bg-blue-100', text: 'text-blue-700' }
    case 'Encerrado': return { bg: 'bg-gray-100', text: 'text-gray-600' }
    case 'Suspenso': return { bg: 'bg-yellow-100', text: 'text-yellow-700' }
    case 'Arquivado': return { bg: 'bg-slate-100', text: 'text-slate-600' }
    default: return { bg: 'bg-gray-100', text: 'text-gray-600' }
  }
}

export const getFaseColor = (fase: string) => {
  switch (fase) {
    case 'Conhecimento': return 'text-blue-600 bg-blue-50'
    case 'Recursal': return 'text-purple-600 bg-purple-50'
    case 'Execução': return 'text-red-600 bg-red-50'
    case 'Liquidação': return 'text-orange-600 bg-orange-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}
