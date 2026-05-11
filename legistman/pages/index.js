import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'

export default function Home() {
  return (
    <>
      <Head>
        <title>LEGISTMAN — Huquq Online Platformasi</title>
        <meta name="description" content="O'zbekistonda huquqiy ta'limning eng yaxshi platformasi" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <nav className={styles.nav}>
        <div className={styles.logo}>LEGIST<span>MAN</span></div>
        <div className={styles.navLinks}>
          <Link href="/login" className="btn-outline" style={{padding:'7px 16px',fontSize:'13px'}}>Kirish</Link>
          <Link href="/register" className="btn-gold" style={{padding:'7px 16px',fontSize:'13px'}}>Ro'yxatdan o'tish</Link>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.badge}>⚖️ O'zbekistondagi №1 Huquq Platformasi</div>
          <h1 className={styles.title}>
            Huquqni <em>professional</em><br/>darajada o'rganing
          </h1>
          <p className={styles.subtitle}>
            Video darslar, testlar va qo'llanmalar orqali huquq sohasida<br/>
            bilimingizni oshiring. Ekspert muallimlardan o'rganing.
          </p>
          <div className={styles.heroBtns}>
            <Link href="/register" className="btn-gold" style={{padding:'13px 32px',fontSize:'15px'}}>
              Telegram orqali kirish →
            </Link>
            <Link href="#kurslar" className="btn-outline" style={{padding:'12px 28px',fontSize:'15px'}}>
              Kurslarni ko'rish
            </Link>
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.stat}><span>50+</span>Video darslar</div>
          <div className={styles.statDivider}/>
          <div className={styles.stat}><span>200+</span>Test savollari</div>
          <div className={styles.statDivider}/>
          <div className={styles.stat}><span>10+</span>Qo'llanmalar</div>
          <div className={styles.statDivider}/>
          <div className={styles.stat}><span>Admin</span>Tasdiqlash tizimi</div>
        </div>

        <section id="kurslar" className={styles.section}>
          <h2 className={styles.sectionTitle}>Kurslar</h2>
          <p className={styles.sectionSub}>Barcha mavzular bir joyda</p>
          <div className={styles.coursesGrid}>
            {[
              { icon: '⚖️', tag: 'Fuqarolik', title: 'Fuqarolik huquqiga kirish', lessons: 12, hours: '4s' },
              { icon: '🏛️', tag: 'Konstitutsiya', title: "O'zbekiston Konstitutsiyasi", lessons: 8, hours: '3s' },
              { icon: '🔨', tag: 'Jinoyat', title: 'Jinoyat huquqi asoslari', lessons: 15, hours: '6s' },
              { icon: '📋', tag: 'Mehnat', title: 'Mehnat huquqi va nizolar', lessons: 10, hours: '3.5s' },
            ].map((c, i) => (
              <div key={i} className={styles.courseCard}>
                <div className={styles.courseThumb}>{c.icon}</div>
                <div className={styles.courseBody}>
                  <span className={styles.courseTag}>{c.tag}</span>
                  <h3>{c.title}</h3>
                  <div className={styles.courseMeta}>{c.lessons} dars · {c.hours}</div>
                  <div className={styles.courseLock}>🔒 A'zolik kerak</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.howSection}>
          <h2 className={styles.sectionTitle}>Qanday ishlaydi?</h2>
          <div className={styles.steps}>
            {[
              ['01', 'Telegram orqali ro\'yxatdan o\'ting'],
              ['02', 'Admin so\'rovingizni ko\'rib chiqadi (1-24 soat)'],
              ['03', 'Tasdiqlangach, Telegram da xabar olasiz'],
              ['04', 'Barcha kurslarga to\'liq kirish ochiladi'],
            ].map(([num, text]) => (
              <div key={num} className={styles.step}>
                <div className={styles.stepNum}>{num}</div>
                <div className={styles.stepText}>{text}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.logo}>LEGIST<span>MAN</span></div>
        <div style={{fontSize:'13px',color:'var(--text-muted)'}}>© 2025 LEGISTMAN. Barcha huquqlar himoyalangan.</div>
      </footer>
    </>
  )
}
