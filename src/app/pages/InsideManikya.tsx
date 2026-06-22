import { useState, useEffect, useRef } from 'react';
import { Play, X, Upload, Video, Plus, Loader2, Trash2 } from 'lucide-react';

const API_BASE = 'https://manikya-backend.onrender.com/api';

const getAdminToken  = () => localStorage.getItem('manikya_admin_token');
const isAdminLoggedIn = () => !!localStorage.getItem('admin_logged_in');

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

const ACCENT = '#00b48a';

const videoSlots = [
  { key: 'ceo',    label: 'MD & CEO Message',                  duration: '~5 min', color: '#00b48a', tab: 'ceo' },
  { key: 'vision', label: 'Company Vision 2030',               duration: '~8 min', color: '#3772cf', tab: 'company' },
  { key: 'pearl',  label: 'Pearl Farms — Investment Story',    duration: '~4 min', color: '#06b6d4', tab: 'company' },
  { key: 'market', label: 'Manikya Market — Village to World', duration: '~5 min', color: '#00b48a', tab: 'company' },
  { key: 'roots',  label: 'Amrutha Malt — 42 Ingredients',    duration: '~3 min', color: '#22a06b', tab: 'company' },
  { key: 'money',  label: 'Manikya Money — Financial Future',  duration: '~4 min', color: '#6b5cf6', tab: 'company' },
];

const ceoSideVideos = [
  { key: 'values',  label: "Vision 2030 — Manikya's Growth Roadmap", tab: 'ceo' },
  { key: 'culture', label: 'Company Values & Culture',                tab: 'ceo' },
  { key: 'impact',  label: 'Our Impact on Indian Communities',        tab: 'ceo' },
];

const allSlots = [...videoSlots, ...ceoSideVideos];

interface VideoRow {
  id: number;
  video_key: string;
  label: string;
  tab: string;
  video_data: string | null;
}

