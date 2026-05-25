import { useState, useEffect, useRef } from 'react';
import { Upload, ImageIcon, Trash2, X, ZoomIn, Filter } from 'lucide-react';

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

const galleryItems = [
  { id:1,  cat:'Pearl Farms',    title:'Freshwater Pearl Oyster Beds',   sub:'Mandya, Karnataka',        color:'#3b82f6', size:'large' },
  { id:2,  cat:'Pearl Farms',    title:'Pearl Harvest Season',           sub:'Mandya, Karnataka',        color:'#06b6d4', size:'small' },
  { id:3,  cat:'NewsJunction',   title:'Kannada News Desk',              sub:'NewsJunction Studio',      color:'#ef4444', size:'small' },
  { id:4,  cat:'NewsJunction',   title:'Multi-Language Broadcast',       sub:'Live Studio',              color:'#f97316', size:'large' },
  { id:5,  cat:'Manikya Market', title:'Village Artisan Workshop',       sub:'Karnataka Craft Zone',     color:'#10b981', size:'small' },
  { id:6,  cat:'Manikya Market', title:'Desi Product Collection',        sub:'100% Indian Origin',       color:'#059669', size:'small' },
  { id:7,  cat:'Wellness',       title:'Amrutha Malt — 42 Ingredients',  sub:'Manikya Roots',            color:'#22c55e', size:'large' },
  { id:8,  cat:'Wellness',       title:'Cold-Press Production Unit',     sub:'Manikya Roots Facility',   color:'#84cc16', size:'small' },
  { id:9,  cat:'Properties',     title:'Premium Residential Property',   sub:'Bengaluru, Karnataka',     color:'#f59e0b', size:'small' },
  { id:10, cat:'Properties',     title:'Property Site Visit',            sub:'Client Consultation',      color:'#ef4444', size:'large' },
  { id:11, cat:'Team',           title:'Manikya Leadership Team',        sub:'Bengaluru HQ',             color:'#8b5cf6', size:'small' },
  { id:12, cat:'Team',           title:'Pearl Farm Investor Meet',       sub:'Mandya, Karnataka',        color:'#a855f7', size:'small' },
  { id:13, cat:'Pearl Farms',    title:'Pearl Nucleation Process',       sub:'Expert Technician',        color:'#3b82f6', size:'small' },
  { id:14, cat:'Manikya Market', title:'Women Self-Help Group',          sub:'Mysuru District',          color:'#10b981', size:'large' },
  { id:15, cat:'NewsJunction',   title:'On-Ground Reporting',            sub:'Karnataka Field Coverage', color:'#ef4444', size:'small' },
];

