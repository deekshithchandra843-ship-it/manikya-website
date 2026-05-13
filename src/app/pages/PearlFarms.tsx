import { useState } from 'react';
import { Link } from 'react-router';
import { Sparkles, TrendingUp, Shield, Users, CheckCircle, ChevronDown, ArrowRight } from 'lucide-react';

export default function PearlFarms() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const farmingSteps = [
    {
      step: 1,
      title: 'Site Selection',
      description: 'Identify suitable water bodies with optimal conditions for pearl cultivation.',
    },
    {
      step: 2,
      title: 'Oyster Procurement',
      description: 'Source healthy oysters from certified suppliers or hatcheries.',
    },
    {
      step: 3,
      title: 'Nucleation',
      description: 'Skilled technicians insert nucleus into oysters to initiate pearl formation.',
    },
    {
      step: 4,
      title: 'Farm Maintenance',
      description: 'Regular monitoring, cleaning, and maintenance of oyster cages.',
    },
    {
      step: 5,
      title: 'Harvest',
      description: 'Pearls are harvested after 12-18 months of careful cultivation.',
    },
    {
      step: 6,
      title: 'Quality Check & Sale',
      description: 'Pearls are graded, certified, and sold through our network.',
    },
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
    'Expected ROI of 30-40% per cycle',
    'Passive income opportunity',
    'Transparent farming operations',
    'Regular progress updates',
    'Low entry investment options',
    'Sustainable and eco-friendly investment',
  ];

  const faqs = [
    {
      question: 'What is the minimum investment required?',
      answer: 'The minimum investment starts from ₹50,000, which covers approximately 100 oysters with complete support infrastructure.',
    },
    {
      question: 'How long does one farming cycle take?',
      answer: 'One complete pearl farming cycle takes 12-18 months from nucleation to harvest, depending on environmental conditions.',
    },
    {
      question: 'What kind of returns can I expect?',
      answer: 'Investors typically see returns of 30-40% per cycle. Farmers earn guaranteed minimum income plus profit sharing on pearl sales.',
    },
    {
      question: 'Is prior farming experience required?',
      answer: 'No prior experience is needed. We provide comprehensive training, technical support, and ongoing guidance throughout the farming process.',
    },
    {
      question: 'What happens if oysters die or pearls fail to form?',
      answer: 'We provide insurance coverage for natural disasters. Our quality control ensures high success rates, and we share risk through guaranteed minimum income programs.',
    },
    {
      question: 'How are the pearls sold?',
      answer: 'Pearls are sold through our established network of jewelry manufacturers, exporters, and retail partners. We handle grading, certification, and market linkage.',
    },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={40} />
            <h1 className="text-4xl md:text-5xl font-bold">Manikya Pearl Farms</h1>
          </div>
          <p className="text-2xl italic mb-4">A Unit of Manikya Services Private Limited</p>
          <p className="text-xl text-blue-100 max-w-3xl">
            A sustainable freshwater pearl farming initiative located in Mandya, Karnataka. Where nature meets high-yield financial growth.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Business Model
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A unique partnership model connecting farmers with investors for mutual prosperity
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">About Us</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Manikya Pearl Farms is a sustainable freshwater pearl farming initiative located in Mandya, Periyapatna Taluk, Maddur Village, Karnataka.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Operating under <strong>Manikya Services Private Limited</strong>, we focus on cultivating naturally grown freshwater pearls using responsible aquaculture practices, supporting the livelihood of local farmers.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We are traditionally cane-growing farmers, now transforming conventional agricultural land into a high-value, sustainable pearl farming business ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To build a farmer-centric pearl farming ecosystem that delivers <strong>sustainable income, premium exports</strong>, and <strong>long-term value creation</strong>.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Our Business Model</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                <strong>Farmer Engagement & Support Model:</strong>
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Complete technical and operational guidance</li>
                <li>✓ End-to-end support from pond preparation to pearl sales</li>
                <li>✓ 100% buyback assurance - We exclusively buy back the pearls</li>
                <li>✓ Guaranteed market access and sales</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pearl Farming Process
            </h2>
            <p className="text-lg text-gray-600">
              A step-by-step journey from oyster to pearl
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmingSteps.map((step) => (
              <div key={step.step} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                </div>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Farmer Benefits</h2>
              <p className="text-lg text-gray-700 mb-6">
                Join our network of successful pearl farmers and transform your livelihood with guaranteed income and comprehensive support.
              </p>
              <ul className="space-y-4">
                {farmerBenefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="text-green-600 mr-3 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors mt-6"
              >
                Become a Farmer Partner
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Investor Opportunities</h2>
              <p className="text-lg text-gray-700 mb-6">
                Invest in sustainable agriculture with transparent operations, regular updates, and attractive returns on your capital.
              </p>
              <ul className="space-y-4">
                {investorBenefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="text-blue-600 mr-3 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-6"
              >
                Start Investing Today
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about pearl farming with Manikya
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`text-gray-500 transition-transform ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                    size={20}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Pearl Farming Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Whether you're a farmer looking for new opportunities or an investor seeking sustainable returns, we're here to help.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Contact Us Today
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
