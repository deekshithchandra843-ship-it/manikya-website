import { useState } from 'react';
import { Link } from 'react-router';
import { TrendingUp, CheckCircle, ChevronDown, ArrowRight, Sparkles } from 'lucide-react';

export default function PearlFarms() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const farmingSteps = [
    { step: '01', title: 'Site Selection', description: 'Identify suitable water bodies with optimal conditions for pearl cultivation.' },
    { step: '02', title: 'Oyster Procurement', description: 'Source healthy oysters from certified suppliers or hatcheries.' },
    { step: '03', title: 'Nucleation', description: 'Skilled technicians insert nucleus into oysters to initiate pearl formation.' },
    { step: '04', title: 'Farm Maintenance', description: 'Regular monitoring, cleaning, and maintenance of oyster cages.' },
    { step: '05', title: 'Harvest', description: 'Pearls are harvested after 12–18 months of careful cultivation.' },
    { step: '06', title: 'Quality Check & Sale', description: 'Pearls are graded, certified, and sold through our network.' },
  ];

  const farmerBenefits = [
    'Guaranteed minimum income per harvest cycle',
    'Technical training and ongoing support',
    'Free oyster procurement assistance',
    'Market linkage for pearl sales',
    'Farming equipment and infrastructure support',
    'Insurance coverage for natural disasters',
  ];

  const investorBenefits = [
    'Expected ROI of 30–40% per cycle',
    'Passive income opportunity',
    'Transparent farming operations',
    'Regular progress updates',
    'Low entry investment options',
    'Sustainable and eco-friendly investment',
  ];

  const faqs = [
    { question: 'What is the minimum investment required?', answer: 'The minimum investment starts from ₹50,000, which covers approximately 100 oysters with complete support infrastructure.' },
    { question: 'How long does one farming cycle take?', answer: 'One complete pearl farming cycle takes 12–18 months from nucleation to harvest, depending on environmental conditions.' },
    { question: 'What kind of returns can I expect?', answer: 'Investors typically see returns of 30–40% per cycle. Farmers earn guaranteed minimum income plus profit sharing on pearl sales.' },
    { question: 'Is prior farming experience required?', answer: 'No prior experience is needed. We provide comprehensive training, technical support, and ongoing guidance throughout the farming process.' },
    { question: 'What happens if oysters die or pearls fail to form?', answer: 'We provide insurance coverage for natural disasters. Our quality control ensures high success rates, and we share risk through guaranteed minimum income programs.' },
    { question: 'How are the pearls sold?', answer: 'Pearls are sold through our established network of jewelry manufacturers, exporters, and retail partners. We handle grading, certification, and market linkage.' },
  ];

  return (
    <div className="mk">
      {/* HERO */}
      <section className="mk-hero-sky" style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(56px,10vw,104px) 0' }}>
        <div className="mk-cloud" style={{ top: -50, left: '8%', width: 320, height: 200 }} />
        <div className="mk-cloud" style={{ bottom: -30, right: '10%', width: 360, height: 220 }} />
        <div className="mk-container" style={{ position: 'relative', zIndex: 2, maxWidth: 820 }}>
          <span className="mk-badge mk-badge-glass" style={{ marginBottom: 20 }}><Sparkles size={13} /> A unit of Manikya Services Pvt Ltd</span>
          <h1 className="mk-display" style={{ color: 'var(--mk-ink)', margin: '0 0 16px' }}>Manikya Pearl Farms</h1>
          <p className="mk-lead" style={{ color: 'var(--mk-slate)', maxWidth: 620 }}>
            A sustainable freshwater pearl farming initiative in Mandya, Karnataka — where nature meets high-yield financial growth.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
            <Link to="/contact" className="mk-btn mk-btn-primary mk-btn-lg">Become a partner <ArrowRight size={16} /></Link>
            <a href="#process" className="mk-btn mk-btn-glass mk-btn-lg">How it works</a>
          </div>
        </div>
      </section>

      {/* BUSINESS MODEL */}
      <section className="mk-section" style={{ background: 'var(--mk-canvas)' }}>
        <div className="mk-container">
          <div className="mk-section-head">
            <p className="mk-eyebrow">Our business model</p>
            <h2 className="mk-h1" style={{ margin: 0 }}>A partnership for mutual prosperity</h2>
          </div>
          <div className="mk-card" style={{ marginBottom: 24 }}>
            <h3 className="mk-h4" style={{ margin: '0 0 12px' }}>About us</h3>
            <p className="mk-body" style={{ marginBottom: 12 }}>Manikya Pearl Farms is a sustainable freshwater pearl farming initiative located in Mandya, Periyapatna Taluk, Maddur Village, Karnataka.</p>
            <p className="mk-body" style={{ marginBottom: 12 }}>Operating under <strong style={{ color: 'var(--mk-ink)' }}>Manikya Services Private Limited</strong>, we cultivate naturally grown freshwater pearls using responsible aquaculture practices, supporting the livelihood of local farmers.</p>
            <p className="mk-body" style={{ margin: 0 }}>We are traditionally cane-growing farmers, now transforming conventional agricultural land into a high-value, sustainable pearl farming ecosystem.</p>
          </div>
          <div className="mk-grid mk-grid-2">
            <div className="mk-card">
              <h3 className="mk-h4" style={{ margin: '0 0 10px' }}>Our vision</h3>
              <p className="mk-body" style={{ margin: 0 }}>To build a farmer-centric pearl farming ecosystem that delivers <strong style={{ color: 'var(--mk-ink)' }}>sustainable income, premium exports</strong>, and <strong style={{ color: 'var(--mk-ink)' }}>long-term value creation</strong>.</p>
            </div>
            <div className="mk-card" style={{ background: 'rgba(0,212,164,0.06)', border: '1px solid rgba(0,212,164,0.25)' }}>
              <h3 className="mk-h4" style={{ margin: '0 0 12px' }}>Farmer engagement & support</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
                {['Complete technical and operational guidance', 'End-to-end support from pond prep to pearl sales', '100% buyback assurance — we buy back the pearls', 'Guaranteed market access and sales'].map(t => (
                  <li key={t} className="mk-small" style={{ display: 'flex', gap: 8, alignItems: 'flex-start', color: 'var(--mk-slate)' }}>
                    <CheckCircle size={16} color="#00b48a" style={{ flexShrink: 0, marginTop: 2 }} /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="mk-section mk-sec-mint">
        <div className="mk-container">
          <div className="mk-section-head">
            <p className="mk-eyebrow">The process</p>
            <h2 className="mk-h1" style={{ margin: 0 }}>From oyster to pearl</h2>
          </div>
          <div className="mk-grid mk-grid-3">
            {farmingSteps.map(step => (
              <div key={step.step} className="mk-card mk-card-hover">
                <span className="mk-mono" style={{ fontSize: '.8rem', fontWeight: 500, color: 'var(--mk-green-deep)' }}>{step.step}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--mk-ink)', margin: '10px 0 8px' }}>{step.title}</h3>
                <p className="mk-small" style={{ color: 'var(--mk-steel)', margin: 0 }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="mk-section mk-sec-peach">
        <div className="mk-container">
          <div className="mk-grid mk-grid-2" style={{ gap: 'clamp(2rem,5vw,4rem)' }}>
            <div>
              <p className="mk-eyebrow">For farmers</p>
              <h2 className="mk-h2" style={{ margin: '0 0 14px' }}>Farmer benefits</h2>
              <p className="mk-body" style={{ marginBottom: 22 }}>Join our network of successful pearl farmers and transform your livelihood with guaranteed income and comprehensive support.</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'grid', gap: 12 }}>
                {farmerBenefits.map((b, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <CheckCircle size={18} color="#00b48a" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span className="mk-body" style={{ color: 'var(--mk-slate)' }}>{b}</span>
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="mk-btn mk-btn-primary">Become a farmer partner <ArrowRight size={14} /></Link>
            </div>
            <div>
              <p className="mk-eyebrow">For investors</p>
              <h2 className="mk-h2" style={{ margin: '0 0 14px' }}>Investor opportunities</h2>
              <p className="mk-body" style={{ marginBottom: 22 }}>Invest in sustainable agriculture with transparent operations, regular updates, and attractive returns on your capital.</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'grid', gap: 12 }}>
                {investorBenefits.map((b, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <TrendingUp size={18} color="#3772cf" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span className="mk-body" style={{ color: 'var(--mk-slate)' }}>{b}</span>
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="mk-btn mk-btn-primary">Start investing today <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mk-section mk-sec-sky">
        <div className="mk-container" style={{ maxWidth: 820 }}>
          <div className="mk-section-head">
            <p className="mk-eyebrow">FAQ</p>
            <h2 className="mk-h1" style={{ margin: 0 }}>Frequently asked questions</h2>
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {faqs.map((faq, idx) => (
              <div key={idx} className="mk-card" style={{ padding: 0, overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{ width: '100%', padding: '18px 22px', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--mk-font)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--mk-ink)', fontSize: '1rem' }}>{faq.question}</span>
                  <ChevronDown size={18} color="#5a5a5c" style={{ transition: 'transform .25s', transform: openFaq === idx ? 'rotate(180deg)' : 'none', flexShrink: 0 }} />
                </button>
                {openFaq === idx && (
                  <div style={{ padding: '0 22px 18px' }}>
                    <p className="mk-body" style={{ margin: 0, color: 'var(--mk-steel)' }}>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mk-hero-dark mk-section" style={{ textAlign: 'center' }}>
        <div className="mk-container" style={{ maxWidth: 720 }}>
          <h2 className="mk-h1" style={{ color: '#fff', margin: '0 0 16px' }}>Ready to start your pearl farming journey?</h2>
          <p className="mk-lead" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 560, margin: '0 auto 28px' }}>
            Whether you're a farmer looking for new opportunities or an investor seeking sustainable returns, we're here to help.
          </p>
          <Link to="/contact" className="mk-btn mk-btn-primary mk-btn-lg">Contact us today <ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
  );
}
