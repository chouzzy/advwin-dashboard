import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, DollarSign, Bell, Settings, LogOut } from 'lucide-react'
import { T } from '../../theme'

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/processos',    icon: FileText,         label: 'Processos' },
  { to: '/verbas',       icon: DollarSign,       label: 'Verbas' },
  { to: '/notificacoes', icon: Bell,             label: 'Notificações', badge: 3 },
]

export default function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 flex flex-col z-40"
      style={{ background: T.bg, borderRight: `1px solid ${T.b1}` }}>

      {/* Logo */}
      <div className="px-6 pt-7 pb-5" style={{ borderBottom: `1px solid ${T.b1}` }}>
        <span style={{ color: T.copper, fontFamily: 'serif', fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px' }}>
          SCC
        </span>
        <p className="text-xs tracking-widest uppercase mt-1.5" style={{ color: T.t3, letterSpacing: '0.13em' }}>
          Portal do Cliente
        </p>
      </div>

      {/* Empresa */}
      <div className="px-6 py-5" style={{ borderBottom: `1px solid ${T.b1}` }}>
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: T.t3, letterSpacing: '0.1em' }}>
          Empresa
        </p>
        <p className="text-sm font-medium leading-snug" style={{ color: T.t1 }}>
          Construtora<br />Meridional Ltda
        </p>
        <div className="flex items-center gap-1.5 mt-3">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: T.copper }}></div>
          <p className="text-xs" style={{ color: T.t2 }}>10 processos ativos</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', fontSize: 13, fontWeight: 500,
              borderRadius: 3, transition: 'all 0.1s',
              background:  isActive ? '#1E1208' : 'transparent',
              color:       isActive ? T.copper : T.t3,
              textDecoration: 'none',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={15} style={{ color: isActive ? T.copper : T.t3, flexShrink: 0 }} />
                <span style={{ flex: 1, color: isActive ? T.copper : T.t2 }}>{label}</span>
                {badge && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 2,
                    background: T.copper + '22', color: T.copper,
                  }}>{badge}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 space-y-0.5" style={{ borderTop: `1px solid ${T.b1}` }}>
        <NavLink to="/configuracoes" style={{ display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 12px', fontSize: 13, borderRadius: 3, color: T.t3, textDecoration: 'none' }}>
          <Settings size={14} style={{ color: T.t3 }} />
          <span>Configurações</span>
        </NavLink>
        <button onClick={() => navigate('/login')} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          width: '100%', padding: '8px 12px', fontSize: 13,
          borderRadius: 3, color: T.t3, background: 'transparent', border: 'none', cursor: 'pointer',
        }}>
          <LogOut size={14} style={{ color: T.t3 }} />
          <span>Sair</span>
        </button>
      </div>

      <div className="px-6 py-3" style={{ borderTop: `1px solid ${T.b1}` }}>
        <p className="text-xs" style={{ color: T.t4 }}>SCC Sociedade de Advogados</p>
      </div>
    </aside>
  )
}
