import { useState, useEffect, useRef } from 'react';
import { Upload, ImageIcon, Trash2, X, ZoomIn, Filter, Loader2 } from 'lucide-react';

const API_BASE = 'https://manikya-backend.onrender.com/api';

const getAdminToken = () => localStorage.getItem('manikya_admin_token');
const isAdminLoggedIn = () => !!localStorage.getItem('admin_logged_in');

function useInView(t = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: t });
    obs.observe(el); return () => obs.disconnect();
  }, [t]);
  return { ref, v };
}

const categories = ['All', 'Pearl Farms', 'NewsJunction', 'Manikya Market', 'Wellness', 'Properties', 'Team'];

const gallerySlots = [
  { id:1,  cat:'Pearl Farms',    title:'Freshwater Pearl Oyster Beds',   sub:'Mandya, Karnataka',        color:'#3772cf', size:'large' },
  { id:2,  cat:'Pearl Farms',    title:'Pearl Harvest Season',           sub:'Mandya, Karnataka',        color:'#06b6d4', size:'small' },
  { id:3,  cat:'NewsJunction',   title:'Kannada News Desk',              sub:'NewsJunction Studio',      color:'#d45656', size:'small' },
  { id:4,  cat:'NewsJunction',   title:'Multi-Language Broadcast',       sub:'Live Studio',              color:'#c37d0d', size:'large' },
  { id:5,  cat:'Manikya Market', title:'Village Artisan Workshop',       sub:'Karnataka Craft Zone',     color:'#00b48a', size:'small' },
  { id:6,  cat:'Manikya Market', title:'Desi Product Collection',        sub:'100% Indian Origin',       color:'#059669', size:'small' },
  { id:7,  cat:'Wellness',       title:'Amrutha Malt — 42 Ingredients',  sub:'Manikya Roots',            color:'#22a06b', size:'large' },
  { id:8,  cat:'Wellness',       title:'Cold-Press Production Unit',     sub:'Manikya Roots Facility',   color:'#84cc16', size:'small' },
  { id:9,  cat:'Properties',     title:'Premium Residential Property',   sub:'Bengaluru, Karnataka',     color:'#c37d0d', size:'small' },
  { id:10, cat:'Properties',     title:'Property Site Visit',            sub:'Client Consultation',      color:'#d45656', size:'large' },
  { id:11, cat:'Team',           title:'Manikya Leadership Team',        sub:'Bengaluru HQ',             color:'#6b5cf6', size:'small' },
  { id:12, cat:'Team',           title:'Pearl Farm Investor Meet',       sub:'Mandya, Karnataka',        color:'#8b5cf6', size:'small' },
  { id:13, cat:'Pearl Farms',    title:'Pearl Nucleation Process',       sub:'Expert Technician',        color:'#3772cf', size:'small' },
  { id:14, cat:'Manikya Market', title:'Women Self-Help Group',          sub:'Mysuru District',          color:'#00b48a', size:'large' },
  { id:15, cat:'NewsJunction',   title:'On-Ground Reporting',            sub:'Karnataka Field Coverage', color:'#d45656', size:'small' },
];

interface GalleryRow {
  id: number;
  title: string;
  category: string;
  image_url: string | null;
  image_data: string | null;
  color: string;
  display_order: number;
}

