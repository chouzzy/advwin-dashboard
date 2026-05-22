import { Bell, Search } from 'lucide-react'
import { T } from '../../theme'

interface HeaderProps { title: string; subtitle?: string }

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="px-8 py-4 flex items-center justify-between sticky top-0 z-30"
      style={{ background: T.bg, borderBottom: `1px solid ${T.b1}` }}>
      <div>
        <h1 className="text-sm font-semibold tracking-wide" style={{ color: T.t1 }}>{title}</h1>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: T.t3 }}>{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.t3 }} />
          <input type="text" placeholder="Buscar processo..."
            className="pl-8 pr-4 py-2 text-xs rounded-sm outline-none w-48 transition-all"
            style={{ background: T.s1, border: `1px solid ${T.b1}`, color: T.t2 }}
            onFocus={e => { e.target.style.borderColor = T.copper + '66'; e.target.style.color = T.t1 }}
            onBlur={e => { e.target.style.borderColor = T.b1; e.target.style.color = T.t2 }}
          />
        </div>

        <button className="relative w-8 h-8 flex items-center justify-center rounded-sm"
          style={{ background: T.s1, border: `1px solid ${T.b1}`, color: T.t3 }}>
          <Bell size={14} />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
            style={{ background: T.copper, fontSize: 9, fontWeight: 700, color: '#000' }}>3</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-sm flex items-center justify-center"
            style={{ background: '#1E1208', border: `1px solid ${T.copper}33` }}>
            <span style={{ color: T.copper, fontSize: 11, fontWeight: 700 }}>M</span>
          </div>
          <p className="text-xs font-medium hidden md:block" style={{ color: T.t2 }}>Meridional</p>
        </div>
      </div>
    </header>
  )
}
