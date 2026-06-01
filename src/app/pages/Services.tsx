import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import {
  Newspaper, Sparkles, ShoppingBag, Leaf, Building2, DollarSign, Clock,
  ArrowRight, ChevronRight, CheckCircle, Phone, ExternalLink,
  Play, Radio, Globe, Shield, TrendingUp, Home, FileText,
  Users
} from 'lucide-react';

/* ── Asset paths — exact filenames from public/media/ ──
   Images to copy into public/media/:
   pearl-farm-pond.jpg            ← 1150745d-af43-40e9-a899-bc7f7678be74.jpg  (Pearl Farms)
   manikya-market-vegetables.jpg  ← markus-spiske-3nX7pythQyM-unsplash.jpg    (E-Market)
   manikya-roots-product.jpg      ← WhatsApp_Image_2026-05-12_at_9_48_53_PM.jpeg (Manikya Roots - Amrutha product)
   manikya-properties-urban.jpg   ← urban2.jpg                                 (Manikya Properties)
   manikya-properties-bank.jpg    ← 2304_q702_034_F_m005_c7_bank.jpg           (Manikya Money)
*/
const njVideo      = '/media/WhatsApp Video 2026-05-12 at 9.49.00 PM.mp4';
const logoCrime    = '/media/WhatsApp Image 2026-05-12 at 9.48.46 PM.jpeg';
const logoMusic    = '/media/WhatsApp Image 2026-05-12 at 9.48.48 PM.jpeg';
const logoComedy   = '/media/WhatsApp Image 2026-05-12 at 9.48.52 PM.jpeg';
const logoRoots    = '/media/WhatsApp Image 2026-05-12 at 9.48.53 PM.jpeg';
const logoTelugu   = '/media/WhatsApp Image 2026-05-12 at 9.48.54 PM.jpeg';
const logoHeritage = '/media/WhatsApp Image 2026-05-12 at 9.48.55 PM.jpeg';
const logoKannada  = '/media/WhatsApp Image 2026-05-12 at 9.48.57 PM.jpeg';
const logoEnglish  = '/media/WhatsApp Image 2026-05-12 at 9.48.59 PM.jpeg';
const logoHindi    = '/media/WhatsApp Image 2026-05-12 at 9.48.59 PM.jpeg';
const bgPearl      = '/media/pearl-farm-pond.jpg';
const bgMarket     = '/media/manikya-market-vegetables.jpg';
const bgRoots      = '/media/manikya-roots-product.jpg';
const bgTraders    = '/manikya-traders-banner.jpg';
const bgProperties = '/media/manikya-properties-urban.jpg';
const bgMoney      = '/media/manikya-properties-bank.jpg';

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

/* ── channels ── */
const channels = [
  { name:'NewsJunction Kannada', lang:'ಕನ್ನಡ', flag:'🟠', color:'#ef4444', url:'https://newsjunction.net/stream.php',           desc:"Karnataka's #1 Kannada digital channel — hyper-local stories from all 31 districts, politics, culture." },
  { name:'NewsJunction Hindi',   lang:'हिन्दी',  flag:'🔵', color:'#3b82f6', url:'https://newsjunction.net/channel.php?channelId=47&channelName=Jankranti+hindi+news+bulletin', desc:'Jankranti Hindi News Bulletin — pan-India coverage with a Southern Indian editorial lens.' },
  { name:'NewsJunction Marathi', lang:'मराठी',  flag:'🟢', color:'#10b981', url:'https://newsjunction.net/stream.php',           desc:'Marathi news and live programs serving Marathi-speaking communities with authentic regional stories from Maharashtra and beyond.' },
  { name:'NewsJunction Telugu',  lang:'తెలుగు', flag:'🟣', color:'#8b5cf6', url:'https://newsjunction.net/stream.php',           desc:'Andhra and Telangana news with comprehensive coverage of regional politics and business events.' },
  { name:'NewsJunction English', lang:'English', flag:'🔴', color:'#f59e0b', url:'https://newsjunction.net/featured_channels.php?rss_id=132', desc:'National & global English news with an Indian editorial lens — for professionals and the diaspora.' },
];

/* ── Logo map for service hero strips ── */
const serviceLogos: Record<number, string> = {
  1: logoHeritage,
  4: logoRoots,
};

/* ── Sub-channel logos for NewsJunction (id=1) ── */
const newsChannelLogos = [
  { lang: 'Kannada', file: logoKannada, color:'#ef4444' },
  { lang: 'English', file: logoEnglish, color:'#f59e0b' },
  { lang: 'Hindi',   file: logoHindi,   color:'#3b82f6' },
  { lang: 'Telugu',  file: logoTelugu,  color:'#8b5cf6' },
  { lang: 'Crime',   file: logoCrime,   color:'#7c3aed' },
  { lang: 'Comedy',  file: logoComedy,  color:'#f59e0b' },
  { lang: 'Music',   file: logoMusic,   color:'#ec4899' },
];

/* ── Heritage logo ── */
const heritageLogo = logoHeritage;

/* ── NewsJunction video ── */
const newsJunctionVideo = njVideo;

