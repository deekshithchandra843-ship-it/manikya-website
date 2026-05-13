import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Phone, Mail, MapPin, ArrowRight, CheckCircle, ExternalLink, Send, ChevronDown, Instagram, Youtube, Facebook, X } from 'lucide-react';

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
  { q:'How do I contact the Pearl Farms investment team?', a:'You can reach out through this contact form, call us at +91 74116 42999, or email us. Our investment team will schedule a consultation within 24 hours.' },
  { q:'Where is the NewsJunction studio located?', a:'Our primary studio is at No. 411, 3rd Floor, Old Airport Road, HAL Kodihalli, Bengaluru – 560008. You can also watch us live at newsjunction.net/stream.php.' },
  { q:'How can I sell on Manikya Market?', a:'Rural artisans, farmers, and women entrepreneurs can register through our contact form. Our team will visit, photograph your products, and list them — at zero cost to you.' },
  { q:'Where can I buy Amrutha Multi Millet Malt?', a:'Amrutha Multi Millet Malt by Manikya Roots is available through our online portal and select retail partners. Contact us to place bulk or retail orders.' },
];

const interests = [
  'Pearl Farm Investment','NewsJunction Advertising','Manikya Market — Sell My Products',
  'Manikya Roots — Wellness Products','Manikya Properties — Buy/Rent Property',
  'Manikya Money — Loan Enquiry','General Enquiry',
];

// Editable social links — update these URLs when ready
const defaultSocialLinks = {
  instagram: 'https://instagram.com/manikyaservices',
  facebook:  'https://facebook.com/manikyaservices',
  youtube:   'https://youtube.com/@manikyaservices',
  maps:      'https://maps.google.com/?q=Old+Airport+Road+HAL+Kodihalli+Bengaluru',
};