export default function Gallery() {
  const isAdmin = isAdminLoggedIn();

  const [activeCat, setActiveCat]   = useState('All');
  const [lightbox, setLightbox]     = useState<number | null>(null);
  const [uploading, setUploading]   = useState<number | null>(null);
  const [deleting, setDeleting]     = useState<number | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  const [images, setImages] = useState<Record<number, string>>({});
  const [dbIds, setDbIds]   = useState<Record<number, number>>({});

  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const s1 = useInView(); const s2 = useInView();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/gallery`);
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const rows: GalleryRow[] = await res.json();

        const imgMap: Record<number, string> = {};
        const idMap:  Record<number, number> = {};

        rows.forEach(row => {
          const slot = gallerySlots.find(s => s.title === row.title);
          if (!slot) return;
          const src = row.image_data || row.image_url;
          if (src) imgMap[slot.id] = src;
          idMap[slot.id] = row.id;
        });

        setImages(imgMap);
        setDbIds(idMap);
      } catch (e) {
        console.error('Gallery load error:', e);
        setError('Could not load gallery. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleUpload = async (slotId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Image is large (>2MB). Consider compressing it first for faster load.');
    }

    setUploading(slotId);
    const token = getAdminToken();

    try {
      const slot = gallerySlots.find(s => s.id === slotId)!;

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      let dbId = dbIds[slotId];

      if (!dbId) {
        const createRes = await fetch(`${API_BASE}/gallery`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            title:         slot.title,
            category:      slot.cat,
            color:         slot.color,
            display_order: slot.id,
          }),
        });

        if (!createRes.ok) {
          const err = await createRes.json();
          throw new Error(err.error || 'Failed to create gallery item');
        }
        const created = await createRes.json();
        dbId = created.id;
        setDbIds(prev => ({ ...prev, [slotId]: dbId }));
      }

      const imgRes = await fetch(`${API_BASE}/gallery/${dbId}/image`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ image_data: base64 }),
      });

      if (!imgRes.ok) {
        const err = await imgRes.json();
        throw new Error(err.error || 'Image upload failed');
      }

      setImages(prev => ({ ...prev, [slotId]: base64 }));

    } catch (err: any) {
      console.error('Upload error:', err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(null);
      if (fileRefs.current[slotId]) fileRefs.current[slotId]!.value = '';
    }
  };

  const removeImage = async (slotId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Remove this image from the gallery?')) return;

    setDeleting(slotId);
    const token = getAdminToken();
    const dbId  = dbIds[slotId];

    try {
      if (dbId) {
        await fetch(`${API_BASE}/gallery/${dbId}/image`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ image_data: null, image_url: null }),
        });
      }
      setImages(prev => { const n = { ...prev }; delete n[slotId]; return n; });
    } catch (err: any) {
      console.error('Delete error:', err);
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const filtered      = activeCat === 'All' ? gallerySlots : gallerySlots.filter(g => g.cat === activeCat);
  const lbItem        = lightbox !== null ? gallerySlots.find(g => g.id === lightbox) : null;
  const uploadedCount = Object.keys(images).length;

  return (
    <div className="mk" style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        .gal-card { border-radius:12px; overflow:hidden; cursor:pointer; position:relative; transition:all .3s; }
        .gal-card:hover { transform:translateY(-3px); box-shadow:0 16px 36px rgba(10,10,10,0.1); }
        .del-btn { position:absolute; top:10px; right:10px; width:32px; height:32px; border-radius:50%; background:rgba(212,86,86,0.92); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .2s; z-index:10; }
        .gal-card:hover .del-btn { opacity:1; }
        .zoom-btn { position:absolute; bottom:10px; right:10px; width:32px; height:32px; border-radius:50%; background:rgba(0,0,0,0.55); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .2s; }
        .gal-card:hover .zoom-btn { opacity:1; }
        @media(hover:none) { .del-btn, .zoom-btn { opacity:1 !important; } }
        .cat-btn { padding:8px 16px; border-radius:9999px; border:1px solid var(--mk-hairline); background:#fff; color:var(--mk-steel); font-family:var(--mk-font); font-size:0.8125rem; font-weight:500; cursor:pointer; transition:all .25s; white-space:nowrap; }
        .cat-btn.active { background:var(--mk-primary); border-color:var(--mk-primary); color:#fff; }
        .cat-btn:hover:not(.active) { border-color:var(--mk-green); color:var(--mk-green-deep); }
        .upload-zone { border:2px dashed; border-radius:10px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; cursor:pointer; transition:all .3s; }
        .upload-zone:hover { opacity:.8; }
        .lightbox { position:fixed; inset:0; background:rgba(10,10,10,0.95); z-index:1000; display:flex; align-items:center; justify-content:center; }
        .gal-grid { columns: 3 280px; gap: 14px; }
        @media(max-width:640px) { .gal-grid { columns: 2; gap: 10px; } }
        @media(max-width:380px) { .gal-grid { columns: 1; gap: 10px; } }
        .cat-scroll { display:flex; gap:8px; align-items:center; overflow-x:auto; padding-bottom:8px; scrollbar-width:none; }
        .cat-scroll::-webkit-scrollbar { display:none; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      {/* Lightbox */}
      {lbItem && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} style={{ position:'absolute', top:16, right:16, background:'rgba(255,255,255,0.12)', border:'none', borderRadius:'50%', width:44, height:44, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1 }}>
            <X size={20} color="#fff"/>
          </button>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth:'95vw', maxHeight:'90vh', textAlign:'center', padding:'0 16px' }}>
            {images[lbItem.id] ? (
              <img src={images[lbItem.id]} alt={lbItem.title} style={{ maxWidth:'100%', maxHeight:'75vh', borderRadius:12, objectFit:'contain' }}/>
            ) : (
              <div style={{ width:'min(360px,85vw)', height:260, background:`${lbItem.color}20`, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <ImageIcon size={52} color={lbItem.color} style={{ opacity:.5 }}/>
              </div>
            )}
            <div style={{ marginTop:16 }}>
              <h3 style={{ color:'#fff', fontFamily:'var(--mk-font)', fontWeight:600, fontSize:'clamp(1rem,4vw,1.2rem)', margin:'0 0 6px' }}>{lbItem.title}</h3>
              <p style={{ color:'rgba(255,255,255,0.5)', fontFamily:'var(--mk-font)', fontSize:'0.85rem', margin:0 }}>{lbItem.sub}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="mk-hero-sky" style={{ position:'relative', overflow:'hidden', padding:'clamp(56px,9vw,96px) 0 clamp(36px,5vw,52px)', textAlign:'center' }}>
        <div className="mk-cloud" style={{ top:-40, left:'12%', width:280, height:180 }} />
        <div className="mk-cloud" style={{ bottom:-30, right:'14%', width:320, height:200 }} />
        <div className="mk-container" style={{ position:'relative', zIndex:2, maxWidth:720 }}>
          <span className="mk-badge mk-badge-glass" style={{ marginBottom:18 }}>Our gallery</span>
          <h1 className="mk-display" style={{ color:'var(--mk-ink)', margin:'0 0 14px' }}>Manikya in pictures</h1>
          <p className="mk-lead" style={{ color:'var(--mk-slate)', maxWidth:520, margin:'0 auto 22px' }}>
            A visual journey across our verticals — from pearl farms to news studios.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <div className="mk-card mk-card-glass" style={{ padding:'10px 20px', display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ color:'var(--mk-ink)', fontWeight:700, fontSize:'1.2rem' }}>{gallerySlots.length}</span>
              <span className="mk-small" style={{ color:'var(--mk-steel)' }}>Total slots</span>
            </div>
            <div className="mk-card mk-card-glass" style={{ padding:'10px 20px', display:'flex', alignItems:'center', gap:8 }}>
              {loading
                ? <Loader2 size={18} color="#00b48a" style={{ animation:'spin 1s linear infinite' }}/>
                : <span style={{ color:'var(--mk-green-deep)', fontWeight:700, fontSize:'1.2rem' }}>{uploadedCount}</span>
              }
              <span className="mk-small" style={{ color:'var(--mk-steel)' }}>Photos uploaded</span>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="mk-container" style={{ paddingTop: 16 }}>
          <div style={{ padding:'12px 16px', background:'rgba(212,86,86,0.08)', border:'1px solid rgba(212,86,86,0.3)', borderRadius:10, color:'#b13b3b', fontSize:'0.875rem' }}>
            ⚠️ {error}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div ref={s1.ref} className={`mk-reveal ${s1.v?'mk-on':''}`} style={{ background:'var(--mk-canvas)', borderBottom:'1px solid var(--mk-hairline)' }}>
        <div className="mk-container" style={{ padding:'18px clamp(1.25rem,4vw,2rem)' }}>
          <div className="cat-scroll">
            <Filter size={15} color="#a8a8aa" style={{ flexShrink:0 }}/>
            {categories.map(c => (
              <button key={c} className={`cat-btn ${activeCat===c?'active':''}`} onClick={() => setActiveCat(c)} style={{ flexShrink:0 }}>
                {c}
                {c !== 'All' && <span style={{ marginLeft:4, opacity:.6 }}>({gallerySlots.filter(g=>g.cat===c).length})</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section ref={s2.ref} className={`mk-reveal mk-sec-mint ${s2.v?'mk-on':''}`}>
        <div className="mk-container" style={{ padding:'clamp(32px,5vw,56px) clamp(1.25rem,4vw,2rem) clamp(60px,9vw,96px)' }}>

          {loading && (
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:12, padding:'60px 0', color:'var(--mk-stone)', fontSize:'0.9rem' }}>
              <Loader2 size={22} style={{ animation:'spin 1s linear infinite', color:'#00b48a' }}/>
              Loading gallery…
            </div>
          )}

          {!loading && (
            <div className="gal-grid">
              {filtered.map(item => {
                const hasImg      = !!images[item.id];
                const isUploading = uploading === item.id;
                const isDeleting  = deleting  === item.id;

                return (
                  <div key={item.id} style={{ breakInside:'avoid', marginBottom:14 }}>
                    <div
                      className="gal-card"
                      style={{ background: hasImg ? '#fff' : '#fff', border:`1px solid var(--mk-hairline)` }}
                      onClick={() => hasImg && !isAdmin && setLightbox(item.id)}
                    >
                      {hasImg ? (
                        <>
                          <img
                            src={images[item.id]}
                            alt={item.title}
                            style={{ width:'100%', display:'block', borderRadius:12, objectFit:'cover', maxHeight:item.size==='large'?340:200 }}
                          />
                          {isAdmin && (
                            <button className="del-btn" onClick={e => removeImage(item.id, e)} disabled={isDeleting}>
                              {isDeleting
                                ? <Loader2 size={13} color="#fff" style={{ animation:'spin 1s linear infinite' }}/>
                                : <Trash2 size={13} color="#fff"/>
                              }
                            </button>
                          )}
                          <button className="zoom-btn" onClick={e => { e.stopPropagation(); setLightbox(item.id); }}>
                            <ZoomIn size={13} color="#fff"/>
                          </button>
                          <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(transparent,rgba(0,0,0,0.78))', padding:'24px 12px 12px', borderRadius:'0 0 12px 12px', pointerEvents:'none' }}>
                            <div style={{ color:'#fff', fontWeight:600, fontSize:'0.85rem' }}>{item.title}</div>
                            <div style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.72rem' }}>{item.sub}</div>
                          </div>
                        </>
                      ) : (
                        <div style={{ padding:16, minHeight:item.size==='large'?220:160, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                          <span style={{ fontSize:'0.65rem', fontWeight:600, color:item.color, textTransform:'uppercase', letterSpacing:'0.1em', padding:'3px 10px', border:`1px solid ${item.color}40`, borderRadius:20, alignSelf:'flex-start' }}>{item.cat}</span>

                          {isAdmin ? (
                            <div
                              className="upload-zone"
                              onClick={e => { e.stopPropagation(); fileRefs.current[item.id]?.click(); }}
                              style={{ borderColor:`${item.color}40`, background:`${item.color}08`, padding:'16px 10px', flex:1, margin:'12px 0' }}
                            >
                              {isUploading ? (
                                <div style={{ textAlign:'center' }}>
                                  <div style={{ width:32, height:32, border:`3px solid ${item.color}40`, borderTopColor:item.color, borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 6px' }}/>
                                  <div style={{ color:item.color, fontSize:'0.75rem' }}>Uploading…</div>
                                </div>
                              ) : (
                                <>
                                  <div style={{ width:40, height:40, borderRadius:'50%', background:`${item.color}1a`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                    <ImageIcon size={18} color={item.color}/>
                                  </div>
                                  <div style={{ textAlign:'center' }}>
                                    <div style={{ fontWeight:600, color:item.color, fontSize:'0.8rem', marginBottom:2 }}>Tap to Upload</div>
                                    <div style={{ color:'var(--mk-stone)', fontSize:'0.68rem' }}>JPG, PNG, WEBP</div>
                                  </div>
                                  <label
                                    style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'7px 14px', background:item.color, color:'#fff', fontFamily:'var(--mk-font)', fontWeight:600, fontSize:'0.72rem', borderRadius:20, cursor:'pointer' }}
                                    onClick={e => e.stopPropagation()}
                                  >
                                    <Upload size={11}/> Choose
                                    <input
                                      ref={el => { fileRefs.current[item.id] = el; }}
                                      type="file"
                                      accept="image/*"
                                      style={{ display:'none' }}
                                      onChange={e => handleUpload(item.id, e)}
                                      onClick={e => e.stopPropagation()}
                                    />
                                  </label>
                                </>
                              )}
                            </div>
                          ) : (
                            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', margin:'12px 0' }}>
                              <div style={{ width:44, height:44, borderRadius:'50%', background:`${item.color}14`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <ImageIcon size={20} color={item.color} style={{ opacity:.5 }}/>
                              </div>
                            </div>
                          )}

                          <div>
                            <div style={{ color:'var(--mk-ink)', fontWeight:600, fontSize:'0.85rem', marginBottom:3 }}>{item.title}</div>
                            <div style={{ color:'var(--mk-stone)', fontSize:'0.72rem' }}>{item.sub}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