/* ── service data ── */
const serviceData: Record<number, any> = {
  1: {
    stats:[{value:'5',label:'Language Channels',icon:'🌐'},{value:'31+',label:'Districts Covered',icon:'📍'},{value:'24/7',label:'Live Streaming',icon:'📡'},{value:'2002',label:'Established',icon:'🏆'}],
    howItWorks:[
      {step:1,title:'Multi-Language Coverage',desc:'Five dedicated language desks — each with local journalists delivering verified news in Kannada, Hindi, Tamil, Telugu, and English.'},
      {step:2,title:'Hyper-Local Reporting',desc:'Reporters embedded in all 31 Karnataka districts ensuring every village story gets the national attention it deserves.'},
      {step:3,title:'Live Streaming & Digital',desc:'Watch 24/7 live news at newsjunction.net. Content distributed across YouTube, social media, and mobile apps.'},
      {step:4,title:'Integrated Commerce',desc:"NewsJunction's shoppable content is integrated with E-Market — watch a story, buy the product directly from the artisan."},
    ],
    extra:{title:'Entertainment Beyond News',items:['🎵 Music Junction — regional music programming','😂 Comedy Junction — original comedy content','🛒 Shoppable News — buy from what you watch','🎙️ Citizen Journalism — your voice, our platform']},
  },
  2: {
    stats:[{value:'500+',label:'Active Investors',icon:'👥'},{value:'40%',label:'Expected ROI',icon:'📈'},{value:'18mo',label:'Harvest Cycle',icon:'⏱️'},{value:'100%',label:'Buyback Assured',icon:'🛡️'}],
    howItWorks:[
      {step:1,title:'Site Selection & Setup',desc:'We identify water bodies in Mandya with optimal water chemistry. Ponds are prepared with filtration, oxygenation, and cage infrastructure.'},
      {step:2,title:'Oyster Procurement & Nucleation',desc:'Certified healthy oysters sourced. Expert technicians surgically insert a nucleus into each oyster — the seed of every pearl.'},
      {step:3,title:'Farm Monitoring',desc:'For 12–18 months our team monitors water quality, oyster health, and growth rates with regular cleaning and feeding schedules.'},
      {step:4,title:'Harvest, Grade & Sell',desc:'Pearls harvested, professionally graded, certified, and sold through our established network for maximum returns.'},
    ],
    extra:{title:'Why Pearl Farming?',items:['💎 A living asset — grows in value daily','🌿 Eco-friendly — improves water quality','💰 Passive income — no daily involvement needed','🏆 Backed by biological science and expert farming']},
  },
  3: {
    stats:[{value:'100%',label:'Desi Origin',icon:'🇮🇳'},{value:'500+',label:'Village Products',icon:'🏘️'},{value:'0',label:'Tech Burden for Sellers',icon:'✅'},{value:'24hr',label:'Rapid Delivery',icon:'🚚'}],
    howItWorks:[
      {step:1,title:'Seller Onboarding',desc:'We visit villages, identify artisans, weavers, and farmers. We handle photography, listing, and digital presence — they just focus on making.'},
      {step:2,title:'Story-Driven Commerce',desc:'"Meet the Maker" videos connect buyers with the human behind every product — the artisan, their village, and their craft.'},
      {step:3,title:'Rapid Rurban Delivery',desc:'Our logistics network bridges the last-mile gap from remote villages to urban doorsteps and global buyers.'},
      {step:4,title:'Payment & Empowerment',desc:'Sellers receive transparent, real-time payments. Women-led self-help groups get priority listing, mentoring, and wider markets.'},
    ],
    extra:{title:'What We Sell',items:['🧵 Handloom textiles and silk products','🏺 Traditional pottery and terracotta art','🍯 Organic honey, pickles and homemade foods','🌿 Herbal products, oils and natural cosmetics']},
  },
  4: {
    stats:[{value:'B2B',label:'Business Model',icon:'🤝'},{value:'100%',label:'Transparent',icon:'✅'},{value:'KA-Wide',label:'Vendor Network',icon:'🗺️'},{value:'20+',label:'Years of Trust',icon:'🏆'}],
    howItWorks:[
      {step:1,title:'Vendor Registers Product',desc:'Manufacturers and producers from their own warehouse or production unit register their food machinery or commodity with us — roti machines, packaging equipment, grains, pulses and more.'},
      {step:2,title:'We Market & Advertise',desc:'Manikya Traders runs digital campaigns, WhatsApp outreach, field sales and on-ground promotions to connect your product with the right buyers across Karnataka and beyond.'},
      {step:3,title:'We Match Buyer to Vendor',desc:'Our team identifies the right client — hotels, canteens, food factories, retailers — and facilitates direct introductions, demos and presentations on your behalf.'},
      {step:4,title:'Deal Closed — Everyone Wins',desc:'Vendor gets the sale, buyer gets the right product, and Manikya Traders earns a transparent commission. No hidden charges. Clean, fast, and simple.'},
    ],
    extra:{title:'What We Trade & Market',items:['🫓 Roti & chapati making machines','📦 Food packaging & sealing machinery','🌾 Grain & pulse processing equipment','🍚 Rice, wheat, pulses & commodity trading','🔧 Commercial kitchen & milling instruments','📣 Full B2B digital & field marketing']},
  },
  5: {
    stats:[{value:'100%',label:'Client-First',icon:'🤝'},{value:'0',label:'Hidden Charges',icon:'✅'},{value:'10+',label:'Bank Partners',icon:'🏦'},{value:'100%',label:'Legal Verified',icon:'⚖️'}],
    howItWorks:[
      {step:1,title:'Share Your Requirements',desc:'Tell us your budget, preferred location, property type, and loan eligibility. We create a personalised property search plan.'},
      {step:2,title:'We Shortlist & Arrange Visits',desc:'Our team shortlists verified properties matching your criteria, arranges site visits, and helps you compare options objectively.'},
      {step:3,title:'Bank Loan Coordination',desc:'We liaise with SBI, HDFC, ICICI, Axis, and other banks on your behalf — negotiate the best interest rate and terms.'},
      {step:4,title:'Legal, Registration & Handover',desc:'Legal team verifies title deeds, encumbrance certificates, and RERA approvals. We assist with registration and handover.'},
    ],
    extra:{title:'Property Types We Handle',items:['🏠 Residential — apartments, villas, independent houses','🏢 Commercial — offices, shops, warehouses, showrooms','🌾 Agricultural plots and farm lands','📐 Layout plots and gated community homes']},
  },
  6: {
    stats:[{value:'24hr',label:'Loan Approval',icon:'⚡'},{value:'0',label:'Hidden Charges',icon:'✅'},{value:'10+',label:'Bank Partners',icon:'🏦'},{value:'100%',label:'Transparent',icon:'🛡️'}],
    howItWorks:[
      {step:1,title:'Digital Application',desc:'Apply online with minimal documentation — ID proof, income proof, and basic KYC. Our digital process saves you time and paperwork.'},
      {step:2,title:'Quick Assessment',desc:'Our team reviews your application within hours and provides an in-principle approval. No lengthy waiting periods.'},
      {step:3,title:'Bank Coordination',desc:'We liaise with our 10+ partner banks to find the best rate for your profile — personal loans, home loans, business loans.'},
      {step:4,title:'Fast Disbursement',desc:'Post approval, funds are disbursed within 2–3 working days. Clear repayment schedule with no hidden fees.'},
    ],
    extra:{title:'Why Choose Manikya Money?',items:['⚡ Speedy Approvals — 24–48 hours','💰 Low Interest Rates — from 10% p.a.','✅ No Hidden Charges — complete transparency','📱 Fully Digital Process — apply from anywhere']},
  },
};


/* ── Per-service brand logo rows ── */
const serviceBrandLogos: Record<number, { file: string; label: string; color: string }[]> = {
  2: [ // Pearl Farms
    { file: logoKannada,  label: 'Mandya Farm',    color: '#3b82f6' },
    { file: logoEnglish,  label: 'Certified Pearls', color: '#06b6d4' },
    { file: logoHindi,    label: 'Investor Portal', color: '#0ea5e9' },
    { file: logoTelugu,   label: 'Buyback Program', color: '#38bdf8' },
  ],
  3: [ // E-Market
    { file: logoKannada,  label: 'Handloom',       color: '#10b981' },
    { file: logoEnglish,  label: 'Organic Foods',  color: '#059669' },
    { file: logoHindi,    label: 'Pottery & Art',  color: '#34d399' },
    { file: logoTelugu,   label: 'Women SHGs',     color: '#6ee7b7' },
    { file: logoCrime,    label: 'Village Crafts', color: '#10b981' },
  ],
  4: [ // Manikya Traders
    { file: logoKannada,  label: 'Machinery Marketing', color: '#f59e0b' },
    { file: logoEnglish,  label: 'Grain Trading',       color: '#f97316' },
    { file: logoHindi,    label: 'Vendor Network',      color: '#ef4444' },
    { file: logoTelugu,   label: 'B2B Outreach',        color: '#fbbf24' },
  ],
  5: [ // Manikya Properties
    { file: logoKannada,  label: 'Residential',    color: '#f59e0b' },
    { file: logoEnglish,  label: 'Commercial',     color: '#ef4444' },
    { file: logoHindi,    label: 'Home Loans',     color: '#f97316' },
    { file: logoTelugu,   label: 'Farm Lands',     color: '#fbbf24' },
  ],
  6: [ // Manikya Money
    { file: logoKannada,  label: 'Personal Loans', color: '#8b5cf6' },
    { file: logoEnglish,  label: 'Business Loans', color: '#a855f7' },
    { file: logoHindi,    label: 'Home Loans',     color: '#7c3aed' },
    { file: logoTelugu,   label: 'Quick Approval', color: '#c084fc' },
  ],
};

