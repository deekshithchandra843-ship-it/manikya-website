import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight, ArrowUpRight, ExternalLink, Check,
  Instagram, Youtube, Facebook, Linkedin, MapPin,
  Volume2, VolumeX,
} from 'lucide-react';

/* ── InView hook ── */
function useInView(t = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: t });
    obs.observe(el); return () => obs.disconnect();
  }, [t]);
  return { ref, v };
}

/* ── Counter ── */
function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const { ref, v } = useInView();
  useEffect(() => {
    if (!v) return;
    let c = 0; const step = end / 80;
    const t = setInterval(() => { c = Math.min(c + step, end); setN(Math.floor(c)); if (c >= end) clearInterval(t); }, 20);
    return () => clearInterval(t);
  }, [v, end]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

/* ── Services data ── */
const services = [
  { id: 1, num: '01', title: 'NewsJunction', sub: 'Digital Media Network', desc: 'Five-language media powerhouse delivering 24/7 live news — Kannada, Hindi, Tamil, Telugu, English.', link: '/services', ext: 'https://newsjunction.net/stream.php', accent: '#d45656', grad: 'linear-gradient(135deg,#d45656,#c37d0d)' },
  { id: 2, num: '02', title: 'Pearl Farms', sub: 'Alternative Investment', desc: 'Invest in living freshwater pearl ecosystems in Mandya, Karnataka. 30–40% ROI per cycle.', link: '/pearl-farms', accent: '#3772cf', grad: 'linear-gradient(135deg,#3772cf,#06b6d4)' },
  { id: 3, num: '03', title: 'Manikya Market', sub: 'Desi Commerce', desc: 'Authentic Indian village products reaching global doorsteps. Zero burden on rural artisans.', link: '/services', accent: '#00b48a', grad: 'linear-gradient(135deg,#00b48a,#059669)' },
  { id: 4, num: '04', title: 'Manikya Traders', sub: 'Marketing & Trading', desc: 'B2B food machinery marketing & grain commodity trading. We connect manufacturers to buyers across Karnataka.', link: '/services', accent: '#c37d0d', grad: 'linear-gradient(135deg,#c37d0d,#d45656)' },
  { id: 5, num: '05', title: 'Manikya Properties', sub: 'Real Estate', desc: 'Your trusted real estate middleman — property search, bank loan facilitation, legal verification.', link: '/services', accent: '#2563eb', grad: 'linear-gradient(135deg,#1e3a5f,#3772cf)' },
  { id: 6, num: '06', title: 'Manikya Money', sub: 'Financial Services', desc: 'Accessible, affordable loan services with speedy approvals, low interest, and zero hidden charges.', link: '/services', accent: '#6b5cf6', grad: 'linear-gradient(135deg,#6b5cf6,#8b5cf6)' },
  { id: 7, num: '07', title: 'Manikya Heritage', sub: 'Coming Soon', desc: "A living museum of Karnataka's 5000-year culture — folk arts, Ayurvedic wellness, heritage stays.", link: '/services', soon: true, accent: '#0d9488', grad: 'linear-gradient(135deg,#00d4a4,#00b48a)' },
];


const stats = [
  { value: 24, suffix: '+', label: 'Years' },
  { value: 500, suffix: '+', label: 'Partners' },
  { value: 7, suffix: '', label: 'Verticals' },
  { value: 50, suffix: '+', label: 'Vendors' },
];

const defaultSocialLinks = {
  instagram: 'https://www.instagram.com/newsjunctiondigital?igsh=eGd5czZldWdsMDEw',
  facebook: 'https://www.facebook.com/share/18cqpxCY8w/',
  youtube: 'https://youtube.com/@newsjunctiondigital?si=Qb5X358zSsEwiOrZ',
  linkedin: 'https://linkedin.com/company/manikyaservices',
  maps: 'https://maps.google.com/?q=215+MGES+5th+Main+Road+RPC+Layout+Hampi+Nagar+Bengaluru+560104',
};

export default function Home() {
  const [activeSvc, setActiveSvc] = useState(0);
  const [heroVisible, setHeroVisible] = useState(true);
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);
  const [heroMuted, setHeroMuted] = useState(true);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const s1 = useInView(); const s2 = useInView(); const s3 = useInView(); const s4 = useInView();

  useEffect(() => {
    fetch('https://manikya-backend.onrender.com/api/social-links')
      .then(r => r.json())
      .then(data => setSocialLinks(prev => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  // Browsers block autoplay with sound, so the hero video starts muted.
  // Unmute it on the user's first interaction anywhere on the page.
  useEffect(() => {
    const unmute = () => {
      const v = heroVideoRef.current;
      if (v) {
        v.muted = false;
        v.volume = 1;
        v.play().catch(() => {});
        setHeroMuted(false);
      }
      events.forEach(e => window.removeEventListener(e, unmute));
    };
    const events = ['pointerdown', 'click', 'keydown', 'touchstart', 'scroll'];
    events.forEach(e => window.addEventListener(e, unmute, { once: true, passive: true }));
    return () => events.forEach(e => window.removeEventListener(e, unmute));
  }, []);


  return (
    <div className="mk" style={{ overflowX: 'hidden', width: '100%' }}>
      <style>{`
        .home-hero-cloud-a { top: -60px; left: 6%; width: 320px; height: 200px; }
        .home-hero-cloud-b { top: 40px; right: 8%; width: 380px; height: 240px; }
        .home-hero-cloud-c { bottom: -40px; left: 38%; width: 420px; height: 220px; }
        .home-svc-grid { display: grid; grid-template-columns: 1fr 1.05fr; gap: 22px; align-items: start; }
        @media (max-width: 860px) { .home-svc-grid { grid-template-columns: 1fr; } }
        .home-svc-list { display: flex; flex-direction: column; gap: 10px; }
        .home-svc-item { display: flex; align-items: center; gap: 14px; padding: 13px 16px; border-radius: 14px; cursor: pointer; border: 1px solid var(--mk-hairline); background: var(--mk-canvas); position: relative; overflow: hidden; transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s ease, border-color .25s ease, background .25s ease; }
        .home-svc-item:hover { transform: translateX(5px); }
        .home-svc-num { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-family: var(--mk-mono); font-size: .82rem; font-weight: 700; color: #fff; flex-shrink: 0; transition: transform .3s cubic-bezier(.16,1,.3,1); box-shadow: 0 4px 14px rgba(10,10,10,0.12); }
        .home-svc-item:hover .home-svc-num, .home-svc-item.act .home-svc-num { transform: scale(1.1) rotate(-4deg); }
        .home-svc-detail { position: relative; border-radius: 18px; overflow: hidden; padding: clamp(1.75rem,4vw,2.75rem); display: flex; flex-direction: column; justify-content: center; min-height: 340px; background: var(--mk-canvas); border: 1px solid var(--mk-hairline); box-shadow: 0 16px 44px rgba(10,10,10,0.07); transition: box-shadow .35s ease; animation: homeDetailIn .45s cubic-bezier(.16,1,.3,1); }
        @keyframes homeDetailIn { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        .home-cta { transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s ease, filter .25s ease; }
        .home-cta:hover { transform: translateY(-3px); }
        .home-cta-fill:hover { filter: brightness(1.06); }
        .home-stat { text-align: center; padding: 14px; }
        /* Hero video sits inside a rounded, contained frame (card look) with
           margins around it — mobile-first. The frame's aspect-ratio controls
           the crop; the video uses object-fit:cover so it always fills cleanly. */
        .home-hero-wrap { position: relative; overflow: hidden;
          padding: clamp(26px,6vw,60px) clamp(12px,4vw,40px) clamp(28px,6vw,56px);
          background: radial-gradient(135% 105% at 50% 0%, #eaf6ff 0%, #d6ecfb 52%, #e9f4fb 100%); }
        /* Soft drifting aurora glow orbs behind the video — light sky blue palette */
        .home-hero-wrap::before, .home-hero-wrap::after { content: ''; position: absolute; border-radius: 50%;
          pointer-events: none; filter: blur(70px); opacity: .65; z-index: 0; }
        .home-hero-wrap::before { width: clamp(280px,55vw,460px); height: clamp(280px,55vw,460px);
          top: -14%; left: -10%; background: radial-gradient(circle, rgba(56,189,248,0.6), transparent 70%);
          animation: heroOrbA 15s ease-in-out infinite; }
        .home-hero-wrap::after { width: clamp(320px,60vw,520px); height: clamp(320px,60vw,520px);
          bottom: -22%; right: -12%; background: radial-gradient(circle, rgba(125,211,252,0.55), transparent 70%);
          animation: heroOrbB 19s ease-in-out infinite; }
        @keyframes heroOrbA { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(55px,38px) scale(1.15) } }
        @keyframes heroOrbB { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(-48px,-30px) scale(1.2) } }
        @media (prefers-reduced-motion: reduce) { .home-hero-wrap::before, .home-hero-wrap::after { animation: none; } }
        .home-hero-frame { position: relative; z-index: 1; overflow: hidden; width: 100%; max-width: 1200px;
          margin: 0 auto; border-radius: clamp(18px,4vw,30px); aspect-ratio: 16 / 10;
          border: 1px solid rgba(255,255,255,0.6);
          box-shadow: 0 26px 60px -26px rgba(15,52,84,0.4); }
        @media (min-width: 768px) { .home-hero-frame { aspect-ratio: 21 / 9; } }
        .home-hero-cta { position: relative; z-index: 1; }
        @media (max-width: 600px) { .home-stats { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>

{/* ── NEWSJUNCTION LIVE STRIP ── */}
      <a href="https://newsjunction.net/dashboard.php" target="_blank" rel="noopener noreferrer"
        style={{ display: 'block', background: 'var(--mk-canvas-dark)', textDecoration: 'none' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '9px clamp(1rem,3vw,2rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span className="mk-badge mk-badge-green" style={{ background: 'rgba(0,212,164,0.18)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4a4', display: 'inline-block' }} /> Live
            </span>
            <span style={{ fontFamily: 'var(--mk-font)', fontSize: '.82rem', fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>NewsJunction — Kannada · Hindi · Telugu · English · Marathi</span>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--mk-font)', fontSize: '.78rem', fontWeight: 600, color: '#fff' }}>
            Open Dashboard <ExternalLink size={12} />
          </span>
        </div>
      </a>

      {/* ── HERO (company intro video in a rounded, contained frame) ── */}
      <section className="home-hero-wrap">
        <div className="home-hero-frame">
          {/* Background intro video */}
          <video
            ref={heroVideoRef}
            autoPlay muted loop playsInline preload="auto"
            poster="/manikya-logo-transparent.png"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none' }}
          >
            <source src="/hero-intro.mp4?v=2" type="video/mp4" />
          </video>
          {/* Mute / unmute toggle */}
          <button
            type="button"
            aria-label={heroMuted ? 'Unmute video' : 'Mute video'}
            onClick={() => {
              const v = heroVideoRef.current;
              if (!v) return;
              const next = !heroMuted;
              v.muted = next;
              if (!next) { v.volume = 1; v.play().catch(() => {}); }
              setHeroMuted(next);
            }}
            style={{
              position: 'absolute', bottom: 16, right: 16, zIndex: 3,
              width: 44, height: 44, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff',
              background: 'rgba(3,9,24,0.45)', border: '1px solid rgba(255,255,255,0.35)',
              backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              transition: 'background .25s ease, transform .25s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(3,9,24,0.7)'; e.currentTarget.style.transform = 'scale(1.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(3,9,24,0.45)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {heroMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          {/* Light readability scrim — keeps the video clearly visible */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            background: 'linear-gradient(180deg, rgba(3,9,24,0.28) 0%, rgba(3,9,24,0.10) 45%, rgba(3,9,24,0.45) 100%)' }} />
        </div>
        {/* CTA buttons — below the video frame */}
        <div className="home-hero-cta" style={{ marginTop: 'clamp(18px,4vw,30px)', textAlign: 'center', opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'all .8s cubic-bezier(.16,1,.3,1)' }}>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/services" className="mk-btn mk-btn-primary mk-btn-lg">
              Explore Services <ArrowRight size={16} />
            </Link>
            <Link to="/about" className="mk-btn mk-btn-outline mk-btn-lg">
              About Manikya
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{ background: '#2a2a2e', borderBottom: '1px solid var(--mk-hairline)' }} ref={s2.ref}>
        <div className="mk-container" style={{ padding: 'clamp(32px,5vw,48px) clamp(1.25rem,4vw,2rem)' }}>
          <div className="mk-grid mk-grid-4 home-stats">
            {stats.map((st, i) => (
              <div key={i} className={`home-stat mk-reveal ${s2.v ? 'mk-on' : ''}`} style={{ transitionDelay: `${i * 80}ms` }}>
                <div style={{ fontSize: 'clamp(2rem,4vw,3.25rem)', fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  <Counter end={st.value} suffix={st.suffix} />
                </div>
                <div className="mk-eyebrow" style={{ marginTop: 8, marginBottom: 0, color: 'rgba(255,255,255,0.7)' }}>{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="mk-section mk-sec-mint" ref={s1.ref}>
        <div className="mk-container">
          <div className={`mk-reveal ${s1.v ? 'mk-on' : ''}`} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 'clamp(2rem,4vw,3rem)' }}>
            <div style={{ maxWidth: 560 }}>
              <p className="mk-eyebrow">What we do</p>
              <h2 className="mk-h1" style={{ margin: 0 }}>Seven verticals. One vision.</h2>
            </div>
            <Link to="/services" className="mk-btn mk-btn-outline mk-btn-sm">View all <ArrowUpRight size={14} /></Link>
          </div>

          <div className="home-svc-grid">
            <div className="home-svc-list">
              {services.map((sv, i) => {
                const on = activeSvc === i;
                return (
                  <div key={sv.id}
                    className={`home-svc-item ${on ? 'act' : ''}`}
                    onClick={() => setActiveSvc(i)}
                    style={{
                      borderColor: on ? sv.accent : 'var(--mk-hairline)',
                      background: on ? `${sv.accent}0f` : 'var(--mk-canvas)',
                      boxShadow: on ? `0 14px 32px -14px ${sv.accent}` : 'none',
                    }}>
                    {on && <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: sv.grad }} />}
                    <span className="home-svc-num" style={{ background: sv.grad, boxShadow: `0 5px 16px -3px ${sv.accent}cc` }}>{sv.num}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: on ? sv.accent : 'var(--mk-ink)', fontSize: '1rem', transition: 'color .25s' }}>{sv.title}</div>
                      <div className="mk-small" style={{ color: 'var(--mk-stone)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sv.sub}</div>
                    </div>
                    {sv.soon && <span className="mk-badge" style={{ fontSize: 11, padding: '2px 8px', background: `${sv.accent}1a`, color: sv.accent, borderColor: `${sv.accent}40` }}>Soon</span>}
                    <ArrowRight size={16} style={{ color: on ? sv.accent : 'var(--mk-muted)', flexShrink: 0, transform: on ? 'translateX(2px)' : 'none', transition: 'transform .25s, color .25s' }} />
                  </div>
                );
              })}
            </div>

            <div className="home-svc-detail" key={activeSvc} style={{ boxShadow: `0 20px 52px -22px ${services[activeSvc].accent}` }}>
              <span style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: services[activeSvc].grad }} />
              <span className="mk-badge" style={{ alignSelf: 'flex-start', marginBottom: 16, background: `${services[activeSvc].accent}14`, color: services[activeSvc].accent, borderColor: `${services[activeSvc].accent}40` }}>{services[activeSvc].sub}</span>
              <h3 className="mk-h2" style={{ margin: '0 0 14px' }}>{services[activeSvc].title}</h3>
              <p className="mk-body" style={{ color: 'var(--mk-steel)', marginBottom: 24 }}>{services[activeSvc].desc}</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {services[activeSvc].soon ? (
                  <span className="mk-btn" style={{ pointerEvents: 'none', background: `${services[activeSvc].accent}14`, color: services[activeSvc].accent, border: `1px solid ${services[activeSvc].accent}40` }}>Coming Soon</span>
                ) : (
                  <>
                    <Link to={services[activeSvc].link} className="mk-btn home-cta home-cta-fill" style={{ background: services[activeSvc].grad, color: '#fff', border: 'none', boxShadow: `0 10px 24px -6px ${services[activeSvc].accent}` }}>Learn more <ArrowRight size={14} /></Link>
                    {(services[activeSvc] as any).ext && (
                      <a href={(services[activeSvc] as any).ext} target="_blank" rel="noopener noreferrer" className="mk-btn home-cta" style={{ background: 'transparent', color: services[activeSvc].accent, border: `1.5px solid ${services[activeSvc].accent}` }}>Watch Live <ExternalLink size={13} /></a>
                    )}
                  </>
                )}
              </div>
              <div className="mk-mono" style={{ position: 'absolute', bottom: 4, right: 18, fontSize: 'clamp(3.5rem,9vw,6rem)', fontWeight: 700, color: `${services[activeSvc].accent}14`, lineHeight: 1, userSelect: 'none' }}>{services[activeSvc].num}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MANIKYA MONEY FEATURE ── */}
      <section className="mk-section mk-sec-sky" ref={s3.ref}>
        <div className="mk-container">
          <div className="mk-grid mk-grid-2" style={{ alignItems: 'center', gap: 'clamp(2rem,5vw,4rem)' }}>
            <div className={`mk-reveal ${s3.v ? 'mk-on' : ''}`}>
              <p className="mk-eyebrow">Financial Services</p>
              <h2 className="mk-h1" style={{ margin: '0 0 16px' }}>Manikya Money Service</h2>
              <p className="mk-lead" style={{ marginBottom: 26 }}>
                Empowering your financial future with trust and transparency — accessible capital with fast approvals and no hidden charges.
              </p>
              <div className="mk-grid mk-grid-2" style={{ marginBottom: 28 }}>
                {[['Speedy Approvals', '24–48 hour processing'], ['Low Interest Rates', 'Competitive & transparent'], ['No Hidden Charges', 'What you see is what you get'], ['Minimal Docs', 'Digital-friendly process']].map(([t, d]) => (
                  <div key={t} className="mk-card" style={{ padding: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: 'var(--mk-ink)', fontSize: '.95rem', marginBottom: 4 }}>
                      <Check size={15} color="#00b48a" /> {t}
                    </div>
                    <div className="mk-small" style={{ color: 'var(--mk-stone)' }}>{d}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/contact" className="mk-btn mk-btn-primary">Apply for a loan <ArrowRight size={14} /></Link>
                <Link to="/services" className="mk-btn mk-btn-outline">Learn more</Link>
              </div>
            </div>
            <div className={`mk-reveal ${s3.v ? 'mk-on' : ''}`}>
              <div className="mk-card" style={{ padding: 'clamp(1.75rem,3vw,2.5rem)' }}>
                <p className="mk-eyebrow">Our core values</p>
                {[['Integrity', 'We uphold the highest standards of honesty in all our actions.'], ['Excellence', 'Striving to deliver the best possible service to every client.'], ['Accountability', 'We take responsibility for our commitments and results.'], ['Innovation', 'Constantly improving our processes to serve you better.']].map(([t, d], i, arr) => (
                  <div key={t} style={{ display: 'flex', gap: 14, padding: '16px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--mk-hairline)' : 'none', alignItems: 'flex-start' }}>
                    <span style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(0,212,164,0.12)', color: '#00b48a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={15} /></span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--mk-ink)', marginBottom: 3, fontSize: '.95rem' }}>{t}</div>
                      <div className="mk-small" style={{ color: 'var(--mk-steel)' }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY MANIKYA ── */}
      <section className="mk-section mk-sec-lavender" ref={s4.ref}>
        <div className="mk-container">
          <div className={`mk-section-head mk-reveal ${s4.v ? 'mk-on' : ''}`}>
            <p className="mk-eyebrow">Why Manikya</p>
            <h2 className="mk-h1" style={{ margin: 0 }}>Built on trust. Driven by purpose.</h2>
          </div>
          <div className="mk-grid mk-grid-3">
            {[
              { n: '01', t: 'Circular Synergy', d: 'Each of our 7 verticals feeds and strengthens the others — media drives commerce, farms attract investors, finance enables growth.' },
              { n: '02', t: '24+ Years Excellence', d: 'Two decades of journalistic integrity, entrepreneurial grit, and community empowerment — building trust one venture at a time since 2002.' },
              { n: '03', t: 'Rural Empowerment', d: 'Every product, every farm, every story — rooted in the empowerment of Indian farmers, artisans, women entrepreneurs, and local communities.' },
              { n: '04', t: 'Tech + Tradition', d: 'We blend modern technology with ancient wisdom — digital media meets pearl farming, Ayurveda meets e-commerce, fintech meets community banking.' },
              { n: '05', t: 'Financial Inclusion', d: 'Manikya Money Service ensures everyone has access to quick capital with speedy approvals, low rates, and zero hidden charges.' },
              { n: '06', t: 'Bengaluru to Bharat', d: 'Headquartered in Bengaluru, our operations and impact span Karnataka and all of India — local roots, national ambitions.' },
            ].map((item, i) => (
              <div key={i} className={`mk-card mk-card-hover mk-reveal ${s4.v ? 'mk-on' : ''}`} style={{ transitionDelay: `${i * 70}ms` }}>
                <span className="mk-mono" style={{ fontSize: '.78rem', fontWeight: 500, color: 'var(--mk-green-deep)' }}>{item.n}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--mk-ink)', margin: '12px 0 10px' }}>{item.t}</h3>
                <p className="mk-small" style={{ color: 'var(--mk-steel)', margin: 0, lineHeight: 1.6 }}>{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA (dark band) ── */}
      <section className="mk-hero-dark mk-section" style={{ textAlign: 'center' }}>
        <div className="mk-container" style={{ maxWidth: 760, position: 'relative', zIndex: 1 }}>
          <p className="mk-eyebrow" style={{ color: 'var(--mk-green-soft)' }}>Partner with us</p>
          <h2 className="mk-display" style={{ color: '#fff', margin: '0 0 18px' }}>Ready to grow together?</h2>
          <p className="mk-lead" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 560, margin: '0 auto 32px' }}>
            Join 500+ partners and investors who chose Manikya as their growth partner across media, farming, commerce, wellness, real estate, and financial services.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
            <Link to="/contact" className="mk-btn mk-btn-primary mk-btn-lg">Contact us <ArrowRight size={16} /></Link>
            <Link to="/about" className="mk-btn mk-btn-glass-dark mk-btn-lg">About us</Link>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: <Instagram size={18} />, href: socialLinks.instagram },
              { icon: <Facebook size={18} />, href: socialLinks.facebook },
              { icon: <Youtube size={18} />, href: socialLinks.youtube },
              { icon: <Linkedin size={18} />, href: socialLinks.linkedin },
              { icon: <MapPin size={18} />, href: socialLinks.maps },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', backdropFilter: 'blur(8px)' }}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
