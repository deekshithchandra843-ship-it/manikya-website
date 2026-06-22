import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';

/* Elements that get the cursor-following light. */
const SPOTLIGHT_SELECTOR = '.mk-btn, .mk-card, .mk-card-glass, [data-spotlight]';

export default function App() {
  /* Global interactive light: writes the cursor's position (relative to the
     hovered button/card) into CSS vars so a radial highlight can follow it. */
  useEffect(() => {
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(SPOTLIGHT_SELECTOR);
      if (!el) return;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mk-mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--mk-my', `${e.clientY - r.top}px`);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <RouterProvider router={router} />;
}