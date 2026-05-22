import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { T } from '../theme'

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => navigate('/dashboard'), 1000)
  }

  return (
    <div className="min-h-screen flex" style={{ background: T.bg }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 relative overflow-hidden"
        style={{ background: T.s1, borderRight: `1px solid ${T.b1}` }}>
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="absolute left-0 right-0 h-px"
              style={{ top: `${(i + 1) * 9}%`, background: '#FFFFFF03' }} />
          ))}
        </div>

        <div className="relative">
          <div className="mb-14">
            <span style={{ color: T.copper, fontFamily: 'serif', fontWeight: 700, fontSize: 26, letterSpacing: '-0.5px' }}>SCC</span>
            <p className="text-xs tracking-widest uppercase mt-2" style={{ color: T.t3, letterSpacing: '0.15em' }}>
              Sociedade de Advogados
            </p>
          </div>
          <p className="text-xs tracking-widest uppercase mb-5" style={{ color: T.t3, letterSpacing: '0.12em' }}>Portal do Cliente</p>
          <h1 style={{ fontFamily: 'serif', fontSize: 46, fontWeight: 400, color: T.t1, lineHeight: 1.15, letterSpacing: '-0.5px' }}>
            Acompanhe<br />
            <em style={{ color: T.copper, fontStyle: 'italic' }}>seus processos</em><br />
            em tempo real
          </h1>
          <p className="mt-6 text-sm leading-relaxed max-w-xs" style={{ color: T.t3 }}>
            Visibilidade completa sobre o seu contencioso trabalhista — prazos, audiências e valores centralizados.
          </p>
        </div>

        <div className="relative grid grid-cols-2 gap-2">
          {[
            { v: '50+', l: 'Processos monitorados' },
            { v: 'LGPD', l: 'Em conformidade' },
            { v: '15', l: 'Anos de experiência' },
            { v: '100%', l: 'Segurança de dados' },
          ].map(s => (
            <div key={s.l} className="p-4" style={{ border: `1px solid ${T.b1}` }}>
              <p style={{ color: T.copper, fontSize: 18, fontWeight: 600, fontFamily: 'serif' }}>{s.v}</p>
              <p className="text-xs mt-1" style={{ color: T.t3 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10">
            <span style={{ color: T.copper, fontFamily: 'serif', fontWeight: 700, fontSize: 22 }}>SCC</span>
            <p className="text-xs mt-1 tracking-widest uppercase" style={{ color: T.t3 }}>Portal do Cliente</p>
          </div>

          <div className="mb-10">
            <h2 className="text-lg font-semibold" style={{ color: T.t1 }}>Acesse sua conta</h2>
            <p className="text-xs mt-1.5" style={{ color: T.t3 }}>Dados fornecidos pela equipe SCC</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: T.t3, letterSpacing: '0.1em' }}>E-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com.br"
                className="w-full px-4 py-3 text-sm outline-none rounded-sm"
                style={{ background: T.s1, border: `1px solid ${T.b1}`, color: T.t1 }}
                onFocus={e => (e.target.style.borderColor = T.copper + '66')}
                onBlur={e => (e.target.style.borderColor = T.b1)}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs tracking-widest uppercase" style={{ color: T.t3, letterSpacing: '0.1em' }}>Senha</label>
                <button type="button" className="text-xs" style={{ color: T.copper }}>Esqueci a senha</button>
              </div>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 text-sm outline-none rounded-sm"
                  style={{ background: T.s1, border: `1px solid ${T.b1}`, color: T.t1 }}
                  onFocus={e => (e.target.style.borderColor = T.copper + '66')}
                  onBlur={e => (e.target.style.borderColor = T.b1)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: T.t3 }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-sm mt-2"
              style={{ background: loading ? T.s2 : T.copper, color: loading ? T.copper : '#0C0C0C' }}>
              {loading ? (
                <><div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />Entrando...</>
              ) : (
                <>Acessar painel <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 text-center" style={{ borderTop: `1px solid ${T.b1}` }}>
            <p className="text-xs" style={{ color: T.t4 }}>
              Problemas de acesso?{' '}
              <a href="#" style={{ color: T.t3 }}>Contate a SCC</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
