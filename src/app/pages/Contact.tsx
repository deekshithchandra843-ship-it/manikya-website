import { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, CheckCircle, ExternalLink, Send, ChevronDown, Instagram, Youtube, Facebook, X } from 'lucide-react';
import { contactApi } from '../../lib/api';

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

const faqs = [
  { q:'What is the minimum eligibility for a loan from Manikya Money Service?', a:'Applicants must have valid government-issued ID proof, income proof (salary slip/ITR), and meet basic KYC requirements. Eligibility varies by loan type and amount.' },
  { q:'How long does loan approval take?', a:'Most applications are reviewed and approved within 24–48 business hours. Disbursement typically follows within 2–3 working days post approval.' },
  { q:'Are there any hidden charges?', a:'Absolutely not. Manikya Money Service maintains complete transparency in all financial dealings. All charges are disclosed upfront before you sign any agreement.' },
  { q:'What are the interest rates?', a:'Interest rates vary by loan type, tenure, and applicant eligibility. We offer competitive rates starting from 10% per annum. Contact us for a personalised quote.' },
  { q:'Can I apply for a loan online?', a:'Yes. Our application process is fully digital-friendly. You can apply, upload documents, and track status entirely online through our platform.' },
  { q:'What types of loans does Manikya Properties offer?', a:'We facilitate Home Loans, Loan Against Property, Commercial Property Loans, and Plot Loans through our partner banks including SBI, HDFC, ICICI, and Axis Bank.' },
  { q:'How do I contact the Pearl Farms investment team?', a:'You can reach out through this contact form, call us at +91 74116 47999, or email us. Our investment team will schedule a consultation within 24 hours.' },
  { q:'Where is the NewsJunction studio located?', a:'Our primary studio is at #215, MGES, Second Floor, 5th Main Road, RPC Layout, Hampi Nagar, Bengaluru – 560 104. You can also watch us live at newsjunction.net/stream.php.' },
  { q:'How can I sell on Manikya Market?', a:'Rural artisans, farmers, and women entrepreneurs can register through our contact form. Our team will visit, photograph your products, and list them — at zero cost to you.' },
  { q:'Where can I buy Amrutha Multi Millet Malt?', a:'Amrutha Multi Millet Malt by Manikya Roots is available through our online portal and select retail partners. Contact us to place bulk or retail orders.' },
];

const interests = [
  'Pearl Farm Investment','NewsJunction Advertising','Manikya Market — Sell My Products',
  'Manikya Roots — Wellness Products','Manikya Properties — Buy/Rent Property',
  'Manikya Money — Loan Enquiry','General Enquiry',
];

const defaultSocialLinks = {
  instagram: 'https://www.instagram.com/newsjunctiondigital?igsh=eGd5czZldWdsMDEw',
  facebook:  'https://www.facebook.com/share/18cqpxCY8w/',
  youtube:   'https://youtube.com/@newsjunctiondigital?si=Qb5X358zSsEwiOrZ',
  maps:      'https://maps.google.com/?q=215+MGES+5th+Main+Road+RPC+Layout+Hampi+Nagar+Bengaluru+560104',
};

