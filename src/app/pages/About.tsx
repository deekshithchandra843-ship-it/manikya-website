import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Play, X, Upload, Video, Plus, Quote, Check } from 'lucide-react';

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
  { key: 'ceo',    label: 'MD & CEO Message',               duration: '~5 min', color: '#00b48a' },
  { key: 'vision', label: 'Company Vision 2030',            duration: '~8 min', color: '#3772cf' },
  { key: 'pearl',  label: 'Pearl Farms — Investment Story', duration: '~4 min', color: '#06b6d4' },
  { key: 'market', label: 'Manikya Market — Village to World', duration: '~5 min', color: '#00b48a' },
  { key: 'roots',  label: 'Amrutha Malt — 42 Ingredients',  duration: '~3 min', color: '#22a06b' },
  { key: 'money',  label: 'Manikya Money — Financial Future',duration: '~4 min', color: '#6b5cf6' },
];

const milestones = [
  { year: '2002', title: 'NewsJunction Founded',      desc: 'Dr. Rahmat Kanchagar started as a Kannada regional news portal covering Karnataka.' },
  { year: '2008', title: 'Multi-Language Expansion',  desc: 'Expanded to Hindi, Tamil, and Telugu channels — national multi-lingual media network.' },
  { year: '2014', title: 'Manikya Market Launched',   desc: 'Desi e-commerce connecting Karnataka artisans to global buyers.' },
  { year: '2018', title: 'Pearl Farms Initiative',    desc: 'Pioneered freshwater pearl farming in Mandya, Karnataka.' },
  { year: '2020', title: 'Manikya Roots',             desc: 'Launched Amrutha Multi Millet Malt — 42 Ayurvedic ingredients.' },
  { year: '2023', title: 'Manikya Properties',        desc: 'Entered real estate as a full-service loan and property facilitator.' },
  { year: '2024', title: 'Manikya Money Service',     desc: 'Launched financial services — accessible loans with full transparency.' },
  { year: '2025+', title: 'Manikya Heritage',         desc: "Mega Heritage Village — Karnataka's living museum of culture. Coming Soon." },
];

