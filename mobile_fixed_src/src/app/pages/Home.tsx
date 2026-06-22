import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight, Sparkles, Newspaper, ShoppingBag, Leaf,
  Building2, ExternalLink, Play, Instagram, Youtube, Facebook,
  Linkedin, X, MapPin
} from 'lucide-react';

/* ── Network Canvas ── */
function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const nodes = Array.from({ length: 55 }, () => ({
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
        if (d < 180) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255,255,255,${0.07 * (1 - d / 180)})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }));
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

/* ── Floating business icons ── */
function FloatingIcons() {
  const icons = [
    { e:'📺', x:'12%', y:'15%', s:2.4, d:0,   dur:7   },
    { e:'💎', x:'82%', y:'12%', s:2.8, d:1,   dur:9   },
    { e:'🛒', x:'90%', y:'55%', s:2.0, d:2,   dur:8   },
    { e:'🌿', x:'8%',  y:'70%', s:2.6, d:0.5, dur:10  },
    { e:'🏡', x:'75%', y:'78%', s:2.1, d:1.5, dur:7.5 },
    { e:'💰', x:'45%', y:'8%',  s:2.3, d:3,   dur:8.5 },
    { e:'🦪', x:'60%', y:'85%', s:1.9, d:2.5, dur:9.5 },
    { e:'📡', x:'25%', y:'88%', s:1.7, d:4,   dur:6.5 },
    { e:'🌾', x:'88%', y:'30%', s:2.5, d:1,   dur:11  },
    { e:'🏛️', x:'5%',  y:'38%', s:1.9, d:3.5, dur:8   },
    { e:'🧵', x:'55%', y:'18%', s:1.8, d:2,   dur:7   },
    { e:'🏦', x:'38%', y:'92%', s:2.0, d:0.8, dur:9   },
  ];
  return (
    <>
      {icons.map((ic, i) => (
        <div key={i} style={{
          position:'absolute', left:ic.x, top:ic.y, fontSize:`${ic.s}rem`,
          opacity:0.07, pointerEvents:'none', userSelect:'none',
          animation:`floatIcon ${ic.dur}s ease-in-out ${ic.d}s infinite alternate`,
          filter:'blur(0.5px)',
        }}>{ic.e}</div>
      ))}
    </>
  );
}

/* ── Parallax orbs ── */
function ParallaxOrbs({ mouse }: { mouse:{x:number;y:number} }) {
  return (
    <>
      <div style={{ position:'absolute',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(59,130,246,0.15),transparent 70%)',filter:'blur(60px)',left:`calc(${mouse.x*0.03}px + 60%)`,top:`calc(${mouse.y*0.03}px + 5%)`,transform:'translate(-50%,-50%)',transition:'left .4s ease,top .4s ease',pointerEvents:'none' }}/>
      <div style={{ position:'absolute',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(245,158,11,0.12),transparent 70%)',filter:'blur(50px)',left:`calc(${mouse.x*-0.02}px + 15%)`,top:`calc(${mouse.y*-0.02}px + 55%)`,transform:'translate(-50%,-50%)',transition:'left .6s ease,top .6s ease',pointerEvents:'none' }}/>
      <div style={{ position:'absolute',width:350,height:350,borderRadius:'50%',background:'radial-gradient(circle,rgba(139,92,246,0.1),transparent 70%)',filter:'blur(50px)',left:`calc(${mouse.x*0.015}px + 80%)`,top:`calc(${mouse.y*0.025}px + 70%)`,transform:'translate(-50%,-50%)',transition:'left .5s ease,top .5s ease',pointerEvents:'none' }}/>
    </>
  );
}

/* ── Cycling word ── */
const cycleWords = [
  { text:'Media',       color:'#ef4444', icon:'📺' },
  { text:'Pearl Farming',color:'#3b82f6',icon:'💎' },
  { text:'E-commerce',  color:'#10b981', icon:'🛒' },
  { text:'Trading',     color:'#f97316', icon:'🏭' },
  { text:'Real Estate', color:'#f59e0b', icon:'🏡' },
  { text:'Finance',     color:'#8b5cf6', icon:'💰' },
];
function CyclingWord() {
  const [idx, setIdx]   = useState(0);
  const [vis, setVis]   = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(p => (p+1) % cycleWords.length); setVis(true); }, 350);
    }, 2200);
    return () => clearInterval(t);
  }, []);
  const w = cycleWords[idx];
  return (
    <span style={{ display:'inline-flex',alignItems:'center',gap:8,transition:'all .35s ease',opacity:vis?1:0,transform:vis?'translateY(0)':'translateY(10px)',color:w.color,fontWeight:700,minWidth:220,whiteSpace:'nowrap' }}>
      <span style={{ fontSize:'1.1em' }}>{w.icon}</span> {w.text}
    </span>
  );
}

/* ── InView hook ── */
function useInView(t=0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [v,setV] = useState(false);
  useEffect(() => {
    const el=ref.current; if(!el) return;
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting){setV(true);obs.disconnect();} },{threshold:t});
    obs.observe(el); return ()=>obs.disconnect();
  },[t]);
  return {ref,v};
}

