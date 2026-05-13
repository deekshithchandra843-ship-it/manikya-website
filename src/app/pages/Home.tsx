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
  { text:'Wellness',    color:'#22c55e', icon:'🌿' },
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
  { id:4, num:'04', title:'Manikya Roots',       sub:'FMCG & Wellness',          color:'#22c55e', bg:'#020a04', desc:'Amrutha Multi Millet Malt — 42 ancient Ayurvedic ingredients, zero sugar, zero chemicals.',             link:'/services' },
  { id:5, num:'05', title:'Manikya Properties',  sub:'Real Estate',              color:'#f59e0b', bg:'#0a0700', desc:'Your trusted real estate middleman — property search, bank loan facilitation, legal verification.',      link:'/services' },
  { id:6, num:'06', title:'Manikya Money',       sub:'Financial Services',       color:'#8b5cf6', bg:'#060210', desc:'Accessible, affordable loan services with speedy approvals, low interest, and zero hidden charges.',    link:'/services' },
  { id:7, num:'07', title:'Manikya Heritage',    sub:'Coming Soon',              color:'#a855f7', bg:'#060110', desc:"A living museum of Karnataka's 5000-year culture — folk arts, Ayurvedic wellness, heritage stays.",   link:'/services', soon:true },
];

const stats = [
  {value:24,suffix:'+',label:'Years'},
  {value:500,suffix:'+',label:'Partners'},
  {value:7,suffix:'',label:'Verticals'},
  {value:42,suffix:'',label:'Ingredients'},
];

// ⚠️ UPDATE THESE LINKS when ready
const socialLinks = {
  instagram: 'https://instagram.com/manikyaservices',
  facebook:  'https://facebook.com/manikyaservices',
  youtube:   'https://youtube.com/@manikyaservices',
  linkedin:  'https://linkedin.com/company/manikyaservices',
};