const services = [
  { id:1, title:'NewsJunction',      subtitle:'Digital Media Network',   icon:Newspaper,   gradient:'linear-gradient(135deg,#ef4444,#f97316)', accent:'#ef4444', tag:'Media',         hasChannels:true,  tagline:'One Network. Many Voices.', description:'NewsJunction is a National Multi-Lingual Media Powerhouse with five dedicated language channels delivering 24/7 live news, entertainment, and hyper-local stories from across India.', features:['5 dedicated language channels with local editorial teams','Live 24/7 streaming at newsjunction.net','Coverage of all 31 Karnataka districts','Music Junction & Comedy Junction verticals','Shoppable content integrated with E-Market','Citizen journalism and audience engagement'], link:'/contact' },
  { id:2, title:'Pearl Farms',        subtitle:'Premium Investment',       icon:Sparkles,    gradient:'linear-gradient(135deg,#3b82f6,#06b6d4)', accent:'#3b82f6', tag:'★ Featured',   featured:true,     tagline:'Where Nature Meets High-Yield Financial Growth.', description:'A premium alternative investment combining sustainable freshwater pearl farming in Mandya, Karnataka with lucrative returns. We connect urban investors with trained farmers.', features:['Expected ROI of 30–40% per 18-month cycle','Complete technical training and farm setup','End-to-end support from pond prep to pearl sales','100% buyback assurance with certified market linkage','Passive income — no daily farm involvement required','Eco-friendly farming that improves water body health'], link:'/pearl-farms' },
  { id:3, title:'E-Market',     subtitle:'Rapid Desi Online Bazar',  icon:ShoppingBag, gradient:'linear-gradient(135deg,#10b981,#059669)', accent:'#10b981', tag:'Commerce',      tagline:'From the Heart of Villages to Doorsteps Worldwide.', description:'A tech-enabled marketplace bridging authentic Indian village craftsmanship with global consumers. We handle everything for rural sellers so they can focus on their craft.', features:['100% Desi products sourced directly from artisans','Rapid delivery through our rurban logistics network','"Meet the Maker" story-driven shoppable content','Priority platform for women entrepreneurs and SHGs','Zero technical burden for rural producers','Integrated discovery through NewsJunction coverage'], link:'/contact' },
  { id:4, title:'Manikya Traders',    subtitle:'Marketing & Trading',      icon:TrendingUp,  gradient:'linear-gradient(135deg,#f59e0b,#ef4444)', accent:'#f59e0b', tag:'Trading',       tagline:'We Trade · You Grow · Together We Prosper.', description:'Manikya Traders is the B2B marketing and commodity trading arm of Manikya Group. We are the intermediary between food machinery manufacturers, grain producers, and businesses — handling all marketing, outreach, and deal facilitation.', features:['Food machinery marketing — roti, packaging, milling machines','Grain & commodity trading — rice, wheat, pulses, spices','B2B vendor–client matchmaking across Karnataka','Digital + field marketing campaigns for your product','Transparent commission model — no hidden charges','Backed by 20+ years of Manikya Group trust'], link:'/contact' },
  { id:5, title:'Manikya Properties', subtitle:'Real Estate & Home Loans', icon:Building2,   gradient:'linear-gradient(135deg,#1e3a5f,#2563eb)', accent:'#2563eb', tag:'Real Estate',   tagline:'Your Dream Home, Made Possible.', description:'Manikya Properties is your end-to-end real estate facilitator — we find the property, verify it legally, coordinate your bank loan, and handle all documentation.', features:['Residential & commercial property search','Home loan facilitation — SBI, HDFC, ICICI, Axis & more','Complete documentation support — zero paperwork stress','Legal title verification, encumbrance & RERA checks','Price negotiation assistance for best market deal','Post-purchase: registration, mutation & handover support'], link:'/contact' },
  { id:6, title:'Manikya Money',      subtitle:'Financial Services',       icon:DollarSign,  gradient:'linear-gradient(135deg,#8b5cf6,#a855f7)', accent:'#8b5cf6', tag:'Finance',       tagline:'Empowering Your Financial Future with Trust.', description:'Manikya Money Service Pvt. Ltd. provides accessible, affordable financial services to every segment of Indian society — personal loans, business loans, and home loan facilitation.', features:['Personal, business & home loan facilitation','Speedy approval in 24–48 business hours','Low interest rates — competitive & transparent','Zero hidden charges — complete transparency','Minimal documentation — digital-friendly process','Customer-first support at every step of the journey'], link:'/contact' },
];

const comingSoon = {
  title:'Manikya Heritage', subtitle:'Mega Heritage Village',
  tagline:'Preserving the Past, Inspiring the Future',
  description:"A living museum preserving Karnataka's 5000-year-old architecture, art, and lifestyle. Artisan workshops, Ayurvedic wellness zones, traditional homes, folk performances, and heritage stays.",
  features:['Authentic Chowkimane & Gutthu Mane traditional homes','Folk arts: Yakshagana, Dollu Kunitha, Kamsale','Ayurvedic Grama with herb gardens and wellness therapy','Artisan Street — live pottery, weaving, craft workshops','Heritage stay cottages for authentic cultural immersion'],
};