/* ── Counter ── */
function Counter({end,suffix=''}:{end:number;suffix?:string}) {
  const [n,setN]=useState(0);
  const {ref,v}=useInView();
  useEffect(()=>{
    if(!v)return;
    let c=0; const step=end/80;
    const t=setInterval(()=>{ c=Math.min(c+step,end); setN(Math.floor(c)); if(c>=end)clearInterval(t); },20);
    return ()=>clearInterval(t);
  },[v,end]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

/* ── Services data ── */
const services = [
  { id:1, num:'01', title:'NewsJunction',       sub:'Digital Media Network',     color:'#ef4444', bg:'#0c0202', desc:'Five-language media powerhouse delivering 24/7 live news — Kannada, Hindi, Tamil, Telugu, English.',        link:'/services', ext:'https://newsjunction.net/stream.php' },
  { id:2, num:'02', title:'Pearl Farms',         sub:'Alternative Investment',    color:'#3b82f6', bg:'#020510', desc:'Invest in living freshwater pearl ecosystems in Mandya, Karnataka. 30–40% ROI per cycle.',               link:'/pearl-farms' },
  { id:3, num:'03', title:'Manikya Market',      sub:'Desi Commerce',            color:'#10b981', bg:'#01080a', desc:'Authentic Indian village products reaching global doorsteps. Zero burden on rural artisans.',             link:'/services' },
  { id:4, num:'04', title:'Manikya Traders',     sub:'Marketing & Trading',      color:'#f97316', bg:'#0a0400', desc:'B2B food machinery marketing & grain commodity trading. We connect manufacturers to buyers across Karnataka.', link:'/services' },
  { id:5, num:'05', title:'Manikya Properties',  sub:'Real Estate',              color:'#f59e0b', bg:'#0a0700', desc:'Your trusted real estate middleman — property search, bank loan facilitation, legal verification.',      link:'/services' },
  { id:6, num:'06', title:'Manikya Money',       sub:'Financial Services',       color:'#8b5cf6', bg:'#060210', desc:'Accessible, affordable loan services with speedy approvals, low interest, and zero hidden charges.',    link:'/services' },
  { id:7, num:'07', title:'Manikya Heritage',    sub:'Coming Soon',              color:'#a855f7', bg:'#060110', desc:"A living museum of Karnataka's 5000-year culture — folk arts, Ayurvedic wellness, heritage stays.",   link:'/services', soon:true },
];

const stats = [
  {value:24,suffix:'+',label:'Years'},
  {value:500,suffix:'+',label:'Partners'},
  {value:7,suffix:'',label:'Verticals'},
  {value:50,suffix:'+',label:'Vendors'},
];

// ⚠️ UPDATE THESE LINKS when ready
const socialLinks = {
  instagram: 'https://instagram.com/manikyaservices',
  facebook:  'https://facebook.com/manikyaservices',
  youtube:   'https://youtube.com/@manikyaservices',
  linkedin:  'https://linkedin.com/company/manikyaservices',
};

/* ── Cycling Company Name (top label) ── */
const companyNames = [
  { name: 'Manikya Services', sub: 'Est. 2002 · Bengaluru', color: '#f59e0b' },
  { name: 'Manikya Money Service Pvt', sub: 'Financial Excellence · Since 2002', color: '#3b82f6' },
  { name: 'Manikya Services', sub: 'Media · Commerce · Finance · Wellness', color: '#ef4444' },
];
function CyclingCompanyName() {
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(p => (p + 1) % companyNames.length); setVis(true); }, 400);
    }, 3200);
    return () => clearInterval(t);
  }, []);
  const c = companyNames[idx];
  return (
    <div style={{ textAlign:'center', transition:'all 0.4s ease', opacity:vis?1:0, transform:vis?'translateY(0)':'translateY(-10px)' }}>
      <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.26em', textTransform:'uppercase', color:c.color, lineHeight:1.4, transition:'color 0.4s ease' }}>{c.name}</div>
      <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.6rem', fontWeight:400, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.38)', marginTop:3 }}>{c.sub}</div>
    </div>
  );
}



