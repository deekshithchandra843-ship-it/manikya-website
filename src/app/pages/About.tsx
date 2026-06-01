import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Play, X, Award, Users, Globe, Heart, CheckCircle, Upload, Video, Plus, Quote } from 'lucide-react';

// Embedded leadership photos
const IMG_RAHMAT = '/images/dr-rahmat.jpg';
const IMG_MEENA = '/images/meena-kumari.jpg';
const IMG_DHANUSH = '/images/dhanush-gowda.png';
const IMG_SHABEERA = '/images/shabeera-k.png';

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

const whyChoose = [
  { icon: '⚡', title: 'Speedy Approvals',      desc: 'Our streamlined process ensures loans are processed and disbursed in record time. We value your time.' },
  { icon: '💰', title: 'Low Interest Rates',    desc: 'Competitive pricing to ensure your financial burden remains manageable throughout the loan tenure.' },
  { icon: '✅', title: 'No Hidden Charges',     desc: 'Transparency is our core. What you see is what you get — no surprise fees, ever.' },
  { icon: '📄', title: 'Minimal Documentation', desc: 'Say goodbye to endless paperwork. We focus on a hassle-free, digital-friendly application process.' },
  { icon: '🤝', title: 'Customer-First',         desc: 'Our dedicated support team is always ready to assist you at every step of your financial journey.' },
];

const coreValues = [
  { icon: '🏅', title: 'Integrity',      desc: 'We uphold the highest standards of honesty in all our actions and dealings.' },
  { icon: '🌟', title: 'Excellence',     desc: 'We strive to deliver the best possible service to every client, every time.' },
  { icon: '📊', title: 'Accountability', desc: 'We take responsibility for our commitments and deliver on our promises.' },
  { icon: '💡', title: 'Innovation',     desc: 'Constantly improving our processes to serve you better in the digital age.' },
];

const videoSlots = [
  { key: 'ceo',    label: 'MD & CEO Message',               duration: '~5 min', color: '#f59e0b' },
  { key: 'vision', label: 'Company Vision 2030',            duration: '~8 min', color: '#3b82f6' },
  { key: 'pearl',  label: 'Pearl Farms — Investment Story', duration: '~4 min', color: '#06b6d4' },
  { key: 'market', label: 'Manikya Market — Village to World', duration: '~5 min', color: '#10b981' },
  { key: 'roots',  label: 'Amrutha Malt — 42 Ingredients',  duration: '~3 min', color: '#22c55e' },
  { key: 'money',  label: 'Manikya Money — Financial Future',duration: '~4 min', color: '#8b5cf6' },
];

const milestones = [
  { year: '2002', title: 'NewsJunction Founded',      desc: 'Dr. Rahmat Kanchagar started as a Kannada regional news portal covering Karnataka.',   color: '#ef4444' },
  { year: '2008', title: 'Multi-Language Expansion',  desc: 'Expanded to Hindi, Tamil, and Telugu channels — national multi-lingual media network.',  color: '#f59e0b' },
  { year: '2014', title: 'Manikya Market Launched',   desc: 'Desi e-commerce connecting Karnataka artisans to global buyers.',                        color: '#10b981' },
  { year: '2018', title: 'Pearl Farms Initiative',    desc: 'Pioneered freshwater pearl farming in Mandya, Karnataka.',                               color: '#3b82f6' },
  { year: '2020', title: 'Manikya Roots',             desc: 'Launched Amrutha Multi Millet Malt — 42 Ayurvedic ingredients.',                        color: '#22c55e' },
  { year: '2023', title: 'Manikya Properties',        desc: 'Entered real estate as a full-service loan and property facilitator.',                   color: '#8b5cf6' },
  { year: '2024', title: 'Manikya Money Service',     desc: 'Launched financial services — accessible loans with full transparency.',                 color: '#f59e0b' },
  { year: '2025+', title: 'Manikya Heritage',         desc: 'Mega Heritage Village — Karnataka\'s living museum of culture. Coming Soon.',           color: '#a855f7' },
];

/* Director messages — update these when content is provided */
const directors = [
  {
    name: 'Meena Kumari KT',
    title: 'Director',
    photo: IMG_MEENA,
    message: 'As a Director of Manikya Group, my commitment is to empower rural communities and women entrepreneurs across Karnataka. Through Manikya Market and Manikya Roots, we are creating sustainable livelihoods that honour our traditions while embracing innovation. Together, we grow stronger.',
  },
  {
    name: 'Dhanush Gowda',
    title: 'Director',
    photo: IMG_DHANUSH,
    message: 'My focus at Manikya Group is on technology-driven growth and youth empowerment. We are building digital platforms that connect India\'s villages to global markets. The future belongs to those who innovate with purpose — and at Manikya, that is exactly what we do every day.',
  },
  {
    name: 'Shabeera K',
    title: 'Director',
    photo: IMG_SHABEERA,
    message: 'At Manikya Group, we believe in inclusive growth — where every farmer, artisan, and entrepreneur has access to fair opportunities. Through Manikya Money Service and Manikya Properties, we are making financial inclusion and homeownership a reality for more Indian families.',
  },
];