export default function Services() {
  const [active, setActive]           = useState(0);
  const [showChannels, setShowChannels] = useState(false);
  const [hovCh, setHovCh]             = useState<number|null>(null);
  const [isMuted, setIsMuted]          = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hero = useInView(); const detail = useInView(); const coming = useInView();

  const s = services[active];
  const Icon = s.icon;
  const data = serviceData[s.id];

  // Auto-play video when NewsJunction is active
  useEffect(() => {
    if (s.id === 1 && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [active, s.id]);

  return (
    <div style={{ fontFamily:'Georgia,serif', overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes logoReveal{0%{opacity:0;filter:drop-shadow(0 0 0px rgba(59,130,246,0)) brightness(0.3)}40%{opacity:0.9;filter:drop-shadow(0 0 80px rgba(59,130,246,1)) drop-shadow(0 0 120px rgba(239,68,68,0.9)) brightness(2.5)}70%{opacity:0.5;filter:drop-shadow(0 0 40px rgba(59,130,246,0.7)) brightness(1.6)}100%{opacity:0.15;filter:drop-shadow(0 0 40px rgba(59,130,246,0.5)) drop-shadow(0 0 80px rgba(239,68,68,0.3)) brightness(1.2)}}
        @keyframes heroTextIn{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes heroBadgeIn{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.9)}}
        @keyframes tabIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes twinkle{0%,100%{opacity:.15}50%{opacity:.65}}
        @keyframes csPulse{0%,100%{box-shadow:0 0 0 0 rgba(139,92,246,0.3)}50%{box-shadow:0 0 0 12px rgba(139,92,246,0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes imgFadeIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes logoFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes pearlFloat{0%{transform:translate(0,0) scale(1)}100%{transform:translate(20px,-20px) scale(1.1)}}
        @keyframes bubble{0%{transform:translateY(0);opacity:.6}100%{transform:translateY(-400px);opacity:0}}
        @keyframes sway{0%{transform:rotate(-5deg)}100%{transform:rotate(5deg)}}
        @keyframes grow{0%{transform:scaleY(0.7)}100%{transform:scaleY(1.1)}}
        @keyframes bgShift{0%{filter:brightness(0.85) hue-rotate(0deg)}100%{filter:brightness(1.1) hue-rotate(15deg)}}
        @keyframes gridMove{0%{backgroundPosition:0 0}100%{backgroundPosition:60px 60px}}
        @keyframes riseBar{0%{height:20%}100%{height:70%}}
        @keyframes windowBlink{0%,100%{opacity:0.1}50%{opacity:0.7}}
        @keyframes logoPopIn{from{opacity:0;transform:translateY(20px) scale(0.85)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes kenBurns{from{transform:scale(1) translate(0,0)}to{transform:scale(1.08) translate(-1%,-1%)}}

        .gold{background:linear-gradient(90deg,#f59e0b,#fde68a,#f59e0b);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite}
        .reveal{opacity:0;transform:translateY(28px);transition:all .7s cubic-bezier(.16,1,.3,1)}
        .reveal.on{opacity:1;transform:translateY(0)}
        .tab-content{animation:tabIn .45s cubic-bezier(.16,1,.3,1)}
        .svc-tab{transition:all .3s ease;cursor:pointer;border:none}
        .ch-card{transition:all .35s cubic-bezier(.16,1,.3,1)}
        .ch-card:hover{transform:translateY(-6px)}
        .btn{transition:all .3s ease;text-decoration:none}
        .btn:hover{transform:translateY(-2px);opacity:.92}
        .how-card{transition:all .35s ease}
        .how-card:hover{transform:translateY(-5px)}
        .feat-row{transition:transform .25s ease}
        .feat-row:hover{transform:translateX(5px)}
        .xlink{transition:all .3s ease;text-decoration:none}
        .xlink:hover{transform:translateY(-5px)}
        .live-dot{width:8px;height:8px;border-radius:50%;background:#ef4444;display:inline-block;animation:pulse 1.5s ease-in-out infinite}
        .cs-glow{animation:csPulse 2.5s ease-in-out infinite}
        .img-fade-in{animation:imgFadeIn .4s ease forwards}
        .marquee-track{display:flex;gap:60px;animation:marquee 20s linear infinite;white-space:nowrap}
        .upload-frame{transition:all .3s ease;cursor:pointer}
        .upload-frame:hover{opacity:.85}
        .logo-float{animation:logoFloat 3s ease-in-out infinite}
        /* ── MOBILE FIXES ── */
        @media(max-width:900px){
          .detail-grid{grid-template-columns:1fr!important}
          .channel-logos-grid{grid-template-columns:repeat(3,1fr)!important;gap:8px!important}
          .cs-heritage-grid{grid-template-columns:1fr!important}
          .stats-bar-grid{grid-template-columns:repeat(2,1fr)!important;gap:4px!important}
          .svc-tab-row{padding:0 0.5rem!important}
          .cross-links{gap:8px!important}
          .cross-link-item{min-width:80px!important;padding:12px 14px!important}
        }
        @media(max-width:600px){
          .channel-logos-grid{grid-template-columns:repeat(2,1fr)!important}
          .stats-bar-grid{grid-template-columns:repeat(2,1fr)!important;gap:6px!important;padding:0 1rem!important}
          .svc-hero-tabs{gap:6px!important}
          .svc-hero-tab{padding:6px 10px!important;font-size:0.72rem!important}
        }
        @media(max-width:480px){
          .hero-txt h1{font-size:2.2rem!important}
          .stats-bar-grid{grid-template-columns:repeat(2,1fr)!important;padding:0 0.75rem!important}
        }

        .channel-logo{transition:all .3s ease;cursor:pointer}
        .channel-logo:hover{transform:scale(1.08);box-shadow:0 8px 24px rgba(0,0,0,0.35)!important}
        .nj-video-header{position:relative;width:100%;overflow:hidden;background:#000}
        @media(max-width:768px){.strip-grid{flex-direction:column!important}.detail-grid{grid-template-columns:1fr!important}.channel-logos-grid{grid-template-columns:repeat(3,1fr)!important}}
      `}</style>

      {/* ── HERO ── */}
      <section style={{ background:'linear-gradient(135deg,#020817,#0a1628,#1e3a8a)',padding:'7rem 0 4rem',position:'relative',overflow:'hidden',minHeight:420 }}>

        {/* Stars */}
        {Array.from({length:28},(_,i)=>(
          <div key={i} style={{ position:'absolute',width:Math.random()*2.5+0.5,height:Math.random()*2.5+0.5,borderRadius:'50%',background:'white',left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,opacity:Math.random()*0.5+0.1,animation:`twinkle ${Math.random()*4+3}s ease-in-out ${Math.random()*3}s infinite` }}/>
        ))}

        {/* Glow orbs */}
        {[['70%','20%','rgba(59,130,246,0.2)'],['10%','65%','rgba(245,158,11,0.12)'],['85%','75%','rgba(139,92,246,0.15)']].map(([x,y,c],i)=>(
          <div key={i} style={{ position:'absolute',left:x,top:y,width:300,height:300,borderRadius:'50%',background:`radial-gradient(circle,${c},transparent)`,filter:'blur(55px)',transform:'translate(-50%,-50%)',pointerEvents:'none' }}/>
        ))}

        {/* ── Logo: glows bright first, then settles to watermark ── */}
        <div style={{
          position:'absolute', top:'50%', left:'50%',
          transform:'translate(-50%,-50%)',
          width:'clamp(280px,38vw,520px)',
          pointerEvents:'none', zIndex:0,
        }}>
          <img
            src="/manikya-logo-services.png"
            alt=""
            aria-hidden="true"
            style={{
              width:'100%', height:'auto',
              mixBlendMode:'screen',
              animation:'logoReveal 2.2s cubic-bezier(0.16,1,0.3,1) 0.1s both',
            }}
          />
        </div>

        {/* ── Hero text — fades in AFTER logo highlight ── */}
        <div style={{ maxWidth:1280,margin:'0 auto',padding:'0 2rem',position:'relative',zIndex:1,textAlign:'center' }} ref={hero.ref}>
          <div>
            {/* Badge — appears after logo */}
            <div style={{
              display:'inline-flex',alignItems:'center',gap:8,padding:'8px 18px',borderRadius:40,
              background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.35)',marginBottom:20,
              animation:'heroBadgeIn 0.6s cubic-bezier(0.16,1,0.3,1) 1.6s both',
            }}>
              <span className="live-dot"/>
              <span style={{ color:'#fde68a',fontSize:'0.68rem',letterSpacing:'0.25em',fontWeight:700,textTransform:'uppercase',fontFamily:'DM Sans,sans-serif' }}>7 Business Verticals · 1 Coming Soon</span>
            </div>

            {/* Heading */}
            <h1 style={{
              fontSize:'clamp(2.8rem,6vw,4.5rem)',fontWeight:700,color:'white',lineHeight:1.1,marginBottom:16,
              animation:'heroTextIn 0.8s cubic-bezier(0.16,1,0.3,1) 1.8s both',
            }}>
              Our <span className="gold">Services</span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontFamily:'DM Sans,sans-serif',color:'#93c5fd',fontSize:'clamp(0.9rem,1.8vw,1.1rem)',
              maxWidth:'42rem',lineHeight:1.75,margin:'0 auto 28px',
              animation:'heroTextIn 0.8s cubic-bezier(0.16,1,0.3,1) 2s both',
            }}>
              Seven powerful business verticals — media, investment, commerce, wellness, real estate, financial services, and culture.
            </p>

            {/* Service tab buttons */}
            <div style={{
              display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center',
              animation:'heroTextIn 0.8s cubic-bezier(0.16,1,0.3,1) 2.2s both',
            }}>
              {services.map((sv,i)=>{
                const SI=sv.icon;
                return(
                  <button key={sv.id} className="svc-tab"
                    onClick={()=>{ setActive(i); setShowChannels(false); document.getElementById('detail')?.scrollIntoView({behavior:'smooth'}); }}
                    style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 16px',borderRadius:40,background:active===i?sv.gradient:'rgba(255,255,255,0.08)',color:'white',border:active===i?'none':'1px solid rgba(255,255,255,0.15)',boxShadow:active===i?`0 4px 20px ${sv.accent}50`:'none',fontWeight:600,fontSize:'0.85rem',fontFamily:'DM Sans,sans-serif' }}>
                    <SI size={14}/>{sv.title}
                    {sv.featured&&<span style={{ background:'rgba(255,255,255,0.3)',borderRadius:8,padding:'1px 6px',fontSize:'0.62rem' }}>★</span>}
                  </button>
                );
              })}
              <div style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 16px',borderRadius:40,background:'rgba(255,255,255,0.04)',border:'1px dashed rgba(255,255,255,0.25)',color:'rgba(255,255,255,0.5)',fontWeight:600,fontSize:'0.85rem',fontFamily:'DM Sans,sans-serif' }}>
                🏛️ Heritage <span style={{ fontSize:'0.62rem',background:'rgba(245,158,11,0.2)',color:'#fbbf24',padding:'1px 6px',borderRadius:6 }}>Soon</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ position:'absolute',bottom:0,left:0,right:0 }}>
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg"><path d="M0,50 C480,90 960,20 1440,50 L1440,80 L0,80 Z" fill="#f8fafc"/></svg>
        </div>
      </section>

      {/* ── STICKY TAB ROW ── */}
      <section style={{ background:'white',padding:'0',position:'sticky',top:0,zIndex:50,boxShadow:'0 2px 12px rgba(0,0,0,0.07)',borderBottom:'1px solid #f1f5f9' }}>
        <div style={{ maxWidth:1280,margin:'0 auto',padding:'0 2rem',display:'flex',gap:0,overflowX:'auto' }}>
          {services.map((sv,i)=>{
            const SI=sv.icon;
            return(
              <button key={sv.id} className="svc-tab"
                onClick={()=>{ setActive(i); setShowChannels(false); }}
                style={{ display:'flex',alignItems:'center',gap:8,padding:'13px 20px',borderRadius:0,fontWeight:700,fontSize:'0.85rem',fontFamily:'DM Sans,sans-serif',flexShrink:0,background:'transparent',color:active===i?'#0f172a':'#64748b',boxShadow:'none',border:'none',borderBottom:active===i?`3px solid ${sv.accent}`:'3px solid transparent',transition:'all .3s' }}>
                <SI size={15}/>{sv.title}
                {sv.featured&&<span style={{ background:sv.accent,color:'white',borderRadius:8,padding:'1px 6px',fontSize:'0.6rem' }}>★</span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── DETAIL ── */}
      <div id="detail">
        <div className="tab-content" key={active}>

          {/* ══════════════════════════════════════════════
              NEWSJUNCTION (id=1): VIDEO HEADER
          ══════════════════════════════════════════════ */}
          {s.id === 1 ? (
            <div className="nj-video-header" style={{ background:'#000' }}>
              {/* Full-width video as hero */}
              <div style={{ position:'relative',width:'100%',maxHeight:520,overflow:'hidden' }}>
                <video
                  ref={videoRef}
                  src={newsJunctionVideo}
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  style={{ width:'100%',maxHeight:520,objectFit:'cover',display:'block' }}
                />
                {/* Overlay gradient for text readability */}
                <div style={{ position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,0.2) 0%,rgba(0,0,0,0.7) 100%)' }}/>
                {/* Audio toggle button */}
                <button
                  onClick={()=>{
                    if(videoRef.current){
                      videoRef.current.muted = !isMuted;
                      setIsMuted(m=>!m);
                    }
                  }}
                  style={{
                    position:'absolute',top:16,right:16,zIndex:10,
                    display:'flex',alignItems:'center',gap:6,
                    padding:'8px 14px',borderRadius:40,
                    background:'rgba(0,0,0,0.55)',backdropFilter:'blur(8px)',
                    border:'1px solid rgba(255,255,255,0.25)',color:'white',
                    fontWeight:700,fontSize:'0.78rem',fontFamily:'DM Sans,sans-serif',
                    cursor:'pointer',transition:'all .25s'
                  }}
                  onMouseEnter={e=>(e.currentTarget.style.background='rgba(0,0,0,0.8)')}
                  onMouseLeave={e=>(e.currentTarget.style.background='rgba(0,0,0,0.55)')}
                >
                  {isMuted ? (
                    <><span style={{fontSize:'1rem'}}>🔇</span> Unmute</>
                  ) : (
                    <><span style={{fontSize:'1rem'}}>🔊</span> Mute</>
                  )}
                </button>
                {/* Title overlay */}
                <div style={{ position:'absolute',bottom:0,left:0,right:0,padding:'2.5rem' }}>
                  <div style={{ maxWidth:1280,margin:'0 auto' }}>
                    <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:10 }}>
                      <span className="live-dot"/>
                      <span style={{ fontFamily:'DM Sans,sans-serif',color:'rgba(255,255,255,0.85)',fontWeight:700,fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.2em' }}>Live · Media</span>
                    </div>
                    <h2 style={{ color:'white',fontSize:'clamp(2rem,5vw,3.5rem)',fontWeight:700,margin:'0 0 8px',lineHeight:1.05 }}>NewsJunction</h2>
                    <p style={{ color:'rgba(255,255,255,0.8)',fontStyle:'italic',fontFamily:'DM Sans,sans-serif',fontSize:'clamp(0.88rem,1.6vw,1.05rem)',margin:0 }}>"One Network. Many Voices."</p>
                  </div>
                </div>
              </div>

              {/* ── CHANNEL LOGOS ROW ── */}
              <div style={{ background:'#0f172a',padding:'1.8rem 0' }}>
                <div style={{ maxWidth:1280,margin:'0 auto',padding:'0 2rem' }}>
                  <p style={{ fontFamily:'DM Sans,sans-serif',color:'rgba(255,255,255,0.4)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.2em',marginBottom:16,textAlign:'center' }}>Our Channels & Verticals</p>
                  <div className="channel-logos-grid" style={{ display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:12 }}>
                    {newsChannelLogos.map((ch,i) => (
                      <div key={i} className="channel-logo" style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:8 }}>
                        <div style={{ width:'100%',aspectRatio:'1',borderRadius:14,overflow:'hidden',border:`2px solid ${ch.color}50`,boxShadow:`0 4px 16px ${ch.color}30` }}>
                          <img src={ch.file} alt={ch.lang} style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
                        </div>
                        <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.68rem',color:'rgba(255,255,255,0.6)',fontWeight:600 }}>{ch.lang}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ══════════════════════════════════════════════
               ALL OTHER SERVICES: CINEMATIC ANIMATED HEADER
            ══════════════════════════════════════════════ */
            <div style={{ width:'100%', position:'relative', height:400, overflow:'hidden', background:'#111' }}>

              {/* ── Per-service background photo — landscape, objectFit:cover ── */}
              {s.id === 2 && (
                <img src={bgPearl} alt="Pearl Farms" style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:'center',display:'block',position:'absolute',inset:0 }}/>
              )}
              {s.id === 3 && (
                <img src={bgMarket} alt="E-Market" style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:'center',display:'block',position:'absolute',inset:0 }}/>
              )}
              {s.id === 4 && (
                <div style={{ position:'absolute',inset:0,overflow:'hidden' }}>
                  <img src={bgTraders} alt="Manikya Traders" style={{
                    position:'absolute', inset:0,
                    width:'100%', height:'100%',
                    objectFit:'cover', objectPosition:'center center',
                    display:'block',
                  }}/>
                  <div style={{ position:'absolute',inset:0,background:'linear-gradient(to right, rgba(10,4,0,0.72) 0%, rgba(10,4,0,0.35) 50%, rgba(10,4,0,0.65) 100%)' }}/>
                </div>
              )}
              {s.id === 5 && (
                <img src={bgProperties} alt="Manikya Properties" style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:'center',display:'block',position:'absolute',inset:0 }}/>
              )}
              {s.id === 6 && (
                <img src={bgMoney} alt="Manikya Money" style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:'center',display:'block',position:'absolute',inset:0 }}/>
              )}

              {/* ── Dark gradient left-side overlay for text readability ── */}
              <div style={{ position:'absolute',inset:0,background:'linear-gradient(to right,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.45) 45%,rgba(0,0,0,0.05) 100%)' }}/>

              {/* ── Service name text — left side ── */}
              <div style={{ position:'absolute',inset:0,display:'flex',flexDirection:'column',justifyContent:'center',padding:'0 3rem',zIndex:3 }}>
                {/* Tag badge */}
                <div style={{ display:'inline-flex',alignItems:'center',gap:8,marginBottom:14,padding:'5px 14px',borderRadius:20,background:'rgba(0,0,0,0.4)',backdropFilter:'blur(8px)',border:`1px solid ${s.accent}70`,width:'fit-content' }}>
                  <div style={{ width:8,height:8,borderRadius:'50%',background:s.accent,animation:'pulse 1.5s ease-in-out infinite' }}/>
                  <span style={{ fontFamily:'DM Sans,sans-serif',color:'white',fontWeight:700,fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.2em' }}>{s.tag}</span>
                </div>
                {/* Service Title */}
                <h2 style={{ color:'white',fontSize:'clamp(2rem,5vw,3.5rem)',fontWeight:800,margin:'0 0 10px',lineHeight:1.05,textShadow:'0 3px 16px rgba(0,0,0,0.9)',maxWidth:500 }}>{s.title}</h2>
                {/* Tagline */}
                <p style={{ color:'rgba(255,255,255,0.85)',fontStyle:'italic',fontFamily:'DM Sans,sans-serif',fontSize:'1rem',margin:0,textShadow:'0 2px 10px rgba(0,0,0,0.9)',maxWidth:420,lineHeight:1.6 }}>"{s.tagline}"</p>
                {/* Accent line */}
                <div style={{ width:60,height:4,borderRadius:2,background:s.gradient,marginTop:18 }}/>
              </div>

            </div>
          )}



          {/* STATS BAR — compact */}
          <div style={{ background:'#0f172a',padding:'0.7rem 0' }}>
            <div className="stats-bar-grid" style={{ maxWidth:1280,margin:'0 auto',padding:'0 2rem',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8 }}>
              {data.stats.map((st: any,i: number)=>(
                <div key={i} style={{ textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,padding:'6px 4px' }}>
                  <div style={{ display:'flex',alignItems:'center',gap:6 }}>
                    <span style={{ fontSize:'clamp(0.85rem,2.5vw,1rem)' }}>{st.icon}</span>
                    <span style={{ fontSize:'clamp(0.95rem,3vw,1.1rem)',fontWeight:700,color:'white',fontFamily:'Georgia,serif' }}>{st.value}</span>
                  </div>
                  <span style={{ fontFamily:'DM Sans,sans-serif',color:'#64748b',fontSize:'clamp(0.6rem,1.8vw,0.65rem)',textTransform:'uppercase',letterSpacing:'0.06em',lineHeight:1.2,textAlign:'center' }}>{st.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div style={{ background:'white',padding:'3.5rem 0' }}>
            <div style={{ maxWidth:1280,margin:'0 auto',padding:'0 2rem' }}>
              <div style={{ display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:56,alignItems:'start' }} className="detail-grid">

                {/* LEFT */}
                <div>
                  <h3 style={{ fontSize:'clamp(1.1rem,2.5vw,1.5rem)',fontWeight:700,color:'#0f172a',marginBottom:14 }}>About {s.title}</h3>
                  <p style={{ fontFamily:'DM Sans,sans-serif',color:'#475569',lineHeight:1.9,fontSize:'1rem',marginBottom:24 }}>{s.description}</p>
                  <h4 style={{ fontSize:'1rem',fontWeight:700,color:'#0f172a',marginBottom:12,fontFamily:'DM Sans,sans-serif',textTransform:'uppercase',letterSpacing:'0.1em' }}>What We Offer</h4>
                  <div style={{ display:'flex',flexDirection:'column',gap:7,marginBottom:28 }}>
                    {s.features.map((f: string,i: number)=>(
                      <div key={i} className="feat-row" style={{ display:'flex',alignItems:'flex-start',gap:10,padding:'9px 12px',borderRadius:10,background:'#f8fafc',border:'1px solid #e2e8f0' }}>
                        <CheckCircle size={17} style={{ color:s.accent,flexShrink:0,marginTop:2 }}/>
                        <span style={{ fontFamily:'DM Sans,sans-serif',color:'#334155',fontSize:'0.92rem',lineHeight:1.5 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  {s.hasChannels&&(
                    <button onClick={()=>setShowChannels(p=>!p)}
                      style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'12px 22px',borderRadius:12,fontWeight:700,fontSize:'0.88rem',color:'white',background:s.gradient,boxShadow:`0 6px 20px ${s.accent}40`,border:'none',cursor:'pointer',marginBottom:14,fontFamily:'DM Sans,sans-serif' }}>
                      <Radio size={16}/>{showChannels?'Hide Channels':'▶ Watch All 5 Language Channels'}
                    </button>
                  )}
                  <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
                    {s.id===2
                      ? <Link to="/pearl-farms" className="btn" style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'12px 22px',borderRadius:12,fontWeight:700,fontSize:'0.88rem',color:'white',background:s.gradient,boxShadow:`0 6px 20px ${s.accent}40` }}>
                          Full Pearl Farms Page <ArrowRight size={15}/>
                        </Link>
                      : <Link to={s.link} className="btn" style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'12px 22px',borderRadius:12,fontWeight:700,fontSize:'0.88rem',color:'white',background:s.gradient,boxShadow:`0 6px 20px ${s.accent}40` }}>
                          {s.id===5?'Enquire About Properties':s.id===6?'Apply for a Loan':s.id===4?'Partner With Us':'Get Started'} <ArrowRight size={15}/>
                        </Link>
                    }
                    <Link to="/contact" className="btn" style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'12px 20px',borderRadius:12,fontWeight:700,fontSize:'0.88rem',color:s.accent,border:`2px solid ${s.accent}30`,background:'white' }}>
                      <Phone size={14}/> Contact Us
                    </Link>
                  </div>
                  {s.id===4 && (
                    <div style={{ marginTop:28 }}>
                      <h4 style={{ fontSize:'1rem',fontWeight:700,color:'#0f172a',marginBottom:16,fontFamily:'DM Sans,sans-serif',textTransform:'uppercase',letterSpacing:'0.1em' }}>Our Business Model</h4>
                      {[
                        { icon:'🏭', label:'Vendor Registers Product', desc:'Registers food machinery or commodity from their warehouse', color:'#f59e0b' },
                        { icon:'📣', label:'We Market & Advertise', desc:'Digital campaigns, WhatsApp outreach & field sales', color:'#ef4444' },
                        { icon:'🤝', label:'Buyer Match Found', desc:'We connect & facilitate demo or presentation', color:'#3b82f6' },
                        { icon:'✅', label:'Deal Closed — Everyone Wins', desc:'Vendor sells, buyer benefits, we earn transparent commission', color:'#10b981' },
                      ].map((step,i,arr)=>(
                        <div key={i} style={{ display:'flex',alignItems:'flex-start',gap:0 }}>
                          <div style={{ display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0 }}>
                            <div style={{ width:40,height:40,borderRadius:'50%',background:step.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',boxShadow:`0 4px 14px ${step.color}55` }}>{step.icon}</div>
                            {i<arr.length-1&&<div style={{ width:2,height:26,background:`linear-gradient(${step.color},${arr[i+1].color})`,opacity:0.35 }}/>}
                          </div>
                          <div style={{ paddingLeft:12,paddingTop:8,paddingBottom:i<arr.length-1?4:0 }}>
                            <div style={{ fontFamily:'DM Sans,sans-serif',fontWeight:700,color:'#0f172a',fontSize:'0.86rem' }}>{step.label}</div>
                            <div style={{ fontFamily:'DM Sans,sans-serif',color:'#64748b',fontSize:'0.78rem',marginTop:2 }}>{step.desc}</div>
                          </div>
                        </div>
                      ))}
                      <div style={{ marginTop:16,padding:'12px 16px',borderRadius:10,background:'linear-gradient(135deg,rgba(245,158,11,0.09),rgba(239,68,68,0.09))',border:'1px solid rgba(245,158,11,0.3)' }}>
                        <div style={{ fontFamily:'DM Sans,sans-serif',fontWeight:700,color:'#92400e',fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:6 }}>How We Earn</div>
                        {['💼 Marketing service fee','📊 Commission on deals','🌾 Commodity trading margin'].map((it,i)=>(
                          <div key={i} style={{ fontFamily:'DM Sans,sans-serif',color:'#78350f',fontSize:'0.8rem',marginBottom:3 }}>{it}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* RIGHT */}
                <div>
                  {s.id===4 && (
                    <div style={{ marginBottom:22,padding:'18px 20px',borderRadius:14,background:'linear-gradient(135deg,rgba(245,158,11,0.07),rgba(239,68,68,0.07))',border:'1px solid rgba(245,158,11,0.22)' }}>
                      <h4 style={{ fontFamily:'DM Sans,sans-serif',fontWeight:700,color:'#0f172a',fontSize:'0.9rem',marginBottom:12,textTransform:'uppercase',letterSpacing:'0.1em' }}>Who We Serve</h4>
                      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
                        {[
                          { title:'Vendors', color:'#f59e0b', items:['Food machinery manufacturers','Grain & commodity producers','Warehouse owners','Packaging providers'] },
                          { title:'Buyers', color:'#ef4444', items:['Hotels & cloud kitchens','Canteens & caterers','Food factories','Wholesalers & retailers'] },
                        ].map((col,ci)=>(
                          <div key={ci}>
                            <div style={{ fontFamily:'DM Sans,sans-serif',fontWeight:700,color:col.color,fontSize:'0.72rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:6 }}>{col.title}</div>
                            {col.items.map((item,ii)=>(
                              <div key={ii} style={{ display:'flex',alignItems:'flex-start',gap:5,marginBottom:4 }}>
                                <div style={{ width:4,height:4,borderRadius:'50%',background:col.color,marginTop:5,flexShrink:0 }}/>
                                <span style={{ fontFamily:'DM Sans,sans-serif',color:'#475569',fontSize:'0.78rem',lineHeight:1.5 }}>{item}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <h4 style={{ fontSize:'1rem',fontWeight:700,color:'#0f172a',marginBottom:14,fontFamily:'DM Sans,sans-serif',textTransform:'uppercase',letterSpacing:'0.1em' }}>
                    {s.id===5?'Our 4-Step Process':s.id===6?'How Loan Process Works':s.id===1?'How NewsJunction Works':s.id===4?'Step-by-Step Process':'How It Works'}
                  </h4>
                  <div style={{ display:'flex',flexDirection:'column',gap:10,marginBottom:24 }}>
                    {data.howItWorks.map((step: any)=>(
                      <div key={step.step} className="how-card" style={{ display:'flex',gap:12,padding:'14px',borderRadius:12,background:'#f8fafc',border:'1px solid #e2e8f0' }}>
                        <div style={{ width:34,height:34,borderRadius:'50%',background:s.gradient,display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:'0.82rem',flexShrink:0 }}>{step.step}</div>
                        <div>
                          <div style={{ fontWeight:700,color:'#0f172a',marginBottom:3,fontSize:'0.92rem' }}>{step.title}</div>
                          <div style={{ fontFamily:'DM Sans,sans-serif',color:'#64748b',fontSize:'0.85rem',lineHeight:1.6 }}>{step.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Extra box */}
                  <div style={{ borderRadius:14,overflow:'hidden',border:`1px solid ${s.accent}20` }}>
                    <div style={{ padding:'12px 18px',background:s.gradient }}>
                      <h4 style={{ color:'white',fontWeight:700,fontSize:'0.9rem',margin:0 }}>{data.extra.title}</h4>
                    </div>
                    <div style={{ padding:'14px 18px',background:'white' }}>
                      {data.extra.items.map((item: string,i: number)=>(
                        <div key={i} style={{ padding:'7px 0',borderBottom:i<data.extra.items.length-1?'1px solid #f1f5f9':'none',fontFamily:'DM Sans,sans-serif',color:'#334155',fontSize:'0.9rem' }}>{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CHANNELS PANEL */}
          {s.hasChannels&&showChannels&&(
            <div style={{ background:'linear-gradient(135deg,#fff5f5,#fff)',borderTop:'1px solid #fee2e2',padding:'2.5rem 0' }}>
              <div style={{ maxWidth:1280,margin:'0 auto',padding:'0 2rem' }}>
                <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:8 }}>
                  <span className="live-dot"/><span style={{ fontFamily:'DM Sans,sans-serif',color:'#ef4444',fontWeight:700,fontSize:'0.72rem',textTransform:'uppercase',letterSpacing:'0.15em' }}>Live Now — 5 Channels</span>
                </div>
                <h3 style={{ fontSize:'clamp(1.1rem,2.5vw,1.5rem)',fontWeight:700,color:'#0f172a',marginBottom:6 }}>Select Your Language Channel</h3>
                <p style={{ fontFamily:'DM Sans,sans-serif',color:'#64748b',marginBottom:22,fontSize:'0.9rem' }}>Click any card to watch live. Each opens in a new tab.</p>
                <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:14 }}>
                  {channels.map((ch,i)=>(
                    <a key={i} href={ch.url} target="_blank" rel="noopener noreferrer" className="ch-card"
                      style={{ display:'block',borderRadius:16,overflow:'hidden',textDecoration:'none',border:`1px solid ${ch.color}25`,boxShadow:hovCh===i?`0 14px 36px ${ch.color}25`:'0 2px 8px rgba(0,0,0,0.05)',background:'white' }}
                      onMouseEnter={()=>setHovCh(i)} onMouseLeave={()=>setHovCh(null)}>
                      <div style={{ height:4,background:`linear-gradient(90deg,${ch.color},${ch.color}88)` }}/>
                      <div style={{ padding:'18px' }}>
                        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8 }}>
                          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                            <span style={{ fontSize:'clamp(1.05rem,2.2vw,1.4rem)' }}>{ch.flag}</span>
                            <div>
                              <div style={{ fontWeight:700,color:'#0f172a',fontSize:'0.92rem' }}>{ch.lang}</div>
                              <div style={{ fontFamily:'DM Sans,sans-serif',color:'#94a3b8',fontSize:'0.68rem' }}>{ch.name}</div>
                            </div>
                          </div>
                          <div style={{ display:'flex',alignItems:'center',gap:4,padding:'3px 8px',borderRadius:20,background:`${ch.color}12`,border:`1px solid ${ch.color}30` }}>
                            <Play size={9} style={{ color:ch.color,fill:ch.color }}/><span style={{ fontSize:'0.62rem',fontWeight:700,color:ch.color,fontFamily:'DM Sans,sans-serif',textTransform:'uppercase' }}>Live</span>
                          </div>
                        </div>
                        <p style={{ fontFamily:'DM Sans,sans-serif',color:'#475569',fontSize:'0.82rem',lineHeight:1.55,margin:'0 0 10px' }}>{ch.desc}</p>
                        <div style={{ display:'flex',alignItems:'center',gap:5,color:ch.color,fontWeight:700,fontSize:'0.8rem',fontFamily:'DM Sans,sans-serif' }}>
                          <ExternalLink size={12}/> Watch Live Now
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
                <div style={{ textAlign:'center',marginTop:20 }}>
                  <a href="https://newsjunction.net/stream.php" target="_blank" rel="noopener noreferrer" className="btn"
                    style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'12px 28px',borderRadius:12,background:'linear-gradient(135deg,#ef4444,#f97316)',color:'white',fontWeight:700,fontSize:'0.88rem',fontFamily:'DM Sans,sans-serif' }}>
                    <Globe size={15}/> Open Full News Portal <ExternalLink size={13}/>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div style={{ maxWidth:1280,margin:'0 auto',padding:'1.5rem 2rem',display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid #e2e8f0',background:'white' }}>
            <button onClick={()=>{ setActive(p=>Math.max(0,p-1)); setShowChannels(false); }} disabled={active===0}
              style={{ padding:'10px 22px',borderRadius:12,border:'1px solid #e2e8f0',background:'white',color:'#64748b',cursor:active===0?'not-allowed':'pointer',opacity:active===0?0.4:1,fontWeight:600,fontSize:'0.88rem',fontFamily:'DM Sans,sans-serif',transition:'all .3s' }}>
              ← Previous
            </button>
            <div style={{ display:'flex',gap:6 }}>
              {services.map((_,i)=>(
                <button key={i} onClick={()=>{ setActive(i); setShowChannels(false); }}
                  style={{ width:i===active?28:8,height:8,borderRadius:4,border:'none',cursor:'pointer',transition:'all .3s',background:i===active?services[active].accent:'#cbd5e1' }}/>
              ))}
            </div>
            <button onClick={()=>{ setActive(p=>Math.min(services.length-1,p+1)); setShowChannels(false); }} disabled={active===services.length-1}
              style={{ padding:'10px 22px',borderRadius:12,border:'1px solid #e2e8f0',background:'white',color:'#64748b',cursor:active===services.length-1?'not-allowed':'pointer',opacity:active===services.length-1?0.4:1,fontWeight:600,fontSize:'0.88rem',fontFamily:'DM Sans,sans-serif',transition:'all .3s' }}>
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* ── COMING SOON — HERITAGE ── */}
      <section style={{ padding:'4rem 0',background:'linear-gradient(135deg,#f5f3ff,#ede9fe)' }} ref={coming.ref}>
        <div style={{ maxWidth:1280,margin:'0 auto',padding:'0 2rem' }}>
          <div className={`reveal ${coming.v?'on':''}`}>
            <div style={{ textAlign:'center',marginBottom:28 }}>
              <span style={{ display:'inline-block',padding:'6px 18px',borderRadius:40,background:'rgba(139,92,246,0.1)',border:'1px dashed rgba(139,92,246,0.4)',fontSize:'0.7rem',fontWeight:700,color:'#7c3aed',textTransform:'uppercase',letterSpacing:'0.2em',marginBottom:14,fontFamily:'DM Sans,sans-serif' }}>🚀 Coming Soon</span>
              <h2 style={{ fontSize:'clamp(1.8rem,4vw,3rem)',fontWeight:700,color:'#0f172a',marginBottom:10 }}>Manikya Heritage</h2>
              <p style={{ fontFamily:'DM Sans,sans-serif',color:'#6d28d9',fontSize:'1rem',maxWidth:'36rem',margin:'0 auto' }}>Mega Heritage Village — Karnataka's living museum of culture, art, and timeless tradition.</p>
            </div>
            <div className="cs-glow" style={{ borderRadius:20,overflow:'hidden',background:'white',border:'2px dashed #c4b5fd',maxWidth:900,margin:'0 auto',position:'relative' }}>
              <div style={{ position:'absolute',top:16,right:16,display:'flex',alignItems:'center',gap:6,padding:'6px 14px',borderRadius:40,background:'linear-gradient(135deg,#8b5cf6,#a855f7)',color:'white',fontWeight:700,fontSize:'0.75rem',fontFamily:'DM Sans,sans-serif' }}>
                <Clock size={13}/> Coming Soon
              </div>
              <div style={{ height:4,background:'linear-gradient(135deg,#8b5cf6,#a855f7)' }}/>
              <div className="cs-heritage-grid" style={{ display:'grid',gridTemplateColumns:'1fr 1fr' }}>
                <div style={{ padding:'2.5rem' }}>
                  {/* Heritage logo */}
                  <div style={{ width:80,height:80,borderRadius:16,overflow:'hidden',marginBottom:16,border:'2px solid #c4b5fd',boxShadow:'0 4px 16px rgba(139,92,246,0.2)' }}>
                    <img src={heritageLogo} alt="Manikya Heritage" style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
                  </div>
                  <h3 style={{ fontSize:'clamp(1.1rem,2.8vw,1.6rem)',fontWeight:700,color:'#0f172a',marginBottom:6 }}>{comingSoon.title}</h3>
                  <p style={{ fontStyle:'italic',color:'#4c1d95',marginBottom:12,fontSize:'0.95rem' }}>"{comingSoon.tagline}"</p>
                  <p style={{ fontFamily:'DM Sans,sans-serif',color:'#475569',lineHeight:1.8,marginBottom:18,fontSize:'0.92rem' }}>{comingSoon.description}</p>
                  <div style={{ display:'flex',flexDirection:'column',gap:7 }}>
                    {comingSoon.features.map((f,i)=>(
                      <div key={i} style={{ display:'flex',alignItems:'flex-start',gap:8 }}>
                        <CheckCircle size={16} style={{ color:'#8b5cf6',flexShrink:0,marginTop:2 }}/>
                        <span style={{ fontFamily:'DM Sans,sans-serif',color:'#334155',fontSize:'0.88rem' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background:'linear-gradient(135deg,#4c1d95,#6d28d9)',padding:'2.5rem',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',color:'white',textAlign:'center' }}>
                  <div style={{ fontSize:'clamp(2rem,5vw,4rem)',marginBottom:16 }}>🎭</div>
                  <div style={{ display:'flex',flexWrap:'wrap',gap:7,justifyContent:'center',marginBottom:20 }}>
                    {['Yakshagana','Pottery','Ayurveda','Heritage Stay','Weaving','Folk Dance','Traditional Food','Artisan Crafts'].map(tag=>(
                      <span key={tag} style={{ padding:'4px 10px',borderRadius:20,background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',fontSize:'0.75rem',fontFamily:'DM Sans,sans-serif' }}>{tag}</span>
                    ))}
                  </div>
                  <p style={{ fontFamily:'DM Sans,sans-serif',color:'rgba(255,255,255,0.7)',fontSize:'0.85rem',lineHeight:1.7,maxWidth:240 }}>
                    A 5000-year cultural journey across Karnataka's finest traditions — arts, food, architecture, and healing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CROSS LINKS ── */}
      <section style={{ padding:'4rem 0',background:'linear-gradient(135deg,#0f172a,#1e3a8a)' }}>
        <div style={{ maxWidth:1280,margin:'0 auto',padding:'0 2rem',textAlign:'center' }}>
          <h2 style={{ fontSize:'clamp(1.3rem,3.5vw,2rem)',fontWeight:700,color:'white',marginBottom:8 }}>Explore Manikya</h2>
          <p style={{ fontFamily:'DM Sans,sans-serif',color:'#93c5fd',marginBottom:32,fontSize:'0.9rem' }}>Discover our full ecosystem</p>
          <div style={{ display:'flex',flexWrap:'wrap',gap:12,justifyContent:'center' }}>
            {[
              {label:'Pearl Farms',desc:'Investment',link:'/pearl-farms',icon:'💎',g:'linear-gradient(135deg,#3b82f6,#06b6d4)',internal:true},
              {label:'Gallery',desc:'See our work',link:'/gallery',icon:'🖼️',g:'linear-gradient(135deg,#8b5cf6,#a855f7)',internal:true},
              {label:'About',desc:'Our story',link:'/about',icon:'📖',g:'linear-gradient(135deg,#f59e0b,#ef4444)',internal:true},
              {label:'Contact',desc:'Get in touch',link:'/contact',icon:'📞',g:'linear-gradient(135deg,#10b981,#059669)',internal:true},
              {label:'NewsJunction',desc:'Watch live',link:'https://newsjunction.net/stream.php',icon:'📺',g:'linear-gradient(135deg,#ef4444,#f97316)',internal:false},
            ].map(item=>(
              item.internal
                ? <Link key={item.label} to={item.link} className="xlink"
                    style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:6,padding:'18px 24px',borderRadius:16,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',color:'white',minWidth:110 }}
                    onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.background=item.g; (e.currentTarget as HTMLElement).style.transform='translateY(-5px)'; }}
                    onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.transform='none'; }}>
                    <span style={{ fontSize:'clamp(1.1rem,2.5vw,1.5rem)' }}>{item.icon}</span>
                    <span style={{ fontWeight:700,fontSize:'0.88rem' }}>{item.label}</span>
                    <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.72rem',color:'rgba(255,255,255,0.55)' }}>{item.desc}</span>
                  </Link>
                : <a key={item.label} href={item.link} target="_blank" rel="noopener noreferrer" className="xlink"
                    style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:6,padding:'18px 24px',borderRadius:16,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',color:'white',minWidth:110,textDecoration:'none' }}
                    onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.background=item.g; (e.currentTarget as HTMLElement).style.transform='translateY(-5px)'; }}
                    onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.transform='none'; }}>
                    <span style={{ fontSize:'clamp(1.1rem,2.5vw,1.5rem)' }}>{item.icon}</span>
                    <span style={{ fontWeight:700,fontSize:'0.88rem' }}>{item.label}</span>
                    <span style={{ fontFamily:'DM Sans,sans-serif',fontSize:'0.72rem',color:'rgba(255,255,255,0.55)' }}>{item.desc}</span>
                    <ExternalLink size={12} style={{ color:'rgba(255,255,255,0.4)' }}/>
                  </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
