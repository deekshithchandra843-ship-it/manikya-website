import { useState, useEffect, useRef } from 'react';
import { Play, X, Upload, Video, Plus } from 'lucide-react';

/* ─── Intersection-observer helper ─── */
function useInView(t = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } },
      { threshold: t }
    );
    obs.observe(el); return () => obs.disconnect();
  }, [t]);
  return { ref, v };
}

/* ─── Data ─── */
const videoSlots = [
  { key: 'ceo',    label: 'MD & CEO Message',                  duration: '~5 min', color: '#f59e0b' },
  { key: 'vision', label: 'Company Vision 2030',               duration: '~8 min', color: '#3b82f6' },
  { key: 'pearl',  label: 'Pearl Farms — Investment Story',    duration: '~4 min', color: '#06b6d4' },
  { key: 'market', label: 'Manikya Market — Village to World', duration: '~5 min', color: '#10b981' },
  { key: 'roots',  label: 'Amrutha Malt — 42 Ingredients',    duration: '~3 min', color: '#22c55e' },
  { key: 'money',  label: 'Manikya Money — Financial Future',  duration: '~4 min', color: '#8b5cf6' },
];

const ceoSideVideos = [
  { key: 'values', label: "Vision 2030 — Manikya's Growth Roadmap" },
  { key: 'culture', label: 'Company Values & Culture' },
  { key: 'impact',  label: 'Our Impact on Indian Communities' },
];

