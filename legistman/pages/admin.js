import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const ADMIN_ID = '7869342062'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('pending')
  const [adminKey, setAdminKey] = useState('')
  const [authed, setAuthed] = useState(false)
  const [error, setError] = useState('')

  const fetchUsers = async (key) => {
    const res = await fetch(`/api/admin/users?adminKey=${key}`)
    if (res.status === 403) return false
    const data = await res.json()
    setUsers(data)
    return true
  }

  const login = async () => {
    if (adminKey !== ADMIN_ID) {
      setError("Noto'g'ri kalit")
      return
    }
    setLoading(true)
    const ok = await fetchUsers(adminKey)
    if (ok) setAuthed(true)
    else setError("Xatolik yuz berdi")
    setLoading(false)
  }

  const updateStatus = async (telegram_id, status) => {
    await fetch(`/api/admin/users?adminKey=${ADMIN_ID}&update=true&telegram_id=${telegram_id}&status=${status}`)
    setUsers(u => u.map(x => x.telegram_id === telegram_id ? { ...x, status } : x))
  }

  const filtered = users.filter(u =>
    tab === 'all' ? true :
    tab === 'pending' ? u.status === 'pending' :
    tab === 'approved' ? u.status === 'approved' :
    u.status === 'rejected'
  )

  const counts = {
    pending: users.filter(u => u.status === 'pending').length,
    approved: users.filter(u => u.status === 'approved').length,
    rejected: users.filter(u => u.status === 'rejected').length,
  }

  if (!authed) return (
    <>
      <Head><title>Admin — LEGISTMAN</title></Head>
      <main style={{maxWidth:'360px',margin:'80px auto',padding:'0 20px'}}>
        <div style={{textAlign:'center',marginBottom:'24px'}}>
          <div style={{fontFamily:'serif',fontSize:'22px',marginBottom:'6px'}}>
            LEGIST<span style={{color:'#B87A1F'}}>MAN</span>
          </div>
          <div style={{fontSize:'14px',color:'#666'}}>Admin panel</div>
        </div>
        <div style={{background:'#fff',border:'1px solid #eee',borderRadius:'14px',padding:'24px'}}>
          <label style={{fontSize:'12px',color:'#666',display:'block',marginBottom:'4px'}}>Admin kalit (Telegram ID)</label>
          <input type="password" placeholder="••••••••" value={adminKey} onChange={e=>setAdminKey(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} style={{width:'100%',padding:'10px',border:'1px solid #ddd',borderRadius:'8px',marginBottom:'8px'}} />
          {error && <div style={{color:'red',fontSize:'13px',marginBottom:'8px'}}>{error}</div>}
          <button onClick={login} disabled={loading} style={{width:'100%',padding:'11px',background:'#B87A1F',color:'#fff',border:'none',borderRadius:'8px',cursor:'pointer'}}>
            {loading ? 'Tekshirilmoqda...' : 'Kirish'}
          </button>
        </div>
      </main>
    </>
  )

  return (
    <>
      <Head><title>Admin Panel — LEGISTMAN</title></Head>
      <nav style={{padding:'12px 32px',borderBottom:'1px solid #eee',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/" style={{fontFamily:'serif',fontSize:'19px'}}>
          LEGIST<span style={{color:'#B87A1F'}}>MAN</span>
        </Link>
        <span style={{fontSize:'13px',background:'#F5E6C8',color:'#7A500F',padding:'4px 12px',borderRadius:'20px'}}>Admin</span>
      </nav>

      <main style={{maxWidth:'800px',margin:'0 auto',padding:'28px 20px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'24px'}}>
          {[['Kutayotgan',counts.pending,'#FAEEDA','#633806'],['Tasdiqlangan',counts.approved,'#EAF3DE','#27500A'],['Rad etilgan',counts.rejected,'#FCEBEB','#791F1F']].map(([label,count,bg,color])=>(
            <div key={label} style={{background:bg,borderRadius:'10px',padding:'16px',textAlign:'center'}}>
              <div style={{fontSize:'24px',fontWeight:600,color}}>{count}</div>
              <div style={{fontSize:'13px',color}}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{display:'flex',borderBottom:'1px solid #eee',marginBottom:'16px'}}>
          {[['pending','Kutayotganlar'],['approved','Tasdiqlangan'],['rejected','Rad etilgan'],['all','Barchasi']].map(([key,label])=>(
            <button key={key} onClick={()=>setTab(key)} style={{padding:'8px 16px',fontSize:'13px',background:'transparent',border:'none',borderBottom:tab===key?'2px solid #B87A1F':'2px solid transparent',color:tab===key?'#B87A1F':'#666',cursor:'pointer',marginBottom:'-1px'}}>
              {label}
            </button>
          ))}
        </div>

        <div style={{background:'#fff',border:'1px solid #eee',borderRadius:'12px',overflow:'hidden'}}>
          {filtered.length === 0
            ? <div style={{padding:'24px',textAlign:'center',color:'#666'}}>Hozircha yo'q</div>
            : filtered.map((u,i) => (
              <div key={u.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px',borderBottom:i<filtered.length-1?'1px solid #eee':'none',flexWrap:'wrap',gap:'8px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                  <div style={{width:'38px',height:'38px',borderRadius:'50%',background:'#F5E6C8',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:500,color:'#7A500F'}}>
                    {u.full_name?.[0]}
                  </div>
                  <div>
                    <div style={{fontSize:'14px',fontWeight:500}}>{u.full_name}</div>
                    <div style={{fontSize:'12px',color:'#666'}}>{u.username ? `@${u.username}` : `ID: ${u.telegram_id}`}</div>
                  </div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <span style={{fontSize:'11px',padding:'3px 10px',borderRadius:'12px',background:u.status==='approved'?'#EAF3DE':u.status==='rejected'?'#FCEBEB':'#FAEEDA',color:u.status==='approved'?'#27500A':u.status==='rejected'?'#791F1F':'#633806'}}>
                    {u.status==='approved'?'Tasdiqlangan':u.status==='rejected'?'Rad etilgan':'Kutmoqda'}
                  </span>
                  {u.status==='pending' && <>
                    <button onClick={()=>updateStatus(u.telegram_id,'approved')} style={{background:'#EAF3DE',border:'1px solid #3B6D11',color:'#27500A',padding:'5px 12px',borderRadius:'8px',fontSize:'12px',cursor:'pointer'}}>✓ Tasdiqlash</button>
                    <button onClick={()=>updateStatus(u.telegram_id,'rejected')} style={{background:'#FCEBEB',border:'1px solid #A32D2D',color:'#791F1F',padding:'5px 8px',borderRadius:'8px',fontSize:'12px',cursor:'pointer'}}>✗</button>
                  </>}
                  {u.status==='approved' && <button onClick={()=>updateStatus(u.telegram_id,'rejected')} style={{background:'transparent',border:'1px solid #ddd',color:'#666',padding:'5px 10px',borderRadius:'8px',fontSize:'12px',cursor:'pointer'}}>Bloklash</button>}
                </div>
              </div>
            ))
          }
        </div>
      </main>
    </>
  )
}
