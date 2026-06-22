import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import { services } from '../data/services';

function useInView(t = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: t });
    obs.observe(el); return () => obs.disconnect();
  }, [t]);
  return { ref, v };
}

export default function Services() {
  const grid = useInView(0.05);

  return (
    <div className="mk" style={{ overflowX: 'hidden' }}>
      <style>{`
        @keyframes svcRise { from { opacity:0; transform:translateY(26px) } to { opacity:1; transform:translateY(0) } }
        @keyframes svcOrb  { 0%,100% { transform:translate3d(0,0,0) scale(1) } 50% { transform:translate3d(40px,-30px,0) scale(1.12) } }
        @keyframes svcOrb2 { 0%,100% { transform:translate3d(0,0,0) scale(1) } 50% { transform:translate3d(-50px,30px,0) scale(1.18) } }
        @keyframes svcGrad { 0% { background-position:0% 50% } 50% { background-position:100% 50% } 100% { background-position:0% 50% } }
        .svc-grad-text {
          background:linear-gradient(110deg,#00d4a4,#7cebcb,#3772cf,#00d4a4);
          background-size:300% 100%;
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent; color:transparent;
          animation:svcGrad 8s ease infinite;
        }
        .svc-orb { position:absolute; border-radius:50%; filter:blur(70px); pointer-events:none; }

        .svc-tiles {
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          gap:clamp(16px, 2.4vw, 26px);
        }
        @media(max-width:900px){ .svc-tiles { grid-template-columns:repeat(2, 1fr); } }
        @media(max-width:600px){ .svc-tiles { grid-template-columns:1fr; } }

        .svc-tile {
          display:flex; flex-direction:column;
          background:#fff;
          border:1px solid var(--mk-hairline);
          border-radius:20px;
          overflow:hidden;
          text-decoration:none;
          box-shadow:0 6px 22px rgba(20,20,40,0.06);
          opacity:0; transform:translateY(30px);
          transition:transform .55s cubic-bezier(.16,1,.3,1), box-shadow .35s ease, border-color .35s ease, opacity .55s cubic-bezier(.16,1,.3,1);
        }
        .svc-tiles.on .svc-tile { opacity:1; transform:translateY(0); }
        .svc-tile:hover {
          transform:translateY(-8px);
          box-shadow:0 22px 48px rgba(20,20,40,0.16);
          border-color:transparent;
        }
        .svc-tile-media { position:relative; aspect-ratio:4/3; overflow:hidden; background:#f4f5f7; border-bottom:1px solid var(--mk-hairline); }
        .svc-tile-media img { width:100%; height:100%; object-fit:contain; transition:transform .6s cubic-bezier(.16,1,.3,1); }
        .svc-tile:hover .svc-tile-media img { transform:scale(1.04); }
        .svc-tile-accent { position:absolute; top:0; left:0; right:0; height:5px; z-index:2; }
        .svc-tile-badge {
          position:absolute; top:14px; right:14px; z-index:3;
          display:inline-flex; align-items:center; gap:5px;
          padding:5px 11px; border-radius:999px;
          font-family:var(--mk-font); font-size:.66rem; font-weight:700;
          letter-spacing:.04em; text-transform:uppercase; color:#fff;
          background:rgba(10,10,14,0.55); border:1px solid rgba(255,255,255,0.28);
          -webkit-backdrop-filter:blur(6px); backdrop-filter:blur(6px);
        }
        .svc-tile-body { padding:20px 22px 22px; display:flex; flex-direction:column; flex:1; }
        .svc-tile-eyebrow { display:flex; align-items:center; gap:9px; margin-bottom:10px; }
        .svc-tile-chip { width:28px; height:28px; border-radius:9px; display:flex; align-items:center; justify-content:center; color:#fff; flex-shrink:0; box-shadow:0 4px 12px rgba(10,10,30,0.18); }
        .svc-tile-sub { font-family:var(--mk-font); font-size:.68rem; font-weight:700; letter-spacing:.13em; text-transform:uppercase; }
        .svc-tile-title { font-family:var(--mk-font); font-weight:700; font-size:1.18rem; color:var(--mk-ink); margin:0 0 9px; letter-spacing:-.01em; }
        .svc-tile-desc {
          color:var(--mk-steel); font-size:.88rem; line-height:1.6; margin:0 0 18px;
          display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;
        }
        .svc-tile-cta {
          margin-top:auto; display:inline-flex; align-items:center; gap:7px;
          font-family:var(--mk-font); font-weight:700; font-size:.84rem;
        }
        .svc-tile-cta svg { transition:transform .3s cubic-bezier(.16,1,.3,1); }
        .svc-tile:hover .svc-tile-cta svg { transform:translateX(4px); }
      `}</style>

      {/* ── HERO ── */}
      <section className="mk-hero-dark" style={{ position:'relative', overflow:'hidden', padding:'clamp(60px,9vw,104px) 0 clamp(48px,7vw,72px)' }}>
        <div className="svc-orb" style={{ width:420, height:420, top:-130, right:-80, background:'rgba(0,212,164,0.28)', animation:'svcOrb 14s ease-in-out infinite' }} />
        <div className="svc-orb" style={{ width:340, height:340, bottom:-150, left:-90, background:'rgba(55,114,207,0.22)', animation:'svcOrb2 17s ease-in-out infinite' }} />
        <div className="svc-orb" style={{ width:220, height:220, top:'45%', left:'48%', background:'rgba(214,80,150,0.14)', animation:'svcOrb 20s ease-in-out infinite' }} />

        <div className="mk-container" style={{ position:'relative', zIndex:1, textAlign:'center' }}>
          <span className="mk-badge mk-badge-glass" style={{ marginBottom:20, color:'#fff', background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.25)', animation:'svcRise .7s cubic-bezier(.16,1,.3,1) both' }}>
            7 Business Verticals · One Vision
          </span>
          <h1 className="mk-display" style={{ color:'#fff', margin:'0 0 16px', animation:'svcRise .7s .06s cubic-bezier(.16,1,.3,1) both' }}>
            Our <span className="svc-grad-text">Services</span>
          </h1>
          <p className="mk-lead" style={{ color:'rgba(255,255,255,0.72)', maxWidth:640, margin:'0 auto', animation:'svcRise .7s .12s cubic-bezier(.16,1,.3,1) both' }}>
            Seven powerful verticals — media, investment, commerce, trading, real estate, finance, and culture.
            Tap any card to explore the full story, photos, and videos.
          </p>
        </div>
      </section>

      {/* ── SERVICE GRID ── */}
      <section className="mk-section" style={{ background:'var(--mk-canvas)' }} ref={grid.ref}>
        <div className="mk-container">
          <div className={`svc-tiles ${grid.v ? 'on' : ''}`}>
            {services.map((sv, i) => {
              const SI = sv.icon;
              return (
                <Link key={sv.id} to={`/services/${sv.slug}`} className="svc-tile" style={{ transitionDelay: `${Math.min(i, 6) * 70}ms` }}>
                  <div className="svc-tile-media" style={{ background: sv.logoBg }}>
                    <img src={sv.logo} alt={sv.title} loading="lazy" />
                    <div className="svc-tile-accent" style={{ background: sv.gradient }} />
                    <span className="svc-tile-badge" style={ sv.featured ? { background:'rgba(55,114,207,0.7)' } : sv.comingSoon ? { background:'rgba(0,150,115,0.75)' } : {} }>
                      {sv.comingSoon && <Clock size={11} />}{sv.tag}
                    </span>
                  </div>
                  <div className="svc-tile-body">
                    <div className="svc-tile-eyebrow">
                      <span className="svc-tile-chip" style={{ background: sv.gradient }}><SI size={15} /></span>
                      <span className="svc-tile-sub" style={{ color: sv.accent }}>{sv.subtitle}</span>
                    </div>
                    <h3 className="svc-tile-title">{sv.title}</h3>
                    <p className="svc-tile-desc">{sv.description}</p>
                    <span className="svc-tile-cta" style={{ color: sv.accent }}>
                      {sv.comingSoon ? 'Preview' : 'Explore service'} <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CROSS LINKS ── */}
      <section className="mk-hero-dark mk-section" style={{ textAlign:'center' }}>
        <div className="mk-container">
          <h2 className="mk-h2" style={{ color:'#fff', margin:'0 0 8px' }}>Explore Manikya</h2>
          <p className="mk-body" style={{ color:'rgba(255,255,255,0.65)', marginBottom:32 }}>Discover our full ecosystem</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center' }}>
            {[
              {label:'Pearl Farms',desc:'Investment',link:'/pearl-farms',icon:'💎',internal:true},
              {label:'Gallery',desc:'See our work',link:'/gallery',icon:'🖼️',internal:true},
              {label:'About',desc:'Our story',link:'/about',icon:'📖',internal:true},
              {label:'Contact',desc:'Get in touch',link:'/contact',icon:'📞',internal:true},
              {label:'NewsJunction',desc:'Watch live',link:'https://newsjunction.net/stream.php',icon:'📺',internal:false},
            ].map(item => {
              const inner = (
                <>
                  <span style={{ fontSize:'clamp(1.1rem,2.5vw,1.5rem)' }}>{item.icon}</span>
                  <span style={{ fontWeight:600, fontSize:'0.88rem' }}>{item.label}</span>
                  <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.55)' }}>{item.desc}</span>
                </>
              );
              const style: React.CSSProperties = { display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'18px 24px', borderRadius:14, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.14)', color:'white', minWidth:110, textDecoration:'none', backdropFilter:'blur(8px)' };
              return item.internal
                ? <Link key={item.label} to={item.link} style={style}>{inner}</Link>
                : <a key={item.label} href={item.link} target="_blank" rel="noopener noreferrer" style={style}>{inner}<ArrowUpRight size={12} style={{ color:'rgba(255,255,255,0.4)' }}/></a>;
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
