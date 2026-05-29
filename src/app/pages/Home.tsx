import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import {
  ArrowRight, Sparkles, ExternalLink,
  Instagram, Youtube, Facebook, Linkedin, X, MapPin
} from 'lucide-react';
import IntroVideo from './IntroVideo';

/* ── Network Canvas ── */
function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const nodes = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.45, vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 2.5 + 1,
      color: ['#f59e0b','#3b82f6','#10b981','#8b5cf6','#ffffff'][Math.floor(Math.random() * 5)],
      pulse: Math.random() * Math.PI * 2,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.pulse += 0.03;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3);
        g.addColorStop(0, n.color + 'cc'); g.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * (1.5 + Math.sin(n.pulse) * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      });
      nodes.forEach((a, i) => nodes.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 160) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255,255,255,${0.07 * (1 - d / 160)})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }));
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }} />;
}

/* ── InView hook ── */
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

/* ── Counter ── */
function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const { ref, v } = useInView();
  useEffect(() => {
    if (!v) return;
    let c = 0; const step = end / 80;
    const t = setInterval(() => { c = Math.min(c + step, end); setN(Math.floor(c)); if (c >= end) clearInterval(t); }, 20);
    return () => clearInterval(t);
  }, [v, end]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

/* ── Cycling word ── */
const cycleWords = [
  { text: 'Media',        color: '#ef4444', icon: '📺' },
  { text: 'Pearl Farming', color: '#3b82f6', icon: '💎' },
  { text: 'E-commerce',   color: '#10b981', icon: '🛒' },
  { text: 'Trading',      color: '#f97316', icon: '🏭' },
  { text: 'Real Estate',  color: '#f59e0b', icon: '🏡' },
  { text: 'Finance',      color: '#8b5cf6', icon: '💰' },
];
function CyclingWord() {
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(p => (p + 1) % cycleWords.length); setVis(true); }, 350);
    }, 2200);
    return () => clearInterval(t);
  }, []);
  const w = cycleWords[idx];
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6, transition:'all .35s ease', opacity:vis?1:0, transform:vis?'translateY(0)':'translateY(10px)', color:w.color, fontWeight:700 }}>
      <span>{w.icon}</span> {w.text}
    </span>
  );
}

/* ── LogoCanvas: screen blend at wrapper level removes black bg completely ── */
function LogoCanvas() {
  return (
    /* isolation:isolate is intentionally NOT set so mix-blend-mode:screen
       composites against the actual hero background, making black = transparent */
    <div className="logo-blend-wrapper" style={{
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      mixBlendMode: 'screen',   /* ← key: whole logo unit blends with hero */
      background: 'transparent',
    }}>
      {/* Neon bottom beam */}
      <div style={{
        position:'absolute', bottom:'-6px', left:'50%',
        transform:'translateX(-50%)',
        width:'65%', height:'28px',
        background:'radial-gradient(ellipse at center, rgba(0,190,255,0.95) 0%, rgba(29,78,216,0.5) 55%, transparent 100%)',
        filter:'blur(9px)',
        borderRadius:'50%',
        pointerEvents:'none',
        animation:'logoPulseBeam 2.8s ease-in-out infinite',
        mixBlendMode:'normal',
      }}/>
      {/* Left sparkle */}
      <div style={{ position:'absolute', bottom:'4px', left:'22%', width:8, height:8, borderRadius:'50%', background:'rgba(0,210,255,1)', boxShadow:'0 0 16px 7px rgba(0,190,255,0.9)', animation:'logoPulseBeam 2.8s ease-in-out infinite 0.4s', pointerEvents:'none', mixBlendMode:'normal' }}/>
      {/* Right sparkle */}
      <div style={{ position:'absolute', bottom:'4px', right:'22%', width:8, height:8, borderRadius:'50%', background:'rgba(0,210,255,1)', boxShadow:'0 0 16px 7px rgba(0,190,255,0.9)', animation:'logoPulseBeam 2.8s ease-in-out infinite 0.8s', pointerEvents:'none', mixBlendMode:'normal' }}/>
      {/* Logo — screen blend makes every black pixel transparent */}
      <img
        src="/manikya-logo-transparent.png"
        alt="Manikya Services Logo"
        style={{
          width:'clamp(320px,56vw,680px)',   /* 35% larger than before */
          height:'auto',
          display:'block',
          position:'relative',
          /* No extra mixBlendMode here — handled by parent wrapper */
          filter:[
            'drop-shadow(0 0 24px rgba(0,180,255,0.95))',
            'drop-shadow(0 0 60px rgba(29,78,216,0.75))',
            'drop-shadow(0 0 100px rgba(0,140,255,0.4))',
            'brightness(1.12)',
            'saturate(1.2)',
            'contrast(1.05)',
          ].join(' '),
        }}
      />
    </div>
  );
}