/* ── Hero Words: Growing (from left) & Together (from right) ── */
function HeroWords() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 150);
    const t2 = setTimeout(() => setStep(2), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  const fs = 'clamp(2rem,4vw,5.5rem)';
  return (
    <div style={{
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      gap:'clamp(0.5rem,3vw,4rem)',
      width:'100%',
      padding:'0 clamp(1rem,4vw,5rem)',
      zIndex:12,
      overflow:'hidden',
    }}>
      {/* GROWING — starts far LEFT, slides RIGHT to center */}
      <div style={{
        transform: step >= 1 ? 'translateX(0)' : 'translateX(-100vw)',
        opacity: step >= 1 ? 1 : 0,
        transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease',
        textAlign:'center',
      }}>
        <span style={{
          fontFamily:"'Playfair Display',Georgia,serif",
          fontSize: fs, fontWeight:800, color:'#ffffff',
          textShadow:'0 0 40px rgba(239,68,68,0.7), 0 2px 30px rgba(0,0,0,0.9)',
          letterSpacing:'-0.02em', display:'block', whiteSpace:'nowrap', lineHeight:1,
        }}>Growing</span>
        <span style={{
          display:'block', height:3, borderRadius:2, marginTop:6, margin:'6px auto 0',
          width: step >= 2 ? '100%' : '0%',
          background:'linear-gradient(90deg,#ef4444,#f59e0b)',
          transition:'width 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}/>
      </div>



      {/* TOGETHER — starts far RIGHT, slides LEFT to center */}
      <div style={{
        transform: step >= 1 ? 'translateX(0)' : 'translateX(100vw)',
        opacity: step >= 1 ? 1 : 0,
        transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1) 0.1s, opacity 0.4s ease 0.1s',
        textAlign:'center',
      }}>
        <span style={{
          fontFamily:"'Playfair Display',Georgia,serif",
          fontSize: fs, fontWeight:800, color:'#ffffff',
          textShadow:'0 0 40px rgba(255,255,255,0.4), 0 2px 30px rgba(0,0,0,0.9)',
          letterSpacing:'-0.02em', display:'block', whiteSpace:'nowrap', lineHeight:1,
        }}>Together</span>
        <span style={{
          display:'block', height:3, borderRadius:2, marginTop:6, margin:'6px auto 0',
          width: step >= 2 ? '100%' : '0%',
          background:'linear-gradient(90deg,#f59e0b,#fde68a)',
          transition:'width 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s',
        }}/>
      </div>
    </div>
  );
}

/* ── Hero Cycling Sectors ── */
const sectorData = [
  { label:'MEDIA',      color:'#ef4444', bg:'rgba(239,68,68,0.12)',      border:'rgba(239,68,68,0.4)',      icon:'📺' },
  { label:'E-COMMERCE', color:'#10b981', bg:'rgba(16,185,129,0.12)',     border:'rgba(16,185,129,0.4)',     icon:'🛒' },
  { label:'FINANCE',    color:'#8b5cf6', bg:'rgba(139,92,246,0.12)',     border:'rgba(139,92,246,0.4)',     icon:'💰' },
  { label:'TRADING',    color:'#f97316', bg:'rgba(249,115,22,0.12)',     border:'rgba(249,115,22,0.4)',     icon:'🏭' },
  { label:'REALTY',     color:'#f59e0b', bg:'rgba(245,158,11,0.12)',     border:'rgba(245,158,11,0.4)',     icon:'🏡' },
  { label:'HERITAGE',   color:'#a855f7', bg:'rgba(168,85,247,0.12)',     border:'rgba(168,85,247,0.4)',     icon:'🏛️' },
];
function HeroCyclingSectors() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % sectorData.length), 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'clamp(6px,1vw,12px)', flexWrap:'wrap', marginBottom:20 }}>
      {sectorData.map((s, i) => (
        <div key={s.label} style={{
          display:'inline-flex', alignItems:'center', gap:6,
          padding:'6px 14px',
          background: i === active ? s.bg : 'rgba(255,255,255,0.03)',
          border: `1px solid ${i === active ? s.border : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 50,
          transition: 'all 0.5s cubic-bezier(.16,1,.3,1)',
          transform: i === active ? 'scale(1.12) translateY(-2px)' : 'scale(1)',
          boxShadow: i === active ? `0 4px 20px ${s.bg}` : 'none',
          cursor: 'pointer',
        }}
        onClick={() => setActive(i)}>
          <span style={{ fontSize: i === active ? '1rem' : '0.75rem', transition:'font-size 0.4s' }}>{s.icon}</span>
          <span style={{
            fontFamily:'DM Sans,sans-serif',
            fontSize: 'clamp(0.6rem,0.85vw,0.75rem)',
            fontWeight: i === active ? 700 : 500,
            letterSpacing:'0.12em',
            color: i === active ? s.color : 'rgba(255,255,255,0.35)',
            textTransform:'uppercase',
            transition:'all 0.4s ease',
          }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [activeSvc, setActiveSvc]   = useState(0);
  const [mouse, setMouse]           = useState({x:0,y:0});
  const [showSocial, setShowSocial] = useState(false);
  const [introStep, setIntroStep]   = useState(0);
  // 0=logo only  1=content visible
  useEffect(() => {
    const t = setTimeout(() => setIntroStep(1), 3200);
    return () => clearTimeout(t);
  }, []);
  const s1=useInView(); const s2=useInView(); const s3=useInView(); const s4=useInView();

  const onMouseMove = useCallback((e:React.MouseEvent)=>{
    setMouse({ x:e.clientX-window.innerWidth/2, y:e.clientY-window.innerHeight/2 });
  },[]);

  return (
    <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", background:'#000', color:'#fff', overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes floatIcon{0%{transform:translateY(0) rotate(-5deg) scale(1)}100%{transform:translateY(-22px) rotate(5deg) scale(1.1)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.9)}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes rotateSlow{to{transform:rotate(360deg)}}
        @keyframes rotateRev{to{transform:rotate(-360deg)}}
        @keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
        @keyframes svcSlide{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}

        .loaded-1{animation:fadeUp 1.1s cubic-bezier(.16,1,.3,1) .2s both}
        .loaded-2{animation:fadeUp 1.1s cubic-bezier(.16,1,.3,1) .45s both}
        .loaded-3{animation:fadeUp 1s cubic-bezier(.16,1,.3,1) .65s both}
        .loaded-4{animation:fadeUp 1s cubic-bezier(.16,1,.3,1) .85s both}
        .loaded-5{animation:fadeUp 1s cubic-bezier(.16,1,.3,1) 1s both}

        .gold-text{background:linear-gradient(90deg,#f59e0b,#fde68a,#f59e0b);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite}
        .reveal{opacity:0;transform:translateY(40px);transition:all .9s cubic-bezier(.16,1,.3,1)}
        .reveal.on{opacity:1;transform:translateY(0)}
        .reveal-l{opacity:0;transform:translateX(-60px);transition:all .9s cubic-bezier(.16,1,.3,1)}
        .reveal-l.on{opacity:1;transform:translateX(0)}
        .reveal-r{opacity:0;transform:translateX(60px);transition:all .9s cubic-bezier(.16,1,.3,1)}
        .reveal-r.on{opacity:1;transform:translateX(0)}

        .svc-item{transition:all .35s ease;border-left:1px solid rgba(255,255,255,0.08);cursor:pointer}
        .svc-item:hover,.svc-item.act{border-left-color:#f59e0b}
        .svc-detail{animation:svcSlide .4s cubic-bezier(.16,1,.3,1)}
        .btn-inf{position:relative;overflow:hidden;transition:all .3s ease;cursor:pointer;text-decoration:none}
        .btn-inf:hover{transform:translateY(-2px)}
        .btn-inf::before{content:'';position:absolute;inset:0;background:rgba(255,255,255,0.08);opacity:0;transition:.3s}
        .btn-inf:hover::before{opacity:1}
        .social-link{transition:all .3s;text-decoration:none;display:flex;align-items:center;justify-content:center}
        .social-link:hover{transform:translateY(-4px) scale(1.15)}
        .scroll-cue{animation:scrollBounce 2s ease-in-out infinite}
        @keyframes scrollBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}
        .marquee-track{display:flex;gap:48px;animation:marquee 20s linear infinite;white-space:nowrap}
        .social-modal{animation:scaleIn .3s ease}
        .why-card{transition:all .35s ease}
        .why-card:hover{transform:translateY(-5px)}
        @media(max-width:768px){
          .grid-2{grid-template-columns:1fr!important}
          .stats-grid{grid-template-columns:repeat(2,1fr)!important}
          .why-grid{grid-template-columns:1fr!important}
          .svc-layout{grid-template-columns:1fr!important}
        }
        @media(max-width:480px){
          .stats-grid{grid-template-columns:repeat(2,1fr)!important}
        }}

        /* ── HERO ANIMATIONS ── */
        @keyframes heroFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes starTwinkle{0%,100%{opacity:0.08;transform:scale(0.8)}50%{opacity:0.75;transform:scale(1.4)}}
        @keyframes logoEntrance{0%{opacity:0;transform:scale(0.75) translateY(20px)}100%{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes logoFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes globePulse{0%,100%{box-shadow:0 0 22px 8px rgba(59,130,246,0.85),0 0 55px 22px rgba(59,130,246,0.35)}50%{box-shadow:0 0 38px 14px rgba(96,165,250,1),0 0 90px 38px rgba(59,130,246,0.55)}}
        @keyframes platformGlow{0%,100%{opacity:0.65}50%{opacity:1}}
        @keyframes swooshDraw{from{stroke-dashoffset:1100}to{stroke-dashoffset:0}}
        @keyframes slideFromLeft{
          0%{opacity:0;transform:translateX(-120vw) skewX(-8deg)}
          70%{opacity:1;transform:translateX(8px) skewX(2deg)}
          85%{transform:translateX(-4px) skewX(-1deg)}
          100%{opacity:1;transform:translateX(0) skewX(0)}
        }
        @keyframes slideFromRight{
          0%{opacity:0;transform:translateX(120vw) skewX(8deg)}
          70%{opacity:1;transform:translateX(-8px) skewX(-2deg)}
          85%{transform:translateX(4px) skewX(1deg)}
          100%{opacity:1;transform:translateX(0) skewX(0)}
        }
        @keyframes fadeUpSub{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes textGlow{0%,100%{text-shadow:0 0 20px rgba(255,255,255,0.3)}50%{text-shadow:0 0 40px rgba(255,255,255,0.7),0 0 80px rgba(99,102,241,0.4)}}
        @keyframes sectorPop{0%{opacity:0;transform:translateY(12px) scale(0.9)}100%{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes btnShine{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes pulseRing{0%{box-shadow:0 0 0 0 rgba(245,158,11,0.5)}70%{box-shadow:0 0 0 12px rgba(245,158,11,0)}100%{box-shadow:0 0 0 0 rgba(245,158,11,0)}}

        @keyframes logoIntroGlow{
          0%  {opacity:0;filter:brightness(0) drop-shadow(0 0 0px transparent)}
          8%  {opacity:1;filter:brightness(0.4) drop-shadow(0 0 30px rgba(59,130,246,0.4))}
          25% {opacity:1;filter:brightness(1.8) drop-shadow(0 0 120px rgba(59,130,246,1)) drop-shadow(0 0 200px rgba(239,68,68,0.9)) drop-shadow(0 0 60px #fff) saturate(1.5)}
          45% {opacity:1;filter:brightness(2.5) drop-shadow(0 0 160px rgba(239,68,68,1)) drop-shadow(0 0 240px rgba(59,130,246,1)) saturate(2)}
          65% {opacity:1;filter:brightness(1.6) drop-shadow(0 0 100px rgba(59,130,246,0.8)) drop-shadow(0 0 140px rgba(239,68,68,0.7)) saturate(1.3)}
          82% {opacity:1;filter:brightness(1.2) drop-shadow(0 0 60px rgba(59,130,246,0.5)) drop-shadow(0 0 80px rgba(239,68,68,0.4))}
          100%{opacity:1;filter:brightness(1.1) drop-shadow(0 0 50px rgba(220,38,38,0.8)) drop-shadow(0 0 100px rgba(29,78,216,0.7))}
        }
        @keyframes introDarkOverlay{
          0%  {opacity:1}
          70% {opacity:1}
          100%{opacity:0}
        }
        @keyframes contentReveal{
          0%  {opacity:0;transform:translateY(18px)}
          100%{opacity:1;transform:translateY(0)}
        }
        @keyframes wordSlideLeft{
          0%  {opacity:0;transform:translateX(-100vw)}
          100%{opacity:1;transform:translateX(0)}
        }
        @keyframes wordSlideRight{
          0%  {opacity:0;transform:translateX(100vw)}
          100%{opacity:1;transform:translateX(0)}
        }
        @keyframes underlineDraw{
          0%  {width:0%}
          100%{width:100%}
        }
        .hero-section{animation:heroFadeIn 0.9s ease both}
        .logo-entrance{animation:logoEntrance 1.1s cubic-bezier(.16,1,.3,1) 0.1s both}
        .logo-float{animation:logoFloat 7s ease-in-out infinite}
        .globe-pulse{animation:globePulse 2.6s ease-in-out infinite}
        .platform-ring{animation:platformGlow 3s ease-in-out infinite}
        .swoosh-draw{stroke-dasharray:1100;animation:swooshDraw 1.6s cubic-bezier(.16,1,.3,1) 0.5s both}
        .hero-sub{animation:fadeUpSub 1s cubic-bezier(.16,1,.3,1) 1s both}
        .hero-btns{animation:fadeUpSub 1s cubic-bezier(.16,1,.3,1) 1.3s both}

        /* Growing | LOGO | Together — logo tall, words at its lower-center */
        .hero-main-row{
          display:flex;
          align-items:flex-end;
          justify-content:center;
          width:100%;
          padding:0 clamp(0.5rem,3vw,2rem);
          gap:0;
        }
        .hero-growing{
          flex:1;
          text-align:right;
          padding-right:clamp(0.8rem,2.5vw,2.5rem);
          padding-bottom:clamp(0.6rem,1.5vw,1.2rem);
          font-family:'Cormorant Garamond',Georgia,serif;
          font-size:clamp(1.6rem,3.2vw,4rem);
          font-weight:700;
          line-height:1;
          letter-spacing:-0.02em;
          color:#ffffff;
          white-space:nowrap;
          animation:slideFromLeft 1.1s cubic-bezier(.16,1,.3,1) 0.2s both;
        }
        .hero-logo-col{
          flex-shrink:0;
          width:clamp(220px,32vw,420px);
          display:flex;
          align-items:center;
          justify-content:center;
        }
        .hero-together{
          flex:1;
          text-align:left;
          padding-left:clamp(0.8rem,2.5vw,2.5rem);
          padding-bottom:clamp(0.6rem,1.5vw,1.2rem);
          font-family:'Cormorant Garamond',Georgia,serif;
          font-size:clamp(1.6rem,3.2vw,4rem);
          font-weight:700;
          line-height:1;
          letter-spacing:-0.02em;
          background:linear-gradient(90deg,#f59e0b,#fde68a 40%,#f59e0b);
          background-size:200% auto;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          white-space:nowrap;
          animation:slideFromRight 1.1s cubic-bezier(.16,1,.3,1) 0.2s both, shimmer 5s linear 1.4s infinite;
        }
        @media(max-width:680px){
          .hero-main-row{flex-direction:column;align-items:center;gap:0.5rem}
          .hero-growing{text-align:center;padding-right:0;padding-bottom:0}
          .hero-together{text-align:center;padding-left:0;padding-bottom:0}
          .hero-logo-col{width:clamp(200px,70vw,320px);order:-1;margin-bottom:0.5rem}
        }
      `}</style>

      {/* ── SOCIAL MODAL ── */}
      {showSocial && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center' }} onClick={()=>setShowSocial(false)}>
          <div className="social-modal" style={{ background:'white',borderRadius:16,padding:'2rem',width:'90%',maxWidth:420,position:'relative' }} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setShowSocial(false)} style={{ position:'absolute',top:12,right:12,background:'#f1f5f9',border:'none',borderRadius:'50%',width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer' }}>
              <X size={15}/>
            </button>
            <h3 style={{ fontSize:'1.3rem',fontWeight:700,color:'#0f172a',marginBottom:4 }}>Follow Manikya</h3>
            <p style={{ fontFamily:'DM Sans,sans-serif',color:'#64748b',fontSize:'0.85rem',marginBottom:22 }}>Connect with us on social media</p>
            <div style={{ display:'flex',gap:14,justifyContent:'center',marginBottom:22 }}>
              {[
                {icon:<Instagram size={24}/>, href:socialLinks.instagram, color:'#e1306c'},
                {icon:<Facebook size={24}/>,  href:socialLinks.facebook,  color:'#1877f2'},
                {icon:<Youtube size={24}/>,   href:socialLinks.youtube,   color:'#ff0000'},
                {icon:<Linkedin size={24}/>,  href:socialLinks.linkedin,  color:'#0a66c2'},
              ].map((s,i)=>(
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="social-link"
                  style={{ width:52,height:52,borderRadius:'50%',background:s.color+'12',border:`2px solid ${s.color}30`,color:s.color }}>
                  {s.icon}
                </a>
              ))}
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
              {[
                {icon:<Instagram size={15}/>,label:'Instagram', href:socialLinks.instagram, color:'#e1306c'},
                {icon:<Facebook size={15}/>, label:'Facebook',  href:socialLinks.facebook,  color:'#1877f2'},
                {icon:<Youtube size={15}/>,  label:'YouTube',   href:socialLinks.youtube,   color:'#ff0000'},
                {icon:<Linkedin size={15}/>, label:'LinkedIn',  href:socialLinks.linkedin,  color:'#0a66c2'},
              ].map((s,i)=>(
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex',alignItems:'center',gap:12,padding:'10px 14px',borderRadius:10,background:'#f8fafc',textDecoration:'none',color:'#0f172a',fontFamily:'DM Sans,sans-serif',fontSize:'0.85rem',fontWeight:500,transition:'background .2s' }}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=s.color+'10'}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='#f8fafc'}>
                  <span style={{ color:s.color }}>{s.icon}</span>{s.label}
                  <ExternalLink size={12} style={{ marginLeft:'auto',color:'#94a3b8' }}/>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── NEWSJUNCTION DASHBOARD BAR ── */}
      <a href="https://newsjunction.net/dashboard.php" target="_blank" rel="noopener noreferrer"
        style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px clamp(1rem,3vw,4rem)',background:'linear-gradient(135deg,#7f1d1d,#991b1b)',textDecoration:'none',flexWrap:'wrap',gap:10,position:'relative',zIndex:100 }}>
        <div style={{ display:'flex',alignItems:'center',gap:12 }}>
          <div style={{ display:'flex',alignItems:'center',gap:6,padding:'3px 10px',background:'#ef4444',borderRadius:20 }}>
            <span style={{ width:6,height:6,borderRadius:'50%',background:'white',display:'inline-block',animation:'pulse .9s ease-in-out infinite' }}/>
            <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'white',letterSpacing:'0.15em',textTransform:'uppercase' }}>Live</span>
          </div>
          <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.82rem',fontWeight:600,color:'rgba(255,255,255,0.9)' }}>NewsJunction Dashboard — Kannada · Hindi · Telugu · English · Marathi</span>
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:8,padding:'5px 14px',background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:4 }}>
          <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.72rem',fontWeight:600,color:'white',textTransform:'uppercase',letterSpacing:'0.08em' }}>Open Dashboard</span>
          <ExternalLink size={12} color="white"/>
        </div>
      </a>

      {/* ── HERO ── */}
      <section className="hero-section" style={{
        position:'relative', height:'100vh', minHeight:700,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        background:'radial-gradient(ellipse 130% 90% at 50% 0%, #050e24 0%, #060f26 40%, #030918 75%, #010710 100%)',
        overflow:'hidden',
      }} onMouseMove={onMouseMove}>

        {/* ── Stars ── */}
        {Array.from({length:90}).map((_,i)=>{
          const x=(i*137.5)%100, y=(i*97.3)%100, s=0.5+(i%4)*0.5;
          return <div key={i} style={{ position:'absolute',left:`${x}%`,top:`${y}%`,width:s,height:s,borderRadius:'50%',background:'white',animation:`starTwinkle ${2+(i%4)*0.7}s ease-in-out ${(i*0.21)%5}s infinite`,pointerEvents:'none' }}/>;
        })}

        {/* ── Atmospheric glows ── */}
        <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse 55% 65% at 18% 55%, rgba(200,30,30,0.26) 0%, transparent 65%)',pointerEvents:'none' }}/>
        <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse 55% 65% at 82% 55%, rgba(29,78,216,0.30) 0%, transparent 65%)',pointerEvents:'none' }}/>
        <div style={{ position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 60%,#010710 100%)',pointerEvents:'none' }}/>

        {/* ── DARK OVERLAY — hides content during logo intro ── */}
        {introStep === 0 && (
          <div style={{
            position:'absolute', inset:0, zIndex:50,
            background:'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(2,8,20,0.2) 0%, rgba(1,4,12,0.98) 100%)',
            pointerEvents:'none',
            animation:'introDarkOverlay 3.2s ease forwards',
          }}/>
        )}

        {/* ══ ALL HERO CONTENT ══ */}
        <div style={{
          position:'relative', zIndex:10,
          width:'100%', height:'100%',
          display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center',
          gap:0, padding:'clamp(1rem,2vh,2rem) 1rem',
          boxSizing:'border-box',
        }}>

          {/* ── Logo — blazes bright on intro, settles after ── */}
          <div className="hero-logo-col" style={{ margin:'0 auto', flexShrink:0 }}>
            <img
              src="/manikya-logo-transparent.png"
              alt="Manikya Services Logo"
              style={{
                width:'100%', height:'auto', display:'block',
                animation:'logoIntroGlow 3.2s cubic-bezier(0.16,1,0.3,1) 0.1s both',
              }}
            />
          </div>

          {/* ── Growing | Together — appears after intro ── */}
          <div style={{
            width:'100%', flexShrink:0, marginTop:'-0.5rem',
            opacity: introStep >= 1 ? 1 : 0,
            transition:'opacity 0.6s ease',
          }}>
            {introStep >= 1 && <HeroWords />}
          </div>

          {/* ── Subtitle ── */}
          <p style={{
            fontFamily:'DM Sans,sans-serif', fontSize:'clamp(0.78rem,1.2vw,0.92rem)',
            color:'rgba(255,255,255,0.45)', fontWeight:300, textAlign:'center',
            margin:'10px 0 8px', lineHeight:1.5, flexShrink:0,
            opacity: introStep >= 1 ? 1 : 0,
            transform: introStep >= 1 ? 'translateY(0)' : 'translateY(20px)',
            transition:'opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s',
          }}>
            A multi-sector enterprise driving innovation across
          </p>

          {/* ── Cycling sector badges ── */}
          <div style={{
            flexShrink:0, width:'100%',
            opacity: introStep >= 1 ? 1 : 0,
            transform: introStep >= 1 ? 'translateY(0)' : 'translateY(20px)',
            transition:'opacity 0.7s ease 0.55s, transform 0.7s ease 0.55s',
          }}>
            <HeroCyclingSectors />
          </div>

          {/* ── Buttons ── */}
          <div style={{
            display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', flexShrink:0, marginTop:4,
            opacity: introStep >= 1 ? 1 : 0,
            transform: introStep >= 1 ? 'translateY(0)' : 'translateY(20px)',
            transition:'opacity 0.7s ease 0.7s, transform 0.7s ease 0.7s',
          }}>
            <Link to="/services" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'12px 30px',
              background:'linear-gradient(135deg,#ef4444,#f59e0b)',
              color:'white', fontFamily:'DM Sans,sans-serif', fontWeight:700,
              fontSize:'0.88rem', letterSpacing:'0.05em',
              border:'none', borderRadius:50,
              boxShadow:'0 4px 24px rgba(245,158,11,0.4)',
              textDecoration:'none', transition:'all 0.3s ease',
            }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-2px) scale(1.04)';(e.currentTarget as HTMLElement).style.boxShadow='0 8px 36px rgba(245,158,11,0.6)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='none';(e.currentTarget as HTMLElement).style.boxShadow='0 4px 24px rgba(245,158,11,0.4)'}}>
              <Sparkles size={15}/> Explore Services <ArrowRight size={14}/>
            </Link>
            <Link to="/about" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'12px 30px',
              background:'rgba(255,255,255,0.07)',
              color:'rgba(255,255,255,0.85)', fontFamily:'DM Sans,sans-serif',
              fontWeight:600, fontSize:'0.88rem',
              border:'1.5px solid rgba(255,255,255,0.25)', borderRadius:50,
              backdropFilter:'blur(10px)', textDecoration:'none', transition:'all 0.3s ease',
            }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-2px)';(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.14)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='none';(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.07)'}}>
              Learn More
            </Link>
          </div>

          {/* ── Scroll cue ── */}
          <div style={{
            marginTop:'auto', paddingTop:12,
            display:'flex', flexDirection:'column', alignItems:'center', gap:5, flexShrink:0,
            opacity: introStep >= 1 ? 1 : 0,
            transition:'opacity 1s ease 1s',
          }}>
            <div style={{ width:22,height:36,borderRadius:11,border:'1.5px solid rgba(255,255,255,0.2)',display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'4px 0' }}>
              <div className="scroll-cue" style={{ width:3,height:3,borderRadius:'50%',background:'rgba(255,255,255,0.5)' }}/>
            </div>
            <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.48rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,255,255,0.2)' }}>SCROLL</span>
          </div>

        </div>
      </section>

            {/* ── SOCIAL MEDIA MARQUEE (replaces old service text bar) ── */}
      <section style={{ background:'#0f172a',padding:'0',overflow:'hidden',borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 clamp(1rem,3vw,3rem)' }}>
          <div style={{ display:'flex',overflow:'hidden',flex:1,padding:'11px 0' }}>
            <div className="marquee-track">
              {[...Array(2)].map((_,r)=>[
                { icon:<Instagram size={14}/>, label:'@ManikyaServices', color:'#e1306c', href:socialLinks.instagram },
                { icon:null, label:'•', color:'rgba(255,255,255,0.2)', href:'' },
                { icon:<Facebook size={14}/>,  label:'Manikya Services', color:'#1877f2', href:socialLinks.facebook },
                { icon:null, label:'•', color:'rgba(255,255,255,0.2)', href:'' },
                { icon:<Youtube size={14}/>,   label:'Manikya YouTube',  color:'#ff0000', href:socialLinks.youtube },
                { icon:null, label:'•', color:'rgba(255,255,255,0.2)', href:'' },
                { icon:<Linkedin size={14}/>,  label:'Manikya LinkedIn', color:'#0a66c2', href:socialLinks.linkedin },
                { icon:null, label:'•', color:'rgba(255,255,255,0.2)', href:'' },
              ].map((item,i)=>(
                item.href
                  ? <a key={`${r}-${i}`} href={item.href} target="_blank" rel="noopener noreferrer"
                      style={{ display:'inline-flex',alignItems:'center',gap:6,flexShrink:0,color:item.color,fontFamily:'DM Sans,sans-serif',fontWeight:600,fontSize:'0.75rem',letterSpacing:'0.08em',textDecoration:'none',transition:'opacity .3s' }}
                      onMouseEnter={e=>(e.currentTarget as HTMLElement).style.opacity='.7'}
                      onMouseLeave={e=>(e.currentTarget as HTMLElement).style.opacity='1'}>
                      {item.icon} {item.label}
                    </a>
                  : <span key={`${r}-${i}`} style={{ flexShrink:0,color:item.color,fontFamily:'DM Sans,sans-serif',fontSize:'0.75rem' }}>{item.label}</span>
              )))}
            </div>
          </div>
          <button onClick={()=>setShowSocial(true)} style={{ flexShrink:0,marginLeft:16,display:'flex',alignItems:'center',gap:6,padding:'6px 14px',background:'rgba(245,158,11,0.12)',border:'1px solid rgba(245,158,11,0.3)',color:'#f59e0b',fontFamily:'DM Sans,sans-serif',fontSize:'0.7rem',fontWeight:600,cursor:'pointer',letterSpacing:'0.1em',textTransform:'uppercase',borderRadius:4 }}>
            Follow Us
          </button>
        </div>
      </section>

      {/* ── SERVICES LIST ── */}
      <section style={{ background:'#050505',padding:'clamp(4rem,8vw,8rem) 0' }} ref={s1.ref}>
        <div style={{ maxWidth:1400,margin:'0 auto',padding:'0 clamp(1.5rem,5vw,5rem)' }}>
          <div className={`reveal ${s1.v?'on':''}`} style={{ display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:52,flexWrap:'wrap',gap:16 }}>
            <div>
              <p style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.72rem',fontWeight:600,letterSpacing:'0.25em',textTransform:'uppercase',color:'#f59e0b',marginBottom:12 }}>What We Do</p>
              <h2 style={{ fontSize:'clamp(2.5rem,5vw,4.5rem)',fontWeight:700,lineHeight:1.05,color:'white',margin:0 }}>Seven Verticals.<br/>One Vision.</h2>
            </div>
            <Link to="/services" style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.85rem',fontWeight:500,color:'#f59e0b',textDecoration:'none',display:'flex',alignItems:'center',gap:8,borderBottom:'1px solid #f59e0b',paddingBottom:2 }}>
              View All Services <ArrowRight size={14}/>
            </Link>
          </div>

          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:2 }} className="grid-2">
            {/* Left — list */}
            <div>
              {services.map((sv,i)=>(
                <div key={sv.id} className={`svc-item ${activeSvc===i?'act':''}`} onClick={()=>setActiveSvc(i)}>
                  <div style={{ padding:'22px 26px',display:'flex',alignItems:'center',gap:18,borderBottom:'1px solid rgba(255,255,255,0.04)',background:activeSvc===i?'rgba(245,158,11,0.04)':'transparent',transition:'background .3s' }}>
                    <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.7rem',color:sv.color,fontWeight:700,letterSpacing:'0.1em',minWidth:26 }}>{sv.num}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700,color:activeSvc===i?'#f59e0b':'white',fontSize:'1.1rem',transition:'color .3s' }}>{sv.title}</div>
                      <div style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.78rem',color:'rgba(255,255,255,0.35)',marginTop:2 }}>{sv.sub}</div>
                    </div>
                    {sv.soon&&<span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.6rem',background:'#8b5cf620',border:'1px solid #8b5cf650',color:'#8b5cf6',padding:'2px 8px',borderRadius:20 }}>Soon</span>}
                    <ArrowRight size={15} style={{ color:activeSvc===i?'#f59e0b':'rgba(255,255,255,0.15)',transition:'color .3s,transform .3s',transform:activeSvc===i?'none':'translateX(-4px)' }}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — detail */}
            <div style={{ background:'#0a0a0a',position:'relative',overflow:'hidden',minHeight:420 }}>
              <div key={activeSvc} className="svc-detail" style={{ padding:'3rem',height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between' }}>
                <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:services[activeSvc].color }}/>
                <div style={{ position:'absolute',top:0,right:0,bottom:0,width:220,background:`radial-gradient(circle at right,${services[activeSvc].color}08,transparent)` }}/>
                <div style={{ position:'relative',zIndex:1 }}>
                  <span style={{ display:'inline-block',fontFamily:'DM Sans,sans-serif',fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:services[activeSvc].color,marginBottom:16,padding:'4px 12px',border:`1px solid ${services[activeSvc].color}30`,borderRadius:20 }}>
                    {services[activeSvc].sub}
                  </span>
                  <h3 style={{ fontSize:'clamp(1.8rem,3vw,3rem)',fontWeight:700,color:'white',lineHeight:1.1,marginBottom:18 }}>{services[activeSvc].title}</h3>
                  <p style={{ fontFamily:'DM Sans,sans-serif',color:'rgba(255,255,255,0.55)',lineHeight:1.8,fontSize:'1rem',marginBottom:28 }}>{services[activeSvc].desc}</p>
                  <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
                    {services[activeSvc].soon ? (
                      <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.82rem',color:'#8b5cf6',border:'1px solid #8b5cf640',padding:'10px 22px' }}>Coming Soon</span>
                    ) : (
                      <>
                        <Link to={services[activeSvc].link} className="btn-inf" style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'11px 22px',background:services[activeSvc].color,color:'#000',fontFamily:'DM Sans,sans-serif',fontWeight:600,fontSize:'0.82rem',textTransform:'uppercase',letterSpacing:'0.05em' }}>
                          Learn More <ArrowRight size={13}/>
                        </Link>
                        {services[activeSvc].ext&&(
                          <a href={services[activeSvc].ext} target="_blank" rel="noopener noreferrer" className="btn-inf" style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'11px 22px',border:`1px solid ${services[activeSvc].color}50`,color:services[activeSvc].color,fontFamily:'DM Sans,sans-serif',fontWeight:600,fontSize:'0.82rem',textDecoration:'none' }}>
                            Watch Live <ExternalLink size={13}/>
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div style={{ position:'absolute',bottom:-10,right:20,fontSize:'8rem',fontWeight:700,color:'rgba(255,255,255,0.025)',lineHeight:1,userSelect:'none' }}>{services[activeSvc].num}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background:'#f59e0b',padding:'clamp(3rem,5vw,5rem) 0' }} ref={s2.ref}>
        <div style={{ maxWidth:1400,margin:'0 auto',padding:'0 clamp(1.5rem,5vw,5rem)' }}>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:2 }}>
            {stats.map((st,i)=>(
              <div key={i} className={`reveal ${s2.v?'on':''}`} style={{ transitionDelay:`${i*100}ms`,padding:'2.5rem 2rem',borderRight:i<3?'1px solid rgba(0,0,0,0.1)':'none' }}>
                <div style={{ fontSize:'clamp(2.8rem,5vw,5rem)',fontWeight:700,color:'#000',lineHeight:1,fontFamily:"'Cormorant Garamond',serif" }}>
                  <Counter end={st.value} suffix={st.suffix}/>
                </div>
                <div style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.78rem',fontWeight:500,color:'rgba(0,0,0,0.55)',letterSpacing:'0.15em',textTransform:'uppercase',marginTop:6 }}>{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIKYA MONEY SERVICE FEATURE ── */}
      <section style={{ background:'linear-gradient(135deg,#06020f,#0a0520,#0f0a2a)',padding:'clamp(4rem,8vw,8rem) 0',position:'relative',overflow:'hidden' }} ref={s3.ref}>
        <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse at 40% 50%,rgba(139,92,246,0.1),transparent 60%)' }}/>
        <div style={{ maxWidth:1400,margin:'0 auto',padding:'0 clamp(1.5rem,5vw,5rem)',position:'relative',zIndex:1 }}>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:70,alignItems:'center' }} className="grid-2">
            <div className={`reveal-l ${s3.v?'on':''}`}>
              <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:18 }}>
                <div style={{ width:28,height:1,background:'#8b5cf6' }}/>
                <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.22em',textTransform:'uppercase',color:'#8b5cf6' }}>New Vertical · Financial Services</span>
              </div>
              <h2 style={{ fontSize:'clamp(2.2rem,4vw,4rem)',fontWeight:700,lineHeight:1.05,color:'white',marginBottom:20 }}>
                Manikya<br/><span style={{ background:'linear-gradient(90deg,#8b5cf6,#c4b5fd,#8b5cf6)',backgroundSize:'200% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',animation:'shimmer 4s linear infinite' }}>Money Service</span>
              </h2>
              <p style={{ fontFamily:'DM Sans,sans-serif',color:'rgba(255,255,255,0.55)',fontSize:'1.05rem',lineHeight:1.85,marginBottom:28,fontWeight:300 }}>
                <strong style={{ color:'white' }}>Empowering Your Financial Future</strong> with Trust and Transparency. Accessible, affordable financial services for every segment of Indian society through a seamless digital experience.
              </p>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:28 }}>
                {[['⚡','Speedy Approvals','24–48 hour processing'],['💰','Low Interest Rates','Competitive & transparent'],['✅','No Hidden Charges','What you see is what you get'],['📄','Minimal Docs','Digital-friendly process']].map(([icon,t,s])=>(
                  <div key={t} style={{ padding:'16px',border:'1px solid rgba(139,92,246,0.2)',background:'rgba(139,92,246,0.04)' }}>
                    <div style={{ fontSize:'1.4rem',marginBottom:6 }}>{icon}</div>
                    <div style={{ fontWeight:700,color:'white',fontSize:'0.9rem',marginBottom:2 }}>{t}</div>
                    <div style={{ fontFamily:'DM Sans,sans-serif',color:'rgba(255,255,255,0.35)',fontSize:'0.78rem' }}>{s}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
                <Link to="/contact" className="btn-inf" style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'13px 26px',background:'#8b5cf6',color:'white',fontFamily:'DM Sans,sans-serif',fontWeight:600,fontSize:'0.85rem',textTransform:'uppercase',letterSpacing:'0.05em' }}>
                  Apply for a Loan <ArrowRight size={14}/>
                </Link>
                <Link to="/services" className="btn-inf" style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'13px 24px',border:'1px solid rgba(139,92,246,0.4)',color:'#8b5cf6',fontFamily:'DM Sans,sans-serif',fontWeight:600,fontSize:'0.85rem' }}>
                  Contact Us
                </Link>
              </div>
            </div>
            <div className={`reveal-r ${s3.v?'on':''}`}>
              <div style={{ background:'rgba(139,92,246,0.06)',border:'1px solid rgba(139,92,246,0.15)',padding:'2.5rem' }}>
                <div style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.68rem',fontWeight:700,color:'#8b5cf6',textTransform:'uppercase',letterSpacing:'0.18em',marginBottom:20 }}>Our Core Values</div>
                {[['🏅','Integrity','We uphold the highest standards of honesty in all our actions.'],['🌟','Excellence','Striving to deliver the best possible service to every client.'],['📊','Accountability','We take responsibility for our commitments and results.'],['💡','Innovation','Constantly improving our processes to serve you better.']].map(([icon,t,d])=>(
                  <div key={t} style={{ display:'flex',gap:16,padding:'16px 0',borderBottom:'1px solid rgba(255,255,255,0.05)',alignItems:'flex-start' }}>
                    <span style={{ fontSize:'1.4rem',flexShrink:0 }}>{icon}</span>
                    <div>
                      <div style={{ fontWeight:700,color:'white',marginBottom:4 }}>{t}</div>
                      <div style={{ fontFamily:'DM Sans,sans-serif',color:'rgba(255,255,255,0.4)',fontSize:'0.85rem',lineHeight:1.65 }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY MANIKYA ── */}
      <section style={{ background:'#fff',padding:'clamp(4rem,8vw,8rem) 0',color:'#000' }} ref={s4.ref}>
        <div style={{ maxWidth:1400,margin:'0 auto',padding:'0 clamp(1.5rem,5vw,5rem)' }}>
          <div className={`reveal ${s4.v?'on':''}`} style={{ textAlign:'center',marginBottom:64 }}>
            <p style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.72rem',fontWeight:600,letterSpacing:'0.25em',textTransform:'uppercase',color:'#f59e0b',marginBottom:14 }}>Why Manikya</p>
            <h2 style={{ fontSize:'clamp(2.5rem,5vw,4.5rem)',fontWeight:700,lineHeight:1.05,color:'#000',margin:0 }}>Built on Trust.<br/>Driven by Purpose.</h2>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:2 }}>
            {[
              {n:'01',t:'Circular Synergy',d:'Each of our 7 verticals feeds and strengthens the others — media drives commerce, farms attract investors, finance enables growth.',col:'#ef4444'},
              {n:'02',t:'24+ Years Excellence',d:'Two decades of journalistic integrity, entrepreneurial grit, and community empowerment — building trust one venture at a time since 2002.',col:'#3b82f6'},
              {n:'03',t:'Rural Empowerment',d:'Every product, every farm, every story — rooted in the empowerment of Indian farmers, artisans, women entrepreneurs, and local communities.',col:'#10b981'},
              {n:'04',t:'Tech + Tradition',d:'We blend modern technology with ancient wisdom — digital media meets pearl farming, Ayurveda meets e-commerce, fintech meets community banking.',col:'#f59e0b'},
              {n:'05',t:'Financial Inclusion',d:'Manikya Money Service ensures everyone has access to quick capital with speedy approvals, low rates, and zero hidden charges.',col:'#8b5cf6'},
              {n:'06',t:'Bengaluru to Bharat',d:'Headquartered in Bengaluru, our operations and impact span Karnataka and all of India — local roots, national ambitions.',col:'#22c55e'},
            ].map((item,i)=>(
              <div key={i} className={`why-card reveal ${s4.v?'on':''}`} style={{ transitionDelay:`${i*80}ms`,padding:'2.5rem 2rem',border:'1px solid #f0f0f0',position:'relative',overflow:'hidden' }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=item.col+'06';(e.currentTarget as HTMLElement).style.borderColor=item.col+'30';}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='white';(e.currentTarget as HTMLElement).style.borderColor='#f0f0f0';}}>
                <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.68rem',fontWeight:700,color:item.col,letterSpacing:'0.2em' }}>{item.n}</span>
                <div style={{ width:28,height:2,background:item.col,margin:'10px 0 14px' }}/>
                <h3 style={{ fontSize:'1.2rem',fontWeight:700,color:'#0f172a',marginBottom:10 }}>{item.t}</h3>
                <p style={{ fontFamily:'DM Sans,sans-serif',color:'#64748b',lineHeight:1.75,fontSize:'0.9rem',margin:0 }}>{item.d}</p>
                <div style={{ position:'absolute',bottom:-20,right:-10,fontSize:'6rem',fontWeight:700,color:item.col+'05',lineHeight:1 }}>{item.n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:'#000',padding:'clamp(5rem,10vw,10rem) 0',textAlign:'center',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(59,130,246,0.06),transparent 70%)',pointerEvents:'none' }}/>
        <div style={{ maxWidth:800,margin:'0 auto',padding:'0 clamp(1.5rem,5vw,5rem)',position:'relative',zIndex:1 }}>
          <p style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.72rem',fontWeight:600,letterSpacing:'0.25em',textTransform:'uppercase',color:'#f59e0b',marginBottom:24 }}>Partner With Us</p>
          <h2 style={{ fontSize:'clamp(2.5rem,6vw,6rem)',fontWeight:700,lineHeight:1.0,color:'white',marginBottom:24 }}>
            Ready to grow<br/><span className="gold-text">together?</span>
          </h2>
          <p style={{ fontFamily:'DM Sans,sans-serif',color:'rgba(255,255,255,0.4)',fontSize:'1.05rem',lineHeight:1.8,marginBottom:44,fontWeight:300 }}>
            Join 500+ partners and investors who have chosen Manikya as their growth partner across media, farming, commerce, wellness, real estate, and financial services.
          </p>
          <div style={{ display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap',marginBottom:36 }}>
            <Link to="/contact" className="btn-inf" style={{ display:'inline-flex',alignItems:'center',gap:10,padding:'17px 40px',background:'#f59e0b',color:'#000',fontFamily:'DM Sans,sans-serif',fontWeight:700,fontSize:'0.88rem',letterSpacing:'0.08em',textTransform:'uppercase' }}>
              Contact Us <ArrowRight size={15}/>
            </Link>
            <Link to="/about" className="btn-inf" style={{ display:'inline-flex',alignItems:'center',gap:10,padding:'17px 40px',border:'1px solid rgba(255,255,255,0.22)',color:'white',fontFamily:'DM Sans,sans-serif',fontWeight:600,fontSize:'0.88rem',textTransform:'uppercase' }}>
              About Us
            </Link>
          </div>
          {/* Social icons in CTA */}
          <div style={{ display:'flex',gap:16,justifyContent:'center' }}>
            {[
              {icon:<Instagram size={20}/>,href:socialLinks.instagram,color:'#e1306c'},
              {icon:<Facebook size={20}/>, href:socialLinks.facebook, color:'#1877f2'},
              {icon:<Youtube size={20}/>,  href:socialLinks.youtube,  color:'#ff0000'},
              {icon:<Linkedin size={20}/>, href:socialLinks.linkedin, color:'#0a66c2'},
              {icon:<MapPin size={20}/>,   href:'https://maps.google.com/?q=Old+Airport+Road+HAL+Kodihalli+Bengaluru', color:'#34a853'},
            ].map((s,i)=>(
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="social-link"
                style={{ width:44,height:44,borderRadius:'50%',background:s.color+'10',border:`1px solid ${s.color}25`,color:s.color }}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
