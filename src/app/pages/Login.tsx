import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Phone, Send, ArrowLeft, UserCheck, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Link } from 'react-router';

// ─────────────────────────────────────────────────────────────
// HOW TO CONNECT SUPABASE:
//   1. npm install @supabase/supabase-js
//   2. Create src/lib/supabase.ts with your project URL + anon key
//   3. Uncomment the import below and all supabase.auth.* calls
// ─────────────────────────────────────────────────────────────
// import { supabase } from '../../lib/supabase';

type LoginMethod = 'email' | 'phone';
type AuthMode = 'magic_link' | 'otp' | 'password';

export default function Login() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [authMode, setAuthMode] = useState<AuthMode>('magic_link');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // ── Helpers ──────────────────────────────────────────────
  const showSuccess = (msg: string) => { setIsError(false); setMessage(msg); };
  const showError = (msg: string) => { setIsError(true); setMessage(msg); };

  // ── Guest Access ─────────────────────────────────────────
  const handleGuestAccess = () => {
    setGuestLoading(true);

    // REAL IMPLEMENTATION: set a guest flag in session/context
    // You might want to use React Context or Zustand to track guest state
    // so that gated features can check if user is a guest.
    sessionStorage.setItem('manikya_guest', 'true');
    sessionStorage.removeItem('manikya_user');

    // TODO with Supabase: use anon sessions (they're created automatically)
    // const { data } = await supabase.auth.getSession();
    // if (!data.session) await supabase.auth.signInAnonymously(); // requires Supabase anon sign-in enabled

    setTimeout(() => {
      setGuestLoading(false);
      navigate('/');
    }, 600);
  };

  // ── Email Auth ────────────────────────────────────────────
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return showError('Please enter your email address.');
    setLoading(true);
    setMessage('');

    try {
      if (authMode === 'magic_link') {
        // ── SUPABASE: Magic Link ──────────────────────────────
        // const { error } = await supabase.auth.signInWithOtp({
        //   email,
        //   options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        // });
        // if (error) throw error;
        // showSuccess('Magic link sent! Check your inbox.');

        // Demo fallback:
        await delay(1400);
        showSuccess('Magic link sent! Check your inbox and click the link to sign in.');

      } else if (authMode === 'otp') {
        // ── SUPABASE: Email OTP ───────────────────────────────
        // const { error } = await supabase.auth.signInWithOtp({ email });
        // if (error) throw error;
        // navigate('/auth/verify-otp', { state: { email } });

        // Demo fallback:
        await delay(1400);
        showSuccess('OTP sent! Redirecting…');
        await delay(1000);
        navigate('/auth/verify-otp', { state: { email } });

      } else {
        // ── SUPABASE: Password ────────────────────────────────
        // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        // if (error) throw error;
        // sessionStorage.setItem('manikya_user', data.user.id);
        // navigate('/');

        // Demo fallback:
        await delay(1200);
        if (password.length < 6) throw new Error('Invalid credentials. Please try again.');
        sessionStorage.setItem('manikya_user', 'demo-user');
        sessionStorage.removeItem('manikya_guest');
        navigate('/');
      }
    } catch (err: any) {
      showError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Phone Auth ────────────────────────────────────────────
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return showError('Please enter your phone number.');
    setLoading(true);
    setMessage('');

    try {
      // ── SUPABASE: Phone OTP ───────────────────────────────
      // const { error } = await supabase.auth.signInWithOtp({ phone });
      // if (error) throw error;
      // navigate('/auth/verify-otp', { state: { phone } });

      // Demo fallback:
      await delay(1400);
      showSuccess('OTP sent to your phone! Redirecting…');
      await delay(1000);
      navigate('/auth/verify-otp', { state: { phone } });
    } catch (err: any) {
      showError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0f1629 0%, #1a2744 50%, #0f2b1f 100%)' }}>
      {/* ── Left panel – decorative ── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        <FloatingOrbs />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(99,179,237,0.2)', border: '1px solid rgba(99,179,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} color="#63B3ED" />
            </div>
            <span style={{ color: '#63B3ED', fontWeight: 600, fontSize: 15, letterSpacing: '0.05em' }}>MANIKYA SERVICES</span>
          </div>
        </div>
        <div className="relative z-10">
          <h2 style={{ color: '#fff', fontSize: 38, fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
            Your gateway to<br />
            <span style={{ color: '#63B3ED' }}>Pearl Excellence</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16, lineHeight: 1.7, maxWidth: 380 }}>
            Explore premium pearl farms, curated services, and our rich heritage — sign in for the full experience, or browse as a guest.
          </p>
          <div style={{ marginTop: 40, display: 'flex', gap: 12 }}>
            {['Heritage', 'Pearl Farms', 'Gallery', 'Services'].map(tag => (
              <span key={tag} style={{ padding: '6px 14px', borderRadius: 999, border: '1px solid rgba(99,179,237,0.3)', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{tag}</span>
            ))}
          </div>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>© 2025 Manikya Services. All rights reserved.</div>
      </div>

      {/* ── Right panel – form ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div style={{ width: '100%', maxWidth: 440, background: 'rgba(255,255,255,0.97)', borderRadius: 20, padding: '40px 36px', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>

          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#4A90D9', fontSize: 14, marginBottom: 28, textDecoration: 'none', fontWeight: 500 }}>
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: 0, marginBottom: 6 }}>Welcome back</h1>
            <p style={{ color: '#6B7280', fontSize: 15, margin: 0 }}>Sign in to your account to continue</p>
          </div>

          {/* ── Method tabs ── */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: '#F3F4F6', borderRadius: 10, padding: 4 }}>
            {(['email', 'phone'] as LoginMethod[]).map(m => (
              <button
                key={m}
                onClick={() => { setLoginMethod(m); setMessage(''); }}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  padding: '9px 0', border: 'none', cursor: 'pointer', borderRadius: 8,
                  fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
                  background: loginMethod === m ? '#fff' : 'transparent',
                  color: loginMethod === m ? '#1D4ED8' : '#6B7280',
                  boxShadow: loginMethod === m ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
                }}
              >
                {m === 'email' ? <Mail size={15} /> : <Phone size={15} />}
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>

          {loginMethod === 'email' ? (
            <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Auth mode selector */}
              <div style={{ display: 'flex', gap: 6 }}>
                {([['magic_link', 'Magic Link'], ['otp', 'OTP Code'], ['password', 'Password']] as [AuthMode, string][]).map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => { setAuthMode(mode); setMessage(''); }}
                    style={{
                      flex: 1, padding: '7px 4px', border: `1.5px solid ${authMode === mode ? '#1D4ED8' : '#E5E7EB'}`,
                      borderRadius: 8, background: authMode === mode ? '#EFF6FF' : '#fff',
                      color: authMode === mode ? '#1D4ED8' : '#6B7280',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >{label}</button>
                ))}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  style={inputStyle}
                />
              </div>

              {authMode === 'password' && (
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      style={{ ...inputStyle, paddingRight: 44 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0 }}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  <div style={{ textAlign: 'right', marginTop: 6 }}>
                    <a href="#" style={{ fontSize: 13, color: '#1D4ED8', textDecoration: 'none' }}>Forgot password?</a>
                  </div>
                </div>
              )}

              {authMode !== 'password' && (
                <p style={{ fontSize: 13, color: '#6B7280', background: '#F9FAFB', padding: '10px 14px', borderRadius: 8, margin: 0 }}>
                  {authMode === 'magic_link'
                    ? '✉️ We\'ll email you a secure sign-in link — no password needed.'
                    : '🔢 We\'ll email you a 6-digit code to verify your identity.'}
                </p>
              )}

              {message && <StatusBanner text={message} isError={isError} />}

              <button type="submit" disabled={loading} style={primaryBtnStyle(loading)}>
                {loading ? <Spinner /> : <><Send size={16} /> {authMode === 'magic_link' ? 'Send Magic Link' : authMode === 'otp' ? 'Send OTP' : 'Sign In'}</>}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePhoneLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  placeholder="+91 98765 43210"
                  style={inputStyle}
                />
              </div>
              <p style={{ fontSize: 13, color: '#6B7280', background: '#F9FAFB', padding: '10px 14px', borderRadius: 8, margin: 0 }}>
                📱 A 6-digit OTP will be sent to this number via SMS.
              </p>

              {message && <StatusBanner text={message} isError={isError} />}

              <button type="submit" disabled={loading} style={primaryBtnStyle(loading)}>
                {loading ? <Spinner /> : <><Send size={16} /> Send OTP</>}
              </button>
            </form>
          )}

          {/* ── Divider ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
            <span style={{ fontSize: 13, color: '#9CA3AF', whiteSpace: 'nowrap' }}>or continue as</span>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
          </div>

          {/* ── Guest Button ── */}
          <button
            onClick={handleGuestAccess}
            disabled={guestLoading}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              padding: '13px 0', borderRadius: 10, border: '1.5px solid #D1D5DB',
              background: guestLoading ? '#F9FAFB' : '#fff', cursor: guestLoading ? 'not-allowed' : 'pointer',
              fontSize: 15, fontWeight: 600, color: '#374151', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (!guestLoading) (e.currentTarget as HTMLButtonElement).style.background = '#F9FAFB'; }}
            onMouseLeave={e => { if (!guestLoading) (e.currentTarget as HTMLButtonElement).style.background = '#fff'; }}
          >
            {guestLoading ? <Spinner color="#374151" /> : <UserCheck size={18} color="#374151" />}
            Browse as Guest
          </button>

          <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
            Guest access lets you explore the site without signing in.<br />Some features may require an account.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Tiny helper components ────────────────────────────────────