const directors = [
  { name: 'Meena Kumari KT', title: 'Director', photo: IMG_MEENA, message: 'As a Director of Manikya Group, my commitment is to empower rural communities and women entrepreneurs across Karnataka. Through Manikya Market and Manikya Roots, we are creating sustainable livelihoods that honour our traditions while embracing innovation. Together, we grow stronger.' },
  { name: 'Dhanush Gowda', title: 'Director', photo: IMG_DHANUSH, message: "My focus at Manikya Group is on technology-driven growth and youth empowerment. We are building digital platforms that connect India's villages to global markets. The future belongs to those who innovate with purpose — and at Manikya, that is exactly what we do every day." },
  { name: 'Shabeera K', title: 'Director', photo: IMG_SHABEERA, message: 'At Manikya Group, we believe in inclusive growth — where every farmer, artisan, and entrepreneur has access to fair opportunities. Through Manikya Money Service and Manikya Properties, we are making financial inclusion and homeownership a reality for more Indian families.' },
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
    <div className="mk" style={{ overflowX: 'hidden' }}>
      <style>{`
        @keyframes mkMarq { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .ab-marquee { display:flex; gap:56px; animation:mkMarq 28s linear infinite; white-space:nowrap; }
        .ab-modal { position:fixed; inset:0; background:rgba(10,10,10,0.92); z-index:999; display:flex; align-items:center; justify-content:center; padding:16px; }
        .ab-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:clamp(2rem,5vw,5rem); align-items:center; }
        @media(max-width:860px){ .ab-grid-2 { grid-template-columns:1fr; } }
        .ab-pillars { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        @media(max-width:460px){ .ab-pillars { grid-template-columns:1fr; } }
        .ab-ceo-grid { display:grid; grid-template-columns:360px 1fr; gap:clamp(2rem,5vw,4rem); align-items:start; }
        @media(max-width:860px){ .ab-ceo-grid { grid-template-columns:1fr; } }
        .ab-dir-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        @media(max-width:860px){ .ab-dir-grid { grid-template-columns:1fr; } }
        .ab-video-ceo { display:grid; grid-template-columns:1.6fr 1fr; gap:24px; }
        @media(max-width:860px){ .ab-video-ceo { grid-template-columns:1fr; } }
        .ab-company-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        @media(max-width:860px){ .ab-company-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:560px){ .ab-company-grid { grid-template-columns:1fr; } }
        .ab-timeline { display:grid; grid-template-columns:1fr 1fr; gap:0; border:1px solid rgba(255,255,255,0.08); border-radius:12px; overflow:hidden; }
        @media(max-width:640px){ .ab-timeline { grid-template-columns:1fr; } }
        .ab-why-grid { display:grid; gap:clamp(16px,2.5vw,24px); grid-template-columns:repeat(5,1fr); }
        @media(max-width:1024px){ .ab-why-grid { grid-template-columns:repeat(3,1fr); } }
        @media(max-width:680px){ .ab-why-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:440px){ .ab-why-grid { grid-template-columns:1fr; } }
      `}</style>

      {/* VIDEO MODAL */}
      {playKey && (
        <div className="ab-modal" onClick={() => setPlayKey(null)}>
          <div style={{ maxWidth: 820, width: '100%', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setPlayKey(null)} style={{ position: 'absolute', top: -44, right: 0, background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
              <X size={18} />
            </button>
            {videos[playKey]
              ? <video src={videos[playKey]} controls autoPlay style={{ width: '100%', maxHeight: '75vh', background: '#000', borderRadius: 12 }} />
              : <div style={{ aspectRatio: '16/9', background: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, borderRadius: 12 }}>
                  <Video size={48} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>No video uploaded yet.</p>
                </div>
            }
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="mk-hero-sky" style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(64px,11vw,112px) 0' }}>
        <div className="mk-cloud" style={{ top: -50, left: '8%', width: 320, height: 200 }} />
        <div className="mk-cloud" style={{ bottom: -30, right: '10%', width: 360, height: 220 }} />
        <div className="mk-container" style={{ position: 'relative', zIndex: 2, maxWidth: 820 }}>
          <span className="mk-badge mk-badge-glass" style={{ marginBottom: 20 }}>Our story</span>
          <h1 className="mk-display" style={{ color: 'var(--mk-ink)', margin: '0 0 16px' }}>About Manikya.</h1>
          <p className="mk-lead" style={{ color: 'var(--mk-slate)', maxWidth: 540 }}>
            A multi-sector enterprise rooted in Bengaluru — driving sustainable growth across media, agriculture, commerce, wellness, financial services, and real estate since 2002.
          </p>
        </div>
      </section>

      {/* ABOUT INTRO */}
      <section className="mk-section" style={{ background: 'var(--mk-canvas)' }}>
        <div className="mk-container">
          <div className="ab-grid-2">
            <div>
              <p className="mk-eyebrow">Who we are</p>
              <h2 className="mk-h2" style={{ margin: '0 0 20px' }}>Building India's future across seven verticals</h2>
              <p className="mk-body" style={{ marginBottom: 16 }}>
                Founded in 2002 by Dr. Rahmat Kanchagar, <strong style={{ color: 'var(--mk-ink)' }}>Manikya Group</strong> is a Bengaluru-based multi-sector enterprise that has grown from a regional news portal into a diversified conglomerate spanning media, agriculture, e-commerce, wellness, financial services, and real estate.
              </p>
              <p className="mk-body" style={{ marginBottom: 24 }}>
                Over more than two decades, we have remained steadfast in our mission: to <strong style={{ color: 'var(--mk-ink)' }}>empower rural communities, elevate Karnataka's cultural heritage</strong>, and create sustainable livelihoods for farmers, artisans, and entrepreneurs across India.
              </p>
              <div className="ab-pillars">
                {[
                  { icon: '📰', label: 'NewsJunction', sub: 'Multi-language media network' },
                  { icon: '🛒', label: 'Manikya Market', sub: 'Desi e-commerce platform' },
                  { icon: '🦪', label: 'Pearl Farms', sub: 'Freshwater pearl cultivation' },
                  { icon: '🌾', label: 'Manikya Roots', sub: 'Ayurvedic wellness products' },
                  { icon: '💰', label: 'Manikya Money', sub: 'Financial services & loans' },
                  { icon: '🏠', label: 'Manikya Properties', sub: 'Real estate facilitation' },
                ].map((p, i) => (
                  <div key={i} className="mk-card mk-card-hover" style={{ display: 'flex', gap: 10, padding: '14px 16px' }}>
                    <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{p.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--mk-ink)', fontSize: '0.9rem' }}>{p.label}</div>
                      <div className="mk-small" style={{ color: 'var(--mk-stone)', marginTop: 2 }}>{p.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="mk-card" style={{ borderLeft: '4px solid var(--mk-green)', background: 'rgba(0,212,164,0.05)' }}>
                <p style={{ fontStyle: 'italic', color: 'var(--mk-slate)', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                  "We don't just build businesses — we build bridges between communities, between tradition and innovation, between today's challenge and tomorrow's opportunity."
                </p>
                <div style={{ marginTop: 12, fontWeight: 600, color: 'var(--mk-green-deep)', fontSize: '0.85rem' }}>— Dr. Rahmat Kanchagar, Founder & MD & CEO</div>
              </div>
              <div className="mk-grid mk-grid-3" style={{ gap: 0, border: '1px solid var(--mk-hairline)', borderRadius: 12, overflow: 'hidden' }}>
                {[{ n: '2002', label: 'Founded' }, { n: '7', label: 'Verticals' }, { n: '500+', label: 'Partners' }].map((s, i) => (
                  <div key={i} style={{ padding: '22px 16px', textAlign: 'center', borderRight: i < 2 ? '1px solid var(--mk-hairline)' : 'none', background: 'var(--mk-surface-soft)' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--mk-ink)' }}>{s.n}</div>
                    <div className="mk-eyebrow" style={{ margin: '4px 0 0', color: 'var(--mk-stone)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="mk-hero-dark" style={{ padding: '20px 22px', borderRadius: 12 }}>
                  <div className="mk-eyebrow" style={{ color: 'var(--mk-green-soft)', margin: '0 0 8px' }}>Our mission</div>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>To uplift communities through responsible business — connecting people to opportunity, culture to commerce, and tradition to technology.</p>
                </div>
                <div className="mk-card">
                  <div className="mk-eyebrow" style={{ color: 'var(--mk-tag)', margin: '0 0 8px' }}>Our vision</div>
                  <p className="mk-body" style={{ color: 'var(--mk-steel)', margin: 0, fontSize: '0.9rem' }}>To become India's most trusted community-driven conglomerate — a household name from Karnataka to every corner of the nation by 2030.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section style={{ background: 'var(--mk-canvas-dark)', padding: '13px 0', overflow: 'hidden' }}>
        <div className="ab-marquee">
          {[...Array(2)].map((_, r) => (['Established 2002', '•', 'Bengaluru, Karnataka', '•', '7 Business Verticals', '•', '500+ Partners', '•', '24+ Years of Excellence', '•']).map((t, i) => (
            <span key={`${r}-${i}`} style={{ fontFamily: 'var(--mk-font)', fontWeight: 500, fontSize: '0.8rem', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.75)', flexShrink: 0 }}>{t}</span>
          )))}
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="mk-section mk-sec-mint" ref={s5.ref}>
        <div className="mk-container">
          <div className={`mk-section-head mk-reveal ${s5.v ? 'mk-on' : ''}`}>
            <p className="mk-eyebrow">Our core values</p>
            <h2 className="mk-h1" style={{ margin: 0 }}>The principles behind everything</h2>
          </div>
          <div className="mk-grid mk-grid-4">
            {coreValues.map((v, i) => (
              <div key={i} className={`mk-card mk-card-hover mk-reveal ${s5.v ? 'mk-on' : ''}`} style={{ transitionDelay: `${i * 80}ms` }}>
                <div style={{ fontSize: '2rem', marginBottom: 14 }}>{v.icon}</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--mk-ink)', marginBottom: 8 }}>{v.title}</h3>
                <p className="mk-small" style={{ color: 'var(--mk-steel)', margin: 0, lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MD & CEO */}
      <section className="mk-section" style={{ background: 'var(--mk-canvas)' }} ref={s1.ref}>
        <div className="mk-container">
          <div className={`mk-section-head mk-reveal ${s1.v ? 'mk-on' : ''}`}>
            <p className="mk-eyebrow">Leadership</p>
            <h2 className="mk-h1" style={{ margin: 0 }}>MD & CEO — Manikya Group</h2>
          </div>
          <div className="ab-ceo-grid">
            <div className={`mk-reveal ${s1.v ? 'mk-on' : ''}`}>
              <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 50px rgba(10,10,10,0.12)', background: 'var(--mk-surface)' }}>
                <img src={IMG_RAHMAT} alt="Dr. Rahmat Kanchagar" style={{ width: '100%', display: 'block', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 24px', background: 'linear-gradient(to top,rgba(0,0,0,0.85),transparent)' }}>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '1.1rem' }}>Dr. Rahmat Kanchagar</div>
                  <div style={{ color: 'var(--mk-green-soft)', fontSize: '0.78rem', fontWeight: 600, marginTop: 3 }}>PhD · MD & CEO, Manikya Group</div>
                </div>
              </div>
              <div className="mk-card" style={{ marginTop: 18 }}>
                <div className="mk-eyebrow" style={{ color: 'var(--mk-stone)', margin: '0 0 12px' }}>Roles & designations</div>
                {['MD & CEO — Manikya Group', 'MD & CEO — Manikya Money Service Pvt Ltd', 'Founder & Editor-in-Chief — NewsJunction', 'Founder — Manikya Pearl Farm', 'Founder — Manikya E-Market & Manikya Roots'].map((role, i, arr) => (
                  <div key={i} style={{ display: 'flex', gap: 10, paddingBottom: 8, marginBottom: 8, borderBottom: i < arr.length - 1 ? '1px solid var(--mk-hairline)' : 'none' }}>
                    <Check size={15} color="#00b48a" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ color: 'var(--mk-slate)', fontSize: '0.875rem', lineHeight: 1.4 }}>{role}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`mk-reveal ${s1.v ? 'mk-on' : ''}`}>
              <p className="mk-eyebrow">About Dr. Rahmat Kanchagar</p>
              <h2 className="mk-h3" style={{ margin: '0 0 18px' }}>Senior Journalist, Media Strategist & Social Reformer</h2>
              <div className="mk-card" style={{ borderLeft: '4px solid var(--mk-green)', background: 'rgba(0,212,164,0.05)', marginBottom: 24 }}>
                <p style={{ fontStyle: 'italic', color: 'var(--mk-slate)', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                  "A unique blend of media excellence, social responsibility, and visionary leadership — an inspiration to aspiring journalists, entrepreneurs, and future leaders."
                </p>
              </div>
              <p className="mk-body" style={{ marginBottom: 16 }}>
                Dr. Rahmat Kanchagar (PhD) is a renowned senior journalist, media strategist, social reformer, and entrepreneur with more than <strong style={{ color: 'var(--mk-ink)' }}>25 years of experience</strong> in journalism, public service, and corporate leadership. As the MD & CEO of Manikya Group, he has dedicated his career to creating meaningful social impact through responsible media, business innovation, and community development.
              </p>
              <p className="mk-body" style={{ marginBottom: 16 }}>
                A <strong style={{ color: 'var(--mk-ink)' }}>PhD holder in Journalism</strong>, he is widely respected for his fearless reporting, people-centric approach, and commitment to social welfare. Over the years, he has produced and broadcasted more than <strong style={{ color: 'var(--mk-ink)' }}>1,000 impactful stories</strong> across Karnataka.
              </p>
              <div style={{ marginBottom: 20 }}>
                <div className="mk-eyebrow" style={{ color: 'var(--mk-stone)', margin: '0 0 12px' }}>Key social contributions</div>
                <div className="ab-pillars">
                  {['🏠 Rehabilitation for flood-affected families', '🛣️ Development of roads & hanging bridges in remote regions', '💡 Electrification of neglected rural villages', '📢 Awareness campaigns for public welfare', '🎭 Founder — Kannada Welfare Society, Hyderabad', '🎉 Organised first Mega Rajyotsava in Hyderabad'].map((item, i) => (
                    <div key={i} className="mk-card mk-card-hover" style={{ padding: '12px 14px' }}>
                      <span style={{ color: 'var(--mk-slate)', fontSize: '0.85rem', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/contact" className="mk-btn mk-btn-primary">Connect <ArrowRight size={14} /></Link>
                <Link to="/services" className="mk-btn mk-btn-outline">Our services</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIRECTORS */}
      <section className="mk-section mk-sec-lavender" ref={s6.ref}>
        <div className="mk-container">
          <div className={`mk-section-head mk-reveal ${s6.v ? 'mk-on' : ''}`}>
            <p className="mk-eyebrow">Board of directors</p>
            <h2 className="mk-h1" style={{ margin: 0 }}>Manikya Group directors</h2>
          </div>
          <div className="ab-dir-grid">
            {directors.map((dir, i) => (
              <div key={i} className={`mk-card mk-card-hover mk-reveal ${s6.v ? 'mk-on' : ''}`} style={{ transitionDelay: `${i * 100}ms`, padding: 0, overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: 320, overflow: 'hidden', background: 'rgba(0,212,164,0.08)' }}>
                  <img src={dir.photo} alt={dir.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px', background: 'linear-gradient(to top,rgba(0,0,0,0.8),transparent)' }}>
                    <div style={{ color: 'white', fontWeight: 600, fontSize: '1.05rem' }}>{dir.name}</div>
                    <div style={{ color: 'var(--mk-green-soft)', fontSize: '0.75rem', fontWeight: 600, marginTop: 2 }}>{dir.title} — Manikya Group</div>
                  </div>
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Quote size={20} style={{ color: 'var(--mk-green-deep)', flexShrink: 0, marginTop: 2 }} />
                    <p className="mk-small" style={{ color: 'var(--mk-steel)', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>{dir.message}</p>
                  </div>
                  <div style={{ height: 2, background: 'var(--mk-green)', width: 40, marginTop: 16, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MANIKYA MONEY OVERVIEW */}
      <section className="mk-hero-dark mk-section" ref={s2.ref}>
        <div className="mk-container">
          <div className="ab-grid-2">
            <div className={`mk-reveal ${s2.v ? 'mk-on' : ''}`}>
              <span className="mk-badge mk-badge-green" style={{ marginBottom: 18 }}>💰 Financial Services</span>
              <h2 className="mk-h1" style={{ color: '#fff', margin: '0 0 18px' }}>Manikya Money Service <span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 400, fontSize: '0.6em' }}>Pvt. Ltd.</span></h2>
              <p className="mk-lead" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>
                Founded on the principles of <strong style={{ color: 'var(--mk-green-soft)' }}>integrity and customer-centricity</strong>. We are your trusted financial partners — providing accessible, affordable, and innovative financial services to every segment of Indian society.
              </p>
              <div className="mk-grid mk-grid-2" style={{ marginBottom: 28 }}>
                <div style={{ padding: 18, border: '1px solid rgba(0,212,164,0.25)', background: 'rgba(0,212,164,0.06)', borderRadius: 12 }}>
                  <div className="mk-eyebrow" style={{ color: 'var(--mk-green-soft)', margin: '0 0 8px' }}>Our mission</div>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>To provide accessible, affordable, and innovative financial services through a seamless digital and physical experience.</p>
                </div>
                <div style={{ padding: 18, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)', borderRadius: 12 }}>
                  <div className="mk-eyebrow" style={{ color: '#8fb4f0', margin: '0 0 8px' }}>Our vision</div>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>To become a household name in financial services, recognized for speed, ethics, and commitment to client growth.</p>
                </div>
              </div>
              <Link to="/contact" className="mk-btn mk-btn-primary">Apply for a loan <ArrowRight size={14} /></Link>
            </div>
            <div className={`mk-reveal ${s2.v ? 'mk-on' : ''}`}>
              <div className="mk-grid mk-grid-2" style={{ gap: 0, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, overflow: 'hidden' }}>
                {[
                  { val: 24, suf: '+', label: 'Years of Excellence' },
                  { val: 500, suf: '+', label: 'Partners & Investors' },
                  { val: 7, suf: '', label: 'Business Verticals' },
                  { val: 48, suf: 'hr', label: 'Loan Approval' },
                  { val: 10, suf: '+', label: 'Bank Partners' },
                  { val: 100, suf: '%', label: 'Transparent' },
                ].map((s, i) => (
                  <div key={i} style={{ padding: '2rem 1.5rem', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ fontSize: 'clamp(1.5rem,4vw,2.4rem)', fontWeight: 700, color: '#fff', lineHeight: 1 }}><Counter end={s.val} suffix={s.suf} /></div>
                    <div className="mk-eyebrow" style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="mk-section mk-sec-peach" ref={s3.ref}>
        <div className="mk-container">
          <div className={`mk-section-head mk-reveal ${s3.v ? 'mk-on' : ''}`}>
            <p className="mk-eyebrow">Manikya Money Service</p>
            <h2 className="mk-h1" style={{ margin: 0 }}>Why choose Manikya Money Service?</h2>
          </div>
          <div className="ab-why-grid">
            {whyChoose.map((w, i) => (
              <div key={i} className={`mk-card mk-card-hover mk-reveal ${s3.v ? 'mk-on' : ''}`} style={{ transitionDelay: `${i * 70}ms` }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>{w.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--mk-ink)', marginBottom: 8 }}>{w.title}</h3>
                <p className="mk-small" style={{ color: 'var(--mk-steel)', margin: 0, lineHeight: 1.6 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="mk-section mk-sec-sky" ref={s4.ref}>
        <div className="mk-container">
          <div className={`mk-reveal ${s4.v ? 'mk-on' : ''}`} style={{ marginBottom: 36 }}>
            <p className="mk-eyebrow">Media & videos</p>
            <h2 className="mk-h1" style={{ margin: '0 0 20px' }}>Inside Manikya</h2>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--mk-hairline)', gap: 4 }}>
              {[{ key: 'ceo', label: 'CEO & Leadership' }, { key: 'company', label: 'Company Videos' }].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                  style={{ padding: '12px 20px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--mk-font)', fontWeight: 600, fontSize: '0.875rem', color: activeTab === tab.key ? 'var(--mk-ink)' : 'var(--mk-stone)', borderBottom: activeTab === tab.key ? '2px solid #00b48a' : '2px solid transparent', marginBottom: -1 }}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'ceo' && (
            <div className="ab-video-ceo">
              <div className={`mk-reveal ${s4.v ? 'mk-on' : ''}`}>
                <div style={{ aspectRatio: '16/9', background: '#0a0a0a', border: '1px solid var(--mk-hairline)', position: 'relative', overflow: 'hidden', borderRadius: 12 }}>
                  {videos['ceo'] ? (
                    <>
                      <video src={videos['ceo']} onClick={() => setPlayKey('ceo')} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 14px', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>MD & CEO Message</span>
                        <button onClick={() => setPlayKey('ceo')} style={{ background: '#00b48a', border: 'none', padding: '5px 12px', color: '#fff', fontFamily: 'var(--mk-font)', fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, borderRadius: 20 }}>
                          <Play size={12} style={{ fill: '#fff' }} /> Play
                        </button>
                      </div>
                      <label style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: 'rgba(0,0,0,0.7)', color: 'white', fontFamily: 'var(--mk-font)', fontSize: '0.68rem', cursor: 'pointer', borderRadius: 20 }}>
                        <Upload size={11} /> Replace
                        <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideoUpload('ceo', e)} />
                      </label>
                    </>
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, minHeight: 280 }}>
                      <Video size={48} style={{ color: 'rgba(255,255,255,0.15)' }} />
                      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>MD & CEO Message Video</p>
                      <label className="mk-btn mk-btn-green mk-btn-sm" style={{ cursor: 'pointer' }}>
                        <Plus size={15} /> Upload Video
                        <input ref={el => { fileRefs.current['ceo'] = el; }} type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideoUpload('ceo', e)} />
                      </label>
                      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem' }}>MP4, MOV, AVI supported</span>
                    </div>
                  )}
                </div>
                <div style={{ padding: '14px 0' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--mk-ink)', marginBottom: 4 }}>Dr. Rahmat Kanchagar — MD & CEO Message</h3>
                  <p className="mk-small" style={{ color: 'var(--mk-stone)' }}>On building a sustainable multi-sector enterprise for India</p>
                </div>
              </div>
              <div className={`mk-reveal ${s4.v ? 'mk-on' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[{ key: 'vision', label: "Vision 2030 — Manikya's Growth Roadmap" }, { key: 'values', label: 'Company Values & Culture' }, { key: 'impact', label: 'Our Impact on Indian Communities' }].map(vid => (
                  <div key={vid.key} className="mk-card" style={{ display: 'flex', gap: 14, padding: 14, alignItems: 'center' }}>
                    <div style={{ width: 100, height: 60, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', overflow: 'hidden', borderRadius: 8 }}>
                      {videos[vid.key]
                        ? <video src={videos[vid.key]} onClick={() => setPlayKey(vid.key)} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
                        : <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                            <Plus size={18} style={{ color: 'rgba(255,255,255,0.3)' }} />
                            <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)' }}>Upload</span>
                            <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideoUpload(vid.key, e)} />
                          </label>
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--mk-ink)', fontSize: '0.875rem', lineHeight: 1.3, marginBottom: 4 }}>{vid.label}</div>
                      {videos[vid.key]
                        ? <button onClick={() => setPlayKey(vid.key)} style={{ fontSize: '0.72rem', color: '#00b48a', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>▶ Play Video</button>
                        : <label style={{ fontSize: '0.72rem', color: 'var(--mk-stone)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
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

          {activeTab === 'company' && (
            <div className="ab-company-grid">
              {videoSlots.map((vs, i) => (
                <div key={vs.key} className={`mk-reveal ${s4.v ? 'mk-on' : ''}`} style={{ transitionDelay: `${i * 70}ms`, border: '1px solid var(--mk-hairline)', overflow: 'hidden', background: '#fff', position: 'relative', borderRadius: 12 }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: vs.color, zIndex: 1 }} />
                  <div style={{ aspectRatio: '16/9', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
                    {videos[vs.key] ? (
                      <>
                        <video src={videos[vs.key]} onClick={() => setPlayKey(vs.key)} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
                        <button onClick={() => setPlayKey(vs.key)} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 44, height: 44, borderRadius: '50%', border: `2px solid ${vs.color}`, background: `${vs.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Play size={16} style={{ color: '#fff', fill: '#fff' }} />
                        </button>
                        <label style={{ position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', background: 'rgba(0,0,0,0.7)', color: 'white', fontFamily: 'var(--mk-font)', fontSize: '0.62rem', cursor: 'pointer', borderRadius: 20 }}>
                          <Upload size={10} /> Replace
                          <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideoUpload(vs.key, e)} />
                        </label>
                      </>
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 16 }}>
                        <Video size={32} style={{ color: `${vs.color}66` }} />
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: vs.color, color: '#fff', fontFamily: 'var(--mk-font)', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', borderRadius: 20 }}>
                          <Plus size={13} /> Upload Video
                          <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideoUpload(vs.key, e)} />
                        </label>
                        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem' }}>MP4, MOV, AVI</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div className="mk-mono" style={{ fontSize: '0.7rem', fontWeight: 500, color: vs.color, marginBottom: 5 }}>{vs.duration}</div>
                    <div style={{ fontWeight: 600, color: 'var(--mk-ink)', fontSize: '0.95rem', lineHeight: 1.35 }}>{vs.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="mk-hero-dark mk-section" ref={s7.ref}>
        <div className="mk-container">
          <div className={`mk-reveal ${s7.v ? 'mk-on' : ''}`} style={{ marginBottom: 48 }}>
            <p className="mk-eyebrow" style={{ color: 'var(--mk-green-soft)' }}>Our journey</p>
            <h2 className="mk-h1" style={{ color: '#fff', margin: 0 }}>Two decades. Eight milestones.</h2>
          </div>
          <div className="ab-timeline">
            {milestones.map((m, i) => (
              <div key={i} className={`mk-reveal ${s7.v ? 'mk-on' : ''}`}
                style={{ transitionDelay: `${i * 70}ms`, padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.07)', borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.07)' : 'none', position: 'relative', overflow: 'hidden' }}>
                <span className="mk-badge" style={{ background: 'rgba(0,212,164,0.15)', color: 'var(--mk-green-soft)', border: '1px solid rgba(0,212,164,0.3)', marginBottom: 10 }}>{m.year}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#fff', margin: '10px 0 6px' }}>{m.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
                <div className="mk-mono" style={{ position: 'absolute', bottom: -12, right: 12, fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 500, color: 'rgba(255,255,255,0.04)', lineHeight: 1 }}>{m.year.replace('+', '')}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mk-section" style={{ background: 'var(--mk-canvas)', textAlign: 'center' }}>
        <div className="mk-container" style={{ maxWidth: 720 }}>
          <p className="mk-eyebrow">Let's build together</p>
          <h2 className="mk-display" style={{ margin: '0 0 18px' }}>Ready when you are.</h2>
          <p className="mk-lead" style={{ maxWidth: 540, margin: '0 auto 32px' }}>
            Whether you're an investor, partner, customer, or looking for financial assistance — Manikya has a solution for you.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="mk-btn mk-btn-primary mk-btn-lg">Get in touch <ArrowRight size={16} /></Link>
            <Link to="/services" className="mk-btn mk-btn-glass mk-btn-lg">Our services</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