/* ═══════════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════════ */
export default function InsideManikya() {
  const [videos, setVideos]       = useState<Record<string, string>>({});
  const [playKey, setPlayKey]     = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ceo' | 'company'>('ceo');
  const fileRefs                  = useRef<Record<string, HTMLInputElement | null>>({});
  const section                   = useInView();

  const handleVideoUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideos(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
  };

  return (
    <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", background: '#fff', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes im-fadeUp  { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes im-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes im-scale   { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }

        .im-gold { background:linear-gradient(90deg,#f59e0b,#fde68a,#f59e0b); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:im-shimmer 4s linear infinite }

        .im-reveal    { opacity:0; transform:translateY(40px);  transition:all .85s cubic-bezier(.16,1,.3,1) }
        .im-reveal.on { opacity:1; transform:translateY(0) }
        .im-reveal-l    { opacity:0; transform:translateX(-50px); transition:all .85s cubic-bezier(.16,1,.3,1) }
        .im-reveal-l.on { opacity:1; transform:translateX(0) }
        .im-reveal-r    { opacity:0; transform:translateX(50px);  transition:all .85s cubic-bezier(.16,1,.3,1) }
        .im-reveal-r.on { opacity:1; transform:translateX(0) }

        .im-tab { transition:all .3s; cursor:pointer; border:none; background:none; font-family:inherit }
        .im-upload { transition:all .3s; cursor:pointer }
        .im-upload:hover { transform:scale(1.05) }
        .im-modal { position:fixed; inset:0; background:rgba(0,0,0,0.92); z-index:999; display:flex; align-items:center; justify-content:center; animation:im-scale .3s ease }

        @media(max-width:768px){
          .im-ceo-grid     { grid-template-columns:1fr !important }
          .im-company-grid { grid-template-columns:1fr !important }
        }
      `}</style>

      {/* ══ VIDEO MODAL ══ */}
      {playKey && (
        <div className="im-modal" onClick={() => setPlayKey(null)}>
          <div style={{ maxWidth: 820, width: '92%', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPlayKey(null)}
              style={{ position: 'absolute', top: -44, right: 0, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
            >
              <X size={18} />
            </button>
            {videos[playKey]
              ? <video src={videos[playKey]} controls autoPlay style={{ width: '100%', maxHeight: '75vh', background: '#000' }} />
              : <div style={{ aspectRatio: '16/9', background: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                  <Video size={48} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <p style={{ fontFamily: 'DM Sans,sans-serif', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', textAlign: 'center' }}>No video uploaded yet.</p>
                </div>
            }
          </div>
        </div>
      )}

      {/* ══ PAGE HERO ══ */}
      <section style={{ background: '#000', minHeight: '38vh', display: 'flex', alignItems: 'flex-end', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 50%,rgba(245,158,11,0.07),transparent 60%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto', padding: 'clamp(5rem,8vw,8rem) clamp(1.5rem,5vw,5rem) clamp(3rem,5vw,5rem)', width: '100%', animation: 'im-fadeUp .9s .1s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 40, height: 1, background: '#f59e0b' }} />
            <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#f59e0b' }}>Media & Videos</span>
          </div>
          <h1 style={{ fontSize: 'clamp(3rem,7vw,6rem)', fontWeight: 700, lineHeight: 0.95, color: 'white', margin: 0 }}>
            Inside <span className="im-gold">Manikya</span>
          </h1>
          <p style={{ fontFamily: 'DM Sans,sans-serif', color: 'rgba(255,255,255,0.45)', fontSize: '1rem', maxWidth: 480, lineHeight: 1.8, fontWeight: 300, marginTop: 20, marginBottom: 0 }}>
            Explore leadership messages, company vision, and stories from across the Manikya ecosystem.
          </p>
        </div>
      </section>

      {/* ══ VIDEO SECTION ══ */}
      <section style={{ background: '#f8fafc', padding: 'clamp(4rem,8vw,8rem) 0' }} ref={section.ref}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.5rem,5vw,5rem)' }}>

          {/* Tab header */}
          <div className={`im-reveal ${section.v ? 'on' : ''}`} style={{ marginBottom: 40 }}>
            <p style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: 12 }}>Media & Videos</p>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 700, lineHeight: 1.05, color: '#0f172a', marginBottom: 20 }}>Inside Manikya</h2>
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
              {([{ key: 'ceo', label: 'CEO & Leadership' }, { key: 'company', label: 'Company Videos' }] as const).map(tab => (
                <button
                  key={tab.key}
                  className="im-tab"
                  onClick={() => setActiveTab(tab.key)}
                  style={{ padding: '12px 26px', fontFamily: 'DM Sans,sans-serif', fontWeight: 600, fontSize: '0.88rem', color: activeTab === tab.key ? '#000' : '#94a3b8', borderBottom: activeTab === tab.key ? '2px solid #f59e0b' : '2px solid transparent', marginBottom: -1, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── CEO & LEADERSHIP TAB ── */}
          {activeTab === 'ceo' && (
            <div className="im-ceo-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 28 }}>

              {/* Main featured video */}
              <div className={`im-reveal-l ${section.v ? 'on' : ''}`}>
                <div style={{ aspectRatio: '16/9', background: '#0a0a0a', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
                  {videos['ceo'] ? (
                    <>
                      <video src={videos['ceo']} onClick={() => setPlayKey('ceo')} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 14px', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'DM Sans,sans-serif', color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>MD & CEO Message</span>
                        <button onClick={() => setPlayKey('ceo')} style={{ background: '#f59e0b', border: 'none', padding: '5px 12px', color: '#000', fontFamily: 'DM Sans,sans-serif', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Play size={12} style={{ fill: '#000' }} /> Play
                        </button>
                      </div>
                    </>
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, minHeight: 280 }}>
                      <Video size={48} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: 4 }} />
                      <p style={{ fontFamily: 'DM Sans,sans-serif', color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', marginBottom: 16 }}>Upload MD & CEO Message Video</p>
                      <label className="im-upload" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#f59e0b', color: '#000', fontFamily: 'DM Sans,sans-serif', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', borderRadius: 4 }}>
                        <Plus size={16} /> Upload Video
                        <input ref={el => { fileRefs.current['ceo'] = el; }} type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideoUpload('ceo', e)} />
                      </label>
                      <span style={{ fontFamily: 'DM Sans,sans-serif', color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem' }}>MP4, MOV, AVI supported</span>
                    </div>
                  )}
                  {videos['ceo'] && (
                    <label style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: 'rgba(0,0,0,0.7)', color: 'white', fontFamily: 'DM Sans,sans-serif', fontSize: '0.68rem', cursor: 'pointer', borderRadius: 4 }}>
                      <Upload size={11} /> Replace
                      <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideoUpload('ceo', e)} />
                    </label>
                  )}
                </div>
                <div style={{ padding: '14px 0' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Dr. Rahmat Kanchagar — MD & CEO Message</h3>
                  <p style={{ fontFamily: 'DM Sans,sans-serif', color: '#94a3b8', fontSize: '0.82rem' }}>On building a sustainable multi-sector enterprise for India</p>
                </div>
              </div>

              {/* Side video list */}
              <div className={`im-reveal-r ${section.v ? 'on' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {ceoSideVideos.map(vid => (
                  <div key={vid.key} style={{ display: 'flex', gap: 14, padding: '14px', border: '1px solid #e2e8f0', background: 'white', alignItems: 'center', borderRadius: 4 }}>
                    <div style={{ width: 100, height: 60, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', overflow: 'hidden', borderRadius: 4 }}>
                      {videos[vid.key]
                        ? <video src={videos[vid.key]} onClick={() => setPlayKey(vid.key)} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
                        : <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                            <Plus size={18} style={{ color: 'rgba(255,255,255,0.3)' }} />
                            <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)' }}>Upload</span>
                            <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideoUpload(vid.key, e)} />
                          </label>
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem', lineHeight: 1.3, marginBottom: 4 }}>{vid.label}</div>
                      {videos[vid.key]
                        ? <button onClick={() => setPlayKey(vid.key)} style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.72rem', color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>▶ Play Video</button>
                        : <label style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.72rem', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Upload size={11} /> Choose File
                            <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideoUpload(vid.key, e)} />
                          </label>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── COMPANY VIDEOS TAB ── */}
          {activeTab === 'company' && (
            <div className="im-company-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
              {videoSlots.map((vs, i) => (
                <div
                  key={vs.key}
                  className={`im-reveal ${section.v ? 'on' : ''}`}
                  style={{ transitionDelay: `${i * 80}ms`, border: '1px solid #e2e8f0', overflow: 'hidden', background: 'white', position: 'relative', borderRadius: 4 }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: vs.color, zIndex: 1 }} />
                  <div style={{ aspectRatio: '16/9', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
                    {videos[vs.key] ? (
                      <>
                        <video src={videos[vs.key]} onClick={() => setPlayKey(vs.key)} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
                        <button
                          onClick={() => setPlayKey(vs.key)}
                          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 40, height: 40, borderRadius: '50%', border: `2px solid ${vs.color}`, background: `${vs.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <Play size={16} style={{ color: vs.color, fill: vs.color }} />
                        </button>
                      </>
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 16 }}>
                        <Video size={32} style={{ color: `${vs.color}40` }} />
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: vs.color, color: '#fff', fontFamily: 'DM Sans,sans-serif', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', borderRadius: 4 }}>
                          <Plus size={13} /> Upload Video
                          <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideoUpload(vs.key, e)} />
                        </label>
                        <span style={{ fontFamily: 'DM Sans,sans-serif', color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem' }}>MP4, MOV, AVI</span>
                      </div>
                    )}
                    {videos[vs.key] && (
                      <label style={{ position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', background: 'rgba(0,0,0,0.7)', color: 'white', fontFamily: 'DM Sans,sans-serif', fontSize: '0.62rem', cursor: 'pointer', borderRadius: 4 }}>
                        <Upload size={10} /> Replace
                        <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideoUpload(vs.key, e)} />
                      </label>
                    )}
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.65rem', fontWeight: 700, color: vs.color, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>{vs.duration}</div>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem', lineHeight: 1.35 }}>{vs.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
