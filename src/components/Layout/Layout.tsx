import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { T } from '../../theme'

export default function Layout() {
  return (
    <div className="flex min-h-screen" style={{ background: T.bg }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: '14rem' }}>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
