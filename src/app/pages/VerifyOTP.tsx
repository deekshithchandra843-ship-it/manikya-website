import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';

// import { supabase } from '../../lib/supabase';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, phone } = location.state || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email && !phone) navigate('/login');
    else inputRefs.current[0]?.focus();
  }, [email, phone, navigate]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError('');
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const next = [...otp];
        next[index] = '';
        setOtp(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...otp];
    [...digits].forEach((d, i) => { if (i < 6) next[i] = d; });
    setOtp(next);
    const focus = Math.min(digits.length, 5);
    inputRefs.current[focus]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return setError('Please enter the complete 6-digit code.');
    setLoading(true);
    setError('');

    try {
      // ── SUPABASE: Verify OTP ──────────────────────────────
      // const { data, error: supaErr } = await supabase.auth.verifyOtp({
      //   ...(email ? { email } : { phone }),
      //   token: code,
      //   type: email ? 'email' : 'sms',
      // });
      // if (supaErr) throw supaErr;
      // sessionStorage.setItem('manikya_user', data.user!.id);
      // sessionStorage.removeItem('manikya_guest');
      // navigate('/');

      // Demo: accept 123456
      await new Promise(r => setTimeout(r, 1200));
      if (code === '123456') {
        sessionStorage.setItem('manikya_user', 'demo-user');
        sessionStorage.removeItem('manikya_guest');
        navigate('/');
      } else {
        throw new Error('Incorrect code. Please check and try again.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');

    try {
      // ── SUPABASE: Resend OTP ──────────────────────────────
      // if (email) await supabase.auth.signInWithOtp({ email });
      // else if (phone) await supabase.auth.signInWithOtp({ phone });

      await new Promise(r => setTimeout(r, 800));
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  const filled = otp.filter(Boolean).length;

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0f1629 0%, #1a2744 50%, #0f2b1f 100%)' }}>

      <div style={{ width: '100%', maxWidth: 420, background: 'rgba(255,255,255,0.97)', borderRadius: 20, padding: '40px 36px', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>

        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#4A90D9', fontSize: 14, marginBottom: 28, textDecoration: 'none', fontWeight: 500 }}>
          <ArrowLeft size={16} />
          Back to Login
        </Link>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '2px solid #BFDBFE' }}>
            <ShieldCheck size={28} color="#1D4ED8" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Verify your identity</h1>
          <p style={{ color: '#6B7280', fontSize: 14, margin: 0, lineHeight: 1.6 }}>
            We sent a 6-digit code to<br />
            <strong style={{ color: '#374151' }}>{email || phone}</strong>
          </p>
        </div>

        <form onSubmit={handleVerify}>
          {/* OTP boxes */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 8 }} onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                style={{
                  width: 48, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 700,
                  border: `2px solid ${digit ? '#1D4ED8' : error ? '#EF4444' : '#E5E7EB'}`,
                  borderRadius: 10, color: '#111827', background: digit ? '#EFF6FF' : '#fff',
                  outline: 'none', transition: 'all 0.15s', cursor: 'text',
                }}
              />
            ))}
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
            {otp.map((_, i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i < filled ? '#1D4ED8' : '#E5E7EB', transition: 'background 0.2s' }} />
            ))}
          </div>

          {error && (
            <div style={{ padding: '11px 14px', borderRadius: 8, background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: 14, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || filled < 6}
            style={{
              width: '100%', padding: '13px 0', borderRadius: 10, border: 'none',
              background: (loading || filled < 6) ? '#93C5FD' : 'linear-gradient(135deg, #1D4ED8, #1E40AF)',
              color: '#fff', fontSize: 15, fontWeight: 600, cursor: (loading || filled < 6) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? <><Spinner />Verifying…</> : 'Verify & Continue'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          {resendTimer > 0 ? (
            <p style={{ fontSize: 13, color: '#9CA3AF' }}>
              Resend code in <span style={{ fontWeight: 600, color: '#374151' }}>{resendTimer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#1D4ED8', fontWeight: 600, padding: 0 }}
            >
              {resending ? 'Sending…' : 'Resend code'}
            </button>
          )}
        </div>

        <div style={{ marginTop: 24, padding: '12px 14px', background: '#F0FDF4', borderRadius: 8, border: '1px solid #BBF7D0' }}>
          <p style={{ fontSize: 12, color: '#166534', margin: 0, fontWeight: 600, marginBottom: 2 }}>Demo Mode</p>
          <p style={{ fontSize: 12, color: '#166534', margin: 0 }}>
            Use code <strong>123456</strong> to sign in. Real OTP requires Supabase.
          </p>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </span>
  );
}