export default function Gallery() {
  const isAdmin = !!localStorage.getItem('admin_logged_in');
  const [activeCat, setActiveCat] = useState('All');
  const [lightbox, setLightbox]   = useState<number|null>(null);
  const [uploading, setUploading] = useState<number|null>(null);
  const [images, setImages]       = useState<Record<number,string>>(() => {
    try { return JSON.parse(localStorage.getItem('manikya_gallery_images') || '{}'); } catch { return {}; }
  });
  const fileRefs = useRef<Record<number, HTMLInputElement|null>>({});
  const s1 = useInView(); const s2 = useInView();

  const saveToStorage = (updated: Record<number,string>) => {
    try { localStorage.setItem('manikya_gallery_images', JSON.stringify(updated)); } catch {}
  };

  const handleUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(id);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImages(p => { const updated = { ...p, [id]: base64 }; saveToStorage(updated); return updated; });
      setUploading(null);
    };
    reader.onerror = () => setUploading(null);
    reader.readAsDataURL(file);
  };

  const removeImage = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setImages(p => { const n = { ...p }; delete n[id]; saveToStorage(n); return n; });
    if (fileRefs.current[id]) fileRefs.current[id]!.value = '';
  };

  const filtered = activeCat === 'All' ? galleryItems : galleryItems.filter(g => g.cat === activeCat);
  const lbItem   = lightbox !== null ? galleryItems.find(g => g.id === lightbox) : null;
  const uploadedCount = Object.keys(images).length;

  return (
    <div style={{ background:'#0a0f1e', minHeight:'100vh', overflowX:'hidden' }}>
      <style>{`
        * { box-sizing: border-box; }
        .gal-card { border-radius:12px; overflow:hidden; cursor:pointer; position:relative; transition:all .3s; }
        .gal-card:hover { transform:translateY(-3px); box-shadow:0 16px 36px rgba(0,0,0,0.4); }
        .del-btn { position:absolute; top:10px; right:10px; width:32px; height:32px; border-radius:50%; background:rgba(239,68,68,0.9); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .2s; z-index:10; }
        .gal-card:hover .del-btn { opacity:1; }
        .zoom-btn { position:absolute; bottom:10px; right:10px; width:32px; height:32px; border-radius:50%; background:rgba(0,0,0,0.6); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .2s; }
        .gal-card:hover .zoom-btn { opacity:1; }
        /* Always show delete/zoom on mobile (no hover) */
        @media(hover:none) {
          .del-btn, .zoom-btn { opacity:1 !important; }
        }
        .cat-btn { padding:7px 14px; border-radius:20px; border:1px solid rgba(255,255,255,0.15); background:transparent; color:rgba(255,255,255,0.6); font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:600; cursor:pointer; transition:all .3s; white-space:nowrap; }
        .cat-btn.active { background:#f59e0b; border-color:#f59e0b; color:#000; }
        .cat-btn:hover:not(.active) { border-color:#f59e0b; color:#f59e0b; }
        .upload-zone { border:2px dashed; border-radius:12px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; cursor:pointer; transition:all .3s; }
        .upload-zone:hover { opacity:.8; }
        .reveal { opacity:0; transform:translateY(30px); transition:all .7s ease; }
        .reveal.on { opacity:1; transform:translateY(0); }
        .lightbox { position:fixed; inset:0; background:rgba(0,0,0,0.95); z-index:1000; display:flex; align-items:center; justify-content:center; }

        /* ── MOBILE GRID ── */
        .gal-grid { columns: 3 280px; gap: 12px; }
        @media(max-width:640px) { .gal-grid { columns: 2; gap: 10px; } }
        @media(max-width:380px) { .gal-grid { columns: 1; gap: 10px; } }

        /* ── CATEGORY SCROLL ── */
        .cat-scroll { display:flex; gap:8px; overflow-x:auto; padding-bottom:8px; scrollbar-width:none; -ms-overflow-style:none; }
        .cat-scroll::-webkit-scrollbar { display:none; }

        /* ── HERO STATS ── */
        .hero-stats { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        @media(max-width:480px) { .hero-stats { gap:8px; } }
      `}</style>

      {/* Lightbox */}
      {lbItem && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} style={{ position:'absolute', top:16, right:16, background:'rgba(255,255,255,0.1)', border:'none', borderRadius:'50%', width:44, height:44, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1 }}>
            <X size={20} color="#fff"/>
          </button>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth:'95vw', maxHeight:'90vh', textAlign:'center', padding:'0 16px' }}>
            {images[lbItem.id] ? (
              <img src={images[lbItem.id]} alt={lbItem.title} style={{ maxWidth:'100%', maxHeight:'75vh', borderRadius:10, objectFit:'contain' }}/>
            ) : (
              <div style={{ width:'min(360px,85vw)', height:260, background:`${lbItem.color}20`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <ImageIcon size={52} color={lbItem.color} style={{ opacity:.5 }}/>
              </div>
            )}
            <div style={{ marginTop:16 }}>
              <h3 style={{ color:'#fff', fontFamily:'DM Sans,sans-serif', fontWeight:700, fontSize:'clamp(1rem,4vw,1.2rem)', margin:'0 0 6px' }}>{lbItem.title}</h3>
              <p style={{ color:'rgba(255,255,255,0.5)', fontFamily:'DM Sans,sans-serif', fontSize:'0.85rem', margin:0 }}>{lbItem.sub}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section style={{ padding:'clamp(70px,10vw,100px) clamp(1rem,4vw,24px) clamp(32px,5vw,50px)', textAlign:'center', background:'linear-gradient(180deg,rgba(245,158,11,0.05) 0%,transparent 100%)' }}>
        <div style={{ maxWidth:700, margin:'0 auto' }}>
          <div style={{ display:'inline-block', padding:'5px 16px', background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:20, marginBottom:16 }}>
            <span style={{ fontFamily:'DM Sans,sans-serif', color:'#f59e0b', fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase' }}>Our Gallery</span>
          </div>
          <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1.8rem,6vw,3rem)', fontWeight:800, color:'#fff', margin:'0 0 14px' }}>
            Manikya in <span style={{ color:'#f59e0b' }}>Pictures</span>
          </h1>
          <p style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.55)', fontSize:'clamp(0.88rem,2.5vw,1rem)', margin:'0 0 20px', lineHeight:1.6 }}>
            A visual journey across our six verticals — from pearl farms to news studios.
          </p>
          <div className="hero-stats">
            <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:10, padding:'10px 20px', display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ color:'#f59e0b', fontFamily:'DM Sans,sans-serif', fontWeight:800, fontSize:'1.3rem' }}>{galleryItems.length}</span>
              <span style={{ color:'rgba(255,255,255,0.5)', fontFamily:'DM Sans,sans-serif', fontSize:'0.82rem' }}>Total Slots</span>
            </div>
            <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:10, padding:'10px 20px', display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ color:'#10b981', fontFamily:'DM Sans,sans-serif', fontWeight:800, fontSize:'1.3rem' }}>{uploadedCount}</span>
              <span style={{ color:'rgba(255,255,255,0.5)', fontFamily:'DM Sans,sans-serif', fontSize:'0.82rem' }}>Photos Uploaded</span>
            </div>
          </div>
        </div>
      </section>

      {/* Admin upload tip */}
      {isAdmin && (
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 clamp(1rem,4vw,24px) 16px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:10 }}>
            <Upload size={16} color="#10b981" style={{ flexShrink:0 }}/>
            <p style={{ margin:0, fontFamily:'DM Sans,sans-serif', color:'#6ee7b7', fontSize:'0.85rem' }}>
              <strong>Admin Mode:</strong> Tap any card to upload a photo.
            </p>
          </div>
        </div>
      )}

      {/* Category Filter — horizontal scroll on mobile */}
      <div ref={s1.ref} className={`reveal ${s1.v?'on':''}`} style={{ maxWidth:1200, margin:'0 auto', padding:'0 clamp(1rem,4vw,24px) 28px' }}>
        <div className="cat-scroll">
          <Filter size={15} color="rgba(255,255,255,0.4)" style={{ flexShrink:0, marginTop:2 }}/>
          {categories.map(c => (
            <button key={c} className={`cat-btn ${activeCat===c?'active':''}`} onClick={() => setActiveCat(c)} style={{ flexShrink:0 }}>{c}
              {c !== 'All' && <span style={{ marginLeft:4, opacity:.7 }}>({galleryItems.filter(g=>g.cat===c).length})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section ref={s2.ref} className={`reveal ${s2.v?'on':''}`} style={{ maxWidth:1200, margin:'0 auto', padding:`0 clamp(1rem,4vw,24px) clamp(60px,10vw,100px)` }}>
        <div className="gal-grid">
          {filtered.map(item => {
            const hasImg = !!images[item.id];
            const isUploading = uploading === item.id;
            return (
              <div key={item.id} style={{ breakInside:'avoid', marginBottom:12 }}>
                <div className="gal-card" style={{ background: hasImg ? 'transparent' : `${item.color}12`, border:`1px solid ${item.color}25` }}
                  onClick={() => hasImg && setLightbox(item.id)}>

                  {hasImg ? (
                    <>
                      <img src={images[item.id]} alt={item.title} style={{ width:'100%', display:'block', borderRadius:12, objectFit:'cover', maxHeight:item.size==='large'?340:200 }}/>
                      {isAdmin && (
                        <button className="del-btn" onClick={e => removeImage(item.id, e)}>
                          <Trash2 size={13} color="#fff"/>
                        </button>
                      )}
                      <button className="zoom-btn" onClick={e => { e.stopPropagation(); setLightbox(item.id); }}>
                        <ZoomIn size={13} color="#fff"/>
                      </button>
                      <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(transparent,rgba(0,0,0,0.8))', padding:'24px 12px 12px', borderRadius:'0 0 12px 12px', pointerEvents:'none' }}>
                        <div style={{ fontFamily:'DM Sans,sans-serif', color:'#fff', fontWeight:700, fontSize:'0.82rem' }}>{item.title}</div>
                        <div style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.6)', fontSize:'0.72rem' }}>{item.sub}</div>
                      </div>
                    </>
                  ) : (
                    <div style={{ padding:14, minHeight:item.size==='large'?220:160, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                      <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.65rem', fontWeight:700, color:item.color, textTransform:'uppercase', letterSpacing:'0.12em', padding:'3px 8px', border:`1px solid ${item.color}40`, borderRadius:20, alignSelf:'flex-start' }}>{item.cat}</span>

                      {isAdmin ? (
                        <div className="upload-zone" onClick={e => { e.stopPropagation(); fileRefs.current[item.id]?.click(); }}
                          style={{ borderColor:`${item.color}40`, background:`${item.color}06`, padding:'16px 10px', flex:1, margin:'10px 0' }}>
                          {isUploading ? (
                            <div style={{ textAlign:'center' }}>
                              <div style={{ width:32, height:32, border:`3px solid ${item.color}40`, borderTopColor:item.color, borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 6px' }}/>
                              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                              <div style={{ fontFamily:'DM Sans,sans-serif', color:item.color, fontSize:'0.75rem' }}>Uploading...</div>
                            </div>
                          ) : (
                            <>
                              <div style={{ width:40, height:40, borderRadius:'50%', background:`${item.color}20`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <ImageIcon size={18} color={item.color}/>
                              </div>
                              <div style={{ textAlign:'center' }}>
                                <div style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, color:item.color, fontSize:'0.78rem', marginBottom:2 }}>Tap to Upload</div>
                                <div style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.4)', fontSize:'0.68rem' }}>JPG, PNG, WEBP</div>
                              </div>
                              <label style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'6px 12px', background:item.color, color:'#fff', fontFamily:'DM Sans,sans-serif', fontWeight:600, fontSize:'0.72rem', borderRadius:6, cursor:'pointer' }}
                                onClick={e => e.stopPropagation()}>
                                <Upload size={11}/> Choose
                                <input ref={el => { fileRefs.current[item.id]=el; }} type="file" accept="image/*" style={{ display:'none' }} onChange={e => handleUpload(item.id,e)} onClick={e => e.stopPropagation()}/>
                              </label>
                            </>
                          )}
                        </div>
                      ) : (
                        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', margin:'10px 0' }}>
                          <div style={{ width:44, height:44, borderRadius:'50%', background:`${item.color}15`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <ImageIcon size={20} color={item.color} style={{ opacity:.4 }}/>
                          </div>
                        </div>
                      )}

                      <div>
                        <div style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.8)', fontWeight:700, fontSize:'0.82rem', marginBottom:3 }}>{item.title}</div>
                        <div style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.4)', fontSize:'0.72rem' }}>{item.sub}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
