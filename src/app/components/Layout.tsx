import { Outlet, Link, useLocation } from 'react-router';
import { Menu, X, ArrowUpRight, Phone, MessageCircle, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Global scroll float-in: every box on every page rises in as it enters view.
  // Auto-discovers cards; also honours any element the author tags with `.mk-float`
  // (e.g. inline-styled decorative tiles on the form/video pages).
  useEffect(() => {
    // No IntersectionObserver (very old browsers): reveal author-tagged boxes so
    // a statically-rendered `.mk-float` never stays stuck at opacity 0.
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('.mk-float').forEach(el => el.classList.add('mk-float-in'));
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const counts = new Map<Element, number>();
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('mk-float-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

    const claim = (el: HTMLElement) => {
      if (el.dataset.float) return;
      // Author-tagged `.mk-float` floats anywhere; auto-discovered cards stay
      // opted out inside `.mk-reveal` regions (those animate themselves).
      const explicit = el.classList.contains('mk-float');
      if (!explicit && (el.classList.contains('mk-reveal') || el.closest('.mk-reveal'))) return;
      el.dataset.float = '1';
      const parent = el.parentElement || document.body;
      const idx = counts.get(parent) || 0;
      counts.set(parent, idx + 1);
      el.style.transitionDelay = `${Math.min(idx, 6) * 65}ms`;
      el.classList.add('mk-float');
      io.observe(el);
    };

    const scan = () => document
      .querySelectorAll<HTMLElement>('.mk-card, .ch-card, .svc-glass:not(.svc-glass-row), .mk-float')
      .forEach(claim);

    let raf = requestAnimationFrame(scan);
    // Catch boxes that mount after the first pass (tab switches, async data, modals).
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { cancelAnimationFrame(raf); mo.disconnect(); io.disconnect(); };
  }, [location.pathname]);

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
    <div className="mk" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <style>{`
        .mk-nav { position: sticky; top: 0; z-index: 200; transition: box-shadow .3s ease, background .3s ease; }
        .mk-nav-glass {
          background: rgba(255,255,255,0.72);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          backdrop-filter: blur(18px) saturate(160%);
          border-bottom: 1px solid var(--mk-hairline-soft);
        }
        .mk-nav.scrolled .mk-nav-glass { background: rgba(255,255,255,0.88); box-shadow: 0 4px 30px rgba(10,10,10,0.06); }
        .mk-nav-inner { max-width: 1280px; margin: 0 auto; padding: 0 clamp(1rem,3vw,2rem); display: flex; align-items: center; justify-content: space-between; height: 64px; gap: 12px; }

        .mk-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; min-width: 0; }
        .mk-brand-logo { width: 40px; height: 40px; object-fit: contain; border-radius: 9px; background: #fff; border: 1px solid var(--mk-hairline-soft); padding: 2px; flex-shrink: 0; }
        .mk-brand-name { font-family: var(--mk-font); font-weight: 700; font-size: clamp(.72rem,1.6vw,.92rem); line-height: 1.15; color: var(--mk-ink); letter-spacing: -.01em; white-space: nowrap; }
        .mk-brand-tag { font-family: var(--mk-font); font-size: .58rem; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--mk-green-deep); margin-top: 2px; white-space: nowrap; }

        .mk-desk-links { display: flex; align-items: center; gap: clamp(2px,1vw,6px); flex: 1; justify-content: center; }
        .mk-navlink { font-family: var(--mk-font); font-size: .875rem; font-weight: 500; color: var(--mk-steel); text-decoration: none; padding: 7px 12px; border-radius: var(--mk-r-md); transition: color .2s ease, background .2s ease; white-space: nowrap; }
        .mk-navlink:hover { color: var(--mk-ink); background: var(--mk-surface); }
        .mk-navlink.active { color: var(--mk-ink); background: var(--mk-surface); font-weight: 600; }

        .mk-nav-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .mk-hamburger { width: 40px; height: 40px; border-radius: 10px; background: var(--mk-surface); border: 1px solid var(--mk-hairline); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: background .2s; }
        .mk-hamburger:hover { background: #eee; }

        @media (min-width: 1025px) { .mk-hamburger { display: none !important; } }
        @media (max-width: 1024px) { .mk-desk-links { display: none !important; } .mk-admin-cta { display: none !important; } }

        .mk-overlay { position: fixed; inset: 0; background: rgba(10,10,10,0.45); -webkit-backdrop-filter: blur(2px); backdrop-filter: blur(2px); z-index: 198; animation: mkFade .2s ease; }
        @keyframes mkFade { from { opacity: 0 } to { opacity: 1 } }
        .mk-drawer { position: fixed; top: 0; right: 0; width: min(320px,88vw); height: 100dvh; background: #fff; z-index: 199; display: flex; flex-direction: column; animation: mkSlide .3s cubic-bezier(.16,1,.3,1); overflow-y: auto; box-shadow: -8px 0 40px rgba(10,10,10,0.12); }
        @keyframes mkSlide { from { transform: translateX(100%) } to { transform: translateX(0) } }
        .mk-drawer-head { display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid var(--mk-hairline-soft); }
        .mk-drawer-link { display: flex; align-items: center; gap: 10px; padding: 13px 20px; font-family: var(--mk-font); font-size: .95rem; font-weight: 500; color: var(--mk-slate); text-decoration: none; border-radius: 10px; margin: 2px 12px; transition: all .2s; }
        .mk-drawer-link:hover, .mk-drawer-link.active { background: var(--mk-surface); color: var(--mk-ink); }

        .mk-footer { background: var(--mk-canvas); border-top: 1px solid var(--mk-hairline); }
        .mk-footer-grid { display: grid; grid-template-columns: 1.6fr 1fr 1.2fr 1.4fr; gap: 40px; }
        @media (max-width: 860px) { .mk-footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; } }
        @media (max-width: 460px) { .mk-footer-grid { grid-template-columns: 1fr; } }
        .mk-footer-head { font-family: var(--mk-font); font-size: .8125rem; font-weight: 600; color: var(--mk-ink); margin-bottom: 14px; }
        .mk-footer-link { display: block; font-family: var(--mk-font); font-size: .875rem; color: var(--mk-steel); text-decoration: none; padding: 4px 0; transition: color .2s; }
        .mk-footer-link:hover { color: var(--mk-ink); }
        @keyframes mkWaPulse { 0% { box-shadow: 0 0 0 0 rgba(0,212,164,0.5) } 70% { box-shadow: 0 0 0 12px rgba(0,212,164,0) } 100% { box-shadow: 0 0 0 0 rgba(0,212,164,0) } }

        /* Global scroll float-in for boxes on every page */
        .mk-float { opacity: 0; transform: translateY(36px) scale(.985); transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); will-change: opacity, transform; }
        .mk-float.mk-float-in { opacity: 1; transform: translateY(0) scale(1); }
        @media (prefers-reduced-motion: reduce) { .mk-float, .mk-float.mk-float-in { opacity: 1 !important; transform: none !important; transition: none !important; } }
      `}</style>

      {/* NAVBAR */}
      <header className={`mk-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="mk-nav-glass">
          <div className="mk-nav-inner">
            <Link to="/" className="mk-brand">
              <img src="/manikya-navbar-logo.jpeg" alt="Manikya" className="mk-brand-logo" />
              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <div className="mk-brand-name">Manikya Money Service</div>
                <div className="mk-brand-tag">Growing Together</div>
              </div>
            </Link>

            <nav className="mk-desk-links">
              {navLinks.map(l => (
                <Link key={l.path} to={l.path} className={`mk-navlink ${isActive(l.path) ? 'active' : ''}`}>{l.label}</Link>
              ))}
            </nav>

            <div className="mk-nav-right">
              <Link to="/admin" className="mk-btn mk-btn-glass mk-btn-sm mk-admin-cta">
                <Lock size={13} /> Admin
              </Link>
              <Link to="/contact" className="mk-btn mk-btn-primary mk-btn-sm mk-admin-cta">
                Get in touch <ArrowUpRight size={14} />
              </Link>
              <button className="mk-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
                {mobileMenuOpen ? <X size={20} color="#0a0a0a" /> : <Menu size={20} color="#0a0a0a" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <>
          <div className="mk-overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="mk-drawer">
            <div className="mk-drawer-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src="/manikya-navbar-logo.jpeg" alt="Logo" style={{ width: 36, height: 36, borderRadius: 9, objectFit: 'contain', background: '#fff', border: '1px solid #ededed' }} />
                <div style={{ fontFamily: 'var(--mk-font)', fontWeight: 700, fontSize: '.85rem', color: '#0a0a0a', lineHeight: 1.2 }}>
                  Manikya Money<br /><span style={{ color: '#00b48a', fontSize: '.6rem', fontWeight: 600, letterSpacing: '.12em' }}>GROWING TOGETHER</span>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} style={{ width: 36, height: 36, borderRadius: 9, border: '1px solid #e5e5e5', background: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={17} color="#5a5a5c" />
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', paddingTop: 10, paddingBottom: 20 }}>
              {navLinks.map(l => (
                <Link key={l.path} to={l.path} className={`mk-drawer-link ${isActive(l.path) ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>{l.label}</Link>
              ))}
              <div style={{ padding: '12px 24px 4px' }}>
                <Link to="/contact" className="mk-btn mk-btn-primary" style={{ width: '100%' }} onClick={() => setMobileMenuOpen(false)}>
                  Get in touch <ArrowUpRight size={14} />
                </Link>
              </div>
              <div style={{ padding: '8px 24px' }}>
                <Link to="/admin" className="mk-btn mk-btn-glass" style={{ width: '100%' }} onClick={() => setMobileMenuOpen(false)}>
                  <Lock size={14} /> Admin Dashboard
                </Link>
              </div>
              <div style={{ margin: '12px 24px', padding: 16, background: 'var(--mk-surface)', borderRadius: 12, border: '1px solid var(--mk-hairline)' }}>
                <div style={{ fontFamily: 'var(--mk-font)', fontSize: '.65rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 10 }}>Quick Contact</div>
                <a href="tel:+917411647999" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', textDecoration: 'none', fontFamily: 'var(--mk-font)', fontSize: '.875rem', fontWeight: 500, color: '#0a0a0a' }}><Phone size={14} color="#00b48a" /> +91 74116 47999</a>
                <a href="https://wa.me/917411647999" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', textDecoration: 'none', fontFamily: 'var(--mk-font)', fontSize: '.875rem', fontWeight: 500, color: '#0a0a0a' }}><MessageCircle size={14} color="#00b48a" /> WhatsApp us</a>
              </div>
            </div>
          </div>
        </>
      )}

      <main style={{ flex: 1, minWidth: 0, overflowX: 'hidden' }}>
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="mk-footer">
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(48px,7vw,64px) clamp(1rem,3vw,2rem) 28px' }}>
          <div className="mk-footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <img src="/manikya-navbar-logo.jpeg" alt="Logo" style={{ width: 42, height: 42, objectFit: 'contain', borderRadius: 10, background: '#fff', border: '1px solid #ededed', padding: 2 }} />
                <div style={{ fontFamily: 'var(--mk-font)', fontWeight: 700, fontSize: '1rem', color: '#0a0a0a', lineHeight: 1.2 }}>Manikya Money<br />Service Pvt Ltd</div>
              </div>
              <p style={{ fontFamily: 'var(--mk-font)', fontSize: '.875rem', color: '#5a5a5c', lineHeight: 1.6, maxWidth: 320 }}>
                A multi-sector enterprise driving innovation across media, agriculture, commerce, trading, and heritage preservation.
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
                {['Media', 'Finance', 'Trading', 'Realty'].map(t => (
                  <span key={t} className="mk-badge">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="mk-footer-head">Explore</div>
              {[{ to: '/about', l: 'About Us' }, { to: '/services', l: 'Our Services' }, { to: '/pearl-farms', l: 'Pearl Farms' }, { to: '/inside-manikya', l: 'Inside Manikya' }, { to: '/gallery', l: 'Gallery' }, { to: '/contact', l: 'Contact Us' }].map(x => (
                <Link key={x.to} to={x.to} className="mk-footer-link">{x.l}</Link>
              ))}
            </div>
            <div>
              <div className="mk-footer-head">Our Verticals</div>
              {['NewsJunction — Digital Media', 'Manikya Pearl Farms', 'Manikya Market', 'Manikya Traders', 'Manikya Properties', 'Manikya Money', 'Manikya Heritage — Soon'].map((s, i) => (
                <div key={i} className="mk-footer-link" style={{ cursor: 'default' }}>{s}</div>
              ))}
            </div>
            <div>
              <div className="mk-footer-head">Contact</div>
              {[
                { text: 'manikyaservicespvtltd@gmail.com', href: 'mailto:manikyaservicespvtltd@gmail.com' },
                { text: '+91 74116 47999', href: 'tel:+917411647999' },
                { text: '+91 74117 42999', href: 'tel:+917411742999' },
                { text: '#215, MGES, 2nd Floor, 5th Main Road, RPC Layout, Hampi Nagar, Bengaluru – 560104', href: 'https://maps.google.com/?q=215+MGES+Bengaluru+560104' },
              ].map((c, i) => (
                <a key={i} href={c.href} target={i >= 3 ? '_blank' : undefined} rel="noopener noreferrer" className="mk-footer-link">{c.text}</a>
              ))}
              <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[{ l: 'YT', h: 'https://youtube.com/@manikyaservices' }, { l: 'IN', h: 'https://linkedin.com/company/manikyaservices' }, { l: 'IG', h: 'https://instagram.com/manikyaservices' }, { l: 'WA', h: 'https://wa.me/917411647999' }].map(s => (
                  <a key={s.l} href={s.h} target="_blank" rel="noopener noreferrer"
                    style={{ width: 34, height: 34, borderRadius: '50%', background: '#f7f7f7', border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mk-font)', fontSize: '.62rem', fontWeight: 700, color: '#5a5a5c', textDecoration: 'none' }}>
                    {s.l}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, borderTop: '1px solid var(--mk-hairline)', marginTop: 36, paddingTop: 22 }}>
            <p style={{ fontFamily: 'var(--mk-font)', fontSize: '.8125rem', color: '#888', margin: 0 }}>© 2026 Manikya Money Service Pvt Ltd. All rights reserved.</p>
            <span className="mk-badge mk-badge-green">Est. 2026 · Bengaluru, Karnataka</span>
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
        <a href="https://wa.me/917411647999?text=Hello%20Manikya%20Money%20Service%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services."
          target="_blank" rel="noopener noreferrer"
          title="+91 74116 47999"
          style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#00d4a4,#00b48a)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', animation: 'mkWaPulse 2.2s infinite', boxShadow: '0 6px 22px rgba(0,180,138,0.5)' }}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
