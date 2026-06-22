import { Link } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mk mk-hero-sky" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, position: 'relative', overflow: 'hidden' }}>
      <div className="mk-cloud" style={{ top: '12%', left: '14%', width: 280, height: 180 }} />
      <div className="mk-cloud" style={{ bottom: '14%', right: '16%', width: 320, height: 200 }} />
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, maxWidth: 520 }}>
        <div style={{ fontSize: 'clamp(5rem,18vw,9rem)', fontWeight: 700, color: 'var(--mk-ink)', lineHeight: 1, letterSpacing: '-0.04em' }}>404</div>
        <h2 className="mk-h2" style={{ margin: '12px 0' }}>Page not found</h2>
        <p className="mk-lead" style={{ color: 'var(--mk-slate)', margin: '0 auto 28px', maxWidth: 400 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="mk-btn mk-btn-primary mk-btn-lg"><Home size={16} /> Go to homepage</Link>
          <button onClick={() => window.history.back()} className="mk-btn mk-btn-glass mk-btn-lg"><ArrowLeft size={16} /> Go back</button>
        </div>
      </div>
    </div>
  );
}
