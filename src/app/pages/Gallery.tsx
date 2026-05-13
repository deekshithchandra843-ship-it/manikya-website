import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { X, ArrowRight, ChevronLeft, ChevronRight, Upload, ImageIcon, Trash2 } from 'lucide-react';

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
  { id:1,  cat:'Pearl Farms',     title:'Freshwater Pearl Oyster Beds',      sub:'Mandya, Karnataka',       color:'#3b82f6', size:'large', desc:'Rows of oyster cages in our Mandya pearl farming facility.' },
  { id:2,  cat:'Pearl Farms',     title:'Pearl Harvest Season',              sub:'Mandya, Karnataka',       color:'#06b6d4', size:'small', desc:'Harvesting fully grown freshwater pearls after 18 months.' },
  { id:3,  cat:'NewsJunction',    title:'Kannada News Desk',                 sub:'NewsJunction Studio',     color:'#ef4444', size:'small', desc:'Our Kannada editorial team delivering live news.' },
  { id:4,  cat:'NewsJunction',    title:'Multi-Language Broadcast',          sub:'Live Studio',             color:'#f97316', size:'large', desc:'Five language desks operating simultaneously.' },
  { id:5,  cat:'Manikya Market',  title:'Village Artisan Workshop',          sub:'Karnataka Craft Zone',    color:'#10b981', size:'small', desc:'Handloom weaver creating silk fabric for Manikya Market.' },
  { id:6,  cat:'Manikya Market',  title:'Desi Product Collection',           sub:'100% Indian Origin',      color:'#059669', size:'small', desc:'Authentic handcrafted pottery and traditional textiles.' },
  { id:7,  cat:'Wellness',        title:'Amrutha Malt — 42 Ingredients',     sub:'Manikya Roots',           color:'#22c55e', size:'large', desc:'42-ingredient Amrutha Multi Millet Malt.' },
  { id:8,  cat:'Wellness',        title:'Cold-Press Production Unit',        sub:'Manikya Roots Facility',  color:'#84cc16', size:'small', desc:'Cold-press oil facility — fresh daily production.' },
  { id:9,  cat:'Properties',      title:'Premium Residential Property',      sub:'Bengaluru, Karnataka',    color:'#f59e0b', size:'small', desc:'Premium residential property with full legal verification.' },
  { id:10, cat:'Properties',      title:'Property Site Visit',               sub:'Client Consultation',     color:'#ef4444', size:'large', desc:'Site visit with prospective buyers — full coordination.' },
  { id:11, cat:'Team',            title:'Manikya Leadership Team',           sub:'Bengaluru HQ',            color:'#8b5cf6', size:'small', desc:'Leadership team driving six verticals across India.' },
  { id:12, cat:'Team',            title:'Pearl Farm Investor Meet',          sub:'Mandya, Karnataka',       color:'#a855f7', size:'small', desc:'Annual investor meet at our Mandya pearl farm.' },
  { id:13, cat:'Pearl Farms',     title:'Pearl Nucleation Process',          sub:'Expert Technician',       color:'#3b82f6', size:'small', desc:'Expert nucleation — surgical nucleus insertion.' },
  { id:14, cat:'Manikya Market',  title:'Women Self-Help Group',             sub:'Mysuru District',         color:'#10b981', size:'large', desc:'Women entrepreneurs reaching global buyers through Manikya Market.' },
  { id:15, cat:'NewsJunction',    title:'On-Ground Reporting',               sub:'Karnataka Field Coverage', color:'#ef4444', size:'small', desc:'Field reporters covering hyper-local stories from 31 districts.' },
];