export default function Contact() {
  const [form, setForm]             = useState({ name:'',email:'',phone:'',interest:'',message:'' });
  const [sent, setSent]             = useState(false);
  const [sending, setSending]       = useState(false);
  const [error, setError]           = useState('');
  const [showPopup, setShowPopup]   = useState(false);
  const [openFaq, setOpenFaq]       = useState<number|null>(null);
  const [showSocial, setShowSocial] = useState(false);
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);
  const [, setSocialLoading] = useState(true);
  const [editMode, setEditMode]     = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savingLinks, setSavingLinks] = useState(false);
  const s1 = useInView(); const s2 = useInView(); const s3 = useInView();

  useEffect(() => {
    fetch('https://manikya-backend.onrender.com/api/social-links')
      .then(r => r.json())
      .then(data => { setSocialLinks(prev => ({ ...prev, ...data })); })
      .catch(() => {})
      .finally(() => setSocialLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      await contactApi.submit(form);
      setSent(true);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 7000);
      setForm({ name:'',email:'',phone:'',interest:'',message:'' });
    } catch {
      setError('Something went wrong. Please try again or call us directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mk" style={{ overflowX:'hidden' }}>
      <style>{`
        @keyframes mkMarquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes mkPop { from { opacity:0; transform:scale(.9) } to { opacity:1; transform:scale(1) } }
        @keyframes mkPulse { 0%,100% { opacity:1 } 50% { opacity:.4 } }
        .ct-marquee { display:flex; gap:48px; animation:mkMarquee 20s linear infinite; white-space:nowrap; }
        .ct-popup-overlay { position:fixed; inset:0; background:rgba(10,10,10,0.55); -webkit-backdrop-filter:blur(4px); backdrop-filter:blur(4px); z-index:9999; display:flex; align-items:center; justify-content:center; padding:16px; }
        .ct-popup { background:#fff; border-radius:20px; padding:40px 36px; max-width:460px; width:100%; text-align:center; position:relative; animation:mkPop .35s cubic-bezier(.34,1.56,.64,1); box-shadow:0 24px 64px rgba(10,10,10,0.18); }
        .ct-grid { display:grid; grid-template-columns:1.1fr 1fr; gap:clamp(32px,6vw,72px); align-items:start; }
        @media(max-width:860px) { .ct-grid { grid-template-columns:1fr; gap:40px; } }
        .ct-interest { border:1px solid var(--mk-hairline); background:#fff; font-family:var(--mk-font); font-size:.8125rem; padding:8px 14px; color:var(--mk-steel); border-radius:9999px; cursor:pointer; transition:all .2s; }
        .ct-interest.act { background:var(--mk-primary); border-color:var(--mk-primary); color:#fff; font-weight:600; }
        .ct-interest:hover:not(.act) { border-color:var(--mk-green); color:var(--mk-green-deep); }
        .ct-label { display:block; font-size:.7rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--mk-steel); margin-bottom:6px; }
        .ct-form-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px; }
        @media(max-width:480px) { .ct-form-row { grid-template-columns:1fr; } }
      `}</style>

      {/* SUCCESS POPUP */}
      {showPopup && (
        <div className="ct-popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="ct-popup" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowPopup(false)} style={{ position:'absolute', top:16, right:16, background:'var(--mk-surface)', border:'none', borderRadius:'50%', width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
              <X size={16} color="#5a5a5c"/>
            </button>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#00d4a4,#00b48a)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
              <CheckCircle size={34} color="#fff"/>
            </div>
            <div className="mk-eyebrow" style={{ marginBottom:10 }}>Manikya Money Service Pvt. Ltd.</div>
            <h2 className="mk-h3" style={{ margin:'0 0 12px' }}>Thank you for reaching out!</h2>
            <p className="mk-body" style={{ margin:'0 0 20px', color:'var(--mk-steel)' }}>
              We have received your enquiry. Our team will get back to you within <strong style={{ color:'var(--mk-ink)' }}>24 hours</strong>.
              {form.email && <><br/><br/>✉️ A confirmation has been sent to <strong style={{ color:'var(--mk-ink)' }}>{form.email}</strong></>}
            </p>
            <div style={{ background:'rgba(0,212,164,0.08)', border:'1px solid rgba(0,212,164,0.3)', borderRadius:12, padding:'12px 16px', marginBottom:20 }}>
              <p className="mk-small" style={{ margin:0, color:'var(--mk-green-deep)' }}>For urgent queries, call us directly at <strong>+91 74116 47999</strong></p>
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              <a href="tel:+917411647999" className="mk-btn mk-btn-primary"><Phone size={13}/> Call now</a>
              <a href="https://wa.me/917411647999" target="_blank" rel="noreferrer" className="mk-btn mk-btn-green">💬 WhatsApp</a>
            </div>
          </div>
        </div>
      )}

      {/* SOCIAL MEDIA POPUP */}
      {showSocial && (
        <div style={{ position:'fixed',inset:0,background:'rgba(10,10,10,0.6)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:16 }} onClick={()=>{ setShowSocial(false); setEditMode(false); }}>
          <div style={{ background:'white',borderRadius:16,padding:'2rem',width:'100%',maxWidth:460,position:'relative',animation:'mkPop .3s ease' }} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>{ setShowSocial(false); setEditMode(false); }} style={{ position:'absolute',top:14,right:14,background:'var(--mk-surface)',border:'none',borderRadius:'50%',width:34,height:34,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer' }}>
              <X size={16}/>
            </button>
            <h3 className="mk-h4" style={{ margin:'0 0 4px' }}>Follow Manikya</h3>
            <p className="mk-small" style={{ color:'var(--mk-steel)', marginBottom:24 }}>Stay connected on social media</p>
            {saveSuccess && (
              <div style={{ marginBottom:16,padding:'10px 14px',background:'rgba(0,212,164,0.1)',border:'1px solid rgba(0,212,164,0.3)',borderRadius:10,fontSize:'0.82rem',color:'var(--mk-green-deep)' }}>
                ✅ Social links saved successfully!
              </div>
            )}
            {!editMode ? (
              <>
                <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                  {[
                    { icon:<Instagram size={15}/>, label:'Instagram', key:'instagram', color:'#e1306c' },
                    { icon:<Facebook size={15}/>,  label:'Facebook',  key:'facebook',  color:'#1877f2' },
                    { icon:<Youtube size={15}/>,   label:'YouTube',   key:'youtube',   color:'#ff0000' },
                    { icon:<MapPin size={15}/>,    label:'Google Maps',key:'maps',     color:'#34a853' },
                  ].map(s=>(
                    <a key={s.key} href={socialLinks[s.key as keyof typeof socialLinks]} target="_blank" rel="noopener noreferrer"
                      style={{ display:'flex',alignItems:'center',gap:12,padding:'11px 14px',borderRadius:10,background:'var(--mk-surface)',textDecoration:'none',color:'var(--mk-ink)',fontSize:'0.875rem',fontWeight:500 }}>
                      <span style={{ color:s.color }}>{s.icon}</span> {s.label}
                      <ExternalLink size={12} style={{ marginLeft:'auto',color:'var(--mk-muted)' }}/>
                    </a>
                  ))}
                </div>
                <button onClick={()=>setEditMode(true)} className="mk-btn mk-btn-outline mk-btn-sm" style={{ width:'100%',marginTop:16 }}>
                  ✏️ Edit social links
                </button>
              </>
            ) : (
              <>
                <p className="mk-small" style={{ color:'var(--mk-steel)', marginBottom:16 }}>Update your social media URLs:</p>
                <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
                  {[
                    { label:'Instagram URL', key:'instagram', placeholder:'https://instagram.com/yourpage' },
                    { label:'Facebook URL',  key:'facebook',  placeholder:'https://facebook.com/yourpage' },
                    { label:'YouTube URL',   key:'youtube',   placeholder:'https://youtube.com/@yourchannel' },
                    { label:'Google Maps',   key:'maps',      placeholder:'https://maps.google.com/...' },
                  ].map(f=>(
                    <div key={f.key}>
                      <label className="ct-label">{f.label}</label>
                      <input className="mk-input" placeholder={f.placeholder} value={socialLinks[f.key as keyof typeof socialLinks]}
                        onChange={e=>setSocialLinks(p=>({...p,[f.key]:e.target.value}))}/>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex',gap:10,marginTop:16 }}>
                  <button
                    disabled={savingLinks}
                    onClick={async () => {
                      setSavingLinks(true);
                      try {
                        const res = await fetch('https://manikya-backend.onrender.com/api/social-links', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(socialLinks),
                        });
                        if (!res.ok) throw new Error('Save failed');
                        setEditMode(false);
                        setSaveSuccess(true);
                        setTimeout(() => setSaveSuccess(false), 3000);
                      } catch {
                        alert('Failed to save links. Please try again.');
                      } finally {
                        setSavingLinks(false);
                      }
                    }}
                    className="mk-btn mk-btn-green" style={{ flex:1, opacity: savingLinks ? .7 : 1 }}>
                    {savingLinks ? 'Saving…' : 'Save links'}
                  </button>
                  <button
                    onClick={() => {
                      fetch('https://manikya-backend.onrender.com/api/social-links')
                        .then(r => r.json())
                        .then(data => setSocialLinks(prev => ({ ...prev, ...data })))
                        .catch(() => setSocialLinks(defaultSocialLinks));
                      setEditMode(false);
                    }}
                    className="mk-btn mk-btn-outline" style={{ flex:1 }}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TOP SOCIAL BAR */}
      <div style={{ background:'var(--mk-canvas-dark)', padding:'9px clamp(1rem,3vw,2rem)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.55)', letterSpacing:'0.12em', textTransform:'uppercase' }}>Follow us</span>
            <div style={{ display:'flex', gap:14 }}>
              {[
                { icon:<Instagram size={16}/>, href:socialLinks.instagram },
                { icon:<Facebook size={16}/>,  href:socialLinks.facebook },
                { icon:<Youtube size={16}/>,   href:socialLinks.youtube },
                { icon:<MapPin size={16}/>,    href:socialLinks.maps },
              ].map((s,i)=>(
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{ color:'rgba(255,255,255,0.8)', display:'flex', alignItems:'center' }}>{s.icon}</a>
              ))}
            </div>
          </div>
          <button onClick={()=>setShowSocial(true)} style={{ display:'flex',alignItems:'center',gap:6,padding:'5px 14px',background:'rgba(0,212,164,0.15)',border:'1px solid rgba(0,212,164,0.4)',borderRadius:20,fontFamily:'var(--mk-font)',fontSize:'0.72rem',fontWeight:600,color:'#00d4a4',cursor:'pointer',letterSpacing:'0.06em',textTransform:'uppercase' }}>
            + Manage social links
          </button>
        </div>
      </div>

      {/* HERO */}
      <section className="mk-hero-sky" style={{ position:'relative', overflow:'hidden', padding:'clamp(56px,9vw,96px) 0' }}>
        <div className="mk-cloud" style={{ top:-40, left:'10%', width:300, height:190 }} />
        <div className="mk-cloud" style={{ bottom:-30, right:'12%', width:340, height:210 }} />
        <div className="mk-container" style={{ position:'relative', zIndex:2, maxWidth:760 }}>
          <span className="mk-badge mk-badge-glass" style={{ marginBottom:18 }}>Get in touch</span>
          <h1 className="mk-display" style={{ color:'var(--mk-ink)', margin:'0 0 14px' }}>Let's connect.</h1>
          <p className="mk-lead" style={{ color:'var(--mk-slate)', maxWidth:480 }}>
            Pearl farming, media, e-commerce, wellness, real estate, or financial services — we're here to help.
          </p>
        </div>
      </section>

      {/* MARQUEE */}
      <section style={{ background:'var(--mk-canvas-dark)', padding:'12px 0', overflow:'hidden' }}>
        <div className="ct-marquee">
          {[...Array(2)].map((_,r)=>(['+91 74116 47999','•','+91 74117 42999','•','manikyamoneyservices@gmail.com','•','5th Main Road, Hampi Nagar, Bengaluru','•']).map((t,i)=>(
            <span key={`${r}-${i}`} style={{ fontFamily:'var(--mk-font)', fontWeight:500, fontSize:'0.78rem', letterSpacing:'0.06em', color:'rgba(255,255,255,0.75)', flexShrink:0 }}>{t}</span>
          )))}
        </div>
      </section>

      {/* FORM + INFO */}
      <section className="mk-section" style={{ background:'var(--mk-canvas)' }} ref={s1.ref}>
        <div className="mk-container">
          <div className="ct-grid">
            {/* LEFT — FORM */}
            <div className={`mk-reveal ${s1.v?'mk-on':''}`}>
              <p className="mk-eyebrow">Send us a message</p>
              <h2 className="mk-h2" style={{ margin:'0 0 26px' }}>Start the conversation</h2>

              {sent ? (
                <div className="mk-card" style={{ background:'rgba(0,212,164,0.06)', border:'1px solid rgba(0,212,164,0.3)', textAlign:'center', padding:'2.5rem' }}>
                  <div style={{ width:60,height:60,borderRadius:'50%',background:'linear-gradient(135deg,#00d4a4,#00b48a)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px' }}>
                    <CheckCircle size={26} color="#fff"/>
                  </div>
                  <h3 className="mk-h4" style={{ margin:'0 0 6px' }}>Message sent!</h3>
                  <p className="mk-body" style={{ color:'var(--mk-steel)', marginBottom:16 }}>Thank you. Our team will respond within 24 hours.</p>
                  <button onClick={()=>{ setSent(false); setForm({ name:'',email:'',phone:'',interest:'',message:'' }); }} style={{ fontWeight:600, color:'var(--mk-green-deep)', background:'none', border:'none', cursor:'pointer', fontSize:'0.9rem', textDecoration:'underline', fontFamily:'var(--mk-font)' }}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div style={{ marginBottom:18,padding:'12px 16px',background:'rgba(212,86,86,0.08)',border:'1px solid rgba(212,86,86,0.3)',borderRadius:10,fontSize:'0.875rem',color:'#b13b3b' }}>
                      {error}
                    </div>
                  )}
                  <div style={{ marginBottom:20 }}>
                    <label className="ct-label">I'm interested in</label>
                    <div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
                      {interests.map(int=>(
                        <button key={int} type="button" className={`ct-interest ${form.interest===int?'act':''}`} onClick={()=>setForm(p=>({...p,interest:int}))}>{int}</button>
                      ))}
                    </div>
                  </div>
                  <div className="ct-form-row">
                    <div>
                      <label className="ct-label">Full name *</label>
                      <input required className="mk-input" placeholder="Your full name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
                    </div>
                    <div>
                      <label className="ct-label">Phone *</label>
                      <input required className="mk-input" placeholder="+91 98765 43210" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/>
                    </div>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <label className="ct-label">Email *</label>
                    <input required type="email" className="mk-input" placeholder="your@email.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/>
                  </div>
                  <div style={{ marginBottom:22 }}>
                    <label className="ct-label">Your message</label>
                    <textarea className="mk-input" rows={4} placeholder="Tell us what you're looking for..." value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))}/>
                  </div>
                  <button type="submit" disabled={sending||!form.name||!form.email||!form.phone} className="mk-btn mk-btn-primary mk-btn-lg" style={{ width:'100%', opacity: (sending||!form.name||!form.email||!form.phone) ? .6 : 1 }}>
                    {sending?<>Sending…</>:<><Send size={16}/> Send message</>}
                  </button>
                </form>
              )}
            </div>

            {/* RIGHT — CONTACT INFO */}
            <div className={`mk-reveal ${s1.v?'mk-on':''}`}>
              <p className="mk-eyebrow">Contact details</p>
              <h2 className="mk-h3" style={{ margin:'0 0 22px' }}>Manikya Services Private Limited</h2>

              <div className="mk-card" style={{ marginBottom:18 }}>
                {[
                  { icon:<MapPin size={17}/>, label:'Registered office', lines:['#215, MGES, Second Floor, 5th Main Road,','RPC Layout, Hampi Nagar, Bengaluru – 560 104, Karnataka'] },
                  { icon:<Phone size={17}/>, label:'Phone', lines:['+91 74116 47999','+91 74117 42999'] },
                  { icon:<Mail size={17}/>, label:'Email', lines:['manikyamoneyservices@gmail.com'] },
                ].map((c,i)=>(
                  <div key={i} style={{ display:'flex',gap:14,alignItems:'flex-start',marginBottom:i<2?16:0,paddingBottom:i<2?16:0,borderBottom:i<2?'1px solid var(--mk-hairline)':'none' }}>
                    <div style={{ width:38,height:38,borderRadius:9,background:'rgba(0,212,164,0.12)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:'#00b48a' }}>{c.icon}</div>
                    <div>
                      <div className="mk-eyebrow" style={{ margin:'0 0 3px', color:'var(--mk-stone)' }}>{c.label}</div>
                      {c.lines.map((l,j)=><div key={j} style={{ color:'var(--mk-slate)', fontSize:'0.9rem', fontWeight:j===0?600:400 }}>{l}</div>)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mk-card" style={{ marginBottom:18 }}>
                <div className="mk-eyebrow" style={{ margin:'0 0 10px', color:'var(--mk-stone)' }}>Business hours</div>
                {[['Monday – Saturday','9:00 AM – 6:00 PM'],['Sunday','By Appointment Only']].map(([d,t])=>(
                  <div key={d} style={{ display:'flex',justifyContent:'space-between',paddingBottom:7,marginBottom:7,borderBottom:'1px solid var(--mk-hairline-soft)' }}>
                    <span style={{ color:'var(--mk-slate)', fontSize:'0.9rem' }}>{d}</span>
                    <span style={{ color:'var(--mk-green-deep)', fontWeight:600, fontSize:'0.9rem' }}>{t}</span>
                  </div>
                ))}
              </div>

              <a href="https://wa.me/917411647999?text=Hello%20Manikya%20Money%20Service%2C%20I%20would%20like%20to%20know%20more." target="_blank" rel="noreferrer" className="mk-float"
                style={{ display:'flex',alignItems:'center',gap:12,padding:'14px 18px',background:'linear-gradient(135deg,#00d4a4,#00b48a)',textDecoration:'none',borderRadius:12,marginBottom:12 }}>
                <span style={{ fontSize:'1.1rem' }}>💬</span>
                <div>
                  <div style={{ fontWeight:600, fontSize:'0.875rem', color:'#fff' }}>Chat on WhatsApp</div>
                  <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.85)' }}>+91 74116 47999 — Quick response</div>
                </div>
              </a>

              <a href="https://newsjunction.net/stream.php" target="_blank" rel="noopener noreferrer" className="mk-float"
                style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 18px',background:'var(--mk-canvas-dark)',textDecoration:'none',borderRadius:12 }}>
                <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                  <span style={{ width:7,height:7,borderRadius:'50%',background:'#00d4a4',display:'inline-block',animation:'mkPulse 1.5s ease-in-out infinite' }}/>
                  <div>
                    <div style={{ fontWeight:600, fontSize:'0.875rem', color:'#fff' }}>NewsJunction — Watch live</div>
                    <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.72rem' }}>Kannada · Hindi · Tamil · Telugu · English</div>
                  </div>
                </div>
                <ExternalLink size={15} style={{ color:'#00d4a4' }}/>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mk-section mk-sec-sky" ref={s2.ref}>
        <div className="mk-container" style={{ maxWidth:880 }}>
          <div className={`mk-section-head mk-reveal ${s2.v?'mk-on':''}`}>
            <p className="mk-eyebrow">Support</p>
            <h2 className="mk-h1" style={{ margin:'0 0 12px' }}>Frequently asked questions</h2>
            <p className="mk-body" style={{ color:'var(--mk-steel)', maxWidth:500, margin:'0 auto' }}>Answers to common questions about our services, loans, and eligibility.</p>
          </div>
          <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
            {faqs.map((f,i)=>(
              <div key={i} className={`mk-reveal ${s2.v?'mk-on':''}`}
                style={{ transitionDelay:`${i*40}ms`, border:`1px solid ${openFaq===i?'var(--mk-green)':'var(--mk-hairline)'}`, background:'#fff', borderRadius:12, overflow:'hidden', boxShadow:openFaq===i?'0 8px 24px rgba(0,212,164,0.08)':'none', transition:'all .3s' }}>
                <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{ cursor:'pointer', border:'none', background:'none', textAlign:'left', width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, padding:'18px 22px', fontFamily:'var(--mk-font)' }}>
                  <span style={{ fontWeight:600, color:'var(--mk-ink)', fontSize:'1rem', flex:1 }}>{f.q}</span>
                  <ChevronDown size={18} style={{ color:'var(--mk-steel)', flexShrink:0, transition:'transform .3s', transform:openFaq===i?'rotate(180deg)':'none' }}/>
                </button>
                <div style={{ overflow:'hidden', maxHeight:openFaq===i?320:0, transition:'max-height .4s ease', paddingLeft:22, paddingRight:22, paddingBottom:openFaq===i?18:0 }}>
                  <p className="mk-body" style={{ color:'var(--mk-steel)', margin:0 }}>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAP CTA */}
      <section style={{ background:'var(--mk-canvas)' }} ref={s3.ref}>
        <div className={`mk-reveal ${s3.v?'mk-on':''}`}>
          <div style={{ padding:'clamp(48px,7vw,72px) 16px', background:'var(--mk-surface)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:10, borderTop:'1px solid var(--mk-hairline)', textAlign:'center' }}>
            <div style={{ fontSize:'clamp(1.5rem,4vw,2.5rem)' }}>📍</div>
            <h3 className="mk-h4" style={{ margin:0 }}>#215, MGES, Second Floor, 5th Main Road</h3>
            <p className="mk-body" style={{ color:'var(--mk-steel)', marginBottom:6 }}>RPC Layout, Hampi Nagar, Bengaluru – 560 104, Karnataka</p>
            <a href={socialLinks.maps} target="_blank" rel="noopener noreferrer" className="mk-btn mk-btn-primary">
              <MapPin size={14}/> Open in Google Maps <ExternalLink size={13}/>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
