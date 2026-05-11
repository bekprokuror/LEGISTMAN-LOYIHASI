import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

const COURSES = [
  { id: 1, icon: '⚖️', tag: 'Fuqarolik', title: 'Fuqarolik huquqiga kirish', lessons: 12, duration: '4 soat', color: '#E6F1FB' },
  { id: 2, icon: '🏛️', tag: 'Konstitutsiya', title: "O'zbekiston Konstitutsiyasi", lessons: 8, duration: '3 soat', color: '#F5E6C8' },
  { id: 3, icon: '🔨', tag: 'Jinoyat', title: 'Jinoyat huquqi asoslari', lessons: 15, duration: '6 soat', color: '#EEEDFE' },
  { id: 4, icon: '📋', tag: 'Mehnat', title: 'Mehnat huquqi va nizolar', lessons: 10, duration: '3.5 soat', color: '#EAF3DE' },
  { id: 5, icon: '🏢', tag: 'Tadbirkorlik', title: 'Tadbirkorlik huquqi', lessons: 9, duration: '3 soat', color: '#FAEEDA' },
  { id: 6, icon: '🏠', tag: 'Mulk', title: 'Mulk va uy-joy huquqi', lessons: 7, duration: '2.5 soat', color: '#FAECE7' },
]

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('legistman_user')
    if (!saved) { router.push('/login'); return }
    setUser(JSON.parse(saved))
  }, [])

  const logout = () => {
    localStorage.removeItem('legistman_user')
    router.push('/')
  }

  if (!user) return null

  return (
    <>
      <Head><title>Kurslar — LEGISTMAN</title></Head>

      <nav style={{padding:'12px 32px',borderBottom:'1px solid var(--border)',background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:10}}>
        <Link href="/dashboard" style={{fontFamily:'var(--font-display)',fontSize:'19px',letterSpacing:'1px'}}>
          LEGIST<span style={{color:'var(--gold)'}}>MAN</span>
        </Link>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <div style={{fontSize:'13px',color:'var(--text-muted)'}}>👤 {user.full_name}</div>
          <button onClick={logout} style={{background:'transparent',border:'1px solid var(--border)',padding:'6px 12px',borderRadius:'8px',fontSize:'12px',color:'var(--text-muted)',cursor:'pointer'}}>Chiqish</button>
        </div>
      </nav>

      <main style={{maxWidth:'960px',margin:'0 auto',padding:'32px 20px'}}>
        <div style={{background:'var(--gold-light)',borderRadius:'14px',padding:'20px 24px',marginBottom:'28px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'12px'}}>
          <div>
            <div style={{fontFamily:'var(--font-display)',fontSize:'20px',marginBottom:'4px'}}>Xush kelibsiz, {user.full_name}! 👋</div>
            <div style={{fontSize:'13px',color:'var(--gold-dark)'}}>Barcha kurslarga to'liq kirish ochiq</div>
          </div>
          <div style={{display:'flex',gap:'20px'}}>
            <div style={{textAlign:'center'}}><div style={{fontSize:'20px',fontWeight:600,color:'var(--gold)'}}>{COURSES.length}</div><div style={{fontSize:'12px',color:'var(--gold-dark)'}}>Kurs</div></div>
            <div style={{textAlign:'center'}}><div style={{fontSize:'20px',fontWeight:600,color:'var(--gold)'}}>200+</div><div style={{fontSize:'12px',color:'var(--gold-dark)'}}>Test</div></div>
          </div>
        </div>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
          <h2 style={{fontFamily:'var(--font-display)',fontSize:'22px',fontWeight:500}}>Kurslar</h2>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'14px'}}>
          {COURSES.map(c => (
            <div key={c.id} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'12px',overflow:'hidden',cursor:'pointer',transition:'box-shadow 0.2s'}}
              onMouseOver={e=>e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'}
              onMouseOut={e=>e.currentTarget.style.boxShadow='none'}
            >
              <div style={{height:'90px',background:c.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'38px'}}>{c.icon}</div>
              <div style={{padding:'14px'}}>
                <span style={{fontSize:'11px',background:'var(--gold-light)',color:'var(--gold-dark)',padding:'2px 10px',borderRadius:'10px'}}>{c.tag}</span>
                <h3 style={{fontSize:'14px',fontWeight:500,margin:'8px 0 4px',lineHeight:'1.4'}}>{c.title}</h3>
                <div style={{fontSize:'12px',color:'var(--text-muted)'}}>{c.lessons} dars · {c.duration}</div>
                <div style={{fontSize:'12px',color:'#3B6D11',marginTop:'6px'}}>✓ Ochiq</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
