import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Register() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ full_name: '', phone: '', purpose: '' })
  const [telegramId, setTelegramId] = useState('')
  const [error, setError] = useState('')

  // Telegram Login Widget callback
  const handleTelegramAuth = async (user) => {
    setTelegramId(String(user.id))
    setForm(f => ({ ...f, full_name: `${user.first_name} ${user.last_name || ''}`.trim() }))
    setStep(2)
  }

  // Telegram widget script loader
  const loadTelegramWidget = () => {
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', 'LEGISTMAN_bot')
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-radius', '8')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    script.async = true
    document.getElementById('tg-widget').appendChild(script)
    window.onTelegramAuth = handleTelegramAuth
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram_id: telegramId,
          full_name: form.full_name,
          phone: form.phone,
          purpose: form.purpose,
        }),
      })
      const data = await res.json()
      if (data.success || data.existing) setStep(3)
      else setError(data.error || 'Xatolik yuz berdi')
    } catch {
      setError('Internet bilan muammo bor')
    }
    setLoading(false)
  }

  return (
    <>
      <Head><title>Ro'yxatdan o'tish — LEGISTMAN</title></Head>
      <nav style={{padding:'14px 32px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/" style={{fontFamily:'var(--font-display)',fontSize:'19px',letterSpacing:'1px'}}>
          LEGIST<span style={{color:'var(--gold)'}}>MAN</span>
        </Link>
        <Link href="/login" style={{fontSize:'13px',color:'var(--text-muted)'}}>Allaqachon a'zomisiz? Kirish</Link>
      </nav>

      <main style={{maxWidth:'420px',margin:'48px auto',padding:'0 20px'}}>
        <div style={{textAlign:'center',marginBottom:'28px'}}>
          <div style={{fontFamily:'var(--font-display)',fontSize:'22px',marginBottom:'6px'}}>
            LEGIST<span style={{color:'var(--gold)'}}>MAN</span>
          </div>
          <div style={{fontSize:'14px',color:'var(--text-muted)'}}>A'zolik so'rovi</div>
        </div>

        {/* Qadam 1: Telegram */}
        {step === 1 && (
          <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'14px',padding:'28px',textAlign:'center'}}>
            <div style={{fontSize:'40px',marginBottom:'12px'}}>✈️</div>
            <h2 style={{fontFamily:'var(--font-display)',fontSize:'20px',marginBottom:'8px',fontWeight:500}}>Telegram orqali kiring</h2>
            <p style={{fontSize:'13px',color:'var(--text-muted)',marginBottom:'24px',lineHeight:'1.7'}}>
              Ro'yxatdan o'tish uchun Telegram hisobingiz ishlatiladi. Parol kerak emas.
            </p>
            <div id="tg-widget" style={{display:'flex',justifyContent:'center',marginBottom:'16px'}}></div>
            <button
              onClick={loadTelegramWidget}
              style={{
                display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',
                width:'100%',padding:'13px',background:'#229ED9',color:'#fff',
                border:'none',borderRadius:'10px',fontSize:'15px',fontWeight:500,cursor:'pointer'
              }}
            >
              <span style={{fontSize:'20px'}}>✈️</span> Telegram orqali davom etish
            </button>
            <p style={{fontSize:'11px',color:'var(--text-muted)',marginTop:'10px'}}>Faqat ism va username ko'riladi</p>
          </div>
        )}

        {/* Qadam 2: Forma */}
        {step === 2 && (
          <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'14px',padding:'24px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'20px',paddingBottom:'16px',borderBottom:'1px solid var(--border)'}}>
              <div style={{width:'42px',height:'42px',borderRadius:'50%',background:'var(--gold-light)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:500,fontSize:'16px',color:'var(--gold-dark)'}}>
                {form.full_name[0]}
              </div>
              <div>
                <div style={{fontWeight:500,fontSize:'14px'}}>{form.full_name}</div>
                <div style={{fontSize:'12px',color:'#229ED9'}}>Telegram ulandi ✓</div>
              </div>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:'12px',marginBottom:'16px'}}>
              <div>
                <label style={{fontSize:'12px',color:'var(--text-muted)',display:'block',marginBottom:'4px'}}>To'liq ism *</label>
                <input value={form.full_name} onChange={e=>setForm(f=>({...f,full_name:e.target.value}))} />
              </div>
              <div>
                <label style={{fontSize:'12px',color:'var(--text-muted)',display:'block',marginBottom:'4px'}}>Telefon raqam</label>
                <input type="tel" placeholder="+998 90 123 45 67" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} />
              </div>
              <div>
                <label style={{fontSize:'12px',color:'var(--text-muted)',display:'block',marginBottom:'4px'}}>Maqsad (ixtiyoriy)</label>
                <input placeholder="Huquq sohasini o'rganmoqchiman..." value={form.purpose} onChange={e=>setForm(f=>({...f,purpose:e.target.value}))} />
              </div>
            </div>

            {error && <div style={{background:'#FCEBEB',color:'#791F1F',padding:'10px 12px',borderRadius:'8px',fontSize:'13px',marginBottom:'12px'}}>{error}</div>}

            <button className="btn-gold" style={{width:'100%',padding:'12px'}} onClick={handleSubmit} disabled={loading}>
              {loading ? 'Yuborilmoqda...' : "So'rov yuborish"}
            </button>
          </div>
        )}

        {/* Qadam 3: Kutish */}
        {step === 3 && (
          <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'14px',padding:'32px',textAlign:'center'}}>
            <div style={{width:'60px',height:'60px',background:'var(--gold-light)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:'26px'}}>⏳</div>
            <h2 style={{fontFamily:'var(--font-display)',fontSize:'20px',marginBottom:'8px',fontWeight:500}}>So'rov yuborildi!</h2>
            <p style={{fontSize:'13px',color:'var(--text-muted)',lineHeight:'1.7',marginBottom:'20px'}}>
              Admin sizning so'rovingizni ko'rib chiqadi. Tasdiqlangach, Telegram orqali xabar olasiz.
            </p>
            <div style={{background:'var(--gold-light)',borderRadius:'10px',padding:'14px',fontSize:'13px',color:'var(--gold-dark)'}}>
              ✈️ <strong>@LEGISTMAN_bot</strong> da xabar kutib turing
            </div>
            <Link href="/" style={{display:'block',marginTop:'16px',fontSize:'13px',color:'var(--text-muted)'}}>← Bosh sahifaga qaytish</Link>
          </div>
        )}
      </main>
    </>
  )
}
