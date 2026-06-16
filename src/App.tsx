import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Processos from './pages/Processos'
import ProcessoDetalhe from './pages/ProcessoDetalhe'
import Verbas from './pages/Verbas'
import Importar from './pages/Importar'
import { DataProvider } from './context/DataContext'
import { T } from './theme'

function App() {
  return (
    <DataProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="processos" element={<Processos />} />
          <Route path="processos/:id" element={<ProcessoDetalhe />} />
          <Route path="verbas" element={<Verbas />} />
          <Route path="importar" element={<Importar />} />
          <Route path="notificacoes" element={<Notificacoes />} />
          <Route path="configuracoes" element={<Placeholder title="Configurações" />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
    </DataProvider>
  )
}

function Notificacoes() {
  const notifs = [
    { title: 'Prazo vencendo em 5 dias', desc: 'Embargos de declaração ao acórdão — Wellington Rodrigues Lima', time: 'Há 2 horas', unread: true },
    { title: 'Nova audiência agendada', desc: 'Audiência inicial marcada para 28/05/2026 — Rafael Augusto Monteiro', time: 'Há 1 dia', unread: true },
    { title: 'Andamento registrado', desc: 'Acórdão publicado parcialmente favorável — Wellington Rodrigues Lima', time: 'Há 2 dias', unread: true },
    { title: 'Processo encerrado', desc: 'Acordo homologado em 10/02/2026 — Luciana Ferreira Alves', time: 'Há 3 meses', unread: false },
  ]
  return (
    <div>
      <div className="px-8 py-4 sticky top-0 z-30" style={{ background: T.bg, borderBottom: `1px solid ${T.b1}` }}>
        <h1 className="text-sm font-semibold" style={{ color: T.t1 }}>Notificações</h1>
        <p className="text-xs mt-0.5" style={{ color: T.t3 }}>3 não lidas</p>
      </div>
      <div className="p-8 space-y-2">
        {notifs.map((n, i) => (
          <div key={i} className="flex gap-5 px-6 py-5" style={{ background: T.s1, border: `1px solid ${T.b1}` }}>
            <div className="w-0.5 self-stretch rounded-full flex-shrink-0"
              style={{ background: n.unread ? T.copper : T.b1 }} />
            <div className="flex-1">
              <p className="text-xs font-semibold" style={{ color: n.unread ? T.t1 : T.t2 }}>{n.title}</p>
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: T.t3 }}>{n.desc}</p>
              <p className="text-xs mt-2" style={{ color: T.t4 }}>{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-8 text-center">
      <p className="text-xs tracking-widest uppercase" style={{ color: T.t4, letterSpacing: '0.12em' }}>{title}</p>
      <p className="text-xs mt-2" style={{ color: T.t4 }}>Em desenvolvimento</p>
    </div>
  )
}

export default App
