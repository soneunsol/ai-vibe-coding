import React, { useEffect, useRef, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import NavBar from './components/layout/NavBar.jsx';
import AuroraBackground from './components/common/AuroraBackground.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Projects from './pages/Projects.jsx';
import Contact from './pages/Contact.jsx';
import Guestbook from './pages/Guestbook.jsx';

const ScrollIndicator = () => {
  const thumbRef = useRef(null);
  const timerRef = useRef(null);

  const update = useCallback(() => {
    const el = thumbRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollHeight <= clientHeight) { el.style.opacity = '0'; return; }
    const ratio = clientHeight / scrollHeight;
    const thumbH = Math.max(ratio * clientHeight, 30);
    const trackSpace = clientHeight - thumbH;
    const top = (scrollTop / (scrollHeight - clientHeight)) * trackSpace;
    el.style.height = `${thumbH}px`;
    el.style.top = `${top}px`;
    el.style.opacity = '1';
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { if (el) el.style.opacity = '0'; }, 1000);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [update]);

  return (
    <div ref={thumbRef} style={{
      position: 'fixed', right: 2, width: 4, borderRadius: 2, zIndex: 9999,
      background: 'rgba(160,120,255,0.4)', opacity: 0, transition: 'opacity 0.3s',
      pointerEvents: 'none',
    }} />
  );
};

const App = () => (
  <Box sx={{ minHeight: '100vh', bgcolor: '#04040f', position: 'relative' }}>
    <ScrollIndicator />
    <AuroraBackground />
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/guestbook" element={<Guestbook />} />
      </Routes>
    </Box>
  </Box>
);

export default App;