export default function InsideManikya() {
  const isAdmin = isAdminLoggedIn();

  const [videos, setVideos]       = useState<Record<string, string>>({});
  const [playKey, setPlayKey]     = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ceo' | 'company'>('ceo');
  const [uploading, setUploading] = useState<string | null>(null);
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [loading, setLoading]     = useState(true);

  const section = useInView();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/videos`);
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const rows: VideoRow[] = await res.json();
        const map: Record<string, string> = {};
        rows.forEach(r => { if (r.video_data) map[r.video_key] = r.video_data; });
        setVideos(map);
      } catch (e) {
        console.error('Video load error:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleVideoUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert('⚠️ Video is larger than 20MB. This may be slow to upload and load. Consider compressing it first.');
    }

    setUploading(key);
    const token = getAdminToken();

    try {
      const slot = allSlots.find(s => s.key === key);

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch(`${API_BASE}/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          video_key:     key,
          label:         slot?.label || key,
          tab:           slot?.tab   || 'company',
          video_data:    base64,
          display_order: videoSlots.findIndex(s => s.key === key),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }

      setVideos(prev => ({ ...prev, [key]: base64 }));
    } catch (err: any) {
      console.error('Upload error:', err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleDelete = async (key: string, ev: React.MouseEvent) => {
    ev.stopPropagation();
    if (!confirm('Remove this video?')) return;
    setDeleting(key);
    const token = getAdminToken();
    try {
      await fetch(`${API_BASE}/videos/${key}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setVideos(prev => { const n = { ...prev }; delete n[key]; return n; });
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const UploadInput = ({ videoKey, style }: { videoKey: string; style?: React.CSSProperties }) => (
    <input
      type="file"
      accept="video/*"
      style={{ display: 'none', ...style }}
      onChange={e => handleVideoUpload(videoKey, e)}
    />
  );

  return (
    <div className="mk" style={{ overflowX: 'hidden' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        .im-modal { position:fixed; inset:0; background:rgba(10,10,10,0.92); z-index:999; display:flex; align-items:center; justify-content:center; padding:16px; }
        .im-ceo-grid { display:grid; grid-template-columns:1.6fr 1fr; gap:28px; }
        @media(max-width:768px) { .im-ceo-grid { grid-template-columns:1fr !important; } }
        .im-company-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        @media(max-width:900px) { .im-company-grid { grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:560px) { .im-company-grid { grid-template-columns:1fr !important; } }
        .im-tabs { display:flex; gap:4px; overflow-x:auto; scrollbar-width:none; border-bottom:1px solid var(--mk-hairline); }
        .im-tabs::-webkit-scrollbar { display:none; }
        .im-side-video { display:flex; gap:12px; padding:12px; border:1px solid var(--mk-hairline); background:#fff; align-items:center; border-radius:var(--mk-r-md); }
        .im-modal-inner { max-width:820px; width:100%; position:relative; }
        .del-vid-btn { position:absolute; top:8px; right:8px; background:rgba(212,86,86,0.9); border:none; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:5; opacity:0; transition:opacity .2s; }
        .vid-wrap:hover .del-vid-btn { opacity:1; }
        @media(hover:none) { .del-vid-btn { opacity:1 !important; } }
      `}</style>

      {/* ══ VIDEO MODAL ══ */}
      {playKey && (
        <div className="im-modal" onClick={() => setPlayKey(null)}>
          <div className="im-modal-inner" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPlayKey(null)}
              style={{ position:'absolute', top:-44, right:0, background:'rgba(255,255,255,0.12)', border:'none', borderRadius:'50%', width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'white' }}
            >
              <X size={18} />
            </button>
            {videos[playKey]
              ? <video src={videos[playKey]} controls autoPlay style={{ width:'100%', maxHeight:'75vh', background:'#000', borderRadius: 12 }} />
              : <div style={{ aspectRatio:'16/9', background:'#111', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, borderRadius: 12 }}>
                  <Video size={48} style={{ color:'rgba(255,255,255,0.3)' }} />
                  <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.9rem', textAlign:'center', padding:'0 20px' }}>No video uploaded yet.</p>
                </div>
            }
          </div>
        </div>
      )}

      {/* ══ HERO ══ */}
      <section className="mk-hero-dark" style={{ position:'relative', overflow:'hidden', padding:'clamp(56px,10vw,96px) 0' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 80% 50%, rgba(0,212,164,0.12), transparent 60%)' }} />
        <div className="mk-container" style={{ position:'relative', zIndex:1 }}>
          <p className="mk-eyebrow" style={{ color: 'var(--mk-green-soft)' }}>Media & videos</p>
          <h1 className="mk-display" style={{ color:'#fff', margin:'0 0 14px' }}>Inside Manikya</h1>
          <p className="mk-lead" style={{ color:'rgba(255,255,255,0.7)', maxWidth:520 }}>
            Explore leadership messages, company vision, and stories from across the Manikya ecosystem.
          </p>
        </div>
      </section>

      {/* ══ VIDEO SECTION ══ */}
      <section className="mk-section mk-sec-sky" ref={section.ref}>
        <div className="mk-container">

          {loading && (
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:10, padding:'60px 0', color:'var(--mk-stone)', fontSize:'0.9rem' }}>
              <Loader2 size={20} style={{ animation:'spin 1s linear infinite', color:ACCENT }}/>
              Loading videos…
            </div>
          )}

          {!loading && <>
            <div className={`mk-reveal ${section.v ? 'mk-on' : ''}`} style={{ marginBottom:32 }}>
              <p className="mk-eyebrow">Media & videos</p>
              <h2 className="mk-h1" style={{ margin:'0 0 20px' }}>Watch the stories</h2>
              <div className="im-tabs">
                {([{ key:'ceo', label:'CEO & Leadership' }, { key:'company', label:'Company Videos' }] as const).map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{ padding:'12px 18px', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--mk-font)', fontWeight:600, fontSize:'0.875rem', color:activeTab===tab.key?'var(--mk-ink)':'var(--mk-stone)', borderBottom:activeTab===tab.key?`2px solid ${ACCENT}`:'2px solid transparent', marginBottom:-1, whiteSpace:'nowrap', flexShrink:0 }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── CEO & LEADERSHIP TAB ── */}
            {activeTab === 'ceo' && (
              <div className="im-ceo-grid">
                <div className={`mk-reveal ${section.v ? 'mk-on' : ''}`}>
                  <div className="vid-wrap" style={{ aspectRatio:'16/9', background:'#0a0a0a', border:'1px solid var(--mk-hairline)', position:'relative', overflow:'hidden', borderRadius:12 }}>
                    {videos['ceo'] ? (
                      <>
                        <video src={videos['ceo']} onClick={() => setPlayKey('ceo')} style={{ width:'100%', height:'100%', objectFit:'cover', cursor:'pointer' }} />
                        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'10px 14px', background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                          <span style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.78rem' }}>MD & CEO Message</span>
                          <button onClick={() => setPlayKey('ceo')} style={{ background:ACCENT, border:'none', padding:'5px 12px', color:'#fff', fontFamily:'var(--mk-font)', fontWeight:600, fontSize:'0.72rem', cursor:'pointer', display:'flex', alignItems:'center', gap:5, borderRadius:20 }}>
                            <Play size={12} style={{ fill:'#fff' }} /> Play
                          </button>
                        </div>
                        {isAdmin && (
                          <>
                            <button className="del-vid-btn" onClick={e => handleDelete('ceo', e)} disabled={deleting==='ceo'}>
                              {deleting==='ceo' ? <Loader2 size={12} color="#fff" style={{ animation:'spin 1s linear infinite' }}/> : <Trash2 size={12} color="#fff"/>}
                            </button>
                            <label style={{ position:'absolute', top:8, left:8, display:'flex', alignItems:'center', gap:5, padding:'4px 10px', background:'rgba(0,0,0,0.7)', color:'white', fontFamily:'var(--mk-font)', fontSize:'0.68rem', cursor:'pointer', borderRadius:20 }}>
                              {uploading==='ceo' ? <><Loader2 size={10} style={{ animation:'spin 1s linear infinite' }}/> Uploading…</> : <><Upload size={10}/> Replace</>}
                              <UploadInput videoKey="ceo" />
                            </label>
                          </>
                        )}
                      </>
                    ) : (
                      <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:18, minHeight:220, padding:16 }}>
                        <Video size={44} style={{ color:'rgba(255,255,255,0.15)', marginBottom:4 }} />
                        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.88rem', marginBottom:12, textAlign:'center' }}>MD & CEO Message Video</p>
                        {isAdmin && (
                          <label className="mk-btn mk-btn-green mk-btn-sm" style={{ cursor:'pointer' }}>
                            {uploading==='ceo' ? <><Loader2 size={14} style={{ animation:'spin 1s linear infinite' }}/> Uploading…</> : <><Plus size={15}/> Upload Video</>}
                            <UploadInput videoKey="ceo" />
                          </label>
                        )}
                        <span style={{ color:'rgba(255,255,255,0.25)', fontSize:'0.72rem' }}>MP4, MOV, AVI supported</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding:'14px 0' }}>
                    <h3 style={{ fontSize:'1.05rem', fontWeight:600, color:'var(--mk-ink)', marginBottom:4 }}>Dr. Rahmat Kanchagar — MD & CEO Message</h3>
                    <p className="mk-small" style={{ color:'var(--mk-stone)' }}>On building a sustainable multi-sector enterprise for India</p>
                  </div>
                </div>

                <div className={`mk-reveal ${section.v ? 'mk-on' : ''}`} style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {ceoSideVideos.map(vid => (
                    <div key={vid.key} className="im-side-video mk-float">
                      <div className="vid-wrap" style={{ width:90, height:56, background:'#0a0a0a', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, position:'relative', overflow:'hidden', borderRadius:8 }}>
                        {videos[vid.key] ? (
                          <>
                            <video src={videos[vid.key]} onClick={() => setPlayKey(vid.key)} style={{ width:'100%', height:'100%', objectFit:'cover', cursor:'pointer' }} />
                            {isAdmin && (
                              <button className="del-vid-btn" style={{ width:22, height:22, top:2, right:2 }} onClick={e => handleDelete(vid.key, e)} disabled={deleting===vid.key}>
                                {deleting===vid.key ? <Loader2 size={10} color="#fff" style={{ animation:'spin 1s linear infinite' }}/> : <Trash2 size={10} color="#fff"/>}
                              </button>
                            )}
                          </>
                        ) : (
                          <label style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, cursor: isAdmin ? 'pointer' : 'default' }}>
                            {uploading===vid.key
                              ? <Loader2 size={14} style={{ color:'rgba(255,255,255,0.4)', animation:'spin 1s linear infinite' }}/>
                              : <><Plus size={16} style={{ color:'rgba(255,255,255,0.3)' }} /><span style={{ fontSize:'0.55rem', color:'rgba(255,255,255,0.3)' }}>{isAdmin ? 'Upload' : 'Soon'}</span></>
                            }
                            {isAdmin && <UploadInput videoKey={vid.key} />}
                          </label>
                        )}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:600, color:'var(--mk-ink)', fontSize:'0.875rem', lineHeight:1.3, marginBottom:4, wordBreak:'break-word' }}>{vid.label}</div>
                        {videos[vid.key]
                          ? <button onClick={() => setPlayKey(vid.key)} style={{ fontSize:'0.72rem', color:ACCENT, background:'none', border:'none', cursor:'pointer', padding:0 }}>▶ Play Video</button>
                          : isAdmin
                            ? <label style={{ fontSize:'0.72rem', color:'var(--mk-stone)', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:4 }}>
                                <Upload size={11} /> Choose File
                                <UploadInput videoKey={vid.key} />
                              </label>
                            : <span style={{ fontSize:'0.72rem', color:'var(--mk-stone)' }}>Coming soon</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── COMPANY VIDEOS TAB ── */}
            {activeTab === 'company' && (
              <div className="im-company-grid">
                {videoSlots.filter(v => v.tab === 'company').map((vs, i) => (
                  <div
                    key={vs.key}
                    className={`mk-reveal ${section.v ? 'mk-on' : ''}`}
                    style={{ transitionDelay:`${i * 80}ms`, border:'1px solid var(--mk-hairline)', overflow:'hidden', background:'#fff', position:'relative', borderRadius:12 }}
                  >
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:vs.color, zIndex:1 }} />
                    <div className="vid-wrap" style={{ aspectRatio:'16/9', background:'#0a0a0a', position:'relative', overflow:'hidden' }}>
                      {videos[vs.key] ? (
                        <>
                          <video src={videos[vs.key]} onClick={() => setPlayKey(vs.key)} style={{ width:'100%', height:'100%', objectFit:'cover', cursor:'pointer' }} />
                          <button
                            onClick={() => setPlayKey(vs.key)}
                            style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:44, height:44, borderRadius:'50%', border:`2px solid ${vs.color}`, background:`${vs.color}30`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}
                          >
                            <Play size={16} style={{ color:'#fff', fill:'#fff' }} />
                          </button>
                          {isAdmin && (
                            <>
                              <button className="del-vid-btn" onClick={e => handleDelete(vs.key, e)} disabled={deleting===vs.key}>
                                {deleting===vs.key ? <Loader2 size={12} color="#fff" style={{ animation:'spin 1s linear infinite' }}/> : <Trash2 size={12} color="#fff"/>}
                              </button>
                              <label style={{ position:'absolute', bottom:8, right:8, display:'flex', alignItems:'center', gap:4, padding:'4px 8px', background:'rgba(0,0,0,0.7)', color:'white', fontFamily:'var(--mk-font)', fontSize:'0.62rem', cursor:'pointer', borderRadius:20 }}>
                                {uploading===vs.key ? <><Loader2 size={10} style={{ animation:'spin 1s linear infinite' }}/> Uploading…</> : <><Upload size={10}/> Replace</>}
                                <UploadInput videoKey={vs.key} />
                              </label>
                            </>
                          )}
                        </>
                      ) : (
                        <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, padding:14 }}>
                          <Video size={28} style={{ color:`${vs.color}66` }} />
                          {isAdmin
                            ? <label style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'8px 14px', background:vs.color, color:'#fff', fontFamily:'var(--mk-font)', fontWeight:600, fontSize:'0.72rem', cursor:'pointer', borderRadius:20 }}>
                                {uploading===vs.key ? <><Loader2 size={12} style={{ animation:'spin 1s linear infinite' }}/> Uploading…</> : <><Plus size={12}/> Upload Video</>}
                                <UploadInput videoKey={vs.key} />
                              </label>
                            : <span style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.72rem' }}>Coming soon</span>
                          }
                          <span style={{ color:'rgba(255,255,255,0.25)', fontSize:'0.62rem' }}>MP4, MOV, AVI</span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding:'14px 16px' }}>
                      <div className="mk-mono" style={{ fontSize:'0.7rem', fontWeight:500, color:vs.color, marginBottom:5 }}>{vs.duration}</div>
                      <div style={{ fontWeight:600, color:'var(--mk-ink)', fontSize:'0.95rem', lineHeight:1.35 }}>{vs.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>}

        </div>
      </section>
    </div>
  );
}
