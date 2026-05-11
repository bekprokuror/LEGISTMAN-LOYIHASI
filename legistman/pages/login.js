import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Login() {
  const [telegramId, setTelegramId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    if (!telegramId) { setError("Telegram ID kiriting"); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/status?telegram_id=${telegramId}`)
      const data = await res.json()
      if (data.status === 'approved') {
        localStorage.setItem('legistman_user', JSON.stringify({ telegram_id: telegramId, full_name: data.full_name }))
        router.push('/dashboard')
      } else if (data.status === 'pending') {
        setError("So'rovingiz hali tasdiqlanmagan. Admin xabarini kuting.")
      } else if (data.status === 'rejected') {
        setError("Afsuski, so'rovingiz rad etilgan.")
      } else {
        setError("Siz ro'yxatdan o'tmagansiz.")
      }
    } catch {
      setError('Xatolik yuz berdi')
    }
    setLoading(false)
  }

  return (
    <>
      <Head><title>Kirish — LEGISTMAN</title></Head>
      <nav style={{padding:'14px 32px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/" style={{fontFamily:'var(--font-display)',fontSize:'19px',letterSpacing:'1px'}}>
          LEGIST<span style={{color:'var(--gold)'}}>MAN</span>
        </Link>
      </nav>

      <main style={{maxWidth:'380px',margin:'56px auto',padding:'0 20px'}}>
        <div style={{textAlign:'center',marginBottom:'24px'}}>
          <div style={{fontFamily:'var(--font-display)',fontSize:'22px',marginBottom:'6px'}}>
            LEGIST<span style={{color:'var(--gold)'}}>MAN</span>
          </div>
          <div style={{fontSize:'14px',color:'var(--text-muted)'}}>Hisobingizga kiring</div>
        </div>

        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'14px',padding:'24px'}}>
          <div style={{marginBottom:'12px'}}>
            <label style={{fontSize:'12px',color:'var(--text-muted)',display:'block',marginBottom:'4px'}}>Telegram ID</label>
            <input
              type="text"
              placeholder="123456789"
              value={telegramId}
              onChange={e=>setTelegramId(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&handleLogin()}
            />
            <div style={{fontSize:'11px',color:'var(--text-muted)',marginTop:'4px'}}>
              Telegram ID ni bilmaysizmi? <Link href="https://t.me/userinfobot" target="_blank" style={{color:'var(--gold)'}}>@userinfobot</Link> dan oling
            </div>
          </div>

          {error && (
            <div style={{background:'#FCEBEB',color:'#791F1F',padding:'10px 12px',borderRadius:'8px',fontSize:'13px',marginBottom:'12px'}}>
              {error}
            </div>
          )}

          <button className="btn-gold" style={{width:'100%',padding:'12px'}} onClick={handleLogin} disabled={loading}>
            {loading ? 'Tekshirilmoqda...' : 'Kirish'}
          </button>

          <div style={{textAlign:'center',marginTop:'14px',fontSize:'13px',color:'var(--text-muted)'}}>
            Hisob yo'qmi? <Link href="/register" style={{color:'var(--gold)'}}>Ro'yxatdan o'ting</Link>
          </div>
        </div>
      </main>
    </>
  )
}
