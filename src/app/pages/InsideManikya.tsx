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

const videoSlots = [
  { key: 'ceo',    label: 'MD & CEO Message',                  duration: '~5 min', color: '#f59e0b', tab: 'ceo' },
  { key: 'vision', label: 'Company Vision 2030',               duration: '~8 min', color: '#3b82f6', tab: 'company' },
  { key: 'pearl',  label: 'Pearl Farms — Investment Story',    duration: '~4 min', color: '#06b6d4', tab: 'company' },
  { key: 'market', label: 'Manikya Market — Village to World', duration: '~5 min', color: '#10b981', tab: 'company' },
  { key: 'roots',  label: 'Amrutha Malt — 42 Ingredients',    duration: '~3 min', color: '#22c55e', tab: 'company' },
  { key: 'money',  label: 'Manikya Money — Financial Future',  duration: '~4 min', color: '#8b5cf6', tab: 'company' },
];

const ceoSideVideos = [
  { key: 'values',  label: "Vision 2030 — Manikya's Growth Roadmap", tab: 'ceo' },
  { key: 'culture', label: 'Company Values & Culture',                tab: 'ceo' },
  { key: 'impact',  label: 'Our Impact on Indian Communities',        tab: 'ceo' },
];

// All slots combined for easy lookup
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

  // video_key → base64 data string
  const [videos, setVideos]       = useState<Record<string, string>>({});
  const [playKey, setPlayKey]     = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ceo' | 'company'>('ceo');
  const [uploading, setUploading] = useState<string | null>(null);
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [loading, setLoading]     = useState(true);

  const section = useInView();

  // ── Load all videos from backend on mount ────────────────────
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

  // ── Upload video (admin only) ─────────────────────────────────
  const handleVideoUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Warn for large files — base64 bloats DB storage
    if (file.size > 20 * 1024 * 1024) {
      alert('⚠️ Video is larger than 20MB. This may be slow to upload and load. Consider compressing it first.');
    }

    setUploading(key);
    const token = getAdminToken();

    try {
      const slot = allSlots.find(s => s.key === key);

      // Convert video file to base64
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

      // Show immediately to admin
      setVideos(prev => ({ ...prev, [key]: base64 }));
    } catch (err: any) {
      console.error('Upload error:', err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(null);
      if (e.target) e.target.value = '';
    }
  };

  // ── Delete video (admin only) ─────────────────────────────────
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

  // ── Shared upload input renderer ─────────────────────────────
  const UploadInput = ({ videoKey, style }: { videoKey: string; style?: React.CSSProperties }) => (
    <input
      type="file"
      accept="video/*"
      style={{ display: 'none', ...style }}
      onChange={e => handleVideoUpload(videoKey, e)}
    />
  );

  return (
    <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", background: '#fff', overflowX: 'hidden' }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes im-fadeUp  { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes im-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes im-scale   { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
        @keyframes spin        { to{transform:rotate(360deg)} }

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
        .im-modal { position:fixed; inset:0; background:rgba(0,0,0,0.92); z-index:999; display:flex; align-items:center; justify-content:center; animation:im-scale .3s ease; padding:16px; }
        .im-ceo-grid { display:grid; grid-template-columns:1.6fr 1fr; gap:28px; }
        @media(max-width:768px) { .im-ceo-grid { grid-template-columns:1fr !important; } }
        .im-company-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        @media(max-width:900px) { .im-company-grid { grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:560px) { .im-company-grid { grid-template-columns:1fr !important; } }
        .im-tabs { display:flex; overflow-x:auto; scrollbar-width:none; -ms-overflow-style:none; border-bottom:1px solid #e2e8f0; }
        .im-tabs::-webkit-scrollbar { display:none; }
        .im-side-video { display:flex; gap:12px; padding:12px; border:1px solid #e2e8f0; background:white; align-items:center; border-radius:4px; }
        .im-modal-inner { max-width:820px; width:100%; position:relative; }
        @media(max-width:560px) { .im-modal-inner { width:100%; } }
        .del-vid-btn { position:absolute; top:8px; right:8px; background:rgba(239,68,68,0.85); border:none; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:5; opacity:0; transition:opacity .2s; }
        .vid-wrap:hover .del-vid-btn { opacity:1; }
        @media(hover:none) { .del-vid-btn { opacity:1 !important; } }
      `}</style>

      {/* ══ VIDEO MODAL ══ */}
      {playKey && (
        <div className="im-modal" onClick={() => setPlayKey(null)}>
          <div className="im-modal-inner" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPlayKey(null)}
              style={{ position:'absolute', top:-44, right:0, background:'rgba(255,255,255,0.1)', border:'none', borderRadius:'50%', width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'white' }}
            >
              <X size={18} />
            </button>
            {videos[playKey]
              ? <video src={videos[playKey]} controls autoPlay style={{ width:'100%', maxHeight:'75vh', background:'#000' }} />
              : <div style={{ aspectRatio:'16/9', background:'#111', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
                  <Video size={48} style={{ color:'rgba(255,255,255,0.3)' }} />
                  <p style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.4)', fontSize:'0.9rem', textAlign:'center', padding:'0 20px' }}>No video uploaded yet.</p>
                </div>
            }
          </div>
        </div>
      )}

      {/* ══ PAGE HERO ══ */}
      <section style={{ background:'#000', minHeight:'clamp(260px,38vh,400px)', display:'flex', alignItems:'flex-end', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)', backgroundSize:'80px 80px' }} />
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 80% 50%,rgba(245,158,11,0.07),transparent 60%)' }} />
        <div style={{ position:'relative', zIndex:1, maxWidth:1400, margin:'0 auto', padding:'clamp(4rem,8vw,8rem) clamp(1rem,5vw,5rem) clamp(2rem,5vw,5rem)', width:'100%', animation:'im-fadeUp .9s .1s both' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
            <div style={{ width:32, height:1, background:'#f59e0b', flexShrink:0 }} />
            <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.25em', textTransform:'uppercase', color:'#f59e0b' }}>Media & Videos</span>
          </div>
          <h1 style={{ fontSize:'clamp(2.2rem,7vw,6rem)', fontWeight:700, lineHeight:0.95, color:'white', margin:0 }}>
            Inside <span className="im-gold">Manikya</span>
          </h1>
          <p style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.45)', fontSize:'clamp(0.88rem,2vw,1rem)', maxWidth:480, lineHeight:1.8, fontWeight:300, marginTop:16, marginBottom:0 }}>
            Explore leadership messages, company vision, and stories from across the Manikya ecosystem.
          </p>
        </div>
      </section>

      {/* ══ VIDEO SECTION ══ */}
      <section style={{ background:'#f8fafc', padding:'clamp(3rem,8vw,8rem) 0' }} ref={section.ref}>
        <div style={{ maxWidth:1400, margin:'0 auto', padding:'0 clamp(1rem,5vw,5rem)' }}>

          {/* Admin banner */}
          {isAdmin && (
            <div style={{ marginBottom:24, display:'flex', alignItems:'center', gap:10, padding:'12px 16px', background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:8 }}>
              <Upload size={15} color="#f59e0b" style={{ flexShrink:0 }}/>
              <p style={{ margin:0, fontFamily:'DM Sans,sans-serif', color:'#92400e', fontSize:'0.82rem' }}>
                <strong>Admin Mode:</strong> Upload videos below. They are saved to the server — all visitors will see them.
              </p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:10, padding:'60px 0', fontFamily:'DM Sans,sans-serif', color:'#94a3b8', fontSize:'0.9rem' }}>
              <Loader2 size={20} style={{ animation:'spin 1s linear infinite', color:'#f59e0b' }}/>
              Loading videos…
            </div>
          )}

          {!loading && <>
            {/* Tab header */}
            <div className={`im-reveal ${section.v ? 'on' : ''}`} style={{ marginBottom:32 }}>
              <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.25em', textTransform:'uppercase', color:'#f59e0b', marginBottom:10 }}>Media & Videos</p>
              <h2 style={{ fontSize:'clamp(1.6rem,4vw,3.2rem)', fontWeight:700, lineHeight:1.05, color:'#0f172a', marginBottom:20 }}>Inside Manikya</h2>
              <div className="im-tabs">
                {([{ key:'ceo', label:'CEO & Leadership' }, { key:'company', label:'Company Videos' }] as const).map(tab => (
                  <button
                    key={tab.key}
                    className="im-tab"
                    onClick={() => setActiveTab(tab.key)}
                    style={{ padding:'12px 22px', fontFamily:'DM Sans,sans-serif', fontWeight:600, fontSize:'0.85rem', color:activeTab===tab.key?'#000':'#94a3b8', borderBottom:activeTab===tab.key?'2px solid #f59e0b':'2px solid transparent', marginBottom:-1, textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap', flexShrink:0 }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── CEO & LEADERSHIP TAB ── */}
            {activeTab === 'ceo' && (
              <div className="im-ceo-grid">

                {/* Main featured CEO video */}
                <div className={`im-reveal-l ${section.v ? 'on' : ''}`}>
                  <div className="vid-wrap" style={{ aspectRatio:'16/9', background:'#0a0a0a', border:'1px solid #e2e8f0', position:'relative', overflow:'hidden', borderRadius:4 }}>
                    {videos['ceo'] ? (
                      <>
                        <video src={videos['ceo']} onClick={() => setPlayKey('ceo')} style={{ width:'100%', height:'100%', objectFit:'cover', cursor:'pointer' }} />
                        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'10px 14px', background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                          <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.7)', fontSize:'0.78rem' }}>MD & CEO Message</span>
                          <button onClick={() => setPlayKey('ceo')} style={{ background:'#f59e0b', border:'none', padding:'5px 12px', color:'#000', fontFamily:'DM Sans,sans-serif', fontWeight:700, fontSize:'0.72rem', cursor:'pointer', display:'flex', alignItems:'center', gap:5, borderRadius:3 }}>
                            <Play size={12} style={{ fill:'#000' }} /> Play
                          </button>
                        </div>
                        {isAdmin && (
                          <>
                            <button className="del-vid-btn" onClick={e => handleDelete('ceo', e)} disabled={deleting==='ceo'}>
                              {deleting==='ceo' ? <Loader2 size={12} color="#fff" style={{ animation:'spin 1s linear infinite' }}/> : <Trash2 size={12} color="#fff"/>}
                            </button>
                            <label style={{ position:'absolute', top:8, left:8, display:'flex', alignItems:'center', gap:5, padding:'4px 10px', background:'rgba(0,0,0,0.7)', color:'white', fontFamily:'DM Sans,sans-serif', fontSize:'0.68rem', cursor:'pointer', borderRadius:4 }}>
                              {uploading==='ceo' ? <><Loader2 size={10} style={{ animation:'spin 1s linear infinite' }}/> Uploading…</> : <><Upload size={10}/> Replace</>}
                              <UploadInput videoKey="ceo" />
                            </label>
                          </>
                        )}
                      </>
                    ) : (
                      <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:18, minHeight:220, padding:16 }}>
                        <Video size={44} style={{ color:'rgba(255,255,255,0.15)', marginBottom:4 }} />
                        <p style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.35)', fontSize:'0.88rem', marginBottom:12, textAlign:'center' }}>Upload MD & CEO Message Video</p>
                        {isAdmin && (
                          <label className="im-upload" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'11px 22px', background:'#f59e0b', color:'#000', fontFamily:'DM Sans,sans-serif', fontWeight:700, fontSize:'0.82rem', cursor:'pointer', borderRadius:4 }}>
                            {uploading==='ceo' ? <><Loader2 size={14} style={{ animation:'spin 1s linear infinite' }}/> Uploading…</> : <><Plus size={15}/> Upload Video</>}
                            <UploadInput videoKey="ceo" />
                          </label>
                        )}
                        <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.25)', fontSize:'0.72rem' }}>MP4, MOV, AVI supported</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding:'12px 0' }}>
                    <h3 style={{ fontSize:'clamp(0.95rem,2vw,1.05rem)', fontWeight:700, color:'#0f172a', marginBottom:4 }}>Dr. Rahmat Kanchagar — MD & CEO Message</h3>
                    <p style={{ fontFamily:'DM Sans,sans-serif', color:'#94a3b8', fontSize:'0.82rem' }}>On building a sustainable multi-sector enterprise for India</p>
                  </div>
                </div>

                {/* Side CEO video list */}
                <div className={`im-reveal-r ${section.v ? 'on' : ''}`} style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {ceoSideVideos.map(vid => (
                    <div key={vid.key} className="im-side-video">
                      <div className="vid-wrap" style={{ width:90, height:56, background:'#0a0a0a', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, position:'relative', overflow:'hidden', borderRadius:4 }}>
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
                              : <><Plus size={16} style={{ color:'rgba(255,255,255,0.3)' }} /><span style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.55rem', color:'rgba(255,255,255,0.3)' }}>{isAdmin ? 'Upload' : 'Soon'}</span></>
                            }
                            {isAdmin && <UploadInput videoKey={vid.key} />}
                          </label>
                        )}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:700, color:'#0f172a', fontSize:'0.85rem', lineHeight:1.3, marginBottom:4, wordBreak:'break-word' }}>{vid.label}</div>
                        {videos[vid.key]
                          ? <button onClick={() => setPlayKey(vid.key)} style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.72rem', color:'#f59e0b', background:'none', border:'none', cursor:'pointer', padding:0 }}>▶ Play Video</button>
                          : isAdmin
                            ? <label style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.72rem', color:'#94a3b8', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:4 }}>
                                <Upload size={11} /> Choose File
                                <UploadInput videoKey={vid.key} />
                              </label>
                            : <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.72rem', color:'#94a3b8' }}>Coming soon</span>
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
                    className={`im-reveal ${section.v ? 'on' : ''}`}
                    style={{ transitionDelay:`${i * 80}ms`, border:'1px solid #e2e8f0', overflow:'hidden', background:'white', position:'relative', borderRadius:4 }}
                  >
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:vs.color, zIndex:1 }} />
                    <div className="vid-wrap" style={{ aspectRatio:'16/9', background:'#0a0a0a', position:'relative', overflow:'hidden' }}>
                      {videos[vs.key] ? (
                        <>
                          <video src={videos[vs.key]} onClick={() => setPlayKey(vs.key)} style={{ width:'100%', height:'100%', objectFit:'cover', cursor:'pointer' }} />
                          <button
                            onClick={() => setPlayKey(vs.key)}
                            style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:40, height:40, borderRadius:'50%', border:`2px solid ${vs.color}`, background:`${vs.color}20`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}
                          >
                            <Play size={16} style={{ color:vs.color, fill:vs.color }} />
                          </button>
                          {isAdmin && (
                            <>
                              <button className="del-vid-btn" onClick={e => handleDelete(vs.key, e)} disabled={deleting===vs.key}>
                                {deleting===vs.key ? <Loader2 size={12} color="#fff" style={{ animation:'spin 1s linear infinite' }}/> : <Trash2 size={12} color="#fff"/>}
                              </button>
                              <label style={{ position:'absolute', bottom:8, right:8, display:'flex', alignItems:'center', gap:4, padding:'4px 8px', background:'rgba(0,0,0,0.7)', color:'white', fontFamily:'DM Sans,sans-serif', fontSize:'0.62rem', cursor:'pointer', borderRadius:4 }}>
                                {uploading===vs.key ? <><Loader2 size={10} style={{ animation:'spin 1s linear infinite' }}/> Uploading…</> : <><Upload size={10}/> Replace</>}
                                <UploadInput videoKey={vs.key} />
                              </label>
                            </>
                          )}
                        </>
                      ) : (
                        <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, padding:14 }}>
                          <Video size={28} style={{ color:`${vs.color}40` }} />
                          {isAdmin
                            ? <label style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'7px 14px', background:vs.color, color:'#fff', fontFamily:'DM Sans,sans-serif', fontWeight:700, fontSize:'0.72rem', cursor:'pointer', borderRadius:4 }}>
                                {uploading===vs.key ? <><Loader2 size={12} style={{ animation:'spin 1s linear infinite' }}/> Uploading…</> : <><Plus size={12}/> Upload Video</>}
                                <UploadInput videoKey={vs.key} />
                              </label>
                            : <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.3)', fontSize:'0.72rem' }}>Coming soon</span>
                          }
                          <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.25)', fontSize:'0.62rem' }}>MP4, MOV, AVI</span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding:'12px 14px' }}>
                      <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.65rem', fontWeight:700, color:vs.color, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:4 }}>{vs.duration}</div>
                      <div style={{ fontWeight:700, color:'#0f172a', fontSize:'clamp(0.82rem,2vw,0.92rem)', lineHeight:1.35 }}>{vs.label}</div>
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
