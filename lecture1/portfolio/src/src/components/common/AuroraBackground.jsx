import React, { useEffect, useRef } from 'react';

const AuroraBackground = () => {
  const starsRef = useRef(null);

  useEffect(() => {
    const container = starsRef.current;
    if (!container) return;

    for (let i = 0; i < 180; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      const size = Math.random() * 2.2 + 0.4;
      s.style.cssText = `
        width:${size}px; height:${size}px;
        top:${Math.random() * 100}%;
        left:${Math.random() * 100}%;
        --d:${(Math.random() * 4 + 2).toFixed(1)}s;
        --o:${(Math.random() * 0.6 + 0.3).toFixed(2)};
        --delay:${(Math.random() * 6).toFixed(1)}s;
      `;
      container.appendChild(s);
    }

    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  return (
    <>
      <div className="stars" ref={starsRef} />
      <div className="aurora">
        <div className="aurora-band" />
        <div className="aurora-band" />
        <div className="aurora-band" />
      </div>
    </>
  );
};

export default AuroraBackground;
