import {
  Newspaper, Sparkles, ShoppingBag, Building2, DollarSign, TrendingUp, Landmark,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ─────────────  Media assets (served from /public)  ───────────── */
export const media = {
  njVideo:      '/media/WhatsApp Video 2026-05-12 at 9.49.00 PM.mp4',
  logoCrime:    '/media/WhatsApp Image 2026-05-12 at 9.48.46 PM.jpeg',
  logoMusic:    '/media/WhatsApp Image 2026-05-12 at 9.48.48 PM.jpeg',
  logoComedy:   '/media/WhatsApp Image 2026-05-12 at 9.48.52 PM.jpeg',
  logoRoots:    '/media/WhatsApp Image 2026-05-12 at 9.48.53 PM.jpeg',
  logoTelugu:   '/media/WhatsApp Image 2026-05-12 at 9.48.54 PM.jpeg',
  logoHeritage: '/media/WhatsApp Image 2026-05-12 at 9.48.55 PM.jpeg',
  logoKannada:  '/media/WhatsApp Image 2026-05-12 at 9.48.57 PM.jpeg',
  logoEnglish:  '/media/WhatsApp Image 2026-05-12 at 9.48.59 PM.jpeg',
  logoHindi:    '/media/WhatsApp Image 2026-05-12 at 9.48.59 PM.jpeg',
  bgPearl:      '/media/pearl-farm-pond.jpg',
  bgMarket:     '/media/manikya-market-vegetables.jpg',
  bgTraders:    '/manikya-traders-banner.jpg',
  bgProperties: '/media/manikya-properties-urban.jpg',
  bgMoney:      '/media/manikya-properties-bank.jpg',
  // Brand logos — used for the Services landing-page cards only
  logoMedia:        '/media/manikya-media-logo.jpg',
  logoPearlBrand:   '/media/manikya-pearl-logo.jpg',
  logoMarket:       '/media/manikya-market-logo.jpg',
  logoTraders:      '/media/manikya-traders-logo.jpg',
  logoProperties:   '/media/manikya-properties-logo.jpg',
  logoMoney:        '/media/manikya-money-logo.jpg',
  logoHeritageNew:  '/media/manikya-heritage-logo.jpg',
  // Hero videos (16:9 recommended). Drop the .mp4 into /public/media then
  // uncomment the matching `heroVideo:` line on the service below.
  njHeroVideo:         '/media/newsjunction-hero.mp4',
  pearlHeroVideo:      '/media/pearl-farm-hero.mp4',
  eMarketHeroVideo:    '/media/e-market-hero.mp4',
  tradersHeroVideo:    '/media/traders-hero.mp4',
  propertiesHeroVideo: '/media/properties-hero.mp4',
  moneyHeroVideo:      '/media/money-hero.mp4',
  heritageHeroVideo:   '/media/heritage-hero.mp4',
};

/* ─────────────  NewsJunction live channels  ───────────── */
export const channels = [
  { name:'NewsJunction Kannada', lang:'ಕನ್ನಡ', flag:'🟠', color:'#d45656', url:'https://newsjunction.net/stream.php',           desc:"Karnataka's #1 Kannada digital channel — hyper-local stories from all 31 districts, politics, culture." },
  { name:'NewsJunction Hindi',   lang:'हिन्दी',  flag:'🔵', color:'#3772cf', url:'https://newsjunction.net/channel.php?channelId=47&channelName=Jankranti+hindi+news+bulletin', desc:'Jankranti Hindi News Bulletin — pan-India coverage with a Southern Indian editorial lens.' },
  { name:'NewsJunction Marathi', lang:'मराठी',  flag:'🟢', color:'#00b48a', url:'https://newsjunction.net/stream.php',           desc:'Marathi news and live programs serving Marathi-speaking communities with authentic regional stories from Maharashtra and beyond.' },
  { name:'NewsJunction Telugu',  lang:'తెలుగు', flag:'🟣', color:'#6b5cf6', url:'https://newsjunction.net/stream.php',           desc:'Andhra and Telangana news with comprehensive coverage of regional politics and business events.' },
  { name:'NewsJunction English', lang:'English', flag:'🔴', color:'#c37d0d', url:'https://newsjunction.net/featured_channels.php?rss_id=132', desc:'National & global English news with an Indian editorial lens — for professionals and the diaspora.' },
];

export const newsChannelLogos = [
  { lang: 'Kannada', file: media.logoKannada, color:'#d45656' },
  { lang: 'English', file: media.logoEnglish, color:'#c37d0d' },
  { lang: 'Hindi',   file: media.logoHindi,   color:'#3772cf' },
  { lang: 'Telugu',  file: media.logoTelugu,  color:'#6b5cf6' },
  { lang: 'Crime',   file: media.logoCrime,   color:'#7c3aed' },
  { lang: 'Comedy',  file: media.logoComedy,  color:'#c37d0d' },
  { lang: 'Music',   file: media.logoMusic,   color:'#ec4899' },
];

/* ─────────────  Deep-dive data per service (by slug)  ───────────── */
export const serviceDetails: Record<string, any> = {
  newsjunction: {
    stats:[{value:'5',label:'Language Channels',icon:'🌐'},{value:'31+',label:'Districts Covered',icon:'📍'},{value:'24/7',label:'Live Streaming',icon:'📡'},{value:'2002',label:'Established',icon:'🏆'}],
    howItWorks:[
      {step:1,title:'Multi-Language Coverage',desc:'Five dedicated language desks — each with local journalists delivering verified news in Kannada, Hindi, Tamil, Telugu, and English.'},
      {step:2,title:'Hyper-Local Reporting',desc:'Reporters embedded in all 31 Karnataka districts ensuring every village story gets the national attention it deserves.'},
      {step:3,title:'Live Streaming & Digital',desc:'Watch 24/7 live news at newsjunction.net. Content distributed across YouTube, social media, and mobile apps.'},
      {step:4,title:'Integrated Commerce',desc:"NewsJunction's shoppable content is integrated with E-Market — watch a story, buy the product directly from the artisan."},
    ],
    extra:{title:'Entertainment Beyond News',items:['🎵 Music Junction — regional music programming','😂 Comedy Junction — original comedy content','🛒 Shoppable News — buy from what you watch','🎙️ Citizen Journalism — your voice, our platform']},
  },
  'pearl-farms': {
    stats:[{value:'500+',label:'Active Investors',icon:'👥'},{value:'40%',label:'Expected ROI',icon:'📈'},{value:'18mo',label:'Harvest Cycle',icon:'⏱️'},{value:'100%',label:'Buyback Assured',icon:'🛡️'}],
    howItWorks:[
      {step:1,title:'Site Selection & Setup',desc:'We identify water bodies in Mandya with optimal water chemistry. Ponds are prepared with filtration, oxygenation, and cage infrastructure.'},
      {step:2,title:'Oyster Procurement & Nucleation',desc:'Certified healthy oysters sourced. Expert technicians surgically insert a nucleus into each oyster — the seed of every pearl.'},
      {step:3,title:'Farm Monitoring',desc:'For 12–18 months our team monitors water quality, oyster health, and growth rates with regular cleaning and feeding schedules.'},
      {step:4,title:'Harvest, Grade & Sell',desc:'Pearls harvested, professionally graded, certified, and sold through our established network for maximum returns.'},
    ],
    extra:{title:'Why Pearl Farming?',items:['💎 A living asset — grows in value daily','🌿 Eco-friendly — improves water quality','💰 Passive income — no daily involvement needed','🏆 Backed by biological science and expert farming']},
  },
  'e-market': {
    stats:[{value:'100%',label:'Desi Origin',icon:'🇮🇳'},{value:'500+',label:'Village Products',icon:'🏘️'},{value:'0',label:'Tech Burden for Sellers',icon:'✅'},{value:'24hr',label:'Rapid Delivery',icon:'🚚'}],
    howItWorks:[
      {step:1,title:'Seller Onboarding',desc:'We visit villages, identify artisans, weavers, and farmers. We handle photography, listing, and digital presence — they just focus on making.'},
      {step:2,title:'Story-Driven Commerce',desc:'"Meet the Maker" videos connect buyers with the human behind every product — the artisan, their village, and their craft.'},
      {step:3,title:'Rapid Rurban Delivery',desc:'Our logistics network bridges the last-mile gap from remote villages to urban doorsteps and global buyers.'},
      {step:4,title:'Payment & Empowerment',desc:'Sellers receive transparent, real-time payments. Women-led self-help groups get priority listing, mentoring, and wider markets.'},
    ],
    extra:{title:'What We Sell',items:['🧵 Handloom textiles and silk products','🏺 Traditional pottery and terracotta art','🍯 Organic honey, pickles and homemade foods','🌿 Herbal products, oils and natural cosmetics']},
  },
  'manikya-traders': {
    stats:[{value:'B2B',label:'Business Model',icon:'🤝'},{value:'100%',label:'Transparent',icon:'✅'},{value:'KA-Wide',label:'Vendor Network',icon:'🗺️'},{value:'20+',label:'Years of Trust',icon:'🏆'}],
    howItWorks:[
      {step:1,title:'Vendor Registers Product',desc:'Manufacturers and producers from their own warehouse or production unit register their food machinery or commodity with us — roti machines, packaging equipment, grains, pulses and more.'},
      {step:2,title:'We Market & Advertise',desc:'Manikya Traders runs digital campaigns, WhatsApp outreach, field sales and on-ground promotions to connect your product with the right buyers across Karnataka and beyond.'},
      {step:3,title:'We Match Buyer to Vendor',desc:'Our team identifies the right client — hotels, canteens, food factories, retailers — and facilitates direct introductions, demos and presentations on your behalf.'},
      {step:4,title:'Deal Closed — Everyone Wins',desc:'Vendor gets the sale, buyer gets the right product, and Manikya Traders earns a transparent commission. No hidden charges. Clean, fast, and simple.'},
    ],
    extra:{title:'What We Trade & Market',items:['🫓 Roti & chapati making machines','📦 Food packaging & sealing machinery','🌾 Grain & pulse processing equipment','🍚 Rice, wheat, pulses & commodity trading','🔧 Commercial kitchen & milling instruments','📣 Full B2B digital & field marketing']},
    whoWeServe:[
      { title:'Vendors', items:['Food machinery manufacturers','Grain & commodity producers','Warehouse owners','Packaging providers'] },
      { title:'Buyers', items:['Hotels & cloud kitchens','Canteens & caterers','Food factories','Wholesalers & retailers'] },
    ],
    model:[
      { icon:'🏭', label:'Vendor Registers Product', desc:'Registers food machinery or commodity from their warehouse' },
      { icon:'📣', label:'We Market & Advertise', desc:'Digital campaigns, WhatsApp outreach & field sales' },
      { icon:'🤝', label:'Buyer Match Found', desc:'We connect & facilitate demo or presentation' },
      { icon:'✅', label:'Deal Closed — Everyone Wins', desc:'Vendor sells, buyer benefits, we earn transparent commission' },
    ],
  },
  'manikya-properties': {
    stats:[{value:'100%',label:'Client-First',icon:'🤝'},{value:'0',label:'Hidden Charges',icon:'✅'},{value:'10+',label:'Bank Partners',icon:'🏦'},{value:'100%',label:'Legal Verified',icon:'⚖️'}],
    howItWorks:[
      {step:1,title:'Share Your Requirements',desc:'Tell us your budget, preferred location, property type, and loan eligibility. We create a personalised property search plan.'},
      {step:2,title:'We Shortlist & Arrange Visits',desc:'Our team shortlists verified properties matching your criteria, arranges site visits, and helps you compare options objectively.'},
      {step:3,title:'Bank Loan Coordination',desc:'We liaise with SBI, HDFC, ICICI, Axis, and other banks on your behalf — negotiate the best interest rate and terms.'},
      {step:4,title:'Legal, Registration & Handover',desc:'Legal team verifies title deeds, encumbrance certificates, and RERA approvals. We assist with registration and handover.'},
    ],
    extra:{title:'Property Types We Handle',items:['🏠 Residential — apartments, villas, independent houses','🏢 Commercial — offices, shops, warehouses, showrooms','🌾 Agricultural plots and farm lands','📐 Layout plots and gated community homes']},
  },
  'manikya-money': {
    stats:[{value:'24hr',label:'Loan Approval',icon:'⚡'},{value:'0',label:'Hidden Charges',icon:'✅'},{value:'10+',label:'Bank Partners',icon:'🏦'},{value:'100%',label:'Transparent',icon:'🛡️'}],
    howItWorks:[
      {step:1,title:'Digital Application',desc:'Apply online with minimal documentation — ID proof, income proof, and basic KYC. Our digital process saves you time and paperwork.'},
      {step:2,title:'Quick Assessment',desc:'Our team reviews your application within hours and provides an in-principle approval. No lengthy waiting periods.'},
      {step:3,title:'Bank Coordination',desc:'We liaise with our 10+ partner banks to find the best rate for your profile — personal loans, home loans, business loans.'},
      {step:4,title:'Fast Disbursement',desc:'Post approval, funds are disbursed within 2–3 working days. Clear repayment schedule with no hidden fees.'},
    ],
    extra:{title:'Why Choose Manikya Money?',items:['⚡ Speedy Approvals — 24–48 hours','💰 Low Interest Rates — from 10% p.a.','✅ No Hidden Charges — complete transparency','📱 Fully Digital Process — apply from anywhere']},
  },
  heritage: {
    stats:[{value:'5000',label:'Years of Culture',icon:'🏛️'},{value:'Mega',label:'Heritage Village',icon:'🎭'},{value:'Live',label:'Artisan Workshops',icon:'🏺'},{value:'Soon',label:'Launching',icon:'🚀'}],
    howItWorks:[
      {step:1,title:'Traditional Homes',desc:'Authentic Chowkimane & Gutthu Mane homes recreated stone-by-stone so visitors live Karnataka heritage, not just view it.'},
      {step:2,title:'Living Folk Arts',desc:'Yakshagana, Dollu Kunitha, Kamsale and more performed daily by master artists keeping the traditions alive.'},
      {step:3,title:'Ayurvedic Grama',desc:'Herb gardens, wellness therapy and traditional healing practices in a serene, restorative village setting.'},
      {step:4,title:'Artisan Street & Stays',desc:'Live pottery, weaving and craft workshops, plus heritage stay cottages for authentic cultural immersion.'},
    ],
    extra:{title:'Inside the Heritage Village',items:['🏠 Chowkimane & Gutthu Mane traditional homes','🎭 Yakshagana, Dollu Kunitha & folk performances','🌿 Ayurvedic Grama with herb gardens','🏺 Artisan Street — live pottery & weaving','🛏️ Heritage stay cottages for immersion']},
  },
};

/* ─────────────  The 7 service tiles  ───────────── */
export interface ServiceItem {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  image: string;
  logo: string;
  logoBg: string;
  heroVideo?: string;
  gradient: string;
  accent: string;
  tag: string;
  tagline: string;
  description: string;
  features: string[];
  link: string;
  featured?: boolean;
  hasChannels?: boolean;
  comingSoon?: boolean;
}

export const services: ServiceItem[] = [
  { id:1, slug:'newsjunction', title:'NewsJunction', subtitle:'Digital Media Network', icon:Newspaper, image:media.logoKannada, logo:media.logoMedia, logoBg:'#f4f0e6', heroVideo:media.njHeroVideo, gradient:'linear-gradient(135deg,#d45656,#c37d0d)', accent:'#d45656', tag:'Media', hasChannels:true, tagline:'One Network. Many Voices.', description:'NewsJunction is a National Multi-Lingual Media Powerhouse with five dedicated language channels delivering 24/7 live news, entertainment, and hyper-local stories from across India.', features:['5 dedicated language channels with local editorial teams','Live 24/7 streaming at newsjunction.net','Coverage of all 31 Karnataka districts','Music Junction & Comedy Junction verticals','Shoppable content integrated with E-Market','Citizen journalism and audience engagement'], link:'/contact' },
  { id:2, slug:'pearl-farms', title:'Pearl Farms', subtitle:'Premium Investment', icon:Sparkles, image:media.bgPearl, logo:media.logoPearlBrand, logoBg:'#efe8da', heroVideo:media.pearlHeroVideo, gradient:'linear-gradient(135deg,#3772cf,#06b6d4)', accent:'#3772cf', tag:'★ Featured', featured:true, tagline:'Where Nature Meets High-Yield Financial Growth.', description:'A premium alternative investment combining sustainable freshwater pearl farming in Mandya, Karnataka with lucrative returns. We connect urban investors with trained farmers.', features:['Expected ROI of 30–40% per 18-month cycle','Complete technical training and farm setup','End-to-end support from pond prep to pearl sales','100% buyback assurance with certified market linkage','Passive income — no daily farm involvement required','Eco-friendly farming that improves water body health'], link:'/pearl-farms' },
  { id:3, slug:'e-market', title:'E-Market', subtitle:'Rapid Desi Online Bazar', icon:ShoppingBag, image:media.bgMarket, logo:media.logoMarket, logoBg:'#e9dfc9', heroVideo:media.eMarketHeroVideo, gradient:'linear-gradient(135deg,#00b48a,#059669)', accent:'#00b48a', tag:'Commerce', tagline:'From the Heart of Villages to Doorsteps Worldwide.', description:'A tech-enabled marketplace bridging authentic Indian village craftsmanship with global consumers. We handle everything for rural sellers so they can focus on their craft.', features:['100% Desi products sourced directly from artisans','Rapid delivery through our rurban logistics network','"Meet the Maker" story-driven shoppable content','Priority platform for women entrepreneurs and SHGs','Zero technical burden for rural producers','Integrated discovery through NewsJunction coverage'], link:'/contact' },
  { id:4, slug:'manikya-traders', title:'Manikya Traders', subtitle:'Marketing & Trading', icon:TrendingUp, image:media.bgTraders, logo:media.logoTraders, logoBg:'#172230', heroVideo:media.tradersHeroVideo, gradient:'linear-gradient(135deg,#c37d0d,#d45656)', accent:'#c37d0d', tag:'Trading', tagline:'We Trade · You Grow · Together We Prosper.', description:'Manikya Traders is the B2B marketing and commodity trading arm of Manikya Group. We are the intermediary between food machinery manufacturers, grain producers, and businesses — handling all marketing, outreach, and deal facilitation.', features:['Food machinery marketing — roti, packaging, milling machines','Grain & commodity trading — rice, wheat, pulses, spices','B2B vendor–client matchmaking across Karnataka','Digital + field marketing campaigns for your product','Transparent commission model — no hidden charges','Backed by 20+ years of Manikya Group trust'], link:'/contact' },
  { id:5, slug:'manikya-properties', title:'Manikya Properties', subtitle:'Real Estate & Home Loans', icon:Building2, image:media.bgProperties, logo:media.logoProperties, logoBg:'#15243a', heroVideo:media.propertiesHeroVideo, gradient:'linear-gradient(135deg,#1e3a5f,#3772cf)', accent:'#3772cf', tag:'Real Estate', tagline:'Your Dream Home, Made Possible.', description:'Manikya Properties is your end-to-end real estate facilitator — we find the property, verify it legally, coordinate your bank loan, and handle all documentation.', features:['Residential & commercial property search','Home loan facilitation — SBI, HDFC, ICICI, Axis & more','Complete documentation support — zero paperwork stress','Legal title verification, encumbrance & RERA checks','Price negotiation assistance for best market deal','Post-purchase: registration, mutation & handover support'], link:'/contact' },
  { id:6, slug:'manikya-money', title:'Manikya Money', subtitle:'Financial Services', icon:DollarSign, image:media.bgMoney, logo:media.logoMoney, logoBg:'#0f2a2f', heroVideo:media.moneyHeroVideo, gradient:'linear-gradient(135deg,#6b5cf6,#8b5cf6)', accent:'#6b5cf6', tag:'Finance', tagline:'Empowering Your Financial Future with Trust.', description:'Manikya Money Service Pvt. Ltd. provides accessible, affordable financial services to every segment of Indian society — personal loans, business loans, and home loan facilitation.', features:['Personal, business & home loan facilitation','Speedy approval in 24–48 business hours','Low interest rates — competitive & transparent','Zero hidden charges — complete transparency','Minimal documentation — digital-friendly process','Customer-first support at every step of the journey'], link:'/contact' },
  { id:7, slug:'heritage', title:'Manikya Heritage', subtitle:'Mega Heritage Village', icon:Landmark, image:media.logoHeritage, logo:media.logoHeritageNew, logoBg:'#f1e9d7', heroVideo:media.heritageHeroVideo, gradient:'linear-gradient(135deg,#00d4a4,#00b48a)', accent:'#00b48a', tag:'Coming Soon', comingSoon:true, tagline:'Preserving the Past, Inspiring the Future.', description:"A living museum preserving Karnataka's 5000-year-old architecture, art, and lifestyle. Artisan workshops, Ayurvedic wellness zones, traditional homes, folk performances, and heritage stays.", features:['Authentic Chowkimane & Gutthu Mane traditional homes','Folk arts: Yakshagana, Dollu Kunitha, Kamsale','Ayurvedic Grama with herb gardens and wellness therapy','Artisan Street — live pottery, weaving, craft workshops','Heritage stay cottages for authentic cultural immersion'], link:'/contact' },
];

export const getService = (slug?: string) => services.find(s => s.slug === slug);