export default function Contact() {
  const [form, setForm]           = useState({ name:'',email:'',phone:'',interest:'',message:'' });
  const [sent, setSent]           = useState(false);
  const [sending, setSending]     = useState(false);
  const [openFaq, setOpenFaq]     = useState<number|null>(null);
  const [showSocial, setShowSocial] = useState(false);
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);
  const [editMode, setEditMode]   = useState(false);
  const s1 = useInView(); const s2 = useInView(); const s3 = useInView();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1800);
  };

  return (
    <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", background:'#fff', overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.9)}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scaleIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
        @keyframes checkIn{from{transform:scale(0) rotate(-45deg);opacity:0}to{transform:scale(1) rotate(0deg);opacity:1}}

        .gold-text{background:linear-gradient(90deg,#f59e0b,#fde68a,#f59e0b);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite}
        .reveal{opacity:0;transform:translateY(36px);transition:all .8s cubic-bezier(.16,1,.3,1)}
        .reveal.on{opacity:1;transform:translateY(0)}
        .reveal-l{opacity:0;transform:translateX(-50px);transition:all .85s cubic-bezier(.16,1,.3,1)}
        .reveal-l.on{opacity:1;transform:translateX(0)}
        .reveal-r{opacity:0;transform:translateX(50px);transition:all .85s cubic-bezier(.16,1,.3,1)}
        .reveal-r.on{opacity:1;transform:translateX(0)}

        .form-input{width:100%;background:#f8fafc;border:1px solid #e2e8f0;padding:13px 16px;font-family:'DM Sans',sans-serif;font-size:.92rem;color:#0f172a;outline:none;transition:all .3s;box-sizing:border-box}
        .form-input:focus{border-color:#f59e0b;background:#fff;box-shadow:0 0 0 3px rgba(245,158,11,0.08)}
        .form-input::placeholder{color:#94a3b8}
        .form-label{display:block;font-family:'DM Sans',sans-serif;font-size:.7rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#64748b;margin-bottom:5px}
        .btn-sub{transition:all .3s ease;cursor:pointer;border:none}
        .btn-sub:hover{transform:translateY(-2px)}
        .btn-sub:disabled{opacity:.5;cursor:not-allowed;transform:none}
        .interest-btn{transition:all .3s;cursor:pointer;border:1px solid #e2e8f0;background:white;font-family:'DM Sans',sans-serif;font-size:.78rem;padding:7px 14px;color:#64748b}
        .interest-btn.act{background:#f59e0b;border-color:#f59e0b;color:#000;font-weight:600}
        .interest-btn:hover:not(.act){border-color:#f59e0b;color:#f59e0b}
        .faq-item{transition:all .3s}
        .faq-btn{cursor:pointer;border:none;background:none;text-align:left;width:100%;display:flex;align-items:center;justify-content:space-between;padding:20px 24px}
        .social-icon{transition:all .3s;text-decoration:none;display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%}
        .social-icon:hover{transform:translateY(-4px) scale(1.1)}
        .marquee-track{display:flex;gap:50px;animation:marquee 18s linear infinite;white-space:nowrap}
        .btn-main{transition:all .3s;text-decoration:none;cursor:pointer}
        .btn-main:hover{transform:translateY(-2px)}
        .social-popup{animation:scaleIn .3s ease}
        @media(max-width:768px){.grid-2{grid-template-columns:1fr!important}}
      `}</style>

      {/* SOCIAL MEDIA POPUP MODAL */}
      {showSocial && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center' }} onClick={()=>{ setShowSocial(false); setEditMode(false); }}>
          <div className="social-popup" style={{ background:'white',borderRadius:16,padding:'2rem',width:'90%',maxWidth:460,position:'relative' }} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>{ setShowSocial(false); setEditMode(false); }} style={{ position:'absolute',top:14,right:14,background:'#f1f5f9',border:'none',borderRadius:'50%',width:34,height:34,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer' }}>
              <X size={16}/>
            </button>
            <h3 style={{ fontSize:'1.4rem',fontWeight:700,color:'#0f172a',marginBottom:4 }}>Follow Manikya</h3>
            <p style={{ fontFamily:'DM Sans,sans-serif',color:'#64748b',fontSize:'0.85rem',marginBottom:24 }}>Stay connected on social media</p>

            {!editMode ? (
              <>
                <div style={{ display:'flex',gap:14,justifyContent:'center',marginBottom:24 }}>
                  {[
                    { icon:<Instagram size={22}/>, color:'#e1306c', label:'Instagram', key:'instagram' },
                    { icon:<Facebook size={22}/>, color:'#1877f2', label:'Facebook',  key:'facebook' },
                    { icon:<Youtube size={22}/>,  color:'#ff0000', label:'YouTube',   key:'youtube' },
                    { icon:<MapPin size={22}/>,   color:'#34a853', label:'Maps',      key:'maps' },
                  ].map(s=>(
                    <a key={s.key} href={socialLinks[s.key as keyof typeof socialLinks]} target="_blank" rel="noopener noreferrer"
                      className="social-icon" style={{ background:s.color+'12',border:`2px solid ${s.color}30`,color:s.color }}>
                      {s.icon}
                    </a>
                  ))}
                </div>
                <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                  {[
                    { icon:<Instagram size={15}/>, label:'Instagram', key:'instagram', color:'#e1306c' },
                    { icon:<Facebook size={15}/>,  label:'Facebook',  key:'facebook',  color:'#1877f2' },
                    { icon:<Youtube size={15}/>,   label:'YouTube',   key:'youtube',   color:'#ff0000' },
                    { icon:<MapPin size={15}/>,    label:'Google Maps',key:'maps',     color:'#34a853' },
                  ].map(s=>(
                    <a key={s.key} href={socialLinks[s.key as keyof typeof socialLinks]} target="_blank" rel="noopener noreferrer"
                      style={{ display:'flex',alignItems:'center',gap:12,padding:'10px 14px',borderRadius:10,background:'#f8fafc',textDecoration:'none',color:'#0f172a',fontFamily:'DM Sans,sans-serif',fontSize:'0.85rem',fontWeight:500,transition:'all .3s' }}
                      onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=s.color+'10'}
                      onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='#f8fafc'}>
                      <span style={{ color:s.color }}>{s.icon}</span> {s.label}
                      <ExternalLink size={12} style={{ marginLeft:'auto',color:'#94a3b8' }}/>
                    </a>
                  ))}
                </div>
                <button onClick={()=>setEditMode(true)} style={{ width:'100%',marginTop:16,padding:'10px',background:'none',border:'1px solid #e2e8f0',fontFamily:'DM Sans,sans-serif',fontSize:'0.78rem',color:'#64748b',cursor:'pointer',borderRadius:8 }}>
                  ✏️ Edit Social Links
                </button>
              </>
            ) : (
              <>
                <p style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.8rem',color:'#64748b',marginBottom:16 }}>Update your social media URLs:</p>
                <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
                  {[
                    { label:'Instagram URL', key:'instagram', placeholder:'https://instagram.com/yourpage' },
                    { label:'Facebook URL',  key:'facebook',  placeholder:'https://facebook.com/yourpage' },
                    { label:'YouTube URL',   key:'youtube',   placeholder:'https://youtube.com/@yourchannel' },
                    { label:'Google Maps',   key:'maps',      placeholder:'https://maps.google.com/...' },
                  ].map(f=>(
                    <div key={f.key}>
                      <label className="form-label">{f.label}</label>
                      <input className="form-input" style={{ borderRadius:8 }} placeholder={f.placeholder} value={socialLinks[f.key as keyof typeof socialLinks]}
                        onChange={e=>setSocialLinks(p=>({...p,[f.key]:e.target.value}))}/>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex',gap:10,marginTop:16 }}>
                  <button onClick={()=>setEditMode(false)} style={{ flex:1,padding:'10px',background:'#f59e0b',border:'none',fontFamily:'DM Sans,sans-serif',fontWeight:700,fontSize:'0.85rem',cursor:'pointer',borderRadius:8 }}>Save Links</button>
                  <button onClick={()=>setEditMode(false)} style={{ flex:1,padding:'10px',background:'#f1f5f9',border:'none',fontFamily:'DM Sans,sans-serif',fontSize:'0.85rem',cursor:'pointer',borderRadius:8 }}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* SOCIAL BAR AT TOP */}
      <div style={{ background:'#0f172a',padding:'8px clamp(1rem,3vw,3rem)',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10 }}>
        <div style={{ display:'flex',alignItems:'center',gap:16 }}>
          <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.75rem',color:'rgba(255,255,255,0.5)',letterSpacing:'0.1em',textTransform:'uppercase' }}>Follow us</span>
          <div style={{ display:'flex',gap:12 }}>
            {[
              { icon:<Instagram size={16}/>, href:socialLinks.instagram, color:'#e1306c' },
              { icon:<Facebook size={16}/>,  href:socialLinks.facebook,  color:'#1877f2' },
              { icon:<Youtube size={16}/>,   href:socialLinks.youtube,   color:'#ff0000' },
              { icon:<MapPin size={16}/>,    href:socialLinks.maps,      color:'#34a853' },
            ].map((s,i)=>(
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{ color:s.color,transition:'all .3s',display:'flex',alignItems:'center' }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.transform='scale(1.2)'}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform='none'}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <button onClick={()=>setShowSocial(true)} style={{ display:'flex',alignItems:'center',gap:6,padding:'5px 14px',background:'rgba(245,158,11,0.15)',border:'1px solid rgba(245,158,11,0.35)',borderRadius:20,fontFamily:'DM Sans,sans-serif',fontSize:'0.72rem',fontWeight:600,color:'#f59e0b',cursor:'pointer',letterSpacing:'0.1em',textTransform:'uppercase' }}>
          + Manage Social Links
        </button>
      </div>

      {/* HERO */}
      <section style={{ background:'#000',minHeight:'50vh',display:'flex',alignItems:'flex-end',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)',backgroundSize:'80px 80px' }}/>
        <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse at 30% 60%,rgba(245,158,11,0.07),transparent 60%)' }}/>
        <div style={{ position:'relative',zIndex:1,maxWidth:1400,margin:'0 auto',padding:'clamp(5rem,8vw,8rem) clamp(1.5rem,5vw,5rem) clamp(3rem,5vw,4rem)',width:'100%' }}>
          <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:16,animation:'fadeUp .9s .1s both' }}>
            <div style={{ width:40,height:1,background:'#f59e0b' }}/><span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.72rem',fontWeight:600,letterSpacing:'0.25em',textTransform:'uppercase',color:'#f59e0b' }}>Get in Touch</span>
          </div>
          <h1 style={{ fontSize:'clamp(3rem,7vw,7rem)',fontWeight:700,lineHeight:0.95,color:'white',marginBottom:16,animation:'fadeUp .9s .25s both' }}>Let's<br/><span className="gold-text">Connect.</span></h1>
          <p style={{ fontFamily:'DM Sans,sans-serif',color:'rgba(255,255,255,0.45)',fontSize:'1rem',maxWidth:440,lineHeight:1.8,fontWeight:300,animation:'fadeUp .9s .4s both' }}>
            Pearl farming, media, e-commerce, wellness, real estate, or financial services — we're here to help.
          </p>
        </div>
      </section>

      {/* SOCIAL MARQUEE */}
      <section style={{ background:'#f59e0b',padding:'12px 0',overflow:'hidden' }}>
        <div className="marquee-track">
          {[...Array(2)].map((_,r)=>(['+91 74116 42999','•','+91 74117 42999','•','manikyaservicespvtltd@gmail.com','•','Old Airport Road, HAL, Bengaluru','•']).map((t,i)=>(
            <span key={`${r}-${i}`} style={{ fontFamily:'DM Sans,sans-serif',fontWeight:500,fontSize:'0.75rem',letterSpacing:'0.1em',color:'#000',flexShrink:0 }}>{t}</span>
          )))}
        </div>
      </section>

      {/* FORM + CONTACT INFO */}
      <section style={{ background:'#fff',padding:'clamp(4rem,8vw,8rem) 0' }} ref={s1.ref}>
        <div style={{ maxWidth:1400,margin:'0 auto',padding:'0 clamp(1.5rem,5vw,5rem)' }}>
          <div style={{ display:'grid',gridTemplateColumns:'1.1fr 1fr',gap:80,alignItems:'start' }} className="grid-2">

            {/* LEFT — FORM */}
            <div className={`reveal-l ${s1.v?'on':''}`}>
              <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:16 }}>
                <div style={{ width:30,height:1,background:'#000' }}/>
                <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.25em',textTransform:'uppercase' }}>Send Us a Message</span>
              </div>
              <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)',fontWeight:700,lineHeight:1.05,color:'#000',marginBottom:28 }}>Start the Conversation</h2>

              {sent ? (
                <div style={{ padding:'2.5rem',border:'1px solid #f59e0b',background:'#fffbeb',textAlign:'center' }}>
                  <div style={{ width:60,height:60,borderRadius:'50%',background:'#f59e0b',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',animation:'checkIn .5s cubic-bezier(.16,1,.3,1)' }}>
                    <CheckCircle size={26} color="#000"/>
                  </div>
                  <h3 style={{ fontSize:'1.3rem',fontWeight:700,color:'#0f172a',marginBottom:6 }}>Message Sent!</h3>
                  <p style={{ fontFamily:'DM Sans,sans-serif',color:'#64748b',marginBottom:16,lineHeight:1.7 }}>Thank you. Our team will respond within 24 hours.</p>
                  <button onClick={()=>{ setSent(false); setForm({ name:'',email:'',phone:'',interest:'',message:'' }); }} style={{ fontFamily:'DM Sans,sans-serif',fontWeight:600,color:'#f59e0b',background:'none',border:'none',cursor:'pointer',fontSize:'0.88rem',textDecoration:'underline' }}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom:20 }}>
                    <label className="form-label">I'm interested in</label>
                    <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
                      {interests.map(int=>(
                        <button key={int} type="button" className={`interest-btn ${form.interest===int?'act':''}`} onClick={()=>setForm(p=>({...p,interest:int}))}>{int}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14 }}>
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input required className="form-input" placeholder="Your full name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
                    </div>
                    <div>
                      <label className="form-label">Phone *</label>
                      <input required className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/>
                    </div>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <label className="form-label">Email *</label>
                    <input required type="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/>
                  </div>
                  <div style={{ marginBottom:22 }}>
                    <label className="form-label">Your Message</label>
                    <textarea className="form-input" rows={4} placeholder="Tell us what you're looking for..." value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} style={{ resize:'vertical' }}/>
                  </div>
                  <button type="submit" disabled={sending||!form.name||!form.email||!form.phone} className="btn-sub"
                    style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:10,width:'100%',padding:'15px',background:sending?'#94a3b8':'#f59e0b',color:'#000',fontFamily:'DM Sans,sans-serif',fontWeight:700,fontSize:'0.9rem',letterSpacing:'0.08em',textTransform:'uppercase' }}>
                    {sending?<>Sending...</>:<><Send size={16}/> Send Message</>}
                  </button>
                </form>
              )}
            </div>

            {/* RIGHT — CONTACT INFO */}
            <div className={`reveal-r ${s1.v?'on':''}`}>
              <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:16 }}>
                <div style={{ width:30,height:1,background:'#f59e0b' }}/><span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.25em',textTransform:'uppercase',color:'#f59e0b' }}>Contact Details</span>
              </div>
              <h2 style={{ fontSize:'clamp(1.8rem,3vw,2.5rem)',fontWeight:700,lineHeight:1.1,color:'#000',marginBottom:24 }}>Manikya Services<br/>Private Limited</h2>

              <div style={{ marginBottom:24,padding:'24px',border:'1px solid #e2e8f0',background:'#fafafa' }}>
                {[
                  { icon:<MapPin size={18}/>, bg:'#000', label:'Registered Office', lines:['No. 411, 3rd Floor, Old Airport Road,','HAL, Kodihalli, Bengaluru – 560 008, Karnataka'] },
                  { icon:<Phone size={18}/>, bg:'#f59e0b', label:'Phone', lines:['+91 74116 42999','+91 74117 42999'] },
                  { icon:<Mail size={18}/>, bg:'#000', label:'Email', lines:['manikyaservicespvtltd@gmail.com'] },
                ].map((c,i)=>(
                  <div key={i} style={{ display:'flex',gap:14,alignItems:'flex-start',marginBottom:i<2?18:0,paddingBottom:i<2?18:0,borderBottom:i<2?'1px solid #e2e8f0':'none' }}>
                    <div style={{ width:40,height:40,background:c.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:'white' }}>{c.icon}</div>
                    <div>
                      <div style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.68rem',fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:3 }}>{c.label}</div>
                      {c.lines.map((l,j)=><div key={j} style={{ fontFamily:'DM Sans,sans-serif',color:'#334155',fontSize:'0.88rem',fontWeight:j===0?600:400 }}>{l}</div>)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Hours */}
              <div style={{ marginBottom:20,padding:'18px 22px',border:'1px solid #e2e8f0' }}>
                <div style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.68rem',fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:10 }}>Business Hours</div>
                {[['Monday – Saturday','9:00 AM – 6:00 PM'],['Sunday','By Appointment Only']].map(([d,t])=>(
                  <div key={d} style={{ display:'flex',justifyContent:'space-between',paddingBottom:7,marginBottom:7,borderBottom:'1px solid #f1f5f9' }}>
                    <span style={{ fontFamily:'DM Sans,sans-serif',color:'#334155',fontSize:'0.87rem' }}>{d}</span>
                    <span style={{ fontFamily:'DM Sans,sans-serif',color:'#f59e0b',fontWeight:600,fontSize:'0.87rem' }}>{t}</span>
                  </div>
                ))}
              </div>

              {/* Social icons */}
              <div style={{ padding:'18px 22px',border:'1px solid #e2e8f0',background:'#f8fafc' }}>
                <div style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.68rem',fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:14 }}>Follow Us</div>
                <div style={{ display:'flex',gap:12 }}>
                  {[
                    { icon:<Instagram size={20}/>, href:socialLinks.instagram, color:'#e1306c', label:'Instagram' },
                    { icon:<Facebook size={20}/>,  href:socialLinks.facebook,  color:'#1877f2', label:'Facebook' },
                    { icon:<Youtube size={20}/>,   href:socialLinks.youtube,   color:'#ff0000', label:'YouTube' },
                    { icon:<MapPin size={20}/>,    href:socialLinks.maps,      color:'#34a853', label:'Maps' },
                  ].map((s,i)=>(
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                      className="social-icon" style={{ background:s.color+'12',border:`1px solid ${s.color}30`,color:s.color }}>
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* NewsJunction live */}
              <a href="https://newsjunction.net/stream.php" target="_blank" rel="noopener noreferrer"
                style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 18px',background:'#0d0000',marginTop:12,textDecoration:'none' }}>
                <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                  <span style={{ width:7,height:7,borderRadius:'50%',background:'#ef4444',display:'inline-block',animation:'pulse 1.5s ease-in-out infinite' }}/>
                  <div>
                    <div style={{ fontFamily:'DM Sans,sans-serif',fontWeight:600,fontSize:'0.85rem',color:'white' }}>NewsJunction — Watch Live</div>
                    <div style={{ fontFamily:'DM Sans,sans-serif',color:'rgba(255,255,255,0.4)',fontSize:'0.72rem' }}>Kannada · Hindi · Tamil · Telugu · English</div>
                  </div>
                </div>
                <ExternalLink size={15} style={{ color:'#ef4444' }}/>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background:'#f8fafc',padding:'clamp(4rem,8vw,8rem) 0' }} ref={s2.ref}>
        <div style={{ maxWidth:900,margin:'0 auto',padding:'0 clamp(1.5rem,5vw,5rem)' }}>
          <div className={`reveal ${s2.v?'on':''}`} style={{ textAlign:'center',marginBottom:48 }}>
            <p style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.72rem',fontWeight:600,letterSpacing:'0.25em',textTransform:'uppercase',color:'#f59e0b',marginBottom:12 }}>Support</p>
            <h2 style={{ fontSize:'clamp(2rem,4vw,3.2rem)',fontWeight:700,lineHeight:1.05,color:'#0f172a',marginBottom:12 }}>Frequently Asked Questions</h2>
            <p style={{ fontFamily:'DM Sans,sans-serif',color:'#64748b',fontSize:'1rem',maxWidth:500,margin:'0 auto' }}>Answers to common questions about our services, loans, and eligibility.</p>
          </div>
          <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
            {faqs.map((f,i)=>(
              <div key={i} className={`faq-item reveal ${s2.v?'on':''}`}
                style={{ transitionDelay:`${i*50}ms`,border:`1px solid ${openFaq===i?'#f59e0b':'#e2e8f0'}`,background:'white',borderRadius:4,overflow:'hidden',boxShadow:openFaq===i?'0 4px 20px rgba(245,158,11,0.1)':'none',transition:'all .3s' }}>
                <button className="faq-btn" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                  <span style={{ fontWeight:700,color:'#0f172a',fontFamily:'Cormorant Garamond,serif',fontSize:'1.05rem',textAlign:'left',lineHeight:1.35,flex:1,marginRight:12 }}>{f.q}</span>
                  <ChevronDown size={20} style={{ color:'#f59e0b',flexShrink:0,transition:'transform .3s',transform:openFaq===i?'rotate(180deg)':'none' }}/>
                </button>
                <div style={{ overflow:'hidden',maxHeight:openFaq===i?300:0,transition:'max-height .4s ease',paddingLeft:24,paddingRight:24,paddingBottom:openFaq===i?18:0 }}>
                  <p style={{ fontFamily:'DM Sans,sans-serif',color:'#475569',lineHeight:1.8,margin:0,fontSize:'0.93rem' }}>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAP */}
      <section style={{ background:'#fff' }} ref={s3.ref}>
        <div className={`reveal ${s3.v?'on':''}`}>
          <div style={{ height:280,background:'linear-gradient(135deg,#f8fafc,#f1f5f9)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:14,borderTop:'1px solid #e2e8f0',position:'relative' }}>
            <div style={{ position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,0,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.03) 1px,transparent 1px)',backgroundSize:'40px 40px' }}/>
            <div style={{ position:'relative',zIndex:1,textAlign:'center' }}>
              <div style={{ fontSize:'2.5rem',marginBottom:10 }}>📍</div>
              <h3 style={{ fontSize:'1.2rem',fontWeight:700,color:'#0f172a',marginBottom:4 }}>No. 411, 3rd Floor, Old Airport Road</h3>
              <p style={{ fontFamily:'DM Sans,sans-serif',color:'#64748b',marginBottom:14,fontSize:'0.9rem' }}>HAL, Kodihalli, Bengaluru – 560 008, Karnataka</p>
              <a href={socialLinks.maps} target="_blank" rel="noopener noreferrer"
                style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'11px 26px',background:'#000',color:'white',fontFamily:'DM Sans,sans-serif',fontWeight:600,fontSize:'0.82rem',textDecoration:'none',letterSpacing:'0.05em',textTransform:'uppercase' }}>
                <MapPin size={13}/> Open in Google Maps <ExternalLink size={12}/>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
