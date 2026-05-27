/**
 * IntroVideo.jsx — with autoplay-blocked fallback (click to play)
 */
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function SkipHint({ onSkip }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="skip"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={onSkip}
          style={{
            position: 'absolute',
            bottom: 'clamp(1.5rem, 4vh, 2.5rem)',
            right: 'clamp(1.5rem, 4vw, 3rem)',
            zIndex: 30,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.22)',
            borderRadius: 50,
            padding: '7px 20px',
            color: 'rgba(255,255,255,0.6)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          Skip Intro ›
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function ProgressBar({ videoRef }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const update = () => {
      if (video.duration) setProgress(video.currentTime / video.duration);
    };
    video.addEventListener('timeupdate', update);
    return () => video.removeEventListener('timeupdate', update);
  }, [videoRef]);
  return (
    <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:'rgba(255,255,255,0.08)', zIndex:20 }}>
      <div style={{ height:'100%', background:'linear-gradient(90deg,#ef4444,#f59e0b)', width:`${progress * 100}%`, boxShadow:'0 0 8px rgba(245,158,11,0.8)', transition:'width 0.25s linear' }} />
    </div>
  );
}

export default function IntroVideo({ videoSrc = '/intro.mp4', onComplete }) {
  const videoRef = useRef(null);
  const [phase, setPhase] = useState('playing'); // 'playing' | 'fading' | 'done'
  const [needsClick, setNeedsClick] = useState(false);

  const finish = useCallback(() => {
    if (phase !== 'playing') return;
    setPhase('fading');
    setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, 900);
  }, [phase, onComplete]);

  const handleEnded = useCallback(() => finish(), [finish]);

  const handleError = useCallback(() => {
    console.warn('[IntroVideo] Video error – skipping.');
    onComplete?.();
  }, [onComplete]);

  /* Try autoplay; if blocked show a "Tap to play" screen */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      setNeedsClick(true);
    });
  }, []);

  const handleUserClick = () => {
    setNeedsClick(false);
    videoRef.current?.play().catch(() => onComplete?.());
  };

  if (phase === 'done') return null;

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="intro-video-wrapper"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'fading' ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ position:'fixed', inset:0, zIndex:9999, background:'#000', overflow:'hidden' }}
        >
          {/* Vignette */}
          <div style={{ position:'absolute', inset:0, zIndex:5, background:'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)', pointerEvents:'none' }} />

          {/* Top letterbox */}
          <motion.div initial={{ scaleY:0 }} animate={{ scaleY:1 }} transition={{ duration:0.6 }}
            style={{ position:'absolute', top:0, left:0, right:0, height:'clamp(20px,3.5vh,36px)', background:'#000', zIndex:10, transformOrigin:'top' }} />

          {/* Bottom letterbox */}
          <motion.div initial={{ scaleY:0 }} animate={{ scaleY:1 }} transition={{ duration:0.6 }}
            style={{ position:'absolute', bottom:0, left:0, right:0, height:'clamp(20px,3.5vh,36px)', background:'#000', zIndex:10, transformOrigin:'bottom' }} />

          {/* Video */}
          <motion.video
            ref={videoRef}
            initial={{ opacity:0, filter:'blur(12px) brightness(0.3)' }}
            animate={{ opacity:1, filter:'blur(0px) brightness(1)' }}
            transition={{ duration:1.2, delay:0.2 }}
            muted
            playsInline
            onEnded={handleEnded}
            onError={handleError}
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:1 }}
          >
            <source src={videoSrc} type="video/mp4" />
          </motion.video>

          {/* Brand watermark */}
          <motion.div
            initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.8, duration:0.7 }}
            style={{ position:'absolute', top:'clamp(1.5rem,4vh,2.5rem)', left:'50%', transform:'translateX(-50%)', zIndex:20,
              fontFamily:"'Playfair Display', Georgia, serif", fontSize:'clamp(0.62rem,1.2vw,0.75rem)', fontWeight:700,
              letterSpacing:'0.32em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)' }}
          >
            MANIKYA SERVICES
          </motion.div>

          {/* Progress bar */}
          <ProgressBar videoRef={videoRef} />

          {/* Skip button */}
          <SkipHint onSkip={finish} />

          {/* ── TAP TO PLAY overlay (shown when autoplay is blocked) ── */}
          <AnimatePresence>
            {needsClick && (
              <motion.div
                key="tap-to-play"
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                exit={{ opacity:0 }}
                onClick={handleUserClick}
                style={{
                  position:'absolute', inset:0, zIndex:25,
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  cursor:'pointer', gap:16,
                }}
              >
                {/* Play icon circle */}
                <motion.div
                  animate={{ scale:[1, 1.08, 1] }}
                  transition={{ repeat:Infinity, duration:2, ease:'easeInOut' }}
                  style={{
                    width:80, height:80, borderRadius:'50%',
                    background:'rgba(255,255,255,0.1)',
                    border:'2px solid rgba(255,255,255,0.4)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </motion.div>
                <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:'0.82rem', color:'rgba(255,255,255,0.5)', letterSpacing:'0.15em', textTransform:'uppercase', margin:0 }}>
                  Tap to play intro
                </p>
                {/* Skip option */}
                <button
                  onClick={e => { e.stopPropagation(); finish(); }}
                  style={{ marginTop:8, background:'none', border:'none', color:'rgba(255,255,255,0.3)', fontFamily:"'DM Sans', sans-serif", fontSize:'0.7rem', letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer' }}
                >
                  Skip →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