export default function About() {
  const [videos, setVideos]       = useState<Record<string, string>>({});
  const [playKey, setPlayKey]     = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ceo' | 'company'>('ceo');
  const fileRefs                  = useRef<Record<string, HTMLInputElement | null>>({});
  const s1 = useInView(); const s2 = useInView(); const s3 = useInView();
  const s4 = useInView(); const s5 = useInView(); const s6 = useInView();
  const s7 = useInView();

  const handleVideoUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideos(p => ({ ...p, [key]: URL.createObjectURL(file) }));
  };

  return (
    <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", background: '#fff', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,0.3)}50%{box-shadow:0 0 0 10px rgba(245,158,11,0)}}

        .gold-text{background:linear-gradient(90deg,#f59e0b,#fde68a,#f59e0b);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite}
        .reveal{opacity:0;transform:translateY(40px);transition:all .85s cubic-bezier(.16,1,.3,1)}
        .reveal.on{opacity:1;transform:translateY(0)}
        .reveal-l{opacity:0;transform:translateX(-50px);transition:all .85s cubic-bezier(.16,1,.3,1)}
        .reveal-l.on{opacity:1;transform:translateX(0)}
        .reveal-r{opacity:0;transform:translateX(50px);transition:all .85s cubic-bezier(.16,1,.3,1)}
        .reveal-r.on{opacity:1;transform:translateX(0)}
        .btn-main{transition:all .3s;text-decoration:none;cursor:pointer;border:none}
        .btn-main:hover{transform:translateY(-2px)}
        .tab-btn{transition:all .3s;cursor:pointer;border:none;background:none;font-family:inherit}
        .why-card{transition:all .35s ease}
        .why-card:hover{transform:translateY(-5px)}
        .val-card{transition:all .35s ease}
        .val-card:hover{transform:translateY(-5px)}
        .dir-card{transition:all .35s ease}
        .dir-card:hover{transform:translateY(-6px);box-shadow:0 20px 50px rgba(0,0,0,0.12)!important}
        .upload-btn{transition:all .3s;cursor:pointer}
        .upload-btn:hover{transform:scale(1.05)}
        .marquee-track{display:flex;gap:60px;animation:marquee 25s linear infinite;white-space:nowrap}
        .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:999;display:flex;align-items:center;justify-content:center;animation:scaleIn .3s ease}
        @media(max-width:768px){.grid-2{grid-template-columns:1fr!important}.grid-3{grid-template-columns:1fr!important}.grid-4{grid-template-columns:1fr 1fr!important}}
        @media(max-width:480px){.grid-4{grid-template-columns:repeat(2,1fr)!important}}
      `}</style>

      {/* VIDEO MODAL */}
      {playKey && (
        <div className="modal-bg" onClick={() => setPlayKey(null)}>
          <div style={{ maxWidth: 820, width: '92%', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setPlayKey(null)} style={{ position: 'absolute', top: -44, right: 0, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
              <X size={18} />
            </button>
            {videos[playKey]
              ? <video src={videos[playKey]} controls autoPlay style={{ width: '100%', maxHeight: '75vh', background: '#000' }} />
              : <div style={{ aspectRatio: '16/9', background: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                  <Video size={48} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <p style={{ fontFamily: 'DM Sans,sans-serif', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', textAlign: 'center' }}>No video uploaded yet.</p>
                </div>
            }
          </div>
        </div>
      )}

      {/* ══ HERO ══ */}
      <section style={{ background: '#000', minHeight: '55vh', display: 'flex', alignItems: 'flex-end', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 50%,rgba(245,158,11,0.07),transparent 60%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto', padding: 'clamp(6rem,10vw,10rem) clamp(1.5rem,5vw,5rem) clamp(4rem,6vw,6rem)', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, animation: 'fadeUp .9s .1s both' }}>
            <div style={{ width: 40, height: 1, background: '#f59e0b' }} />
            <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#f59e0b' }}>Our Story</span>
          </div>
          <h1 style={{ fontSize: 'clamp(3.5rem,8vw,8rem)', fontWeight: 700, lineHeight: 0.95, color: 'white', marginBottom: 24, animation: 'fadeUp .9s .25s both' }}>
            About<br /><span className="gold-text">Manikya.</span>
          </h1>
          <p style={{ fontFamily: 'DM Sans,sans-serif', color: 'rgba(255,255,255,0.5)', fontSize:'clamp(0.9rem,1.8vw,1.1rem)', maxWidth: 500, lineHeight: 1.8, fontWeight: 300, animation: 'fadeUp .9s .4s both' }}>
            A multi-sector enterprise rooted in Bengaluru — driving sustainable growth across media, agriculture, commerce, wellness, financial services, and real estate since 2002.
          </p>
        </div>
      </section>

      {/* ══ ABOUT INTRO — EXTENDED ══ */}
      <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,7rem) 0' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.5rem,5vw,5rem)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="grid-2">
            {/* Left — Story */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 40, height: 1, background: '#f59e0b' }} />
                <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#f59e0b' }}>Who We Are</span>
              </div>
              <h2 style={{ fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 700, lineHeight: 1.1, color: '#0f172a', marginBottom: 24 }}>
                Building India's Future<br />Across Seven Verticals
              </h2>
              <p style={{ fontFamily: 'DM Sans,sans-serif', color: '#475569', lineHeight: 1.9, fontSize: '0.97rem', marginBottom: 18, fontWeight: 300 }}>
                Founded in 2002 by Dr. Rahmat Kanchagar, <strong style={{ color: '#0f172a' }}>Manikya Group</strong> is a Bengaluru-based multi-sector enterprise that has grown from a regional news portal into a diversified conglomerate spanning media, agriculture, e-commerce, wellness, financial services, and real estate.
              </p>
              <p style={{ fontFamily: 'DM Sans,sans-serif', color: '#475569', lineHeight: 1.9, fontSize: '0.97rem', marginBottom: 24, fontWeight: 300 }}>
                Over more than two decades, we have remained steadfast in our mission: to <strong style={{ color: '#0f172a' }}>empower rural communities, elevate Karnataka's cultural heritage</strong>, and create sustainable livelihoods for farmers, artisans, and entrepreneurs across India.
              </p>
              {/* Key pillars */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { icon: '📰', label: 'NewsJunction', sub: 'Multi-language media network' },
                  { icon: '🛒', label: 'Manikya Market', sub: 'Desi e-commerce platform' },
                  { icon: '🦪', label: 'Pearl Farms', sub: 'Freshwater pearl cultivation' },
                  { icon: '🌾', label: 'Manikya Roots', sub: 'Ayurvedic wellness products' },
                  { icon: '💰', label: 'Manikya Money', sub: 'Financial services & loans' },
                  { icon: '🏠', label: 'Manikya Properties', sub: 'Real estate facilitation' },
                ].map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fafafa' }}>
                    <span style={{ fontSize:'clamp(1rem,2vw,1.3rem)', flexShrink: 0 }}>{p.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>{p.label}</div>
                      <div style={{ fontFamily: 'DM Sans,sans-serif', color: '#94a3b8', fontSize: '0.75rem', marginTop: 2 }}>{p.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right — Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Quote block */}
              <div style={{ borderLeft: '4px solid #f59e0b', padding: '20px 24px', background: '#fffbeb', borderRadius: '0 12px 12px 0' }}>
                <p style={{ fontFamily: 'DM Sans,sans-serif', fontStyle: 'italic', color: '#334155', fontSize:'clamp(0.88rem,1.6vw,1.05rem)', lineHeight: 1.8, margin: 0 }}>
                  "We don't just build businesses — we build bridges between communities, between tradition and innovation, between today's challenge and tomorrow's opportunity."
                </p>
                <div style={{ marginTop: 12, fontFamily: 'DM Sans,sans-serif', fontWeight: 700, color: '#f59e0b', fontSize: '0.8rem' }}>— Dr. Rahmat Kanchagar, Founder & MD & CEO</div>
              </div>
              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, border: '1px solid #e2e8f0' }}>
                {[
                  { n: '2002', label: 'Founded' },
                  { n: '7', label: 'Verticals' },
                  { n: '500+', label: 'Partners' },
                ].map((s, i) => (
                  <div key={i} style={{ padding: '20px 16px', textAlign: 'center', borderRight: i < 2 ? '1px solid #e2e8f0' : 'none', background: '#fafafa' }}>
                    <div style={{ fontSize:'clamp(1.2rem,3vw,1.8rem)', fontWeight: 700, color: '#0f172a' }}>{s.n}</div>
                    <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {/* Mission & Vision */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ padding: '18px 20px', background: '#0f172a', borderRadius: 8 }}>
                  <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.65rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 8 }}>Our Mission</div>
                  <p style={{ fontFamily: 'DM Sans,sans-serif', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.75, margin: 0 }}>To uplift communities through responsible business — connecting people to opportunity, culture to commerce, and tradition to technology.</p>
                </div>
                <div style={{ padding: '18px 20px', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                  <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.65rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 8 }}>Our Vision</div>
                  <p style={{ fontFamily: 'DM Sans,sans-serif', color: '#475569', fontSize: '0.9rem', lineHeight: 1.75, margin: 0 }}>To become India's most trusted community-driven conglomerate — a household name from Karnataka to every corner of the nation by 2030.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <section style={{ background: '#f59e0b', padding: '14px 0', overflow: 'hidden' }}>
        <div className="marquee-track">
          {[...Array(2)].map((_, r) => (['Established 2002', '•', 'Bengaluru, Karnataka', '•', '7 Business Verticals', '•', '500+ Partners', '•', '24+ Years of Excellence', '•']).map((t, i) => (
            <span key={`${r}-${i}`} style={{ fontFamily: 'DM Sans,sans-serif', fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#000', flexShrink: 0 }}>{t}</span>
          )))}
        </div>
      </section>

      {/* ══ CORE VALUES ══ */}
      <section style={{ background: '#050505', color: 'white', padding: 'clamp(4rem,8vw,8rem) 0' }} ref={s5.ref}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.5rem,5vw,5rem)' }}>
          <div className={`reveal ${s5.v ? 'on' : ''}`} style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: 12 }}>Our Core Values</p>
            <h2 style={{ fontSize: 'clamp(2.2rem,4vw,3.5rem)', fontWeight: 700, lineHeight: 1.05, color: 'white', margin: 0 }}>The Principles<br />Behind Everything.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }} className="grid-2">
            {coreValues.map((v, i) => (
              <div key={i} className={`val-card reveal ${s5.v ? 'on' : ''}`}
                style={{ transitionDelay: `${i * 100}ms`, padding: '2.5rem 2rem', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(245,158,11,0.05)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.3)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                <div style={{ fontSize:'clamp(1.5rem,4vw,2.5rem)', marginBottom: 16 }}>{v.icon}</div>
                <div style={{ width: 28, height: 2, background: '#f59e0b', marginBottom: 14 }} />
                <h3 style={{ fontSize:'clamp(1rem,2vw,1.3rem)', fontWeight: 700, color: 'white', marginBottom: 10 }}>{v.title}</h3>
                <p style={{ fontFamily: 'DM Sans,sans-serif', color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', lineHeight: 1.75, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MD & CEO — DR. RAHMAT KANCHAGAR ══ */}
      <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,8rem) 0' }} ref={s1.ref}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.5rem,5vw,5rem)' }}>
          <div className={`reveal ${s1.v ? 'on' : ''}`} style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: 12 }}>Leadership</p>
            <h2 style={{ fontSize: 'clamp(2.2rem,4vw,3.5rem)', fontWeight: 700, lineHeight: 1.05, color: '#0f172a', margin: 0 }}>MD & CEO — Manikya Group</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 64, alignItems: 'start' }} className="grid-2">
            {/* Photo */}
            <div className={`reveal-l ${s1.v ? 'on' : ''}`}>
              <div style={{ position: 'relative', borderRadius: 4, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                <img src={IMG_RAHMAT} alt="Dr. Rahmat Kanchagar" style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 24px', background: 'linear-gradient(to top,rgba(0,0,0,0.85),transparent)' }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize:'clamp(0.95rem,1.8vw,1.15rem)', fontFamily: 'Cormorant Garamond,serif' }}>Dr. Rahmat Kanchagar</div>
                  <div style={{ fontFamily: 'DM Sans,sans-serif', color: '#f59e0b', fontSize: '0.78rem', fontWeight: 600, marginTop: 3 }}>PhD · MD & CEO, Manikya Group</div>
                </div>
              </div>

              {/* Key roles */}
              <div style={{ marginTop: 20, padding: '20px', border: '1px solid #e2e8f0', borderRadius: 4, background: '#fafafa' }}>
                <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Roles & Designations</div>
                {[
                  'MD & CEO — Manikya Group',
                  'MD & CEO — Manikya Money Service Pvt Ltd',
                  'Founder & Editor-in-Chief — NewsJunction',
                  'Founder — Manikya Pearl Farm',
                  'Founder — Manikya E-Market & Manikya Roots',
                ].map((role, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingBottom: 8, marginBottom: 8, borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none' }}>
                    <span style={{ color: '#f59e0b', marginTop: 2, flexShrink: 0 }}>▸</span>
                    <span style={{ fontFamily: 'DM Sans,sans-serif', color: '#334155', fontSize: '0.85rem', lineHeight: 1.4 }}>{role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className={`reveal-r ${s1.v ? 'on' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 30, height: 1, background: '#f59e0b' }} />
                <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#f59e0b' }}>About Dr. Rahmat Kanchagar</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 700, lineHeight: 1.1, color: '#0f172a', marginBottom: 20 }}>
                Senior Journalist, Media Strategist<br />&amp; Social Reformer
              </h2>

              {/* Pull quote */}
              <div style={{ borderLeft: '4px solid #f59e0b', paddingLeft: 20, marginBottom: 24, background: '#fffbeb', padding: '16px 20px', borderRadius: '0 8px 8px 0' }}>
                <p style={{ fontStyle: 'italic', color: '#334155', fontSize:'clamp(0.88rem,1.6vw,1.05rem)', lineHeight: 1.8, margin: 0 }}>
                  "A unique blend of media excellence, social responsibility, and visionary leadership — an inspiration to aspiring journalists, entrepreneurs, and future leaders."
                </p>
              </div>

              <p style={{ fontFamily: 'DM Sans,sans-serif', color: '#475569', lineHeight: 1.9, fontSize: '0.97rem', marginBottom: 16, fontWeight: 300 }}>
                Dr. Rahmat Kanchagar (PhD) is a renowned senior journalist, media strategist, social reformer, and entrepreneur with more than <strong style={{ color: '#0f172a' }}>25 years of experience</strong> in journalism, public service, and corporate leadership. As the MD & CEO of Manikya Group, he has dedicated his career to creating meaningful social impact through responsible media, business innovation, and community development.
              </p>
              <p style={{ fontFamily: 'DM Sans,sans-serif', color: '#475569', lineHeight: 1.9, fontSize: '0.97rem', marginBottom: 16, fontWeight: 300 }}>
                A <strong style={{ color: '#0f172a' }}>PhD holder in Journalism</strong>, Dr. Rahmat Kanchagar is widely respected for his fearless reporting, people-centric approach, and commitment to social welfare. Over the years, he has produced and broadcasted more than <strong style={{ color: '#0f172a' }}>1,000 impactful stories</strong> across Karnataka, helping bring real change to society through journalism.
              </p>

              {/* Impact grid */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Key Social Contributions</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    '🏠 Rehabilitation for flood-affected families',
                    '🛣️ Development of roads & hanging bridges in remote regions',
                    '💡 Electrification of neglected rural villages',
                    '📢 Awareness campaigns for public welfare',
                    '🎭 Founder — Kannada Welfare Society, Hyderabad',
                    '🎉 Organised first Mega Rajyotsava in Hyderabad',
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <span style={{ fontFamily: 'DM Sans,sans-serif', color: '#334155', fontSize: '0.83rem', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p style={{ fontFamily: 'DM Sans,sans-serif', color: '#475569', lineHeight: 1.9, fontSize: '0.95rem', marginBottom: 16, fontWeight: 300 }}>
                Being among the <strong style={{ color: '#0f172a' }}>first generation of electronic media professionals</strong> in Karnataka, his career spans Bengaluru, Hyderabad, Mumbai, Delhi, Ahmedabad, Chennai, Goa, and Belagavi. He is especially known for his courageous on-ground coverage during the <strong style={{ color: '#0f172a' }}>2008 Mumbai 26/11 attacks</strong> and political analysis during major Indian elections.
              </p>

              <div style={{ display: 'flex', gap: 12 }}>
                <Link to="/contact" className="btn-main" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', background: '#000', color: '#fff', fontFamily: 'DM Sans,sans-serif', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Connect <ArrowRight size={14} />
                </Link>
                <Link to="/services" className="btn-main" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 24px', border: '1px solid #e2e8f0', color: '#0f172a', fontFamily: 'DM Sans,sans-serif', fontWeight: 600, fontSize: '0.85rem' }}>
                  Our Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ DIRECTORS ══ */}
      <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,8rem) 0' }} ref={s6.ref}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.5rem,5vw,5rem)' }}>
          <div className={`reveal ${s6.v ? 'on' : ''}`} style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: 12 }}>Board of Directors</p>
            <h2 style={{ fontSize: 'clamp(2.2rem,4vw,3.5rem)', fontWeight: 700, lineHeight: 1.05, color: '#0f172a', margin: 0 }}>Manikya Group<br />Directors</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }} className="grid-3">
            {directors.map((dir, i) => (
              <div key={i} className={`dir-card reveal ${s6.v ? 'on' : ''}`}
                style={{ transitionDelay: `${i * 120}ms`, border: '1px solid #e2e8f0', borderRadius: 4, overflow: 'hidden', background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                {/* Photo */}
                <div style={{ position: 'relative', height: 340, overflow: 'hidden', background: '#f8fafc' }}>
                  <img src={dir.photo} alt={dir.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                    onError={e => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) { parent.style.display = 'flex'; parent.style.alignItems = 'center'; parent.style.justifyContent = 'center'; parent.style.background = '#f59e0b15'; }
                    }}
                  />
                  {/* Name overlay */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px', background: 'linear-gradient(to top,rgba(0,0,0,0.8),transparent)' }}>
                    <div style={{ color: 'white', fontWeight: 700, fontSize:'clamp(0.9rem,1.8vw,1.1rem)', fontFamily: 'Cormorant Garamond,serif' }}>{dir.name}</div>
                    <div style={{ fontFamily: 'DM Sans,sans-serif', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600, marginTop: 2 }}>{dir.title} — Manikya Group</div>
                  </div>
                </div>

                {/* Message */}
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                    <Quote size={20} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontFamily: 'DM Sans,sans-serif', color: '#475569', lineHeight: 1.8, fontSize: '0.9rem', margin: 0, fontStyle: 'italic' }}>{dir.message}</p>
                  </div>
                  <div style={{ height: 1, background: '#f59e0b', width: 40, marginTop: 16 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MANIKYA MONEY — COMPANY OVERVIEW ══ */}
      <section style={{ background: 'linear-gradient(135deg,#0a0a0a,#0f172a)', padding: 'clamp(4rem,8vw,8rem) 0', color: 'white' }} ref={s2.ref}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.5rem,5vw,5rem)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="grid-2">
            <div className={`reveal-l ${s2.v ? 'on' : ''}`}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 40, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', marginBottom: 20 }}>
                <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.68rem', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.2em', textTransform: 'uppercase' }}>💰 Financial Services</span>
              </div>
              <h2 style={{ fontSize: 'clamp(2.2rem,4vw,3.8rem)', fontWeight: 700, lineHeight: 1.05, marginBottom: 20 }}>
                Manikya<br /><span className="gold-text">Money Service</span><br />
                <span style={{ fontSize: '0.55em', fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>Pvt. Ltd.</span>
              </h2>
              <p style={{ fontFamily: 'DM Sans,sans-serif', color: 'rgba(255,255,255,0.55)', fontSize:'clamp(0.88rem,1.6vw,1.05rem)', lineHeight: 1.85, marginBottom: 24, fontWeight: 300 }}>
                Founded on the principles of <strong style={{ color: '#f59e0b' }}>integrity and customer-centricity</strong>. We are your trusted financial partners — providing accessible, affordable, and innovative financial services to every segment of Indian society.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
                <div style={{ padding: '18px', border: '1px solid rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.04)' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8, fontFamily: 'DM Sans,sans-serif' }}>Our Mission</div>
                  <p style={{ fontFamily: 'DM Sans,sans-serif', color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>To provide accessible, affordable, and innovative financial services through a seamless digital and physical experience.</p>
                </div>
                <div style={{ padding: '18px', border: '1px solid rgba(59,130,246,0.2)', background: 'rgba(59,130,246,0.04)' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8, fontFamily: 'DM Sans,sans-serif' }}>Our Vision</div>
                  <p style={{ fontFamily: 'DM Sans,sans-serif', color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>To become a household name in financial services, recognized for speed, ethics, and commitment to client growth.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Link to="/contact" className="btn-main" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', background: '#f59e0b', color: '#000', fontFamily: 'DM Sans,sans-serif', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Apply for a Loan <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className={`reveal-r ${s2.v ? 'on' : ''}`}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {[
                  { val: 24, suf: '+', label: 'Years of Excellence', col: '#f59e0b' },
                  { val: 500, suf: '+', label: 'Partners & Investors', col: '#3b82f6' },
                  { val: 7, suf: '', label: 'Business Verticals', col: '#10b981' },
                  { val: 48, suf: 'hr', label: 'Loan Approval', col: '#ef4444' },
                  { val: 10, suf: '+', label: 'Bank Partners', col: '#8b5cf6' },
                  { val: 100, suf: '%', label: 'Transparent', col: '#22c55e' },
                ].map((s, i) => (
                  <div key={i} className={`reveal ${s2.v ? 'on' : ''}`} style={{ transitionDelay: `${i * 80}ms`, padding: '2rem', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ fontSize:'clamp(1.5rem,4vw,2.6rem)', fontWeight: 700, color: s.col, lineHeight: 1 }}><Counter end={s.val} suffix={s.suf} /></div>
                    <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ WHY CHOOSE US ══ */}
      <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,8rem) 0' }} ref={s3.ref}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.5rem,5vw,5rem)' }}>
          <div className={`reveal ${s3.v ? 'on' : ''}`} style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: 12 }}>Manikya Money Service</p>
            <h2 style={{ fontSize: 'clamp(2.2rem,4vw,3.5rem)', fontWeight: 700, lineHeight: 1.05, color: '#0f172a', margin: 0 }}>Why Choose<br />Manikya Money Service?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14 }} className="grid-3">
            {whyChoose.map((w, i) => (
              <div key={i} className={`why-card reveal ${s3.v ? 'on' : ''}`}
                style={{ transitionDelay: `${i * 80}ms`, padding: '2rem 1.5rem', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden', background: 'white' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#f59e0b50'; (e.currentTarget as HTMLElement).style.background = '#fffbeb'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLElement).style.background = 'white'; }}>
                <div style={{ fontSize:'clamp(1.4rem,3.5vw,2.2rem)', marginBottom: 14 }}>{w.icon}</div>
                <div style={{ width: 28, height: 2, background: '#f59e0b', marginBottom: 12 }} />
                <h3 style={{ fontSize:'clamp(0.88rem,1.6vw,1.05rem)', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{w.title}</h3>
                <p style={{ fontFamily: 'DM Sans,sans-serif', color: '#64748b', fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VIDEO SECTION — BELOW WHY CHOOSE ══ */}
      <section style={{ background: '#f8fafc', padding: 'clamp(4rem,8vw,8rem) 0' }} ref={s4.ref}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.5rem,5vw,5rem)' }}>
          <div className={`reveal ${s4.v ? 'on' : ''}`} style={{ marginBottom: 40 }}>
            <p style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: 12 }}>Media & Videos</p>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 700, lineHeight: 1.05, color: '#0f172a', marginBottom: 20 }}>Inside Manikya</h2>
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: 0 }}>
              {[{ key: 'ceo', label: 'CEO & Leadership' }, { key: 'company', label: 'Company Videos' }].map(tab => (
                <button key={tab.key} className="tab-btn" onClick={() => setActiveTab(tab.key as any)}
                  style={{ padding: '12px 26px', fontFamily: 'DM Sans,sans-serif', fontWeight: 600, fontSize: '0.88rem', color: activeTab === tab.key ? '#000' : '#94a3b8', borderBottom: activeTab === tab.key ? '2px solid #f59e0b' : '2px solid transparent', marginBottom: -1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* CEO TAB */}
          {activeTab === 'ceo' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 28 }} className="grid-2">
              <div className={`reveal-l ${s4.v ? 'on' : ''}`}>
                <div style={{ aspectRatio: '16/9', background: '#0a0a0a', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
                  {videos['ceo'] ? (
                    <>
                      <video src={videos['ceo']} onClick={() => setPlayKey('ceo')} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 14px', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'DM Sans,sans-serif', color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>MD & CEO Message</span>
                        <button onClick={() => setPlayKey('ceo')} style={{ background: '#f59e0b', border: 'none', padding: '5px 12px', color: '#000', fontFamily: 'DM Sans,sans-serif', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Play size={12} style={{ fill: '#000' }} /> Play
                        </button>
                      </div>
                    </>
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, minHeight: 280 }}>
                      <Video size={48} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: 4 }} />
                      <p style={{ fontFamily: 'DM Sans,sans-serif', color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', marginBottom: 16 }}>Upload MD & CEO Message Video</p>
                      <label className="upload-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#f59e0b', color: '#000', fontFamily: 'DM Sans,sans-serif', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', borderRadius: 4 }}>
                        <Plus size={16} /> Upload Video
                        <input ref={el => { fileRefs.current['ceo'] = el; }} type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideoUpload('ceo', e)} />
                      </label>
                      <span style={{ fontFamily: 'DM Sans,sans-serif', color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem' }}>MP4, MOV, AVI supported</span>
                    </div>
                  )}
                  {videos['ceo'] && (
                    <label style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: 'rgba(0,0,0,0.7)', color: 'white', fontFamily: 'DM Sans,sans-serif', fontSize: '0.68rem', cursor: 'pointer', borderRadius: 4 }}>
                      <Upload size={11} /> Replace
                      <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideoUpload('ceo', e)} />
                    </label>
                  )}
                </div>
                <div style={{ padding: '14px 0' }}>
                  <h3 style={{ fontSize:'clamp(0.88rem,1.6vw,1.05rem)', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Dr. Rahmat Kanchagar — MD & CEO Message</h3>
                  <p style={{ fontFamily: 'DM Sans,sans-serif', color: '#94a3b8', fontSize: '0.82rem' }}>On building a sustainable multi-sector enterprise for India</p>
                </div>
              </div>
              <div className={`reveal-r ${s4.v ? 'on' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[{ key: 'vision', label: "Vision 2030 — Manikya's Growth Roadmap" }, { key: 'values', label: 'Company Values & Culture' }, { key: 'impact', label: 'Our Impact on Indian Communities' }].map(vid => (
                  <div key={vid.key} style={{ display: 'flex', gap: 14, padding: '14px', border: '1px solid #e2e8f0', background: 'white', alignItems: 'center', borderRadius: 4 }}>
                    <div style={{ width: 100, height: 60, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', overflow: 'hidden', borderRadius: 4 }}>
                      {videos[vid.key]
                        ? <video src={videos[vid.key]} onClick={() => setPlayKey(vid.key)} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
                        : <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                            <Plus size={18} style={{ color: 'rgba(255,255,255,0.3)' }} />
                            <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)' }}>Upload</span>
                            <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideoUpload(vid.key, e)} />
                          </label>
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem', lineHeight: 1.3, marginBottom: 4 }}>{vid.label}</div>
                      {videos[vid.key]
                        ? <button onClick={() => setPlayKey(vid.key)} style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.72rem', color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>▶ Play Video</button>
                        : <label style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.72rem', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Upload size={11} /> Choose File
                            <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideoUpload(vid.key, e)} />
                          </label>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COMPANY VIDEOS TAB */}
          {activeTab === 'company' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="grid-2">
              {videoSlots.map((vs, i) => (
                <div key={vs.key} className={`reveal ${s4.v ? 'on' : ''}`} style={{ transitionDelay: `${i * 80}ms`, border: '1px solid #e2e8f0', overflow: 'hidden', background: 'white', position: 'relative', borderRadius: 4 }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: vs.color, zIndex: 1 }} />
                  <div style={{ aspectRatio: '16/9', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
                    {videos[vs.key] ? (
                      <>
                        <video src={videos[vs.key]} onClick={() => setPlayKey(vs.key)} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
                        <button onClick={() => setPlayKey(vs.key)} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 40, height: 40, borderRadius: '50%', border: `2px solid ${vs.color}`, background: `${vs.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Play size={16} style={{ color: vs.color, fill: vs.color }} />
                        </button>
                      </>
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 16 }}>
                        <Video size={32} style={{ color: `${vs.color}40` }} />
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: vs.color, color: '#fff', fontFamily: 'DM Sans,sans-serif', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', borderRadius: 4 }}>
                          <Plus size={13} /> Upload Video
                          <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideoUpload(vs.key, e)} />
                        </label>
                        <span style={{ fontFamily: 'DM Sans,sans-serif', color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem' }}>MP4, MOV, AVI</span>
                      </div>
                    )}
                    {videos[vs.key] && (
                      <label style={{ position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', background: 'rgba(0,0,0,0.7)', color: 'white', fontFamily: 'DM Sans,sans-serif', fontSize: '0.62rem', cursor: 'pointer', borderRadius: 4 }}>
                        <Upload size={10} /> Replace
                        <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideoUpload(vs.key, e)} />
                      </label>
                    )}
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.65rem', fontWeight: 700, color: vs.color, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>{vs.duration}</div>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem', lineHeight: 1.35 }}>{vs.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ TIMELINE ══ */}
      <section style={{ background: '#050505', color: 'white', padding: 'clamp(4rem,8vw,8rem) 0' }} ref={s7.ref}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.5rem,5vw,5rem)' }}>
          <div className={`reveal ${s7.v ? 'on' : ''}`} style={{ marginBottom: 56 }}>
            <p style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: 12 }}>Our Journey</p>
            <h2 style={{ fontSize: 'clamp(2.2rem,4vw,3.5rem)', fontWeight: 700, lineHeight: 1.05, color: 'white', margin: 0 }}>Two Decades.<br />Eight Milestones.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }} className="grid-2">
            {milestones.map((m, i) => (
              <div key={i} className={`reveal ${s7.v ? 'on' : ''}`}
                style={{ transitionDelay: `${i * 80}ms`, padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none', position: 'relative', overflow: 'hidden', transition: 'background .3s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = m.color + '06'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.7rem', fontWeight: 700, color: m.color, letterSpacing: '0.15em', padding: '3px 10px', border: `1px solid ${m.color}40`, borderRadius: 20, display: 'inline-block', marginBottom: 10 }}>{m.year}</span>
                <div style={{ width: 24, height: 2, background: m.color, marginBottom: 10 }} />
                <h3 style={{ fontSize:'clamp(0.95rem,1.8vw,1.15rem)', fontWeight: 700, color: 'white', marginBottom: 6 }}>{m.title}</h3>
                <p style={{ fontFamily: 'DM Sans,sans-serif', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', lineHeight: 1.65, margin: 0 }}>{m.desc}</p>
                <div style={{ position: 'absolute', bottom: -15, right: 10, fontSize:'clamp(2.5rem,6vw,5rem)', fontWeight: 700, color: m.color + '05', lineHeight: 1 }}>{m.year.replace('+', '')}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ background: '#000', padding: 'clamp(4rem,8vw,8rem) 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,158,11,0.06),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 clamp(1.5rem,5vw,5rem)', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(2.5rem,5vw,5rem)', fontWeight: 700, lineHeight: 1.05, color: 'white', marginBottom: 24 }}>
            Let's build<br /><span className="gold-text">together.</span>
          </h2>
          <p style={{ fontFamily: 'DM Sans,sans-serif', color: 'rgba(255,255,255,0.4)', fontSize: '1rem', lineHeight: 1.8, marginBottom: 40, fontWeight: 300 }}>
            Whether you're an investor, partner, customer, or looking for financial assistance — Manikya has a solution for you.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-main" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 36px', background: '#f59e0b', color: '#000', fontFamily: 'DM Sans,sans-serif', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Get in Touch <ArrowRight size={14} />
            </Link>
            <Link to="/services" className="btn-main" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 36px', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontFamily: 'DM Sans,sans-serif', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>
              Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


