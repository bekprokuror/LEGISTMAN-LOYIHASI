import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('pending')
  const [adminKey, setAdminKey] = useState('')
  const [authed, setAuthed] = useState(false)

  const fetchUsers = async (key) => {
    const res = await fetch(`/api/admin/users?adminKey=${key}`)
    if (res.status === 403) return false
    const data = await res.json()
    setUsers(data)
    setLoading(false)
    return true
  }

  const login = async () => {
    const ok = await fetchUsers(adminKey)
    if (ok) setAuthed(true)
    else alert("Noto'g'ri kalit")
  }

  const updateStatus = async (telegram_id, status) => {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    await supabase.from('users').update({ status }).eq('telegram_id', telegram_id)
    setUsers(u => u.map(x => x.telegram_id === telegram_id ? { ...x, status } : x))
  }

  const filtered = users.filter(u =>
    tab === 'all' ? true :
    tab === 'pending' ? u.status === 'pending' :
    tab === 'approved' ? u.status === 'approved' :
    u.status === 'rejected'
  )

  const counts = {
    pending: users.filter(u=>u.status==='pending').length,
    approved: users.filter(u=>u.status==='approved').length,
    rejected: users.filter(u=>u.status==='rejected').length,
  }

  if (!authed) return (
    <>
      <Head><title>Admin — LEGISTMAN</title></Head>
      <main style={{maxWidth:'360px',margin:'80px auto',padding:'0 20px'}}>
        <div style={{textAlign:'center',marginBottom:'24px'}}>
          <div style={{fontFamily:'var(--font-display)',fontSize:'22px',marginBottom:'6px'}}>
            LEGIST<span style={{color:'var(--gold)'}}>MAN</span>
          </div>
          <div style={{fontSize:'14px',color:'var(--text-muted)'}}>Admin panel</div>
        </div>
        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'14px',padding:'24px'}}>
          <label style={{fontSize:'12px',color:'var(--text-muted)',display:'block',marginBottom:'4px'}}>Admin kalit (Telegram ID)</label>
          <input type="password" placeholder="••••••••" value={adminKey} onChange={e=>setAdminKey(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} />
          <button className="btn-gold" style={{width:'100%',padding:'11px',marginTop:'12px'}} onClick={login}>Kirish</button>
        </div>
      </main>
    </>
  )

  return (
    <>
      <Head><title>Admin Panel — LEGISTMAN</title></Head>
      <nav style={{padding:'12px 32px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/" style={{fontFamily:'var(--font-display)',fontSize:'19px',letterSpacing:'1px'}}>
          LEGIST<span style={{color:'var(--gold)'}}>MAN</span>
        </Link>
        <span style={{fontSize:'13px',background:'var(--gold-light)',color:'var(--gold-dark)',padding:'4px 12px',borderRadius:'20px'}}>🛡️ Admin</span>
      </nav>

      <main style={{maxWidth:'800px',margin:'0 auto',padding:'28px 20px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'24px'}}>
          {[['Kutayotgan',counts.pending,'#FAEEDA','#633806'],['Tasdiqlangan',counts.approved,'#EAF3DE','#27500A'],['Rad etilgan',counts.rejected,'#FCEBEB','#791F1F']].map(([label,count,bg,color])=>(
            <div key={label} style={{background:bg,borderRadius:'10px',padding:'16px',textAlign:'center'}}>
              <div style={{fontSize:'24px',fontWeight:600,color,fontFamily:'var(--font-display)'}}>{count}</div>
              <div style={{fontSize:'13px',color}}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{display:'flex',gap:0,borderBottom:'1px solid var(--border)',marginBottom:'16px'}}>
          {[['pending','Kutayotganlar'],['approved','Tasdiqlangan'],['rejected','Rad etilgan'],['all','Barchasi']].map(([key,label])=>(
            <button key={key} onClick={()=>setTab(key)} style={{padding:'8px 16px',fontSize:'13px',background:'transparent',border:'none',borderBottom:tab===key?'2px solid var(--gold)':'2px solid transparent',color:tab===key?'var(--gold)':'var(--text-muted)',cursor:'pointer',marginBottom:'-1px'}}>
              {label}
            </button>
          ))}
        </div>

        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'12px',overflow:'hidden'}}>
          {loading ? <div style={{padding:'24px',textAlign:'center',color:'var(--text-muted)'}}>Yuklanmoqda...</div>
          : filtered.length === 0 ? <div style={{padding:'24px',textAlign:'center',color:'var(--text-muted)'}}>Hozircha yo'q</div>
          : filtered.map((u, i) => (
            <div key={u.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px',borderBottom:i<filtered.length-1?'1px solid var(--border)':'none',flexWrap:'wrap',gap:'8px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                <div style={{width:'38px',height:'38px',borderRadius:'50%',background:'var(--gold-light)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:500,fontSize:'14px',color:'var(--gold-dark)',flexShrink:0}}>
                  {u.full_name?.[0]}
                </div>
                <div>
                  <div style={{fontSize:'14px',fontWeight:500}}>{u.full_name}</div>
                  <div style={{fontSize:'12px',color:'var(--text-muted)'}}>
                    {u.username ? `@${u.username}` : `ID: ${u.telegram_id}`}
                    {u.phone && ` · ${u.phone}`}
                  </div>
                  {u.purpose && <div style={{fontSize:'12px',color:'var(--text-muted)',fontStyle:'italic'}}>"{u.purpose}"</div>}
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <span style={{fontSize:'11px',padding:'3px 10px',borderRadius:'12px',
                  background:u.status==='approved'?'#EAF3DE':u.status==='rejected'?'#FCEBEB':'#FAEEDA',
                  color:u.status==='approved'?'#27500A':u.status==='rejected'?'#791F1F':'#633806'
                }}>
                  {u.status==='approved'?'Tasdiqlangan':u.status==='rejected'?'Rad etilgan':'Kutmoqda'}
                </span>
                {u.status === 'pending' && <>
                  <button onClick={()=>updateStatus(u.telegram_id,'approved')} style={{background:'#EAF3DE',border:'1px solid #3B6D11',color:'#27500A',padding:'5px 12px',borderRadius:'8px',fontSize:'12px',cursor:'pointer'}}>✓ Tasdiqlash</button>
                  <button onClick={()=>updateStatus(u.telegram_id,'rejected')} style={{background:'#FCEBEB',border:'1px solid #A32D2D',color:'#791F1F',padding:'5px 8px',borderRadius:'8px',fontSize:'12px',cursor:'pointer'}}>✗</button>
                </>}
                {u.status === 'approved' && <button onClick={()=>updateStatus(u.telegram_id,'rejected')} style={{background:'transparent',border:'1px solid var(--border)',color:'var(--text-muted)',padding:'5px 10px',borderRadius:'8px',fontSize:'12px',cursor:'pointer'}}>Bloklash</button>}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
