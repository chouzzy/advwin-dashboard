import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { T } from '../../theme'
import { useData } from '../../context/DataContext'

export default function Layout() {
  const { isLoading, error } = useData()

  return (
    <div className="flex min-h-screen" style={{ background: T.bg }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: '14rem' }}>
        {isLoading && (
          <div className="fixed top-0 left-0 right-0 z-50 h-0.5" style={{ background: T.bg }}>
            <div className="h-full animate-pulse" style={{ background: T.copper, width: '60%' }} />
          </div>
        )}
        {error && (
          <div className="px-6 py-2 text-xs flex items-center gap-2" style={{ background: T.redBg, color: T.red, borderBottom: `1px solid ${T.red}33` }}>
            <span>⚠</span>
            <span>Sem conexão com o banco de dados — exibindo dados de demonstração. ({error})</span>
          </div>
        )}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
