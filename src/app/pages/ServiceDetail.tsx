import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router';
import {
  ArrowRight, ArrowLeft, CheckCircle, Phone, ExternalLink,
  Play, Radio, Globe, Clock, ChevronRight,
} from 'lucide-react';
import { services, serviceDetails, getService, channels, newsChannelLogos, media } from '../data/services';

export default function ServiceDetail() {
  const { slug } = useParams();
  const s = getService(slug);
  const [showChannels, setShowChannels] = useState(false);
  const [hovCh, setHovCh] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setShowChannels(false);
  }, [slug]);

  useEffect(() => {
    if (s?.slug === 'newsjunction' && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [s?.slug]);

  if (!s) {
    return (
      <div className="mk mk-section" style={{ textAlign:'center', minHeight:'60vh', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:14 }}>
        <h1 className="mk-h2">Service not found</h1>
        <p className="mk-body" style={{ color:'var(--mk-steel)' }}>The service you're looking for doesn't exist.</p>
        <Link to="/services" className="mk-btn mk-btn-primary"><ArrowLeft size={15}/> Back to all services</Link>
      </div>
    );
  }

  const data = serviceDetails[s.slug];
  const idx = services.findIndex(x => x.slug === s.slug);
  const prev = idx > 0 ? services[idx - 1] : null;
  const next = idx < services.length - 1 ? services[idx + 1] : null;

  return (
    <div className="mk" style={{ overflowX:'hidden' }}>
      <style>{`
        @keyframes svcPulse { 0%,100% { opacity:1 } 50% { opacity:.4 } }
        @keyframes svcOrb { 0%,100% { transform:translate3d(0,0,0) scale(1) } 50% { transform:translate3d(40px,-30px,0) scale(1.12) } }
        @keyframes svcRise { from { opacity:0; transform:translateY(26px) } to { opacity:1; transform:translateY(0) } }
        .live-dot { width:8px; height:8px; border-radius:50%; background:#d45656; display:inline-block; animation:svcPulse 1.5s ease-in-out infinite; }
        .detail-grid { display:grid; grid-template-columns:1.2fr 1fr; gap:48px; align-items:start; }
        @media(max-width:900px){ .detail-grid { grid-template-columns:1fr; } }
        .channel-logos-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:12px; }
        @media(max-width:900px){ .channel-logos-grid { grid-template-columns:repeat(4,1fr); } }
        @media(max-width:560px){ .channel-logos-grid { grid-template-columns:repeat(3,1fr); } }
        .stats-bar-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
        @media(max-width:560px){ .stats-bar-grid { grid-template-columns:repeat(2,1fr); } }
        .svc-orb { position:absolute; border-radius:50%; filter:blur(70px); pointer-events:none; }
        .svc-glass {
          background-color:rgba(255,255,255,0.62);
          background-image:linear-gradient(135deg, rgba(0,212,164,0.10) 0%, rgba(55,114,207,0.07) 55%, rgba(214,80,150,0.06) 100%);
          -webkit-backdrop-filter:blur(16px) saturate(160%);
          backdrop-filter:blur(16px) saturate(160%);
          border:1px solid rgba(255,255,255,0.7);
          box-shadow:0 8px 30px rgba(20,20,40,0.08), inset 0 1px 0 rgba(255,255,255,0.65);
        }
        .svc-glass-row { transition:transform .25s ease, background-color .25s ease, border-color .25s ease; }
        .svc-glass-row:hover { transform:translateX(4px); background-color:rgba(255,255,255,0.8); }
        .ch-card { transition:transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s ease; }
        .ch-card:hover { transform:translateY(-5px); }
        .svc-nav-card { transition:transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s ease, border-color .3s ease; }
        .svc-nav-card:hover { transform:translateY(-4px); box-shadow:0 14px 32px rgba(20,20,40,0.12); }
      `}</style>

      {/* BREADCRUMB */}
      <div style={{ background:'var(--mk-canvas-dark)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="mk-container" style={{ display:'flex', alignItems:'center', gap:7, padding:'12px clamp(1rem,3vw,2rem)', fontSize:'0.8rem' }}>
          <Link to="/services" style={{ color:'rgba(255,255,255,0.6)', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:5 }}>
            <ArrowLeft size={14}/> All Services
          </Link>
          <ChevronRight size={13} style={{ color:'rgba(255,255,255,0.3)' }}/>
          <span style={{ color:'#fff', fontWeight:600 }}>{s.title}</span>
        </div>
      </div>

      {/* HERO — NewsJunction video, others image */}
      {s.heroVideo ? (
        <div style={{ position:'relative', overflow:'hidden', background:'linear-gradient(135deg,#0a1622 0%,#0e1d2b 58%,#0b1822 100%)', padding:'clamp(28px,4.5vw,52px) 0' }}>
          <div className="svc-orb" style={{ width:380, height:380, top:-170, right:-70, background:s.accent, opacity:0.20 }}/>
          <div className="svc-orb" style={{ width:300, height:300, bottom:-150, left:-70, background:s.accent, opacity:0.14 }}/>
          <div className="mk-container" style={{ position:'relative', zIndex:1, textAlign:'center' }}>
            <span className="mk-badge mk-badge-glass" style={{ background:'rgba(0,0,0,0.32)', border:`1px solid ${s.accent}70`, color:'#fff', marginBottom:14 }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:s.accent, display:'inline-block', animation:'svcPulse 1.5s ease-in-out infinite' }}/> {s.slug==='newsjunction' ? 'Live · Media' : s.tag}
            </span>
            <h1 style={{ color:'#fff', fontSize:'clamp(2rem,5vw,3.25rem)', fontWeight:700, margin:'0 0 8px', lineHeight:1.05 }}>{s.title}</h1>
            <p style={{ color:'rgba(255,255,255,0.82)', fontStyle:'italic', fontSize:'clamp(0.9rem,1.6vw,1.05rem)', margin:'0 0 22px' }}>"{s.tagline}"</p>
            <div style={{ position:'relative', maxWidth:960, margin:'0 auto', aspectRatio:'16 / 9', borderRadius:18, overflow:'hidden', border:'1px solid rgba(255,255,255,0.14)', boxShadow:'0 24px 60px rgba(0,0,0,0.45)', background:'#000' }}>
              <video
                ref={s.slug==='newsjunction' ? videoRef : undefined}
                src={s.heroVideo}
                autoPlay muted={s.slug==='newsjunction' ? isMuted : true} loop playsInline
                style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
              {s.slug==='newsjunction' && (
                <button
                  onClick={()=>{ if(videoRef.current){ videoRef.current.muted = !isMuted; setIsMuted(m=>!m); } }}
                  className="mk-btn mk-btn-glass-dark mk-btn-sm"
                  style={{ position:'absolute', top:12, right:12, zIndex:10 }}>
                  {isMuted ? <>🔇 Unmute</> : <>🔊 Mute</>}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ width:'100%', position:'relative', height:'clamp(320px,42vw,440px)', overflow:'hidden', background:'#111' }}>
          <img src={s.image} alt={s.title} style={{ width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset:0 }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right,rgba(0,0,0,0.78) 0%,rgba(0,0,0,0.45) 45%,rgba(0,0,0,0.08) 100%)' }}/>
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'center', padding:'0 clamp(1.5rem,5vw,3rem)', zIndex:3 }}>
            <span className="mk-badge mk-badge-glass" style={{ background:'rgba(0,0,0,0.4)', border:`1px solid ${s.accent}70`, color:'#fff', width:'fit-content', marginBottom:14 }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:s.accent, display:'inline-block', animation:'svcPulse 1.5s ease-in-out infinite' }}/> {s.tag}
            </span>
            <h1 style={{ color:'white', fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:700, margin:'0 0 10px', lineHeight:1.05, textShadow:'0 3px 16px rgba(0,0,0,0.9)', maxWidth:560 }}>{s.title}</h1>
            <p style={{ color:'rgba(255,255,255,0.88)', fontStyle:'italic', fontSize:'1.05rem', margin:0, textShadow:'0 2px 10px rgba(0,0,0,0.9)', maxWidth:460, lineHeight:1.6 }}>"{s.tagline}"</p>
            <div style={{ width:60, height:4, borderRadius:2, background:s.gradient, marginTop:18 }}/>
          </div>
        </div>
      )}

      {/* NewsJunction channel logos strip */}
      {s.slug === 'newsjunction' && (
        <div style={{ background:'var(--mk-canvas-dark)', padding:'1.8rem 0' }}>
          <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 clamp(1rem,3vw,2rem)' }}>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.68rem', textTransform:'uppercase', letterSpacing:'0.18em', marginBottom:16, textAlign:'center' }}>Our Channels & Verticals</p>
            <div className="channel-logos-grid">
              {newsChannelLogos.map((ch,i) => (
                <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                  <div style={{ width:'100%', aspectRatio:'1', borderRadius:14, overflow:'hidden', border:`2px solid ${ch.color}55`, boxShadow:`0 4px 16px ${ch.color}30` }}>
                    <img src={ch.file} alt={ch.lang} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                  </div>
                  <span style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.6)', fontWeight:500 }}>{ch.lang}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STATS BAR */}
      <div style={{ position:'relative', overflow:'hidden', background:'#f0faf5', padding:'clamp(1rem,2.5vw,1.4rem) 0', borderBottom:'1px solid #d7eede' }}>
        <div className="svc-orb" style={{ width:360, height:360, top:-180, left:'30%', background:s.accent, opacity:0.10 }}/>
        <div className="stats-bar-grid" style={{ position:'relative', zIndex:1, maxWidth:1280, margin:'0 auto', padding:'0 clamp(1rem,3vw,2rem)' }}>
          {data.stats.map((st: any, i: number)=>(
            <div key={i} className="svc-glass" style={{ textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'12px 8px', borderRadius:14 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:'clamp(0.85rem,2.5vw,1.05rem)' }}>{st.icon}</span>
                <span style={{ fontSize:'clamp(1rem,3vw,1.25rem)', fontWeight:700, color:'var(--mk-ink)' }}>{st.value}</span>
              </div>
              <span style={{ color:'var(--mk-stone)', fontSize:'clamp(0.6rem,1.8vw,0.66rem)', textTransform:'uppercase', letterSpacing:'0.06em', lineHeight:1.2 }}>{st.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ position:'relative', overflow:'hidden', background:'#eaf7f0', padding:'clamp(2.5rem,5vw,3.5rem) 0' }}>
        <div className="svc-orb" style={{ width:520, height:520, top:-180, left:-140, background:s.accent, opacity:0.16 }}/>
        <div className="svc-orb" style={{ width:460, height:460, bottom:-200, right:-150, background:s.accent, opacity:0.12 }}/>
        <div className="svc-orb" style={{ width:300, height:300, top:'30%', left:'55%', background:'#7cebcb', opacity:0.10 }}/>

        <div className="mk-container" style={{ position:'relative', zIndex:1 }}>
          {s.comingSoon && (
            <div style={{ marginBottom:22 }}>
              <span className="mk-badge mk-badge-green"><Clock size={13}/> Coming Soon — launching shortly</span>
            </div>
          )}
          <div className="detail-grid">
            {/* LEFT */}
            <div>
              <h2 className="mk-h3" style={{ margin:'0 0 14px' }}>About {s.title}</h2>
              <p className="mk-body" style={{ marginBottom:24 }}>{s.description}</p>
              <div className="mk-eyebrow">What we offer</div>
              <div style={{ display:'flex', flexDirection:'column', gap:9, marginBottom:28 }}>
                {s.features.map((f, i)=>(
                  <div key={i} className="svc-glass svc-glass-row" style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'11px 15px', borderRadius:14 }}>
                    <CheckCircle size={17} style={{ color:s.accent, flexShrink:0, marginTop:2 }}/>
                    <span style={{ color:'var(--mk-slate)', fontSize:'0.92rem', lineHeight:1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
              {s.hasChannels && (
                <button onClick={()=>setShowChannels(p=>!p)} className="mk-btn mk-btn-primary" style={{ marginBottom:14 }}>
                  <Radio size={16}/>{showChannels?'Hide Channels':'Watch All 5 Language Channels'}
                </button>
              )}
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                {s.slug==='pearl-farms'
                  ? <Link to="/pearl-farms" className="mk-btn mk-btn-primary">Full Pearl Farms page <ArrowRight size={15}/></Link>
                  : !s.comingSoon &&
                    <Link to={s.link} className="mk-btn mk-btn-primary">
                      {s.slug==='manikya-properties'?'Enquire About Properties':s.slug==='manikya-money'?'Apply for a Loan':s.slug==='manikya-traders'?'Partner With Us':'Get Started'} <ArrowRight size={15}/>
                    </Link>
                }
                <Link to="/contact" className="mk-btn mk-btn-outline"><Phone size={14}/> Contact Us</Link>
              </div>

              {/* Traders business model */}
              {data.model && (
                <div style={{ marginTop:28 }}>
                  <div className="mk-eyebrow">Our business model</div>
                  {data.model.map((step: any, i: number, arr: any[])=>(
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:0 }}>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                        <div style={{ width:40, height:40, borderRadius:'50%', background:s.accent, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>{step.icon}</div>
                        {i<arr.length-1 && <div style={{ width:2, height:26, background:s.accent, opacity:0.3 }}/>}
                      </div>
                      <div style={{ paddingLeft:12, paddingTop:8 }}>
                        <div style={{ fontWeight:600, color:'var(--mk-ink)', fontSize:'0.9rem' }}>{step.label}</div>
                        <div className="mk-small" style={{ color:'var(--mk-stone)', marginTop:2 }}>{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div>
              {/* Traders who-we-serve */}
              {data.whoWeServe && (
                <div className="svc-glass" style={{ marginBottom:22, borderRadius:16, padding:18 }}>
                  <div className="mk-eyebrow">Who we serve</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    {data.whoWeServe.map((col: any, ci: number)=>(
                      <div key={ci}>
                        <div className="mk-eyebrow" style={{ color:s.accent }}>{col.title}</div>
                        {col.items.map((item: string, ii: number)=>(
                          <div key={ii} style={{ display:'flex', alignItems:'flex-start', gap:6, marginBottom:5 }}>
                            <div style={{ width:4, height:4, borderRadius:'50%', background:s.accent, marginTop:7, flexShrink:0 }}/>
                            <span style={{ color:'var(--mk-steel)', fontSize:'0.8rem', lineHeight:1.5 }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mk-eyebrow">
                {s.slug==='manikya-properties'?'Our 4-step process':s.slug==='manikya-money'?'How the loan process works':s.slug==='newsjunction'?'How NewsJunction works':s.slug==='manikya-traders'?'Step-by-step process':s.comingSoon?'What to expect':'How it works'}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
                {data.howItWorks.map((step: any)=>(
                  <div key={step.step} className="svc-glass svc-glass-row" style={{ display:'flex', gap:12, padding:14, borderRadius:16 }}>
                    <div style={{ width:34, height:34, borderRadius:'50%', background:s.gradient, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:600, fontSize:'0.82rem', flexShrink:0, boxShadow:`0 4px 14px ${s.accent}55` }}>{step.step}</div>
                    <div>
                      <div style={{ fontWeight:600, color:'var(--mk-ink)', marginBottom:3, fontSize:'0.92rem' }}>{step.title}</div>
                      <div className="mk-small" style={{ color:'var(--mk-steel)', lineHeight:1.6 }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="svc-glass" style={{ borderRadius:16, overflow:'hidden', padding:0 }}>
                <div style={{ padding:'12px 18px', background:s.gradient }}>
                  <h3 style={{ color:'white', fontWeight:600, fontSize:'0.9rem', margin:0 }}>{data.extra.title}</h3>
                </div>
                <div style={{ padding:'14px 18px' }}>
                  {data.extra.items.map((item: string, i: number)=>(
                    <div key={i} style={{ padding:'7px 0', borderBottom:i<data.extra.items.length-1?'1px solid var(--mk-hairline-soft)':'none', color:'var(--mk-slate)', fontSize:'0.9rem' }}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHANNELS PANEL */}
      {s.hasChannels && showChannels && (
        <div style={{ background:'#f0faf5', borderTop:'1px solid #d7eede', padding:'2.5rem 0' }}>
          <div className="mk-container">
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <span className="live-dot"/><span style={{ color:'#d45656', fontWeight:600, fontSize:'0.72rem', textTransform:'uppercase', letterSpacing:'0.12em' }}>Live now — 5 channels</span>
            </div>
            <h3 className="mk-h3" style={{ margin:'0 0 6px' }}>Select your language channel</h3>
            <p className="mk-body" style={{ color:'var(--mk-steel)', marginBottom:22 }}>Click any card to watch live. Each opens in a new tab.</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
              {channels.map((ch,i)=>(
                <a key={i} href={ch.url} target="_blank" rel="noopener noreferrer" className="ch-card svc-glass"
                  style={{ display:'block', borderRadius:14, overflow:'hidden', textDecoration:'none', border:`1px solid ${ch.color}40`, boxShadow:hovCh===i?`0 14px 36px ${ch.color}33`:'0 8px 24px rgba(20,20,40,0.07)' }}
                  onMouseEnter={()=>setHovCh(i)} onMouseLeave={()=>setHovCh(null)}>
                  <div style={{ height:4, background:`linear-gradient(90deg,${ch.color},${ch.color}88)` }}/>
                  <div style={{ padding:18 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <span style={{ fontSize:'clamp(1.05rem,2.2vw,1.4rem)' }}>{ch.flag}</span>
                        <div>
                          <div style={{ fontWeight:600, color:'var(--mk-ink)', fontSize:'0.92rem' }}>{ch.lang}</div>
                          <div style={{ color:'var(--mk-stone)', fontSize:'0.68rem' }}>{ch.name}</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:4, padding:'3px 8px', borderRadius:20, background:`${ch.color}14`, border:`1px solid ${ch.color}30` }}>
                        <Play size={9} style={{ color:ch.color, fill:ch.color }}/><span style={{ fontSize:'0.62rem', fontWeight:600, color:ch.color, textTransform:'uppercase' }}>Live</span>
                      </div>
                    </div>
                    <p style={{ color:'var(--mk-steel)', fontSize:'0.82rem', lineHeight:1.55, margin:'0 0 10px' }}>{ch.desc}</p>
                    <div style={{ display:'flex', alignItems:'center', gap:5, color:ch.color, fontWeight:600, fontSize:'0.8rem' }}>
                      <ExternalLink size={12}/> Watch Live Now
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <div style={{ textAlign:'center', marginTop:20 }}>
              <a href="https://newsjunction.net/stream.php" target="_blank" rel="noopener noreferrer" className="mk-btn mk-btn-primary">
                <Globe size={15}/> Open Full News Portal <ExternalLink size={13}/>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* PREV / NEXT NAV */}
      <section className="mk-section" style={{ background:'var(--mk-canvas)' }}>
        <div className="mk-container">
          <div style={{ display:'flex', justifyContent:'center', marginBottom:26 }}>
            <Link to="/services" className="mk-btn mk-btn-outline"><ArrowLeft size={15}/> Back to all services</Link>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {[prev, next].map((nav, i) => nav ? (
              <Link key={nav.slug} to={`/services/${nav.slug}`} className="svc-nav-card"
                style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 18px', borderRadius:16, background:'#fff', border:'1px solid var(--mk-hairline)', textDecoration:'none', boxShadow:'0 4px 16px rgba(20,20,40,0.05)', justifyContent:i===1?'flex-end':'flex-start', textAlign:i===1?'right':'left', flexDirection:i===1?'row-reverse':'row' }}>
                <div style={{ width:52, height:52, borderRadius:13, overflow:'hidden', flexShrink:0 }}>
                  <img src={nav.image} alt={nav.title} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                </div>
                <div>
                  <div className="mk-eyebrow" style={{ color:nav.accent, margin:0 }}>{i===0?'← Previous':'Next →'}</div>
                  <div style={{ fontWeight:700, color:'var(--mk-ink)', fontSize:'1rem' }}>{nav.title}</div>
                </div>
              </Link>
            ) : <div key={i} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
