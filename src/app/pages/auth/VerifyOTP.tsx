import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, phone } = location.state || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email && !phone) {
      navigate('/login');
    }
  }, [email, phone, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6 && /^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }

    setOtp(newOtp);
    const lastFilledIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const otpCode = otp.join('');

    // Track verification attempt
    const verificationAttempt = {
      method: email ? 'email' : 'phone',
      identifier: email || phone,
      otpLength: otpCode.length,
      timestamp: new Date().toISOString(),
    };

    console.log('Verification attempt tracked:', verificationAttempt);

    // TODO: When Supabase is connected, use this code:
    // const { data, error } = await supabase.auth.verifyOtp({
    //   email,
    //   phone,
    //   token: otpCode,
    //   type: email ? 'email' : 'sms',
    // });
    //
    // if (error) {
    //   setError(error.message);
    //   setLoading(false);
    // } else {
    //   // Track successful login
    //   await supabase.from('login_analytics').insert({
    //     user_id: data.user.id,
    //     method: email ? 'email' : 'phone',
    //     type: 'otp',
    //     timestamp: new Date().toISOString(),
    //   });
    //   navigate('/');
    // }

    // Demo simulation
    setTimeout(() => {
      setLoading(false);
      if (otpCode === '123456') {
        // Demo OTP
        localStorage.setItem('user_logged_in', 'true');
        navigate('/');
      } else {
        setError('Invalid OTP. Try 123456 for demo.');
      }
    }, 1500);
  };

  const handleResend = async () => {
    setResendTimer(60);
    setError('');

    // Track resend attempt
    const resendAttempt = {
      method: email ? 'email' : 'phone',
      identifier: email || phone,
      timestamp: new Date().toISOString(),
    };

    console.log('Resend OTP tracked:', resendAttempt);

    // TODO: When Supabase is connected, resend OTP
    // if (email) {
    //   await supabase.auth.signInWithOtp({ email });
    // } else if (phone) {
    //   await supabase.auth.signInWithOtp({ phone });
    // }

    alert('OTP resent! (Demo mode - use 123456)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <Link to="/login" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Back to Login
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-blue-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h1>
          <p className="text-gray-600">
            We sent a code to{' '}
            <span className="font-semibold">{email || phone}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Enter 6-digit code
            </label>
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || otp.some((d) => !d)}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify & Sign In'}
          </button>

          <div className="text-center">
            {resendTimer > 0 ? (
              <p className="text-sm text-gray-600">
                Resend code in <span className="font-semibold">{resendTimer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                Resend OTP
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-900 font-semibold mb-1">Demo Mode:</p>
          <p className="text-xs text-blue-700">
            Use OTP: <span className="font-bold">123456</span> to sign in. Real OTP verification requires Supabase.
          </p>
        </div>
      </div>
    </div>
  );
}