function StatusBanner({ text, isError }: { text: string; isError: boolean }) {
  return (
    <div style={{
      padding: '12px 14px', borderRadius: 8, fontSize: 14,
      background: isError ? '#FEF2F2' : '#F0FDF4',
      border: `1px solid ${isError ? '#FECACA' : '#BBF7D0'}`,
      color: isError ? '#B91C1C' : '#15803D',
    }}>
      {text}
    </div>
  );
}

function Spinner({ color = '#fff' }: { color?: string }) {
  return (
    <span style={{
      width: 16, height: 16, border: `2px solid ${color}40`, borderTopColor: color,
      borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite',
    }} />
  );
}

function FloatingOrbs() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}`}</style>
      {[
        { w: 320, h: 320, top: '-80px', left: '-80px', color: 'rgba(59,130,246,0.15)', delay: '0s' },
        { w: 240, h: 240, bottom: '60px', right: '-40px', color: 'rgba(16,185,129,0.12)', delay: '1.5s' },
        { w: 180, h: 180, top: '40%', left: '60%', color: 'rgba(99,179,237,0.1)', delay: '3s' },
      ].map((o, i) => (
        <div key={i} style={{
          position: 'absolute', width: o.w, height: o.h, borderRadius: '50%',
          background: o.color, top: (o as any).top, bottom: (o as any).bottom,
          left: (o as any).left, right: (o as any).right,
          animation: `float 6s ease-in-out ${o.delay} infinite`,
          filter: 'blur(40px)',
        }} />
      ))}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB',
  borderRadius: 9, fontSize: 15, color: '#111827', outline: 'none',
  boxSizing: 'border-box', background: '#fff', transition: 'border-color 0.15s',
};

const primaryBtnStyle = (disabled: boolean): React.CSSProperties => ({
  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
  padding: '13px 0', borderRadius: 10, border: 'none',
  background: disabled ? '#93C5FD' : 'linear-gradient(135deg, #1D4ED8, #1E40AF)',
  color: '#fff', fontSize: 15, fontWeight: 600,
  cursor: disabled ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s',
});

// ── Util ──────────────────────────────────────────────────────
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