export default function Home() {
  const [activeSvc, setActiveSvc]   = useState(0);
  const [mouse, setMouse]           = useState({x:0,y:0});
  const [showSocial, setShowSocial] = useState(false);
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
        .loaded-2{animation:fadeUp 1.1s cubic-bezier(.16,1,.3,1) .4s both}
        .loaded-3{animation:fadeUp 1s cubic-bezier(.16,1,.3,1) .6s both}
        .loaded-4{animation:fadeUp 1s cubic-bezier(.16,1,.3,1) .8s both}
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
        @media(max-width:768px){.grid-2{grid-template-columns:1fr!important}}

        /* ── Logo animations ── */
        @keyframes logoEntrance{0%{opacity:0;transform:translate(-50%,-50%) scale(0.6)}100%{opacity:1;transform:translate(-50%,-50%) scale(1)}}
        @keyframes logoFloat{0%,100%{transform:translate(-50%,-50%) translateY(0)}50%{transform:translate(-50%,-50%) translateY(-18px)}}
        @keyframes orbitA{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
        @keyframes orbitB{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(-360deg)}}
        @keyframes orbitC{from{transform:translate(-50%,-50%) rotate(45deg)}to{transform:translate(-50%,-50%) rotate(405deg)}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 30px 10px rgba(245,158,11,0.5),0 0 80px 30px rgba(245,158,11,0.15)}50%{box-shadow:0 0 50px 18px rgba(245,158,11,0.8),0 0 120px 50px rgba(245,158,11,0.25)}}
        @keyframes dotOrbit{from{transform:rotate(var(--start)) translateX(var(--r)) rotate(calc(-1 * var(--start)))}to{transform:rotate(calc(var(--start) + 360deg)) translateX(var(--r)) rotate(calc(-1 * (var(--start) + 360deg)))}}
        @keyframes ringGlow{0%,100%{opacity:0.15;transform:translate(-50%,-50%) scale(1)}50%{opacity:0.45;transform:translate(-50%,-50%) scale(1.04)}}
        @keyframes mTextGlow{0%,100%{text-shadow:0 0 20px rgba(245,158,11,0.6),0 0 60px rgba(245,158,11,0.2)}50%{text-shadow:0 0 40px rgba(245,158,11,1),0 0 100px rgba(245,158,11,0.5),0 0 160px rgba(59,130,246,0.3)}}
        @keyframes taglineFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sparkle{0%,100%{opacity:0;transform:scale(0) rotate(0deg)}40%,60%{opacity:1;transform:scale(1) rotate(180deg)}}

        .logo-wrap{animation:logoEntrance 1.4s cubic-bezier(.16,1,.3,1) 0.3s both}
        .logo-float{animation:logoFloat 6s ease-in-out infinite}
        .logo-m{animation:mTextGlow 3s ease-in-out infinite}
        .logo-wrap:hover .logo-m{animation:mTextGlow 1s ease-in-out infinite}
        .logo-ring-glow{animation:ringGlow 4s ease-in-out infinite}
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
          <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.82rem',fontWeight:600,color:'rgba(255,255,255,0.9)' }}>NewsJunction Dashboard — Kannada · Hindi · Tamil · Telugu · English</span>
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:8,padding:'5px 14px',background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:4 }}>
          <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.72rem',fontWeight:600,color:'white',textTransform:'uppercase',letterSpacing:'0.08em' }}>Open Dashboard</span>
          <ExternalLink size={12} color="white"/>
        </div>
      </a>

      {/* ── HERO ── */}
      <section style={{ position:'relative',height:'100vh',minHeight:600,display:'flex',alignItems:'flex-end',background:'linear-gradient(135deg,#020b1a 0%,#051430 35%,#0a1f4a 65%,#0d2760 100%)',overflow:'hidden' }} onMouseMove={onMouseMove}>
        <NetworkCanvas/>
        <FloatingIcons/>
        <ParallaxOrbs mouse={mouse}/>

        <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse at 60% 40%,rgba(59,130,246,0.15) 0%,transparent 60%)',pointerEvents:'none' }}/>
        <div style={{ position:'absolute',inset:0,background:'linear-gradient(to top,#020b1a 0%,rgba(2,11,26,0.4) 50%,transparent 100%)',pointerEvents:'none' }}/>
        <div style={{ position:'absolute',top:'50%',left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(59,130,246,0.15),rgba(245,158,11,0.12),transparent)',pointerEvents:'none' }}/>

        {/* ══ MANIKYA INTERACTIVE LOGO ══ */}
        <div className="logo-wrap absolute right-16 top-1/2 hidden xl:block" style={{ width: 560, height: 560, position: 'absolute', right: '6rem', top: '50%' }}>
          <div className="logo-float" style={{ position: 'relative', width: '100%', height: '100%' }}>

            {/* — Outermost ambient glow ring — */}
            <div className="logo-ring-glow" style={{ position:'absolute', top:'50%', left:'50%', width:540, height:540, borderRadius:'50%', background:'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)', transform:'translate(-50%,-50%)', pointerEvents:'none' }}/>

            {/* — Ring 1: slow clockwise, dashed gold — */}
            <div style={{ position:'absolute', top:'50%', left:'50%', width:500, height:500, borderRadius:'50%', border:'1px dashed rgba(245,158,11,0.2)', animation:'orbitA 32s linear infinite', transform:'translate(-50%,-50%)' }}>
              {/* Dot on ring 1 */}
              {[0,90,180,270].map((deg,i)=>(
                <div key={i} style={{ position:'absolute', top:'50%', left:'50%', width: i%2===0 ? 8 : 5, height: i%2===0 ? 8 : 5, borderRadius:'50%', background: i%2===0 ? '#f59e0b' : 'rgba(245,158,11,0.4)', boxShadow: i%2===0 ? '0 0 16px 6px rgba(245,158,11,0.7)' : 'none', transform:`translate(-50%,-50%) rotate(${deg}deg) translateX(250px)`, marginTop:0 }}/>
              ))}
            </div>

            {/* — Ring 2: reverse, solid blue faint — */}
            <div style={{ position:'absolute', top:'50%', left:'50%', width:390, height:390, borderRadius:'50%', border:'1px solid rgba(59,130,246,0.18)', animation:'orbitB 22s linear infinite', transform:'translate(-50%,-50%)' }}>
              <div style={{ position:'absolute', top:-6, left:'50%', width:12, height:12, borderRadius:'50%', background:'#60a5fa', boxShadow:'0 0 20px 8px rgba(96,165,250,0.7)', transform:'translateX(-50%)' }}/>
              <div style={{ position:'absolute', bottom:-5, right:'18%', width:7, height:7, borderRadius:'50%', background:'#93c5fd', boxShadow:'0 0 12px 5px rgba(147,197,253,0.5)' }}/>
            </div>

            {/* — Ring 3: medium clockwise, purple — */}
            <div style={{ position:'absolute', top:'50%', left:'50%', width:285, height:285, borderRadius:'50%', border:'1px solid rgba(139,92,246,0.22)', animation:'orbitC 16s linear infinite', transform:'translate(-50%,-50%) rotate(45deg)' }}>
              <div style={{ position:'absolute', top:-5, left:'50%', width:10, height:10, borderRadius:'50%', background:'#a78bfa', boxShadow:'0 0 18px 7px rgba(167,139,250,0.65)', transform:'translateX(-50%)' }}/>
            </div>

            {/* — Ring 4: innermost, gold solid — */}
            <div style={{ position:'absolute', top:'50%', left:'50%', width:185, height:185, borderRadius:'50%', border:'1.5px solid rgba(245,158,11,0.35)', animation:'orbitA 10s linear infinite', transform:'translate(-50%,-50%)' }}>
              <div style={{ position:'absolute', top:-5, left:'50%', width:9, height:9, borderRadius:'50%', background:'#fde68a', boxShadow:'0 0 14px 6px rgba(253,230,138,0.8)', transform:'translateX(-50%)' }}/>
            </div>

            {/* — Central logo disc — */}
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:130, height:130, borderRadius:'50%', background:'radial-gradient(circle at 38% 35%, rgba(255,255,255,0.12), rgba(245,158,11,0.08) 40%, rgba(15,23,42,0.95) 70%)', border:'2px solid rgba(245,158,11,0.5)', boxShadow:'0 0 0 1px rgba(245,158,11,0.15), inset 0 1px 0 rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:10, animation:'glowPulse 3.5s ease-in-out infinite', cursor:'pointer', transition:'transform 0.4s cubic-bezier(.16,1,.3,1)' }}
              onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.transform='translate(-50%,-50%) scale(1.12)'; }}
              onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.transform='translate(-50%,-50%) scale(1)'; }}>
              {/* M lettermark */}
              <div className="logo-m" style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'3.6rem', fontWeight:700, color:'#f59e0b', lineHeight:1, letterSpacing:'-0.04em', userSelect:'none' }}>M</div>
              {/* Sub-label */}
              <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.42rem', fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(245,158,11,0.6)', marginTop:2, lineHeight:1 }}>MANIKYA</div>
            </div>

            {/* — Sparkle particles around the disc — */}
            {[
              { angle:30,  r:100, size:4, color:'#f59e0b', delay:'0s',   dur:'2.8s' },
              { angle:110, r:95,  size:3, color:'#60a5fa', delay:'0.6s', dur:'3.2s' },
              { angle:200, r:105, size:5, color:'#fde68a', delay:'1.1s', dur:'2.5s' },
              { angle:290, r:98,  size:3, color:'#a78bfa', delay:'1.8s', dur:'3.6s' },
              { angle:160, r:92,  size:2, color:'#10b981', delay:'0.3s', dur:'2.2s' },
              { angle:340, r:108, size:3, color:'#f59e0b', delay:'2.1s', dur:'3.0s' },
            ].map((sp, i) => {
              const rad = (sp.angle * Math.PI) / 180;
              const x = Math.cos(rad) * sp.r;
              const y = Math.sin(rad) * sp.r;
              return (
                <div key={i} style={{ position:'absolute', top:`calc(50% + ${y}px)`, left:`calc(50% + ${x}px)`, width:sp.size, height:sp.size, borderRadius:'50%', background:sp.color, boxShadow:`0 0 ${sp.size*3}px ${sp.size}px ${sp.color}80`, transform:'translate(-50%,-50%)', animation:`sparkle ${sp.dur} ease-in-out ${sp.delay} infinite`, pointerEvents:'none' }}/>
              );
            })}

            {/* — Tagline below the logo — */}
            <div style={{ position:'absolute', bottom: -10, left:'50%', transform:'translateX(-50%)', textAlign:'center', animation:'taglineFade 1.8s cubic-bezier(.16,1,.3,1) 1.2s both', whiteSpace:'nowrap' }}>
              <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.65rem', fontWeight:600, letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(245,158,11,0.55)', marginBottom:6 }}>Est. 2002 · Bengaluru</div>
              <div style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center' }}>
                {['Media','Agri','Commerce','Finance','Wellness','Realty','Heritage'].map((v,i)=>(
                  <div key={i} style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.52rem', fontWeight:500, color:'rgba(255,255,255,0.22)', letterSpacing:'0.1em', textTransform:'uppercase' }}>{v}{i<6&&<span style={{ marginLeft:8, color:'rgba(255,255,255,0.1)' }}>·</span>}</div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Hero text */}
        <div style={{ position:'relative',zIndex:10,width:'100%',padding:'clamp(2rem,5vw,5rem)',paddingBottom:'clamp(3rem,8vw,7rem)' }}>
          <div style={{ maxWidth:1400,margin:'0 auto' }}>
            <div className="loaded-1" style={{ display:'flex',alignItems:'center',gap:14,marginBottom:22 }}>
              <div style={{ width:40,height:1,background:'#f59e0b' }}/>
              <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.72rem',fontWeight:500,letterSpacing:'0.3em',textTransform:'uppercase',color:'#f59e0b' }}>Manikya Services Private Limited · Est. 2002 · Bengaluru</span>
            </div>
            <h1 className="loaded-2" style={{ fontSize:'clamp(4rem,9vw,9rem)',fontWeight:700,lineHeight:0.95,letterSpacing:'-0.02em',margin:'0 0 24px',color:'white' }}>
              Growing<br/><span className="gold-text">Together.</span>
            </h1>
            <div className="loaded-3" style={{ marginBottom:32 }}>
              <p style={{ fontFamily:'DM Sans,sans-serif',fontSize:'clamp(1rem,2vw,1.15rem)',color:'rgba(255,255,255,0.55)',lineHeight:1.7,marginBottom:10,fontWeight:300 }}>
                A multi-sector enterprise driving innovation across
              </p>
              <div style={{ display:'inline-flex',alignItems:'center',gap:12,padding:'11px 20px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',backdropFilter:'blur(10px)',borderRadius:4,maxWidth:380 }}>
                <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.72rem',color:'rgba(255,255,255,0.35)',fontWeight:500,textTransform:'uppercase',letterSpacing:'0.1em',flexShrink:0 }}>NOW</span>
                <div style={{ width:1,height:18,background:'rgba(255,255,255,0.15)' }}/>
                <div style={{ fontFamily:'DM Sans,sans-serif',fontSize:'1rem',display:'flex',alignItems:'center' }}><CyclingWord/></div>
              </div>
              <p style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.92rem',color:'rgba(255,255,255,0.35)',lineHeight:1.7,marginTop:10,fontWeight:300 }}>
                — for a sustainable, prosperous India.
              </p>
            </div>
            <div className="loaded-4" style={{ display:'flex',gap:14,flexWrap:'wrap' }}>
              <Link to="/services" className="btn-inf" style={{ display:'inline-flex',alignItems:'center',gap:10,padding:'14px 30px',background:'#f59e0b',color:'#000',fontFamily:'DM Sans,sans-serif',fontWeight:600,fontSize:'0.88rem',letterSpacing:'0.05em',textTransform:'uppercase' }}>
                Explore Our Business <ArrowRight size={15}/>
              </Link>
              <Link to="/pearl-farms" className="btn-inf" style={{ display:'inline-flex',alignItems:'center',gap:10,padding:'14px 30px',border:'1px solid rgba(255,255,255,0.28)',color:'white',fontFamily:'DM Sans,sans-serif',fontWeight:600,fontSize:'0.88rem',textTransform:'uppercase' }}>
                Pearl Farm Investment
              </Link>
              <Link to="/contact" className="btn-inf" style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'14px 24px',border:'1px solid rgba(245,158,11,0.4)',color:'#f59e0b',fontFamily:'DM Sans,sans-serif',fontWeight:600,fontSize:'0.88rem' }}>
                Apply Loan
              </Link>
            </div>
          </div>
          <div className="loaded-5" style={{ position:'absolute',right:'clamp(2rem,5vw,5rem)',bottom:'clamp(2rem,4vw,3rem)',display:'flex',flexDirection:'column',alignItems:'center',gap:8 }}>
            <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.62rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,255,255,0.35)',writingMode:'vertical-rl' }}>Scroll to explore</span>
            <div className="scroll-cue" style={{ width:1,height:48,background:'linear-gradient(to bottom,rgba(255,255,255,0.35),transparent)' }}/>
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
