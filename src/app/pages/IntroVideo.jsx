/**
 * IntroVideo.jsx — HERO-SECTION EMBEDDED cinematic intro
 * ─────────────────────────────────────────────────────────────────────────────
 * Place at: src/app/pages/IntroVideo.jsx
 *
 * Props:
 *   videoSrc   – "/intro.mp4"
 *   onComplete – called when video ends or is skipped
 * ─────────────────────────────────────────────────────────────────────────────
 * This version renders INSIDE the hero section (not fixed/fullscreen).
 * It sits below the navbar + live bar, perfectly filling the hero area.
 */
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Progress bar ── */
function ProgressBar({ videoRef }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tick = () => { if (v.duration) setPct(v.currentTime / v.duration * 100); };
    v.addEventListener('timeupdate', tick);
    return () => v.removeEventListener('timeupdate', tick);
  }, [videoRef]);
  return (
    <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:'rgba(255,255,255,0.06)', zIndex:20 }}>
      <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,#ef4444,#f59e0b)', boxShadow:'0 0 6px rgba(245,158,11,0.8)', transition:'width 0.3s linear' }} />
    </div>
  );
}

/* ── Skip button ── */
function SkipBtn({ onSkip }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 1200); return () => clearTimeout(t); }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
          transition={{ duration:0.4 }}
          onClick={onSkip}
          style={{
            position:'absolute', bottom:'clamp(1.2rem,3vh,2rem)', right:'clamp(1rem,3vw,2rem)',
            zIndex:30, background:'rgba(0,0,0,0.35)', border:'1px solid rgba(255,255,255,0.18)',
            borderRadius:40, padding:'6px 18px', color:'rgba(255,255,255,0.55)',
            fontFamily:"'DM Sans',sans-serif", fontSize:'0.68rem', fontWeight:600,
            letterSpacing:'0.12em', textTransform:'uppercase', cursor:'pointer',
            backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
          }}
        >
          Skip ›
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ── Tap-to-play overlay (when autoplay is blocked) ── */
function TapToPlay({ onTap, onSkip }) {
  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{
        position:'absolute', inset:0, zIndex:25,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)',
        cursor:'pointer', gap:14,
      }}
      onClick={onTap}
    >
      {/* Pulsing play circle */}
      <motion.div
        animate={{ scale:[1,1.1,1] }} transition={{ repeat:Infinity, duration:2 }}
        style={{
          width:72, height:72, borderRadius:'50%',
          background:'rgba(255,255,255,0.1)', border:'2px solid rgba(255,255,255,0.35)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <polygon points="5,3 19,12 5,21"/>
        </svg>
      </motion.div>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.78rem', color:'rgba(255,255,255,0.45)', letterSpacing:'0.15em', textTransform:'uppercase', margin:0 }}>
        Tap to watch intro
      </p>
      <button
        onClick={e => { e.stopPropagation(); onSkip(); }}
        style={{ background:'none', border:'none', color:'rgba(255,255,255,0.25)', fontFamily:"'DM Sans',sans-serif", fontSize:'0.65rem', letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer', marginTop:4 }}
      >
        Skip →
      </button>
    </motion.div>
  );
}

/* ── Main export ── */
export default function IntroVideo({ videoSrc = '/intro.mp4', onComplete }) {
  const videoRef = useRef(null);
  const [phase, setPhase] = useState('playing'); // 'playing' | 'fading' | 'done'
  const [needsClick, setNeedsClick] = useState(false);

  const finish = useCallback(() => {
    if (phase !== 'playing') return;
    setPhase('fading');
    setTimeout(() => { setPhase('done'); onComplete?.(); }, 800);
  }, [phase, onComplete]);

  const handleError = useCallback(() => { onComplete?.(); }, [onComplete]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => setNeedsClick(true));
  }, []);

  const handleTap = () => {
    setNeedsClick(false);
    videoRef.current?.play().catch(() => onComplete?.());
  };

  if (phase === 'done') return null;

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="hero-intro"
          initial={{ opacity:1 }}
          animate={{ opacity: phase === 'fading' ? 0 : 1 }}
          exit={{ opacity:0 }}
          transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
          style={{
            position:'absolute', inset:0, zIndex:40,
            background:'#000', overflow:'hidden',
          }}
        >
          {/* Cinematic vignette */}
          <div style={{
            position:'absolute', inset:0, zIndex:5, pointerEvents:'none',
            background:'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.6) 100%)',
          }} />

          {/* Top letterbox */}
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'clamp(16px,3vh,32px)', background:'#000', zIndex:10 }} />
          {/* Bottom letterbox */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'clamp(16px,3vh,32px)', background:'#000', zIndex:10 }} />

          {/* Video */}
          <motion.video
            ref={videoRef}
            initial={{ opacity:0, filter:'blur(10px) brightness(0.3)' }}
            animate={{ opacity:1, filter:'blur(0px) brightness(1)' }}
            transition={{ duration:1.2, delay:0.15 }}
            muted
            playsInline
            onEnded={finish}
            onError={handleError}
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:2 }}
          >
            <source src={videoSrc} type="video/mp4" />
          </motion.video>

          {/* Brand watermark */}
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9, duration:0.6 }}
            style={{
              position:'absolute', top:'clamp(1rem,3.5vh,2rem)', left:'50%', transform:'translateX(-50%)',
              zIndex:20, fontFamily:"'Playfair Display',Georgia,serif",
              fontSize:'clamp(0.55rem,1vw,0.7rem)', fontWeight:700,
              letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)',
              whiteSpace:'nowrap',
            }}
          >
            MANIKYA SERVICES
          </motion.div>

          {/* Progress bar */}
          <ProgressBar videoRef={videoRef} />

          {/* Skip button */}
          <SkipBtn onSkip={finish} />

          {/* Tap-to-play */}
          <AnimatePresence>
            {needsClick && <TapToPlay onTap={handleTap} onSkip={finish} />}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
