import { Outlet, Link, useLocation } from 'react-router';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Logo from './Logo';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string|null>(null);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/pearl-farms', label: 'Pearl Farms' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/inside-manikya', label: 'Inside Manikya' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        :root {
          --red:   #dc2626;
          --blue:  #1d4ed8;
          --gold:  #f59e0b;
          --dark:  #0f172a;
          --nav-h: 72px;
        }

        .nav-root {
          position: sticky;
          top: 0;
          z-index: 100;
          transition: all 0.35s cubic-bezier(.16,1,.3,1);
        }
        .nav-root.scrolled {
          box-shadow: 0 4px 40px rgba(15,23,42,0.13);
        }

        /* ── glass strip behind nav ── */
        .nav-glass {
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(220,38,38,0.10);
        }

        /* ── brand name ── */
        .brand-name {
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          font-size: clamp(0.95rem, 1.5vw, 1.18rem);
          line-height: 1.2;
          background: linear-gradient(135deg, var(--red) 0%, #991b1b 40%, var(--blue) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.01em;
        }
        .brand-tagline {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold);
          margin-top: 1px;
        }

        /* ── nav links ── */
        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.84rem;
          font-weight: 600;
          color: #334155;
          text-decoration: none;
          padding: 6px 2px;
          position: relative;
          letter-spacing: 0.02em;
          transition: color 0.2s ease;
          white-space: nowrap;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 2px;
          background: linear-gradient(90deg, var(--red), var(--blue));
          border-radius: 2px;
          transition: width 0.3s cubic-bezier(.16,1,.3,1);
        }
        .nav-link:hover { color: var(--red); }
        .nav-link:hover::after { width: 100%; }
        .nav-link.active {
          color: var(--red);
          -webkit-text-fill-color: var(--red);
        }
        .nav-link.active::after { width: 100%; }

        /* ── login button ── */
        .btn-login {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 9px 22px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: all 0.3s ease;
          text-decoration: none;
          background: linear-gradient(135deg, var(--red), var(--blue));
          color: white;
          box-shadow: 0 4px 18px rgba(220,38,38,0.3);
        }
        .btn-login:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(220,38,38,0.45);
        }
        .btn-logout {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 9px 20px;
          border-radius: 50px;
          border: 1.5px solid var(--red);
          background: transparent;
          color: var(--red);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: all 0.3s ease;
        }
        .btn-logout:hover {
          background: var(--red);
          color: white;
          transform: translateY(-2px);
        }

        /* ── logo ring ── */
        .logo-wrap {
          position: relative;
          flex-shrink: 0;
        }
        .logo-wrap::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--red), white, var(--blue));
          z-index: -1;
          opacity: 0.7;
        }
        .logo-img {
          width: 62px;
          height: 62px;
          object-fit: contain;
          border-radius: 50%;
          background: white;
          padding: 3px;
          display: block;
        }

        /* ── mobile menu ── */
        .mobile-nav {
          font-family: 'DM Sans', sans-serif;
          background: white;
          border-top: 2px solid;
          border-image: linear-gradient(90deg, var(--red), var(--blue)) 1;
          animation: slideDown 0.28s cubic-bezier(.16,1,.3,1);
        }
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .mobile-link {
          display: flex;
          align-items: center;
          padding: 13px 20px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #334155;
          text-decoration: none;
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.2s;
          gap: 10px;
        }
        .mobile-link:hover, .mobile-link.active {
          background: linear-gradient(90deg, rgba(220,38,38,0.06), transparent);
          color: var(--red);
          padding-left: 26px;
        }
        .mobile-link::before {
          content: '';
          width: 4px; height: 4px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--red), var(--blue));
          flex-shrink: 0;
        }

        /* ── FOOTER ── */
        .footer-root {
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }
        .footer-root::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--red), var(--gold), var(--blue));
        }
        .footer-brand {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, #fff 0%, #fde68a 50%, #fff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .footer-heading {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(245,158,11,0.25);
        }
        .footer-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.84rem;
          color: #94a3b8;
          text-decoration: none;
          display: block;
          padding: 4px 0;
          transition: all 0.2s;
        }
        .footer-link:hover {
          color: white;
          padding-left: 6px;
        }
        .footer-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.84rem;
          color: #94a3b8;
          line-height: 1.7;
        }
        .footer-service-item {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.83rem;
          color: #94a3b8;
          padding: 4px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .footer-service-item::before {
          content: '';
          width: 5px; height: 5px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--red), var(--blue));
          flex-shrink: 0;
        }
        .footer-contact-item {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.83rem;
          color: #94a3b8;
          padding: 3px 0;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          line-height: 1.5;
        }
        .footer-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.07);
          margin: 32px 0 20px;
        }
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-copy {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          color: #64748b;
        }
        .footer-badge {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(220,38,38,0.2), rgba(29,78,216,0.2));
          border: 1px solid rgba(255,255,255,0.1);
          color: #cbd5e1;
        }

        /* ── hamburger ── */
        .hamburger {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(220,38,38,0.08), rgba(29,78,216,0.08));
          border: 1px solid rgba(220,38,38,0.15);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .hamburger:hover {
          background: linear-gradient(135deg, rgba(220,38,38,0.15), rgba(29,78,216,0.15));
          transform: scale(1.05);
        }
      `}</style>

      {/* ══ NAVBAR ══ */}
      <header className={`nav-root ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-glass">
          <nav style={{ maxWidth:1320, margin:'0 auto', padding:'0 clamp(1rem,3vw,2.5rem)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:'var(--nav-h)' }}>

              {/* ── Brand ── */}
              <Link to="/" style={{ display:'flex', alignItems:'center', gap:14, textDecoration:'none' }}>
                <div className="logo-wrap">
                  <img
                    src="/manikya-navbar-logo.png"
                    alt="Manikya Money Service Pvt Ltd"
                    className="logo-img"
                  />
                </div>
                <div>
                  <div className="brand-name">Manikya Money<br/>Service Pvt Ltd</div>
                  <div className="brand-tagline">Growing Together</div>
                </div>
              </Link>

              {/* ── Desktop Nav ── */}
              <div style={{ display:'flex', alignItems:'center', gap:'clamp(14px,2vw,28px)' }} className="hidden md:flex">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* ── Admin + Hamburger ── */}
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <Link to="/admin"
                  className="hidden md:flex"
                  style={{ alignItems:'center', gap:6, padding:'7px 16px', background:'#1a3a5c', color:'#fff', borderRadius:6, fontFamily:'DM Sans,sans-serif', fontWeight:700, fontSize:'0.78rem', letterSpacing:'0.06em', textDecoration:'none', textTransform:'uppercase', transition:'all 0.2s' }}
                  onMouseEnter={e=>(e.currentTarget.style.background='#f59e0b')}
                  onMouseLeave={e=>(e.currentTarget.style.background='#1a3a5c')}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Admin
                </Link>
                <button
                  className="hamburger md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Menu"
                >
                  {mobileMenuOpen ? <X size={20} color="#dc2626"/> : <Menu size={20} color="#dc2626"/>}
                </button>
              </div>

            </div>

            {/* ── Mobile Menu ── */}
            {mobileMenuOpen && (
              <div className="mobile-nav">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`mobile-link ${isActive(link.path) ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* ══ FOOTER ══ */}
      <footer className="footer-root">
        <div style={{ maxWidth:1320, margin:'0 auto', padding:'56px clamp(1rem,3vw,2.5rem) 32px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))', gap:40 }}>

            {/* Brand column */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                <img src="/manikya-navbar-logo.png" alt="Logo" style={{ width:52, height:52, objectFit:'contain', borderRadius:'50%', background:'white', padding:3 }}/>
                <div className="footer-brand">Manikya Money<br/>Service Pvt Ltd</div>
              </div>
              <p className="footer-text" style={{ fontStyle:'italic', color:'#f59e0b', marginBottom:8, fontSize:'0.82rem' }}>
                "Growing Together"
              </p>
              <p className="footer-text">
                Multi-sector enterprise driving innovation across media, agriculture, commerce, trading, and heritage preservation.
              </p>
              <div style={{ display:'flex', gap:8, marginTop:16, flexWrap:'wrap' }}>
                {['Media','Finance','Trading','Realty'].map(tag=>(
                  <span key={tag} style={{ fontSize:'0.65rem', fontFamily:'DM Sans,sans-serif', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'3px 10px', borderRadius:20, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'#94a3b8' }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div className="footer-heading">Quick Links</div>
              {[
                { to:'/about', label:'About Us' },
                { to:'/services', label:'Our Services' },
                { to:'/pearl-farms', label:'Pearl Farms' },
                { to:'/inside-manikya', label:'Inside Manikya' },
                { to:'/gallery', label:'Gallery' },
                { to:'/contact', label:'Contact Us' },
              ].map(l=>(
                <Link key={l.to} to={l.to} className="footer-link">{l.label}</Link>
              ))}
            </div>

            {/* Our Services */}
            <div>
              <div className="footer-heading">Our Services</div>
              {[
                'NewsJunction — Digital Media',
                'Manikya Pearl Farms',
                'Manikya Market',
                'Manikya Traders',
                'Manikya Properties',
                'Manikya Money',
                'Manikya Heritage — Coming Soon',
              ].map((s,i)=>(
                <div key={i} className="footer-service-item">{s}</div>
              ))}
            </div>

            {/* Contact */}
            <div>
              <div className="footer-heading">Contact Info</div>
              {[
                { icon:'📧', text:'manikyaservicespvtltd@gmail.com', href:'mailto:manikyaservicespvtltd@gmail.com' },
                { icon:'📞', text:'+91 74116 42999', href:'tel:+917411642999' },
                { icon:'📞', text:'+91 74117 42999', href:'tel:+917411742999' },
                { icon:'📍', text:'#215, MGES, 2nd Floor, 5th Main Road, RPC Layout, Hampi Nagar, Bengaluru – 560104', href:'https://maps.google.com/?q=215+MGES+5th+Main+Road+RPC+Layout+Hampi+Nagar+Bengaluru+560104' },
              ].map((c,i)=>(
                <a key={i} href={c.href} target={i >= 2 ? '_blank' : undefined} rel="noopener noreferrer"
                  className="footer-contact-item" style={{ textDecoration:'none' }}>
                  <span style={{ fontSize:'0.9rem', flexShrink:0 }}>{c.icon}</span>
                  <span style={{ color:'#94a3b8' }}>{c.text}</span>
                </a>
              ))}
              {/* Social */}
              <div style={{ marginTop:20, display:'flex', gap:10 }}>
                {[
                  { label:'YT', color:'#ef4444', href:'https://youtube.com/@manikyaservices' },
                  { label:'IN', color:'#3b82f6', href:'https://linkedin.com/company/manikyaservices' },
                  { label:'IG', color:'#a855f7', href:'https://instagram.com/manikyaservices' },
                  { label:'WA', color:'#22c55e', href:'https://wa.me/917411642999' },
                ].map(s=>(
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{ width:34, height:34, borderRadius:'50%', background:`${s.color}22`, border:`1px solid ${s.color}44`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.2s', fontFamily:'DM Sans,sans-serif', fontSize:'0.62rem', fontWeight:700, color:s.color, textDecoration:'none' }}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

          </div>

          <hr className="footer-divider"/>

          <div className="footer-bottom">
            <p className="footer-copy">© 2026 Manikya Money Service Pvt Ltd. All rights reserved.</p>
            <span className="footer-badge">Est. 2002 · Bengaluru, Karnataka</span>
          </div>
        </div>
      </footer>
      {/* ── WhatsApp Floating Button ── */}
      <a
        href="https://wa.me/917411642999?text=Hello%20Manikya%20Money%20Service%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services."
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position:'fixed', bottom:24, right:24, zIndex:999,
          width:56, height:56, borderRadius:'50%',
          background:'#22c55e',
          boxShadow:'0 4px 20px rgba(34,197,94,0.5)',
          display:'flex', alignItems:'center', justifyContent:'center',
          textDecoration:'none',
          transition:'all 0.3s ease',
          animation:'waPulse 2s infinite',
        }}
        title="Chat with us on WhatsApp"
      >
        <style>{`
          @keyframes waPulse {
            0%  { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
            70% { box-shadow: 0 0 0 12px rgba(34,197,94,0); }
            100%{ box-shadow: 0 0 0 0 rgba(34,197,94,0); }
          }
        `}</style>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

    </div>
  );
}
