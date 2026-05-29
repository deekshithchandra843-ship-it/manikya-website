import { Outlet, Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { path: '/',               label: 'Home' },
    { path: '/about',          label: 'About' },
    { path: '/services',       label: 'Services' },
    { path: '/pearl-farms',    label: 'Pearl Farms' },
    { path: '/gallery',        label: 'Gallery' },
    { path: '/inside-manikya', label: 'Inside Manikya' },
    { path: '/contact',        label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col" style={{ overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        :root { --red:#dc2626; --blue:#1d4ed8; --gold:#f59e0b; }

        .nav-root { position:sticky; top:0; z-index:200; transition:box-shadow 0.35s ease; }
        .nav-root.scrolled { box-shadow:0 4px 40px rgba(15,23,42,0.13); }
        .nav-glass { background:rgba(255,255,255,0.97); backdrop-filter:blur(18px); border-bottom:1px solid rgba(220,38,38,0.10); }
        .nav-inner { max-width:1320px; margin:0 auto; padding:0 clamp(0.75rem,3vw,2rem); display:flex; align-items:center; justify-content:space-between; height:64px; gap:8px; }

        .brand-wrap { display:flex; align-items:center; gap:clamp(6px,1.5vw,12px); text-decoration:none; flex-shrink:0; min-width:0; }
        .logo-ring { position:relative; flex-shrink:0; }
        .logo-ring::before { content:''; position:absolute; inset:-3px; border-radius:50%; background:linear-gradient(135deg,var(--red),white,var(--blue)); z-index:-1; opacity:0.7; }
        .logo-img { width:clamp(36px,5vw,54px); height:clamp(36px,5vw,54px); object-fit:contain; border-radius:50%; background:white; padding:2px; display:block; }
        .brand-name { font-family:'Playfair Display',serif; font-weight:800; font-size:clamp(0.6rem,1.8vw,1rem); line-height:1.2; background:linear-gradient(135deg,var(--red) 0%,#991b1b 40%,var(--blue) 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; white-space:nowrap; }
        .brand-tag { font-family:'DM Sans',sans-serif; font-size:clamp(0.42rem,0.9vw,0.58rem); font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:var(--gold); margin-top:1px; white-space:nowrap; }

        /* KEY FIX: pure CSS classes, no inline style conflict */
        .desk-links { display:flex; align-items:center; gap:clamp(8px,1.2vw,22px); flex:1; justify-content:center; }
        .nav-link { font-family:'DM Sans',sans-serif; font-size:clamp(0.72rem,1vw,0.84rem); font-weight:600; color:#334155; text-decoration:none; padding:6px 2px; position:relative; letter-spacing:0.02em; transition:color 0.2s ease; white-space:nowrap; }
        .nav-link::after { content:''; position:absolute; bottom:0; left:0; width:0; height:2px; background:linear-gradient(90deg,var(--red),var(--blue)); border-radius:2px; transition:width 0.3s cubic-bezier(.16,1,.3,1); }
        .nav-link:hover { color:var(--red); }
        .nav-link:hover::after { width:100%; }
        .nav-link.active { color:var(--red); -webkit-text-fill-color:var(--red); }
        .nav-link.active::after { width:100%; }

        .admin-btn { display:flex; align-items:center; gap:6px; padding:7px 14px; background:#1a3a5c; color:#fff; border-radius:6px; font-family:'DM Sans',sans-serif; font-weight:700; font-size:clamp(0.68rem,0.9vw,0.78rem); letter-spacing:0.06em; text-decoration:none; text-transform:uppercase; transition:all 0.2s; white-space:nowrap; flex-shrink:0; }
        .admin-btn:hover { background:#f59e0b; color:#000; }

        .hamburger { width:40px; height:40px; border-radius:10px; background:linear-gradient(135deg,rgba(220,38,38,0.08),rgba(29,78,216,0.08)); border:1px solid rgba(220,38,38,0.15); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s; flex-shrink:0; }
        .hamburger:hover { background:linear-gradient(135deg,rgba(220,38,38,0.15),rgba(29,78,216,0.15)); }

        /* THE KEY: hide/show with pure CSS — no inline style conflict */
        @media (min-width:769px) { .hamburger { display:none !important; } }
        @media (max-width:768px)  { .desk-links { display:none !important; } .admin-btn { display:none !important; } }

        .mob-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:198; animation:fadeOv 0.2s ease; }
        @keyframes fadeOv { from{opacity:0} to{opacity:1} }
        .mob-drawer { position:fixed; top:0; right:0; width:min(300px,86vw); height:100dvh; background:white; z-index:199; display:flex; flex-direction:column; animation:slideIn 0.3s cubic-bezier(.16,1,.3,1); overflow-y:auto; box-shadow:-8px 0 40px rgba(0,0,0,0.15); }
        @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
        .mob-header { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-bottom:1px solid #f1f5f9; flex-shrink:0; }
        .mob-link { display:flex; align-items:center; gap:10px; padding:14px 20px; font-family:'DM Sans',sans-serif; font-size:0.92rem; font-weight:600; color:#334155; text-decoration:none; border-bottom:1px solid #f8fafc; transition:all 0.2s; }
        .mob-link::before { content:''; width:5px; height:5px; border-radius:50%; background:linear-gradient(135deg,var(--red),var(--blue)); flex-shrink:0; }
        .mob-link:hover,.mob-link.active { background:linear-gradient(90deg,rgba(220,38,38,0.06),transparent); color:var(--red); padding-left:26px; }
        .mob-admin { margin:16px; display:flex; align-items:center; justify-content:center; gap:8px; padding:13px; background:#1a3a5c; color:#fff; border-radius:8px; font-family:'DM Sans',sans-serif; font-weight:700; font-size:0.85rem; text-decoration:none; transition:all 0.2s; }
        .mob-admin:hover { background:#f59e0b; color:#000; }

        .footer-root { background:linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%); color:white; position:relative; overflow:hidden; }
        .footer-root::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--red),var(--gold),var(--blue)); }
        .footer-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:36px; }
        @media (max-width:640px) { .footer-grid { grid-template-columns:1fr 1fr !important; gap:24px !important; } }
        @media (max-width:400px) { .footer-grid { grid-template-columns:1fr !important; } }
        .footer-brand { font-family:'Playfair Display',serif; font-size:clamp(0.95rem,2vw,1.2rem); font-weight:800; background:linear-gradient(135deg,#fff 0%,#fde68a 50%,#fff 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .footer-heading { font-family:'DM Sans',sans-serif; font-size:0.72rem; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:var(--gold); margin-bottom:16px; padding-bottom:8px; border-bottom:1px solid rgba(245,158,11,0.25); }
        .footer-link { font-family:'DM Sans',sans-serif; font-size:0.84rem; color:#94a3b8; text-decoration:none; display:block; padding:4px 0; transition:all 0.2s; }
        .footer-link:hover { color:white; padding-left:6px; }
        .footer-svc { font-family:'DM Sans',sans-serif; font-size:0.83rem; color:#94a3b8; padding:4px 0; display:flex; align-items:center; gap:8px; }
        .footer-svc::before { content:''; width:5px; height:5px; border-radius:50%; background:linear-gradient(135deg,var(--red),var(--blue)); flex-shrink:0; }
        .footer-ci { font-family:'DM Sans',sans-serif; font-size:0.83rem; color:#94a3b8; padding:3px 0; display:flex; align-items:flex-start; gap:8px; line-height:1.5; }
        .footer-bottom { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; border-top:1px solid rgba(255,255,255,0.07); margin-top:32px; padding-top:20px; }
        .footer-copy { font-family:'DM Sans',sans-serif; font-size:0.78rem; color:#64748b; }
        .footer-badge { font-family:'DM Sans',sans-serif; font-size:0.7rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding:4px 12px; border-radius:20px; background:linear-gradient(135deg,rgba(220,38,38,0.2),rgba(29,78,216,0.2)); border:1px solid rgba(255,255,255,0.1); color:#cbd5e1; }
        @keyframes waPulse { 0%{box-shadow:0 0 0 0 rgba(34,197,94,0.5)} 70%{box-shadow:0 0 0 12px rgba(34,197,94,0)} 100%{box-shadow:0 0 0 0 rgba(34,197,94,0)} }
        @media (max-width:480px) { .footer-bottom { flex-direction:column; text-align:center; } }
        @media (max-width:380px) { .wa-fab { width:44px!important; height:44px!important; bottom:14px!important; right:14px!important; } }
      `}</style>

      {/* NAVBAR */}
      <header className={`nav-root ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-glass">
          <div className="nav-inner">
            <Link to="/" className="brand-wrap">
              <div className="logo-ring">
                <img src="/manikya-navbar-logo.jpeg" alt="Manikya" className="logo-img"/>
              </div>
              <div style={{ minWidth:0, overflow:'hidden' }}>
                <div className="brand-name">Manikya Money Service Pvt Ltd</div>
                <div className="brand-tag">Growing Together</div>
              </div>
            </Link>

            {/* Desktop nav — hidden on mobile via .desk-links CSS (no inline style) */}
            <nav className="desk-links">
              {navLinks.map(l => (
                <Link key={l.path} to={l.path} className={`nav-link ${isActive(l.path)?'active':''}`}>{l.label}</Link>
              ))}
            </nav>

            <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
              <Link to="/admin" className="admin-btn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Admin
              </Link>
              <button className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
                {mobileMenuOpen ? <X size={20} color="#dc2626"/> : <Menu size={20} color="#dc2626"/>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <>
          <div className="mob-overlay" onClick={() => setMobileMenuOpen(false)}/>
          <div className="mob-drawer">
            <div className="mob-header">
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <img src="/manikya-navbar-logo.jpeg" alt="Logo" style={{ width:34,height:34,borderRadius:'50%',objectFit:'contain',background:'white',border:'1px solid #f1f5f9' }}/>
                <div style={{ fontFamily:'DM Sans,sans-serif',fontWeight:700,fontSize:'0.78rem',color:'#0f172a',lineHeight:1.3 }}>
                  Manikya Money<br/><span style={{ color:'#f59e0b',fontSize:'0.6rem',fontWeight:600 }}>GROWING TOGETHER</span>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} style={{ width:34,height:34,borderRadius:8,border:'1px solid #e2e8f0',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer' }}>
                <X size={17} color="#64748b"/>
              </button>
            </div>
            <div style={{ flex:1,overflowY:'auto',paddingBottom:20 }}>
              {navLinks.map(l => (
                <Link key={l.path} to={l.path} className={`mob-link ${isActive(l.path)?'active':''}`} onClick={() => setMobileMenuOpen(false)}>{l.label}</Link>
              ))}
              <Link to="/admin" className="mob-admin" onClick={() => setMobileMenuOpen(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Admin Dashboard
              </Link>
              <div style={{ margin:'0 16px 16px',padding:14,background:'#f8fafc',borderRadius:8,border:'1px solid #e2e8f0' }}>
                <div style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.6rem',fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.15em',marginBottom:10 }}>Quick Contact</div>
                <a href="tel:+917411647999" style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 0',textDecoration:'none',fontFamily:'DM Sans,sans-serif',fontSize:'0.84rem',fontWeight:600,color:'#0f172a',borderBottom:'1px solid #e2e8f0' }}>📞 +91 74116 47999</a>
                <a href="tel:+917411742999" style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 0',textDecoration:'none',fontFamily:'DM Sans,sans-serif',fontSize:'0.84rem',fontWeight:600,color:'#0f172a',borderBottom:'1px solid #e2e8f0' }}>📞 +91 74117 42999</a>
                <a href="https://wa.me/917411647999" target="_blank" rel="noopener noreferrer" style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 4px',textDecoration:'none',fontFamily:'DM Sans,sans-serif',fontSize:'0.84rem',fontWeight:600,color:'#22c55e',borderBottom:'1px solid #e2e8f0' }}>💬 WhatsApp 74116 47999</a>
                <a href="https://wa.me/917411742999" target="_blank" rel="noopener noreferrer" style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 4px',textDecoration:'none',fontFamily:'DM Sans,sans-serif',fontSize:'0.84rem',fontWeight:600,color:'#22c55e' }}>💬 WhatsApp 74117 42999</a>
              </div>
            </div>
          </div>
        </>
      )}

      <main className="flex-1" style={{ minWidth:0,overflowX:'hidden' }}>
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="footer-root">
        <div style={{ maxWidth:1320,margin:'0 auto',padding:'48px clamp(1rem,3vw,2.5rem) 28px' }}>
          <div className="footer-grid">
            <div>
              <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:16,flexWrap:'wrap' }}>
                <img src="/manikya-navbar-logo.jpeg" alt="Logo" style={{ width:44,height:44,objectFit:'contain',borderRadius:'50%',background:'white',padding:3,flexShrink:0 }}/>
                <div className="footer-brand">Manikya Money<br/>Service Pvt Ltd</div>
              </div>
              <p style={{ fontFamily:'DM Sans,sans-serif',fontStyle:'italic',color:'#f59e0b',marginBottom:8,fontSize:'0.82rem' }}>"Growing Together"</p>
              <p style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.84rem',color:'#94a3b8',lineHeight:1.7 }}>Multi-sector enterprise driving innovation across media, agriculture, commerce, trading, and heritage preservation.</p>
              <div style={{ display:'flex',gap:8,marginTop:16,flexWrap:'wrap' }}>
                {['Media','Finance','Trading','Realty'].map(t=>(
                  <span key={t} style={{ fontSize:'0.62rem',fontFamily:'DM Sans,sans-serif',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'3px 10px',borderRadius:20,background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',color:'#94a3b8' }}>{t}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="footer-heading">Quick Links</div>
              {[{to:'/about',l:'About Us'},{to:'/services',l:'Our Services'},{to:'/pearl-farms',l:'Pearl Farms'},{to:'/inside-manikya',l:'Inside Manikya'},{to:'/gallery',l:'Gallery'},{to:'/contact',l:'Contact Us'}].map(x=>(
                <Link key={x.to} to={x.to} className="footer-link">{x.l}</Link>
              ))}
            </div>
            <div>
              <div className="footer-heading">Our Services</div>
              {['NewsJunction — Digital Media','Manikya Pearl Farms','Manikya Market','Manikya Traders','Manikya Properties','Manikya Money','Manikya Heritage — Coming Soon'].map((s,i)=>(
                <div key={i} className="footer-svc">{s}</div>
              ))}
            </div>
            <div>
              <div className="footer-heading">Contact Info</div>
              {[
                {icon:'📧',text:'manikyaservicespvtltd@gmail.com',href:'mailto:manikyaservicespvtltd@gmail.com'},
                {icon:'📞',text:'+91 74116 47999',href:'tel:+917411647999'},
                {icon:'📞',text:'+91 74117 42999',href:'tel:+917411742999'},
                {icon:'📍',text:'#215, MGES, 2nd Floor, 5th Main Road, RPC Layout, Hampi Nagar, Bengaluru – 560104',href:'https://maps.google.com/?q=215+MGES+Bengaluru+560104'},
              ].map((c,i)=>(
                <a key={i} href={c.href} target={i>=2?'_blank':undefined} rel="noopener noreferrer" className="footer-ci" style={{ textDecoration:'none' }}>
                  <span style={{ fontSize:'0.9rem',flexShrink:0 }}>{c.icon}</span>
                  <span style={{ color:'#94a3b8',wordBreak:'break-word',minWidth:0 }}>{c.text}</span>
                </a>
              ))}
              <div style={{ marginTop:18,display:'flex',gap:10,flexWrap:'wrap' }}>
                {[{l:'YT',c:'#ef4444',h:'https://youtube.com/@manikyaservices'},{l:'IN',c:'#3b82f6',h:'https://linkedin.com/company/manikyaservices'},{l:'IG',c:'#a855f7',h:'https://instagram.com/manikyaservices'},{l:'WA',c:'#22c55e',h:'https://wa.me/917411647999'}].map(s=>(
                  <a key={s.l} href={s.h} target="_blank" rel="noopener noreferrer"
                    style={{ width:34,height:34,borderRadius:'50%',background:`${s.c}22`,border:`1px solid ${s.c}44`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'DM Sans,sans-serif',fontSize:'0.62rem',fontWeight:700,color:s.c,textDecoration:'none' }}>
                    {s.l}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copy">© 2026 Manikya Money Service Pvt Ltd. All rights reserved.</p>
            <span className="footer-badge">Est. 2002 · Bengaluru, Karnataka</span>
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <div style={{ position:'fixed',bottom:24,right:24,zIndex:1000,display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end' }}>
        <a href="https://wa.me/917411647999?text=Hello%20Manikya%20Money%20Service%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services."
          target="_blank" rel="noopener noreferrer" className="wa-fab"
          title="+91 74116 47999"
          style={{ width:40,height:40,borderRadius:'50%',background:'#22c55e',boxShadow:'0 4px 16px rgba(34,197,94,0.5)',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none',animation:'waPulse 2s infinite' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
        <a href="https://wa.me/917411742999?text=Hello%20Manikya%20Money%20Service%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services."
          target="_blank" rel="noopener noreferrer"
          title="+91 74117 42999"
          style={{ width:40,height:40,borderRadius:'50%',background:'#16a34a',boxShadow:'0 4px 16px rgba(34,197,94,0.4)',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