export default function Gallery() {
  const [activeCat, setActiveCat]   = useState('All');
  const [lightbox, setLightbox]     = useState<number | null>(null);
  const [images, setImages]         = useState<Record<number, string>>({});
  const fileRefs                    = useRef<Record<number, HTMLInputElement | null>>({});
  const s1 = useInView(); const s2 = useInView();

  const filtered = activeCat === 'All' ? galleryItems : galleryItems.filter(g => g.cat === activeCat);
  const lbItem   = lightbox !== null ? galleryItems.find(g => g.id === lightbox) : null;
  const lbIdx    = lightbox !== null ? filtered.findIndex(g => g.id === lightbox) : -1;

  const prev = () => { if (lbIdx > 0) setLightbox(filtered[lbIdx - 1].id); };
  const next = () => { if (lbIdx < filtered.length - 1) setLightbox(filtered[lbIdx + 1].id); };

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [lbIdx, filtered]);

  // Permanent upload — no 15-sec timer
  const handleUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImages(p => ({ ...p, [id]: url }));
  };

  const removeImage = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setImages(p => { const n = { ...p }; delete n[id]; return n; });
    if (fileRefs.current[id]) fileRefs.current[id]!.value = '';
  };

  return (
    <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", background: '#fff', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}

        .gold-text{background:linear-gradient(90deg,#f59e0b,#fde68a,#f59e0b);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite}
        .reveal{opacity:0;transform:translateY(36px);transition:all .8s cubic-bezier(.16,1,.3,1)}
        .reveal.on{opacity:1;transform:translateY(0)}
        .cat-btn{transition:all .3s ease;cursor:pointer;border:none;background:none;font-family:'DM Sans',sans-serif}
        .gal-card{transition:all .4s cubic-bezier(.16,1,.3,1);overflow:hidden;position:relative}
        .gal-card:hover{transform:translateY(-4px);box-shadow:0 20px 40px rgba(0,0,0,0.12)!important}
        .gal-card:hover .hover-overlay{opacity:1}
        .hover-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.55);opacity:0;transition:opacity .4s;display:flex;flex-direction:column;justify-content:flex-end;padding:20px;pointer-events:none}
        .btn-main{transition:all .3s;text-decoration:none;cursor:pointer;border:none}
        .btn-main:hover{transform:translateY(-2px)}
        .upload-zone{border:2px dashed;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;cursor:pointer;transition:all .3s}
        .upload-zone:hover{opacity:.8}
        .lb-nav{transition:all .3s;cursor:pointer;border:none}
        .lb-nav:hover{background:rgba(255,255,255,0.2)!important}
        .marquee-track{display:flex;gap:60px;animation:marquee 20s linear infinite;white-space:nowrap}
        .del-btn{position:absolute;top:8px;right:8px;z-index:10;background:rgba(239,68,68,0.9);border:none;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity .3s}
        .gal-card:hover .del-btn{opacity:1}
      `}</style>

      {/* LIGHTBOX */}
      {lbItem && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.95)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',animation:'scaleIn .3s ease' }} onClick={() => setLightbox(null)}>
          <button onClick={e=>{e.stopPropagation();setLightbox(null);}} style={{ position:'absolute',top:20,right:20,background:'rgba(255,255,255,0.1)',border:'none',borderRadius:'50%',width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'white' }}><X size={20}/></button>
          <button onClick={e=>{e.stopPropagation();prev();}} className="lb-nav" disabled={lbIdx===0} style={{ position:'absolute',left:20,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'50%',width:48,height:48,display:'flex',alignItems:'center',justifyContent:'center',color:'white',opacity:lbIdx===0?0.3:1 }}><ChevronLeft size={22}/></button>
          <button onClick={e=>{e.stopPropagation();next();}} className="lb-nav" disabled={lbIdx===filtered.length-1} style={{ position:'absolute',right:20,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'50%',width:48,height:48,display:'flex',alignItems:'center',justifyContent:'center',color:'white',opacity:lbIdx===filtered.length-1?0.3:1 }}><ChevronRight size={22}/></button>
          <div onClick={e=>e.stopPropagation()} style={{ maxWidth:700,width:'90%',background:'#111',borderRadius:12,overflow:'hidden' }}>
            {images[lbItem.id] ? (
              <img src={images[lbItem.id]} alt={lbItem.title} style={{ width:'100%',maxHeight:440,objectFit:'cover',display:'block' }}/>
            ) : (
              <div style={{ height:320,background:lbItem.color+'20',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12 }}>
                <div style={{ fontSize:'3rem' }}>🖼️</div>
                <p style={{ fontFamily:'DM Sans,sans-serif',color:'rgba(255,255,255,0.4)',fontSize:'0.9rem' }}>No photo uploaded yet</p>
              </div>
            )}
            <div style={{ padding:'24px 28px' }}>
              <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.7rem',fontWeight:700,color:lbItem.color,textTransform:'uppercase',letterSpacing:'0.15em' }}>{lbItem.cat}</span>
              <h3 style={{ fontSize:'1.4rem',fontWeight:700,color:'white',margin:'6px 0 6px' }}>{lbItem.title}</h3>
              <p style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.8rem',color:'rgba(255,255,255,0.5)',margin:'0 0 8px' }}>{lbItem.sub}</p>
              <p style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.88rem',color:'rgba(255,255,255,0.65)',margin:0,lineHeight:1.7 }}>{lbItem.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section style={{ background:'#000',padding:'8rem 0 5rem',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',inset:0,background:'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}/>
        <div style={{ maxWidth:900,margin:'0 auto',padding:'0 2rem',position:'relative',textAlign:'center' }}>
          <p style={{ fontFamily:'DM Sans,sans-serif',fontWeight:700,fontSize:'0.7rem',letterSpacing:'0.3em',color:'#f59e0b',textTransform:'uppercase',marginBottom:16 }}>Manikya Groups</p>
          <h1 style={{ fontSize:'clamp(3rem,7vw,5.5rem)',fontWeight:700,color:'white',lineHeight:1.0,marginBottom:20 }}>
            The <span className="gold-text">Gallery</span>
          </h1>
          <p style={{ fontFamily:'DM Sans,sans-serif',color:'rgba(255,255,255,0.45)',fontSize:'1.05rem',maxWidth:480,margin:'0 auto 36px',lineHeight:1.8,fontWeight:300 }}>
            Visual stories from across our six business verticals — farms, studios, markets, and beyond.
          </p>
          <div style={{ display:'flex',gap:24,justifyContent:'center',flexWrap:'wrap' }}>
            {[['15+','Visual Stories'],['6','Business Verticals'],['31+','Districts Covered']].map(([v,l])=>(
              <div key={l} style={{ textAlign:'center' }}>
                <div style={{ fontSize:'1.8rem',fontWeight:700,color:'white' }}>{v}</div>
                <div style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.7rem',color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'0.1em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position:'absolute',bottom:0,left:0,right:0 }}>
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg"><path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#fff"/></svg>
        </div>
      </section>

      {/* GALLERY GRID */}
      <section style={{ padding:'4rem 0 6rem',background:'#fff' }} ref={s1.ref}>
        <div style={{ maxWidth:1280,margin:'0 auto',padding:'0 2rem' }}>

          {/* Category filter */}
          <div className={`reveal ${s1.v?'on':''}`} style={{ display:'flex',gap:0,flexWrap:'wrap',marginBottom:40,borderBottom:'1px solid #e2e8f0' }}>
            {categories.map(cat=>(
              <button key={cat} className="cat-btn" onClick={()=>setActiveCat(cat)}
                style={{ padding:'12px 20px',fontWeight:600,fontSize:'0.8rem',letterSpacing:'0.05em',textTransform:'uppercase',color:activeCat===cat?'#000':'#94a3b8',borderBottom:activeCat===cat?'2px solid #f59e0b':'2px solid transparent',marginBottom:-1 }}>
                {cat}
              </button>
            ))}
            <span style={{ marginLeft:'auto',fontFamily:'DM Sans,sans-serif',fontSize:'0.8rem',color:'#94a3b8',alignSelf:'center',paddingRight:8 }}>{filtered.length} items</span>
          </div>

          {/* Upload tip */}
          <div className={`reveal ${s1.v?'on':''}`} style={{ display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:10,marginBottom:32 }}>
            <Upload size={18} style={{ color:'#16a34a',flexShrink:0 }}/>
            <p style={{ fontFamily:'DM Sans,sans-serif',color:'#15803d',fontSize:'0.85rem',margin:0 }}>
              <strong>Upload photos:</strong> Click "Choose File" on each card to permanently upload a photo. Photos stay visible until you remove them.
            </p>
          </div>

          {/* Masonry grid */}
          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16 }}>
            {filtered.map((item,i)=>{
              const hasImg = !!images[item.id];
              return(
                <div key={item.id} className={`gal-card reveal ${s1.v?'on':''}`}
                  style={{ transitionDelay:`${(i%9)*60}ms`,gridRow:item.size==='large'?'span 2':'span 1',background:hasImg?'#000':item.color+'0d',border:`1px solid ${item.color}25`,minHeight:item.size==='large'?340:200,position:'relative',borderRadius:4 }}
                  onClick={()=>setLightbox(item.id)}>
                  <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:item.color,zIndex:2 }}/>

                  {/* Delete button */}
                  {hasImg && (
                    <button className="del-btn" onClick={e=>removeImage(item.id,e)}>
                      <Trash2 size={13} color="white"/>
                    </button>
                  )}

                  {hasImg ? (
                    /* Uploaded image — permanently visible */
                    <div style={{ width:'100%',height:'100%',minHeight:item.size==='large'?340:200,position:'relative' }}>
                      <img src={images[item.id]} alt={item.title} style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
                      <div className="hover-overlay">
                        <h3 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'1.1rem',fontWeight:700,color:'white',marginBottom:2 }}>{item.title}</h3>
                        <p style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.75rem',color:'rgba(255,255,255,0.7)',margin:0 }}>{item.sub}</p>
                      </div>
                    </div>
                  ) : (
                    /* Upload zone */
                    <div style={{ padding:24,height:'100%',minHeight:item.size==='large'?340:200,display:'flex',flexDirection:'column',justifyContent:'space-between' }}>
                      <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.68rem',fontWeight:700,color:item.color,textTransform:'uppercase',letterSpacing:'0.15em',padding:'3px 10px',border:`1px solid ${item.color}40`,borderRadius:20,alignSelf:'flex-start' }}>{item.cat}</span>

                      {/* Upload area */}
                      <div className="upload-zone" onClick={e=>{e.stopPropagation();fileRefs.current[item.id]?.click();}}
                        style={{ borderColor:`${item.color}40`,background:`${item.color}06`,padding:item.size==='large'?'32px 20px':'20px',flex:1,margin:'16px 0' }}>
                        <div style={{ width:52,height:52,borderRadius:'50%',background:item.color+'15',display:'flex',alignItems:'center',justifyContent:'center' }}>
                          <ImageIcon size={24} style={{ color:item.color }}/>
                        </div>
                        <div style={{ textAlign:'center' }}>
                          <div style={{ fontFamily:'DM Sans,sans-serif',fontWeight:700,color:item.color,fontSize:'0.88rem',marginBottom:4 }}>Click to Upload Photo</div>
                          <div style={{ fontFamily:'DM Sans,sans-serif',color:'#94a3b8',fontSize:'0.72rem' }}>JPG, PNG, WEBP supported</div>
                        </div>
                        <label style={{ display:'inline-flex',alignItems:'center',gap:6,padding:'8px 18px',background:item.color,color:'#fff',fontFamily:'DM Sans,sans-serif',fontWeight:600,fontSize:'0.78rem',borderRadius:6,cursor:'pointer',letterSpacing:'0.05em' }}
                          onClick={e=>e.stopPropagation()}>
                          <Upload size={14}/> Choose File
                          <input ref={el=>{ fileRefs.current[item.id]=el; }} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>handleUpload(item.id,e)} onClick={e=>e.stopPropagation()}/>
                        </label>
                      </div>

                      <div>
                        <h3 style={{ fontSize:item.size==='large'?'1.15rem':'0.95rem',fontWeight:700,color:'#0f172a',marginBottom:3,lineHeight:1.3 }}>{item.title}</h3>
                        <p style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.72rem',color:'#94a3b8',margin:0 }}>{item.sub}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:'#000',padding:'clamp(4rem,6vw,6rem) 0',textAlign:'center' }} ref={s2.ref}>
        <div style={{ maxWidth:700,margin:'0 auto',padding:'0 clamp(1.5rem,5vw,5rem)' }}>
          <div className={`reveal ${s2.v?'on':''}`}>
            <h2 style={{ fontSize:'clamp(2rem,4vw,3.5rem)',fontWeight:700,lineHeight:1.05,color:'white',marginBottom:20 }}>
              Want to see<br/><span className="gold-text">more?</span>
            </h2>
            <p style={{ fontFamily:'DM Sans,sans-serif',color:'rgba(255,255,255,0.4)',fontSize:'1rem',lineHeight:1.8,marginBottom:36,fontWeight:300 }}>
              Schedule a site visit to our farms, studios, or wellness centres and experience Manikya up close.
            </p>
            <div style={{ display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap' }}>
              <Link to="/contact" className="btn-main" style={{ display:'inline-flex',alignItems:'center',gap:10,padding:'15px 36px',background:'#f59e0b',color:'#000',fontFamily:'DM Sans,sans-serif',fontWeight:700,fontSize:'0.85rem',letterSpacing:'0.08em',textTransform:'uppercase' }}>
                Schedule a Visit <ArrowRight size={14}/>
              </Link>
              <Link to="/pearl-farms" className="btn-main" style={{ display:'inline-flex',alignItems:'center',gap:10,padding:'15px 36px',border:'1px solid rgba(255,255,255,0.2)',color:'white',fontFamily:'DM Sans,sans-serif',fontWeight:600,fontSize:'0.85rem',letterSpacing:'0.08em',textTransform:'uppercase' }}>
                Pearl Farm Investment
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