/* ── Hero Cycling Sectors ── */
const sectorData = [
  { label:'MEDIA',      color:'#ef4444', bg:'rgba(239,68,68,0.12)',    border:'rgba(239,68,68,0.4)',    icon:'📺' },
  { label:'E-COMMERCE', color:'#10b981', bg:'rgba(16,185,129,0.12)',   border:'rgba(16,185,129,0.4)',   icon:'🛒' },
  { label:'FINANCE',    color:'#8b5cf6', bg:'rgba(139,92,246,0.12)',   border:'rgba(139,92,246,0.4)',   icon:'💰' },
  { label:'TRADING',    color:'#f97316', bg:'rgba(249,115,22,0.12)',   border:'rgba(249,115,22,0.4)',   icon:'🏭' },
  { label:'REALTY',     color:'#f59e0b', bg:'rgba(245,158,11,0.12)',   border:'rgba(245,158,11,0.4)',   icon:'🏡' },
  { label:'HERITAGE',   color:'#a855f7', bg:'rgba(168,85,247,0.12)',   border:'rgba(168,85,247,0.4)',   icon:'🏛️' },
];
function HeroCyclingSectors() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % sectorData.length), 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'clamp(4px,1vw,10px)', flexWrap:'wrap', marginBottom:16, padding:'0 8px' }}>
      {sectorData.map((s, i) => (
        <div key={s.label} onClick={() => setActive(i)} style={{
          display:'inline-flex', alignItems:'center', gap:5,
          padding:'5px 12px',
          background: i === active ? s.bg : 'rgba(255,255,255,0.03)',
          border: `1px solid ${i === active ? s.border : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 50,
          transition: 'all 0.5s cubic-bezier(.16,1,.3,1)',
          transform: i === active ? 'scale(1.1) translateY(-2px)' : 'scale(1)',
          cursor: 'pointer',
        }}>
          <span style={{ fontSize: i === active ? '0.95rem' : '0.72rem', transition:'font-size 0.4s' }}>{s.icon}</span>
          <span style={{
            fontFamily:'DM Sans,sans-serif',
            fontSize: 'clamp(0.55rem,0.85vw,0.72rem)',
            fontWeight: i === active ? 700 : 500,
            letterSpacing:'0.1em',
            color: i === active ? s.color : 'rgba(255,255,255,0.35)',
            textTransform:'uppercase',
            transition:'all 0.4s ease',
          }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Services data ── */
const services = [
  { id:1, num:'01', title:'NewsJunction',      sub:'Digital Media Network',  color:'#ef4444', bg:'#0c0202', desc:'Five-language media powerhouse delivering 24/7 live news — Kannada, Hindi, Tamil, Telugu, English.',            link:'/services', ext:'https://newsjunction.net/stream.php' },
  { id:2, num:'02', title:'Pearl Farms',        sub:'Alternative Investment', color:'#3b82f6', bg:'#020510', desc:'Invest in living freshwater pearl ecosystems in Mandya, Karnataka. 30–40% ROI per cycle.',                  link:'/pearl-farms' },
  { id:3, num:'03', title:'Manikya Market',     sub:'Desi Commerce',         color:'#10b981', bg:'#01080a', desc:'Authentic Indian village products reaching global doorsteps. Zero burden on rural artisans.',                link:'/services' },
  { id:4, num:'04', title:'Manikya Traders',    sub:'Marketing & Trading',   color:'#f97316', bg:'#0a0400', desc:'B2B food machinery marketing & grain commodity trading. We connect manufacturers to buyers across Karnataka.', link:'/services' },
  { id:5, num:'05', title:'Manikya Properties', sub:'Real Estate',           color:'#f59e0b', bg:'#0a0700', desc:'Your trusted real estate middleman — property search, bank loan facilitation, legal verification.',         link:'/services' },
  { id:6, num:'06', title:'Manikya Money',      sub:'Financial Services',    color:'#8b5cf6', bg:'#060210', desc:'Accessible, affordable loan services with speedy approvals, low interest, and zero hidden charges.',        link:'/services' },
  { id:7, num:'07', title:'Manikya Heritage',   sub:'Coming Soon',           color:'#a855f7', bg:'#060110', desc:"A living museum of Karnataka's 5000-year culture — folk arts, Ayurvedic wellness, heritage stays.",        link:'/services', soon:true },
];

const stats = [
  { value:24, suffix:'+', label:'Years' },
  { value:500, suffix:'+', label:'Partners' },
  { value:7, suffix:'', label:'Verticals' },
  { value:50, suffix:'+', label:'Vendors' },
];

const defaultSocialLinks = {
  instagram: 'https://www.instagram.com/newsjunctiondigital?igsh=eGd5czZldWdsMDEw',
  facebook:  'https://www.facebook.com/share/18cqpxCY8w/',
  youtube:   'https://youtube.com/@newsjunctiondigital?si=Qb5X358zSsEwiOrZ',
  linkedin:  'https://linkedin.com/company/manikyaservices',
  maps:      'https://maps.google.com/?q=215+MGES+5th+Main+Road+RPC+Layout+Hampi+Nagar+Bengaluru+560104',
};

/* ── Hero Words ── */
function HeroWords() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 150);
    const t2 = setTimeout(() => setStep(2), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div style={{
      display:'flex', justifyContent:'center', alignItems:'center',
      gap:'clamp(0.4rem,2vw,3rem)',
      width:'100%', padding:'0 clamp(0.5rem,3vw,3rem)',
      overflow:'hidden', flexWrap:'wrap',
    }}>
      <div style={{ transform: step >= 1 ? 'translateX(0)' : 'translateX(-100vw)', opacity: step >= 1 ? 1 : 0, transition:'transform 1.2s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease', textAlign:'center' }}>
        <span style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(1.8rem,5vw,5.5rem)', fontWeight:800, color:'#ffffff', textShadow:'0 0 40px rgba(239,68,68,0.7)', letterSpacing:'-0.02em', display:'block', lineHeight:1 }}>Growing</span>
        <span style={{ display:'block', height:3, borderRadius:2, marginTop:6, margin:'6px auto 0', width: step >= 2 ? '100%' : '0%', background:'linear-gradient(90deg,#ef4444,#f59e0b)', transition:'width 0.7s cubic-bezier(0.16,1,0.3,1)' }}/>
      </div>
      <div style={{ transform: step >= 1 ? 'translateX(0)' : 'translateX(100vw)', opacity: step >= 1 ? 1 : 0, transition:'transform 1.2s cubic-bezier(0.16,1,0.3,1) 0.1s, opacity 0.4s ease 0.1s', textAlign:'center' }}>
        <span style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(1.8rem,5vw,5.5rem)', fontWeight:800, color:'#ffffff', textShadow:'0 0 40px rgba(255,255,255,0.4)', letterSpacing:'-0.02em', display:'block', lineHeight:1 }}>Together</span>
        <span style={{ display:'block', height:3, borderRadius:2, marginTop:6, margin:'6px auto 0', width: step >= 2 ? '100%' : '0%', background:'linear-gradient(90deg,#f59e0b,#fde68a)', transition:'width 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s' }}/>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeSvc, setActiveSvc] = useState(0);
  const [showSocial, setShowSocial] = useState(false);
  const [introPlaying, setIntroPlaying] = useState(true);
  const [logoVisible, setLogoVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);
  const s1 = useInView(); const s2 = useInView(); const s3 = useInView(); const s4 = useInView();

  // Fetch social links from backend
  useEffect(() => {
    fetch('https://manikya-backend.onrender.com/api/social-links')
      .then(r => r.json())
      .then(data => setSocialLinks(prev => ({ ...prev, ...data })))
      .catch(() => {}); // keep defaults on error
  }, []);

  const handleIntroComplete = useCallback(() => {
    setIntroPlaying(false);
    setTimeout(() => setLogoVisible(true), 200);
    setTimeout(() => setHeroVisible(true), 900);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setMouse({ x: e.clientX - window.innerWidth / 2, y: e.clientY - window.innerHeight / 2 });
  }, []);

  return (
    <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", background:'#000', color:'#fff', overflowX:'hidden', width:'100%' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.9)}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes svcSlide{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
        @keyframes starTwinkle{0%,100%{opacity:0.08;transform:scale(0.8)}50%{opacity:0.75;transform:scale(1.4)}}
        @keyframes logoIntroGlow{
          0%  {opacity:0;filter:brightness(0)}
          8%  {opacity:1;filter:brightness(0.4) drop-shadow(0 0 30px rgba(59,130,246,0.4))}
          25% {opacity:1;filter:brightness(1.8) drop-shadow(0 0 120px rgba(59,130,246,1)) drop-shadow(0 0 200px rgba(239,68,68,0.9)) saturate(1.5)}
          45% {opacity:1;filter:brightness(2.5) drop-shadow(0 0 160px rgba(239,68,68,1)) drop-shadow(0 0 240px rgba(59,130,246,1)) saturate(2)}
          82% {opacity:1;filter:brightness(1.2) drop-shadow(0 0 60px rgba(59,130,246,0.5))}
          100%{opacity:1;filter:brightness(1.1) drop-shadow(0 0 50px rgba(220,38,38,0.8)) drop-shadow(0 0 100px rgba(29,78,216,0.7))}
        }
        @keyframes introDarkOverlay{0%,70%{opacity:1}100%{opacity:0}}
        @keyframes contentReveal{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scrollBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}
        @keyframes waPulse{0%{box-shadow:0 0 0 0 rgba(34,197,94,0.5)}70%{box-shadow:0 0 0 12px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}}
        @keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
        @keyframes logoPulseBeam{0%,100%{opacity:0.7;transform:translateX(-50%) scaleX(1)}50%{opacity:1;transform:translateX(-50%) scaleX(1.12)}}

        .gold-text{background:linear-gradient(90deg,#f59e0b,#fde68a,#f59e0b);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite}
        .reveal{opacity:0;transform:translateY(40px);transition:all .9s cubic-bezier(.16,1,.3,1)}
        .reveal.on{opacity:1;transform:translateY(0)}
        .reveal-l{opacity:0;transform:translateX(-60px);transition:all .9s cubic-bezier(.16,1,.3,1)}
        .reveal-l.on{opacity:1;transform:translateX(0)}
        .reveal-r{opacity:0;transform:translateX(60px);transition:all .9s cubic-bezier(.16,1,.3,1)}
        .reveal-r.on{opacity:1;transform:translateX(0)}
        .svc-item{transition:all .35s ease;border-left:2px solid rgba(255,255,255,0.08);cursor:pointer}
        .svc-item:hover,.svc-item.act{border-left-color:#f59e0b}
        .svc-detail{animation:svcSlide .4s cubic-bezier(.16,1,.3,1)}
        .btn-inf{position:relative;overflow:hidden;transition:all .3s ease;cursor:pointer;text-decoration:none}
        .btn-inf:hover{transform:translateY(-2px)}
        .why-card{transition:all .35s ease;cursor:default}
        .why-card:hover{transform:translateY(-5px)}
        .scroll-cue{animation:scrollBounce 2s ease-in-out infinite}
        .social-modal{animation:scaleIn .3s ease}
        .marquee-track{display:flex;gap:40px;animation:marquee 20s linear infinite;white-space:nowrap}

        /* ── HERO logo ── */
        .hero-logo-img {
          width: clamp(180px, 35vw, 380px);
          height: auto;
          display: block;
          margin: 0 auto;
          animation: logoIntroGlow 3.2s cubic-bezier(0.16,1,0.3,1) 0.1s both;
        }

        /* ── LOGO BLEND WRAPPER — critical for black-bg removal ── */
        .logo-blend-wrapper {
          mix-blend-mode: screen !important;
          background: transparent !important;
          isolation: auto !important;
        }
        .logo-blend-wrapper img {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
        }

        /* ── SERVICES GRID ── */
        .svc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
        }
        @media (max-width: 768px) {
          .svc-grid { grid-template-columns: 1fr !important; }
          .svc-detail-panel { min-height: 300px !important; }
        }

        /* ── STATS GRID ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-grid > div { border-right: none !important; border-bottom: 1px solid rgba(0,0,0,0.1); }
        }

        /* ── MONEY FEATURE GRID ── */
        .money-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem, 5vw, 4rem);
          align-items: center;
        }
        @media (max-width: 768px) {
          .money-grid { grid-template-columns: 1fr !important; }
        }

        /* ── MONEY MINI-GRID ── */
        .money-mini-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 28px;
        }
        @media (max-width: 400px) {
          .money-mini-grid { grid-template-columns: 1fr !important; }
        }

        /* ── WHY GRID ── */
        .why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        @media (max-width: 900px) {
          .why-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 540px) {
          .why-grid { grid-template-columns: 1fr !important; }
        }

        /* ── NEWS BAR ── */
        .news-bar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px clamp(1rem,3vw,4rem);
          flex-wrap: wrap;
          gap: 8px;
        }
        @media (max-width: 480px) {
          .news-bar-inner { flex-direction: column; align-items: flex-start; }
        }

        /* ── SOCIAL MARQUEE BAR ── */
        .social-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 clamp(1rem,3vw,3rem);
        }
        @media (max-width: 480px) {
          .social-bar { flex-direction: column; align-items: flex-start; padding: 8px 1rem; gap: 8px; }
          .follow-btn { width: 100%; justify-content: center; }
        }

        /* ── CTA BUTTONS ── */
        .cta-btns {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }
        .cta-btn-primary, .cta-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: clamp(12px,2vw,17px) clamp(20px,4vw,40px);
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: clamp(0.78rem,1.5vw,0.88rem);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.3s;
        }
        .cta-btn-primary { background: #f59e0b; color: #000; }
        .cta-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(245,158,11,0.5); }
        .cta-btn-secondary { border: 1px solid rgba(255,255,255,0.22); color: white; }
        .cta-btn-secondary:hover { transform: translateY(-2px); background: rgba(255,255,255,0.06); }
      `}</style>

      {/* IntroVideo is now inside the hero section below */}

      {/* SOCIAL MODAL */}
      {showSocial && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem' }} onClick={() => setShowSocial(false)}>
          <div className="social-modal" style={{ background:'white',borderRadius:16,padding:'clamp(1.5rem,4vw,2rem)',width:'90%',maxWidth:420,position:'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowSocial(false)} style={{ position:'absolute',top:12,right:12,background:'#f1f5f9',border:'none',borderRadius:'50%',width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer' }}>
              <X size={15}/>
            </button>
            <h3 style={{ fontSize:'1.3rem',fontWeight:700,color:'#0f172a',marginBottom:4 }}>Follow Manikya</h3>
            <p style={{ fontFamily:'DM Sans,sans-serif',color:'#64748b',fontSize:'0.85rem',marginBottom:20 }}>Connect with us on social media</p>
            <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
              {[
                { icon:<Instagram size={15}/>, label:'Instagram', href:socialLinks.instagram, color:'#e1306c'},
                { icon:<Facebook size={15}/>,  label:'Facebook',  href:socialLinks.facebook,  color:'#1877f2'},
                { icon:<Youtube size={15}/>,   label:'YouTube',   href:socialLinks.youtube,   color:'#ff0000'},
                { icon:<Linkedin size={15}/>,  label:'LinkedIn',  href:socialLinks.linkedin,  color:'#0a66c2'},
              ].map((s,i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex',alignItems:'center',gap:12,padding:'10px 14px',borderRadius:10,background:'#f8fafc',textDecoration:'none',color:'#0f172a',fontFamily:'DM Sans,sans-serif',fontSize:'0.85rem',fontWeight:500 }}>
                  <span style={{ color:s.color }}>{s.icon}</span>{s.label}
                  <ExternalLink size={12} style={{ marginLeft:'auto',color:'#94a3b8' }}/>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NEWSJUNCTION BAR */}
      <a href="https://newsjunction.net/dashboard.php" target="_blank" rel="noopener noreferrer"
        style={{ display:'block', background:'linear-gradient(135deg,#7f1d1d,#991b1b)', textDecoration:'none', position:'relative', zIndex:100 }}>
        <div className="news-bar-inner">
          <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
            <div style={{ display:'flex',alignItems:'center',gap:6,padding:'3px 10px',background:'#ef4444',borderRadius:20,flexShrink:0 }}>
              <span style={{ width:6,height:6,borderRadius:'50%',background:'white',display:'inline-block',animation:'pulse .9s ease-in-out infinite' }}/>
              <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.62rem',fontWeight:700,color:'white',letterSpacing:'0.15em',textTransform:'uppercase' }}>Live</span>
            </div>
            <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'clamp(0.72rem,1.5vw,0.82rem)',fontWeight:600,color:'rgba(255,255,255,0.9)' }}>NewsJunction — Kannada · Hindi · Telugu · English · Marathi</span>
          </div>
          <div style={{ display:'flex',alignItems:'center',gap:8,padding:'5px 14px',background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:4,flexShrink:0 }}>
            <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.7rem',fontWeight:600,color:'white',textTransform:'uppercase',letterSpacing:'0.08em' }}>Open Dashboard</span>
            <ExternalLink size={12} color="white"/>
          </div>
        </div>
      </a>

      {/* ── HERO ── */}
      <section style={{
        position:'relative', minHeight:'100svh',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        background: introPlaying
          ? 'radial-gradient(ellipse 130% 90% at 50% 50%, #08001a 0%, #0a0005 40%, #000510 75%, #000 100%)'
          : 'radial-gradient(ellipse 130% 90% at 50% 0%, #050e24 0%, #060f26 40%, #030918 75%, #010710 100%)',
        overflow:'hidden', padding:'clamp(4rem,8vh,6rem) clamp(1rem,3vw,2rem) clamp(2rem,4vh,4rem)',
        transition:'background 1.2s ease',
      }} onMouseMove={onMouseMove}>

        {/* Stars — only show after intro */}
        {!introPlaying && Array.from({ length: 70 }).map((_, i) => {
          const x = (i * 137.5) % 100, y = (i * 97.3) % 100, s = 0.5 + (i % 4) * 0.5;
          return <div key={i} style={{ position:'absolute',left:`${x}%`,top:`${y}%`,width:s,height:s,borderRadius:'50%',background:'white',animation:`starTwinkle ${2+(i%4)*0.7}s ease-in-out ${(i*0.21)%5}s infinite`,pointerEvents:'none' }}/>;
        })}

        {/* Atmospheric glows — show after intro */}
        {!introPlaying && <>
          <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse 55% 65% at 18% 55%, rgba(200,30,30,0.26) 0%, transparent 65%)',pointerEvents:'none' }}/>
          <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse 55% 65% at 82% 55%, rgba(29,78,216,0.30) 0%, transparent 65%)',pointerEvents:'none' }}/>
          <div style={{ position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 60%,#010710 100%)',pointerEvents:'none' }}/>
          <NetworkCanvas />
        </>}

        {/* ── EMBEDDED INTRO VIDEO (fills hero, below navbar) ── */}
        <IntroVideo
          videoSrc="/intro.mp4"
          onComplete={handleIntroComplete}
        />

        {/* ── HERO CONTENT (shown after video) ── */}
        <div style={{ position:'relative', zIndex:10, width:'100%', maxWidth:960, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', gap:0, isolation:'auto', background:'transparent' }}>

          {/* Logo — fades in from center after video, replacing the video logo */}
          <AnimatePresence>
            {logoVisible && (
              <motion.div
                key="hero-logo"
                initial={{ opacity:0, scale:0.7, filter:'blur(16px) brightness(2)' }}
                animate={{ opacity:1, scale:1, filter:'blur(0px) brightness(1)' }}
                transition={{ duration:1.1, ease:[0.16,1,0.3,1] }}
                style={{
                  marginBottom:'clamp(0.5rem,2vh,1.5rem)',
                  isolation:'auto',        /* do NOT isolate — lets screen blend reach hero bg */
                  background:'transparent',
                }}
              >
                <LogoCanvas />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Growing Together */}
          <div style={{ width:'100%', opacity:heroVisible ? 1 : 0, transition:'opacity 0.7s ease' }}>
            {heroVisible && <HeroWords />}
          </div>

          {/* Subtitle */}
          <p style={{
            fontFamily:'DM Sans,sans-serif', fontSize:'clamp(0.75rem,1.5vw,0.92rem)',
            color:'rgba(255,255,255,0.45)', fontWeight:300, textAlign:'center',
            margin:'clamp(8px,1.5vh,14px) 0 6px', lineHeight:1.5, maxWidth:500,
            opacity:heroVisible ? 1 : 0,
            transform:heroVisible ? 'translateY(0)' : 'translateY(20px)',
            transition:'opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s',
          }}>
            A multi-sector enterprise driving innovation across
          </p>

          {/* Sector badges */}
          <div style={{ width:'100%', opacity:heroVisible ? 1 : 0, transform:heroVisible ? 'translateY(0)' : 'translateY(20px)', transition:'opacity 0.7s ease 0.5s, transform 0.7s ease 0.5s' }}>
            <HeroCyclingSectors />
          </div>

          {/* Buttons */}
          <div style={{
            display:'flex', gap:'clamp(8px,2vw,14px)', justifyContent:'center', flexWrap:'wrap', marginTop:8,
            opacity:heroVisible ? 1 : 0, transform:heroVisible ? 'translateY(0)' : 'translateY(20px)',
            transition:'opacity 0.7s ease 0.65s, transform 0.7s ease 0.65s',
          }}>
            <Link to="/services" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'clamp(10px,2vw,12px) clamp(18px,4vw,30px)',
              background:'linear-gradient(135deg,#ef4444,#f59e0b)',
              color:'white', fontFamily:'DM Sans,sans-serif', fontWeight:700,
              fontSize:'clamp(0.78rem,1.5vw,0.88rem)', letterSpacing:'0.05em',
              border:'none', borderRadius:50,
              boxShadow:'0 4px 24px rgba(245,158,11,0.4)', textDecoration:'none', transition:'all 0.3s ease',
            }}>
              <Sparkles size={14}/> Explore Services <ArrowRight size={13}/>
            </Link>
            <Link to="/about" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'clamp(10px,2vw,12px) clamp(18px,4vw,30px)',
              background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.85)',
              fontFamily:'DM Sans,sans-serif', fontWeight:600,
              fontSize:'clamp(0.78rem,1.5vw,0.88rem)',
              border:'1.5px solid rgba(255,255,255,0.25)', borderRadius:50,
              backdropFilter:'blur(10px)', textDecoration:'none', transition:'all 0.3s ease',
            }}>
              Learn More
            </Link>
          </div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity:0 }}
            animate={heroVisible ? { opacity:1 } : { opacity:0 }}
            transition={{ duration:1, delay:1.2 }}
            style={{ marginTop:'clamp(1rem,3vh,2rem)', display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}
          >
            <div style={{ width:22,height:36,borderRadius:11,border:'1.5px solid rgba(255,255,255,0.2)',display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'4px 0' }}>
              <div className="scroll-cue" style={{ width:3,height:3,borderRadius:'50%',background:'rgba(255,255,255,0.5)' }}/>
            </div>
            <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.46rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,255,255,0.2)' }}>SCROLL</span>
          </motion.div>
        </div>
      </section>

      {/* SOCIAL MARQUEE BAR */}
      <section style={{ background:'#0f172a', overflow:'hidden', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <div className="social-bar">
          <div style={{ display:'flex', overflow:'hidden', flex:1, padding:'10px 0' }}>
            <div className="marquee-track">
              {[...Array(2)].map((_, r) => [
                { label:'@ManikyaServices', color:'#e1306c', href:socialLinks.instagram },
                { label:'•', color:'rgba(255,255,255,0.2)', href:'' },
                { label:'Manikya Services', color:'#1877f2', href:socialLinks.facebook },
                { label:'•', color:'rgba(255,255,255,0.2)', href:'' },
                { label:'Manikya YouTube', color:'#ff0000', href:socialLinks.youtube },
                { label:'•', color:'rgba(255,255,255,0.2)', href:'' },
                { label:'Manikya LinkedIn', color:'#0a66c2', href:socialLinks.linkedin },
                { label:'•', color:'rgba(255,255,255,0.2)', href:'' },
              ].map((item, i) => (
                item.href
                  ? <a key={`${r}-${i}`} href={item.href} target="_blank" rel="noopener noreferrer"
                      style={{ display:'inline-flex',alignItems:'center',gap:6,flexShrink:0,color:item.color,fontFamily:'DM Sans,sans-serif',fontWeight:600,fontSize:'0.73rem',letterSpacing:'0.08em',textDecoration:'none' }}>
                      {item.label}
                    </a>
                  : <span key={`${r}-${i}`} style={{ flexShrink:0,color:item.color,fontFamily:'DM Sans,sans-serif',fontSize:'0.73rem' }}>{item.label}</span>
              )))}
            </div>
          </div>
          <button onClick={() => setShowSocial(true)} className="follow-btn" style={{ flexShrink:0,marginLeft:12,display:'flex',alignItems:'center',gap:6,padding:'6px 14px',background:'rgba(245,158,11,0.12)',border:'1px solid rgba(245,158,11,0.3)',color:'#f59e0b',fontFamily:'DM Sans,sans-serif',fontSize:'0.7rem',fontWeight:600,cursor:'pointer',letterSpacing:'0.1em',textTransform:'uppercase',borderRadius:4 }}>
            Follow Us
          </button>
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ background:'#050505', padding:'clamp(3rem,7vw,8rem) 0' }} ref={s1.ref}>
        <div style={{ maxWidth:1400, margin:'0 auto', padding:'0 clamp(1rem,4vw,3rem)' }}>
          <div className={`reveal ${s1.v ? 'on' : ''}`} style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'clamp(2rem,5vw,3.5rem)', flexWrap:'wrap', gap:16 }}>
            <div>
              <p style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.72rem',fontWeight:600,letterSpacing:'0.25em',textTransform:'uppercase',color:'#f59e0b',marginBottom:12 }}>What We Do</p>
              <h2 style={{ fontSize:'clamp(2rem,5vw,4.5rem)',fontWeight:700,lineHeight:1.05,color:'white',margin:0 }}>Seven Verticals.<br/>One Vision.</h2>
            </div>
            <Link to="/services" style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.85rem',fontWeight:500,color:'#f59e0b',textDecoration:'none',display:'flex',alignItems:'center',gap:8,borderBottom:'1px solid #f59e0b',paddingBottom:2,whiteSpace:'nowrap' }}>
              View All <ArrowRight size={14}/>
            </Link>
          </div>

          <div className="svc-grid">
            {/* Service list */}
            <div>
              {services.map((sv, i) => (
                <div key={sv.id} className={`svc-item ${activeSvc === i ? 'act' : ''}`} onClick={() => setActiveSvc(i)}>
                  <div style={{ padding:'clamp(14px,2vw,22px) clamp(14px,3vw,26px)', display:'flex', alignItems:'center', gap:14, borderBottom:'1px solid rgba(255,255,255,0.04)', background:activeSvc===i?'rgba(245,158,11,0.04)':'transparent', transition:'background .3s' }}>
                    <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.68rem',color:sv.color,fontWeight:700,letterSpacing:'0.1em',minWidth:24,flexShrink:0 }}>{sv.num}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700,color:activeSvc===i?'#f59e0b':'white',fontSize:'clamp(0.9rem,1.5vw,1.1rem)',transition:'color .3s' }}>{sv.title}</div>
                      <div style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.75rem',color:'rgba(255,255,255,0.35)',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{sv.sub}</div>
                    </div>
                    {sv.soon && <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.58rem',background:'#8b5cf620',border:'1px solid #8b5cf650',color:'#8b5cf6',padding:'2px 7px',borderRadius:20,flexShrink:0 }}>Soon</span>}
                    <ArrowRight size={14} style={{ color:activeSvc===i?'#f59e0b':'rgba(255,255,255,0.15)',transition:'color .3s',flexShrink:0 }}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Service detail */}
            <div style={{ background:'#0a0a0a', position:'relative', overflow:'hidden', minHeight:300 }} className="svc-detail-panel">
              <div key={activeSvc} className="svc-detail" style={{ padding:'clamp(1.5rem,4vw,3rem)', height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:services[activeSvc].color }}/>
                <div style={{ position:'relative', zIndex:1 }}>
                  <span style={{ display:'inline-block',fontFamily:'DM Sans,sans-serif',fontSize:'0.66rem',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:services[activeSvc].color,marginBottom:14,padding:'4px 12px',border:`1px solid ${services[activeSvc].color}30`,borderRadius:20 }}>
                    {services[activeSvc].sub}
                  </span>
                  <h3 style={{ fontSize:'clamp(1.5rem,3vw,2.8rem)',fontWeight:700,color:'white',lineHeight:1.1,marginBottom:16 }}>{services[activeSvc].title}</h3>
                  <p style={{ fontFamily:'DM Sans,sans-serif',color:'rgba(255,255,255,0.55)',lineHeight:1.8,fontSize:'clamp(0.85rem,1.2vw,1rem)',marginBottom:24 }}>{services[activeSvc].desc}</p>
                  <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                    {services[activeSvc].soon ? (
                      <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.82rem',color:'#8b5cf6',border:'1px solid #8b5cf640',padding:'10px 22px' }}>Coming Soon</span>
                    ) : (
                      <>
                        <Link to={services[activeSvc].link} className="btn-inf" style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'10px 20px',background:services[activeSvc].color,color:'#000',fontFamily:'DM Sans,sans-serif',fontWeight:600,fontSize:'0.8rem',textTransform:'uppercase',letterSpacing:'0.05em' }}>
                          Learn More <ArrowRight size={13}/>
                        </Link>
                        {(services[activeSvc] as any).ext && (
                          <a href={(services[activeSvc] as any).ext} target="_blank" rel="noopener noreferrer" className="btn-inf" style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'10px 20px',border:`1px solid ${services[activeSvc].color}50`,color:services[activeSvc].color,fontFamily:'DM Sans,sans-serif',fontWeight:600,fontSize:'0.8rem',textDecoration:'none' }}>
                            Watch Live <ExternalLink size={13}/>
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div style={{ position:'absolute',bottom:-10,right:20,fontSize:window.innerWidth > 600 ? '8rem' : '4rem',fontWeight:700,color:'rgba(255,255,255,0.025)',lineHeight:1,userSelect:'none' }}>{services[activeSvc].num}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background:'#f59e0b', padding:'clamp(2.5rem,5vw,5rem) 0' }} ref={s2.ref}>
        <div style={{ maxWidth:1400, margin:'0 auto', padding:'0 clamp(1rem,4vw,3rem)' }}>
          <div className="stats-grid">
            {stats.map((st, i) => (
              <div key={i} className={`reveal ${s2.v ? 'on' : ''}`} style={{ transitionDelay:`${i * 100}ms`, padding:'clamp(1.5rem,3vw,2.5rem) clamp(1rem,2vw,2rem)', borderRight:i < 3 ? '1px solid rgba(0,0,0,0.1)' : 'none' }}>
                <div style={{ fontSize:'clamp(2.2rem,5vw,5rem)',fontWeight:700,color:'#000',lineHeight:1,fontFamily:"'Cormorant Garamond',serif" }}>
                  <Counter end={st.value} suffix={st.suffix}/>
                </div>
                <div style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.78rem',fontWeight:500,color:'rgba(0,0,0,0.55)',letterSpacing:'0.15em',textTransform:'uppercase',marginTop:6 }}>{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MANIKYA MONEY FEATURE */}
      <section style={{ background:'linear-gradient(135deg,#06020f,#0a0520,#0f0a2a)', padding:'clamp(3rem,7vw,8rem) 0', position:'relative', overflow:'hidden' }} ref={s3.ref}>
        <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse at 40% 50%,rgba(139,92,246,0.1),transparent 60%)' }}/>
        <div style={{ maxWidth:1400, margin:'0 auto', padding:'0 clamp(1rem,4vw,3rem)', position:'relative', zIndex:1 }}>
          <div className="money-grid">
            <div className={`reveal-l ${s3.v ? 'on' : ''}`}>
              <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:18 }}>
                <div style={{ width:28,height:1,background:'#8b5cf6',flexShrink:0 }}/>
                <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.66rem',fontWeight:700,letterSpacing:'0.22em',textTransform:'uppercase',color:'#8b5cf6' }}>Financial Services</span>
              </div>
              <h2 style={{ fontSize:'clamp(1.8rem,4vw,4rem)',fontWeight:700,lineHeight:1.05,color:'white',marginBottom:20 }}>
                Manikya<br/>
                <span style={{ background:'linear-gradient(90deg,#8b5cf6,#c4b5fd,#8b5cf6)',backgroundSize:'200% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',animation:'shimmer 4s linear infinite' }}>Money Service</span>
              </h2>
              <p style={{ fontFamily:'DM Sans,sans-serif',color:'rgba(255,255,255,0.55)',fontSize:'clamp(0.9rem,1.5vw,1.05rem)',lineHeight:1.85,marginBottom:28,fontWeight:300 }}>
                <strong style={{ color:'white' }}>Empowering Your Financial Future</strong> with Trust and Transparency.
              </p>
              <div className="money-mini-grid">
                {[['⚡','Speedy Approvals','24–48 hour processing'],['💰','Low Interest Rates','Competitive & transparent'],['✅','No Hidden Charges','What you see is what you get'],['📄','Minimal Docs','Digital-friendly process']].map(([icon,t,s]) => (
                  <div key={t as string} style={{ padding:'clamp(12px,2vw,16px)',border:'1px solid rgba(139,92,246,0.2)',background:'rgba(139,92,246,0.04)' }}>
                    <div style={{ fontSize:'1.3rem',marginBottom:6 }}>{icon}</div>
                    <div style={{ fontWeight:700,color:'white',fontSize:'clamp(0.82rem,1.2vw,0.9rem)',marginBottom:2 }}>{t}</div>
                    <div style={{ fontFamily:'DM Sans,sans-serif',color:'rgba(255,255,255,0.35)',fontSize:'0.75rem' }}>{s}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
                <Link to="/contact" className="btn-inf" style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'12px 24px',background:'#8b5cf6',color:'white',fontFamily:'DM Sans,sans-serif',fontWeight:600,fontSize:'0.85rem',textTransform:'uppercase',letterSpacing:'0.05em' }}>
                  Apply for a Loan <ArrowRight size={14}/>
                </Link>
                <Link to="/services" className="btn-inf" style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'12px 22px',border:'1px solid rgba(139,92,246,0.4)',color:'#8b5cf6',fontFamily:'DM Sans,sans-serif',fontWeight:600,fontSize:'0.85rem' }}>
                  Contact Us
                </Link>
              </div>
            </div>
            <div className={`reveal-r ${s3.v ? 'on' : ''}`}>
              <div style={{ background:'rgba(139,92,246,0.06)',border:'1px solid rgba(139,92,246,0.15)',padding:'clamp(1.5rem,3vw,2.5rem)' }}>
                <div style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.66rem',fontWeight:700,color:'#8b5cf6',textTransform:'uppercase',letterSpacing:'0.18em',marginBottom:20 }}>Our Core Values</div>
                {[['🏅','Integrity','We uphold the highest standards of honesty in all our actions.'],['🌟','Excellence','Striving to deliver the best possible service to every client.'],['📊','Accountability','We take responsibility for our commitments and results.'],['💡','Innovation','Constantly improving our processes to serve you better.']].map(([icon,t,d]) => (
                  <div key={t as string} style={{ display:'flex',gap:14,padding:'14px 0',borderBottom:'1px solid rgba(255,255,255,0.05)',alignItems:'flex-start' }}>
                    <span style={{ fontSize:'1.3rem',flexShrink:0 }}>{icon}</span>
                    <div>
                      <div style={{ fontWeight:700,color:'white',marginBottom:4,fontSize:'clamp(0.85rem,1.2vw,0.95rem)' }}>{t}</div>
                      <div style={{ fontFamily:'DM Sans,sans-serif',color:'rgba(255,255,255,0.4)',fontSize:'0.82rem',lineHeight:1.65 }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY MANIKYA */}
      <section style={{ background:'#fff', padding:'clamp(3rem,7vw,8rem) 0', color:'#000' }} ref={s4.ref}>
        <div style={{ maxWidth:1400, margin:'0 auto', padding:'0 clamp(1rem,4vw,3rem)' }}>
          <div className={`reveal ${s4.v ? 'on' : ''}`} style={{ textAlign:'center', marginBottom:'clamp(2.5rem,5vw,4rem)' }}>
            <p style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.72rem',fontWeight:600,letterSpacing:'0.25em',textTransform:'uppercase',color:'#f59e0b',marginBottom:14 }}>Why Manikya</p>
            <h2 style={{ fontSize:'clamp(2rem,5vw,4.5rem)',fontWeight:700,lineHeight:1.05,color:'#000',margin:0 }}>Built on Trust.<br/>Driven by Purpose.</h2>
          </div>
          <div className="why-grid">
            {[
              {n:'01',t:'Circular Synergy',d:'Each of our 7 verticals feeds and strengthens the others — media drives commerce, farms attract investors, finance enables growth.',col:'#ef4444'},
              {n:'02',t:'24+ Years Excellence',d:'Two decades of journalistic integrity, entrepreneurial grit, and community empowerment — building trust one venture at a time since 2002.',col:'#3b82f6'},
              {n:'03',t:'Rural Empowerment',d:'Every product, every farm, every story — rooted in the empowerment of Indian farmers, artisans, women entrepreneurs, and local communities.',col:'#10b981'},
              {n:'04',t:'Tech + Tradition',d:'We blend modern technology with ancient wisdom — digital media meets pearl farming, Ayurveda meets e-commerce, fintech meets community banking.',col:'#f59e0b'},
              {n:'05',t:'Financial Inclusion',d:'Manikya Money Service ensures everyone has access to quick capital with speedy approvals, low rates, and zero hidden charges.',col:'#8b5cf6'},
              {n:'06',t:'Bengaluru to Bharat',d:'Headquartered in Bengaluru, our operations and impact span Karnataka and all of India — local roots, national ambitions.',col:'#22c55e'},
            ].map((item, i) => (
              <div key={i} className={`why-card reveal ${s4.v ? 'on' : ''}`}
                style={{ transitionDelay:`${i * 80}ms`, padding:'clamp(1.5rem,3vw,2.5rem) clamp(1rem,2vw,2rem)', border:'1px solid #f0f0f0', position:'relative', overflow:'hidden' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = item.col + '06'; (e.currentTarget as HTMLElement).style.borderColor = item.col + '30'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'white'; (e.currentTarget as HTMLElement).style.borderColor = '#f0f0f0'; }}>
                <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.68rem',fontWeight:700,color:item.col,letterSpacing:'0.2em' }}>{item.n}</span>
                <div style={{ width:28,height:2,background:item.col,margin:'10px 0 14px' }}/>
                <h3 style={{ fontSize:'clamp(1rem,1.5vw,1.2rem)',fontWeight:700,color:'#0f172a',marginBottom:10 }}>{item.t}</h3>
                <p style={{ fontFamily:'DM Sans,sans-serif',color:'#64748b',lineHeight:1.75,fontSize:'clamp(0.82rem,1.2vw,0.9rem)',margin:0 }}>{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:'#000', padding:'clamp(4rem,9vw,10rem) 0', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'min(600px,100%)',height:'min(600px,100%)',borderRadius:'50%',background:'radial-gradient(circle,rgba(59,130,246,0.06),transparent 70%)',pointerEvents:'none' }}/>
        <div style={{ maxWidth:800, margin:'0 auto', padding:'0 clamp(1rem,4vw,3rem)', position:'relative', zIndex:1 }}>
          <p style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.72rem',fontWeight:600,letterSpacing:'0.25em',textTransform:'uppercase',color:'#f59e0b',marginBottom:24 }}>Partner With Us</p>
          <h2 style={{ fontSize:'clamp(2rem,6vw,6rem)',fontWeight:700,lineHeight:1.0,color:'white',marginBottom:20 }}>
            Ready to grow<br/><span className="gold-text">together?</span>
          </h2>
          <p style={{ fontFamily:'DM Sans,sans-serif',color:'rgba(255,255,255,0.4)',fontSize:'clamp(0.88rem,1.5vw,1.05rem)',lineHeight:1.8,marginBottom:'clamp(2rem,4vw,3rem)',fontWeight:300 }}>
            Join 500+ partners and investors who have chosen Manikya as their growth partner across media, farming, commerce, wellness, real estate, and financial services.
          </p>
          <div className="cta-btns">
            <Link to="/contact" className="cta-btn-primary">Contact Us <ArrowRight size={15}/></Link>
            <Link to="/about" className="cta-btn-secondary">About Us</Link>
          </div>
          <div style={{ display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap' }}>
            {[
              { icon:<Instagram size={20}/>, href:socialLinks.instagram, color:'#e1306c' },
              { icon:<Facebook size={20}/>,  href:socialLinks.facebook,  color:'#1877f2' },
              { icon:<Youtube size={20}/>,   href:socialLinks.youtube,   color:'#ff0000' },
              { icon:<Linkedin size={20}/>,  href:socialLinks.linkedin,  color:'#0a66c2' },
              { icon:<MapPin size={20}/>,    href:socialLinks.maps,      color:'#34a853' },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{ width:44,height:44,borderRadius:'50%',background:s.color+'10',border:`1px solid ${s.color}25`,color:s.color,display:'flex',alignItems:'center',justifyContent:'center',transition:'all .3s',textDecoration:'none' }}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
