import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Phone, Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

type LoginMethod = 'email' | 'phone';

export default function Login() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [useMagicLink, setUseMagicLink] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Track login attempt
    const loginAttempt = {
      method: 'email',
      type: useMagicLink ? 'magic_link' : 'otp',
      email,
      timestamp: new Date().toISOString(),
    };

    console.log('Login attempt tracked:', loginAttempt);

    // TODO: When Supabase is connected, use this code:
    // if (useMagicLink) {
    //   const { error } = await supabase.auth.signInWithOtp({
    //     email,
    //     options: {
    //       emailRedirectTo: `${window.location.origin}/auth/callback`,
    //     },
    //   });
    //   if (error) {
    //     setMessage(`Error: ${error.message}`);
    //   } else {
    //     setMessage('Check your email for the magic link!');
    //   }
    // } else {
    //   const { error } = await supabase.auth.signInWithOtp({ email });
    //   if (error) {
    //     setMessage(`Error: ${error.message}`);
    //   } else {
    //     navigate('/auth/verify-otp', { state: { email } });
    //   }
    // }

    // Demo simulation
    setTimeout(() => {
      setLoading(false);
      if (useMagicLink) {
        setMessage('✓ Magic link sent! Check your email inbox.');
      } else {
        setMessage('✓ OTP sent! Redirecting to verification...');
        setTimeout(() => navigate('/auth/verify-otp', { state: { email } }), 1500);
      }
    }, 1500);
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Track login attempt
    const loginAttempt = {
      method: 'phone',
      type: 'otp',
      phone,
      timestamp: new Date().toISOString(),
    };

    console.log('Login attempt tracked:', loginAttempt);

    // TODO: When Supabase is connected, use this code:
    // const { error } = await supabase.auth.signInWithOtp({ phone });
    // if (error) {
    //   setMessage(`Error: ${error.message}`);
    // } else {
    //   navigate('/auth/verify-otp', { state: { phone } });
    // }

    // Demo simulation
    setTimeout(() => {
      setLoading(false);
      setMessage('✓ OTP sent to your phone! Redirecting...');
      setTimeout(() => navigate('/auth/verify-otp', { state: { phone } }), 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setLoginMethod('email')}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
              loginMethod === 'email'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Mail size={20} className="mr-2" />
            Email
          </button>
          <button
            onClick={() => setLoginMethod('phone')}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
              loginMethod === 'phone'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Phone size={20} className="mr-2" />
            Phone
          </button>
        </div>

        {loginMethod === 'email' ? (
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useMagicLink}
                  onChange={(e) => setUseMagicLink(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Use magic link instead of OTP
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-2 ml-7">
                {useMagicLink
                  ? 'We\'ll send you a secure link to sign in'
                  : 'We\'ll send you a 6-digit code to verify'}
              </p>
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.startsWith('✓')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                <p className="text-sm">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Sending...'
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  {useMagicLink ? 'Send Magic Link' : 'Send OTP'}
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePhoneLogin} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="+91 1234567890"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                📱 We'll send you a 6-digit OTP via SMS
              </p>
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.startsWith('✓')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                <p className="text-sm">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Sending...'
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  Send OTP
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            No passwords needed. We'll send you a secure code or link.
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-900 font-semibold mb-1">Demo Mode:</p>
          <p className="text-xs text-blue-700">
            Connect Supabase to enable real authentication. Currently tracking attempts to console.
          </p>
        </div>
      </div>
    </div>
  );
}
