import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EmailIcon from '@mui/icons-material/Email';

const SKILLS = ['React', 'JavaScript', 'MUI', 'HTML/CSS', 'Git', 'Vite', 'Node.js', 'AI코딩'];

/* index.html 의 SVG 오브 */
const HeroOrb = () => (
  <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <defs>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#c084fc" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#7b2ff7" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="orb" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00c8ff" />
        <stop offset="50%" stopColor="#7b2ff7" />
        <stop offset="100%" stopColor="#ff3cac" />
      </linearGradient>
      <linearGradient id="ring1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00c8ff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#7b2ff7" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="ring2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ff3cac" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#00c8ff" stopOpacity="0.2" />
      </linearGradient>
      <filter id="blur-glow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <circle cx="55" cy="55" r="52" fill="url(#glow)" />
    <ellipse cx="55" cy="55" rx="48" ry="18" stroke="url(#ring1)" strokeWidth="1.2" strokeDasharray="4 3" fill="none" transform="rotate(-25 55 55)" />
    <ellipse cx="55" cy="55" rx="48" ry="18" stroke="url(#ring2)" strokeWidth="1" strokeDasharray="3 4" fill="none" transform="rotate(55 55 55)" />
    <ellipse cx="55" cy="55" rx="44" ry="14" stroke="rgba(0,200,255,0.3)" strokeWidth="0.8" fill="none" transform="rotate(10 55 55)" />
    <line x1="55" y1="55" x2="22" y2="28" stroke="rgba(192,132,252,0.4)" strokeWidth="0.8" />
    <line x1="55" y1="55" x2="88" y2="28" stroke="rgba(0,200,255,0.4)" strokeWidth="0.8" />
    <line x1="55" y1="55" x2="88" y2="82" stroke="rgba(255,60,172,0.4)" strokeWidth="0.8" />
    <line x1="55" y1="55" x2="22" y2="82" stroke="rgba(192,132,252,0.4)" strokeWidth="0.8" />
    <line x1="55" y1="55" x2="55" y2="10" stroke="rgba(0,200,255,0.35)" strokeWidth="0.8" />
    <line x1="55" y1="55" x2="55" y2="100" stroke="rgba(123,47,247,0.35)" strokeWidth="0.8" />
    <line x1="22" y1="28" x2="88" y2="28" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
    <line x1="22" y1="82" x2="88" y2="82" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
    <circle cx="22" cy="28" r="3.5" fill="#00c8ff" fillOpacity="0.8" filter="url(#blur-glow)" />
    <circle cx="88" cy="28" r="3.5" fill="#c084fc" fillOpacity="0.8" filter="url(#blur-glow)" />
    <circle cx="88" cy="82" r="3.5" fill="#ff3cac" fillOpacity="0.8" filter="url(#blur-glow)" />
    <circle cx="22" cy="82" r="3.5" fill="#00c8ff" fillOpacity="0.8" filter="url(#blur-glow)" />
    <circle cx="55" cy="10" r="2.5" fill="#c084fc" fillOpacity="0.7" />
    <circle cx="55" cy="100" r="2.5" fill="#7b2ff7" fillOpacity="0.7" />
    <circle cx="55" cy="55" r="16" fill="url(#orb)" fillOpacity="0.95" filter="url(#blur-glow)" />
    <circle cx="55" cy="55" r="16" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none" />
    <circle cx="50" cy="50" r="5" fill="rgba(255,255,255,0.25)" />
  </svg>
);

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 6,
      }}
    >
      <Box sx={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>

        {/* 플로팅 오브 */}
        <Box
          sx={{
            width: 120,
            height: 120,
            mx: 'auto',
            mb: 5,
            animation: 'float 5s ease-in-out infinite',
          }}
        >
          <HeroOrb />
        </Box>

        {/* 서브 태그 */}
        <Typography
          variant="caption"
          sx={{
            letterSpacing: 4,
            display: 'block',
            mb: 2,
            color: '#00c8ff',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
          }}
        >
          Welcome to My Portfolio
        </Typography>

        {/* 메인 타이틀 */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2rem', md: '2.8rem' },
            fontWeight: 800,
            color: '#ffffff',
            mb: 1,
            letterSpacing: '-0.5px',
            textShadow: '0 0 24px rgba(123,47,247,0.7), 0 0 48px rgba(0,200,255,0.3)',
          }}
        >
          AI바이브코딩웹
        </Typography>

        {/* 구분선 */}
        <Box
          sx={{
            width: 56,
            height: 2,
            background: 'linear-gradient(90deg, #7b2ff7, #00c8ff)',
            borderRadius: 1,
            mx: 'auto',
            mb: 3,
          }}
        />

        {/* 설명 */}
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(220, 215, 255, 0.88)',
            lineHeight: 1.9,
            mb: 5,
            fontSize: '1.05rem',
          }}
        >
          AI바이브코딩웹에서 프롬프트만으로도
          <br />
          퀄리티 높은 웹을 만들 수 있습니다!
          <br />
          <Box component="span" sx={{ color: 'rgba(220, 215, 255, 0.6)', fontSize: '0.95rem' }}>
            React · MUI · Vite 기반의 풀스택 포트폴리오
          </Box>
        </Typography>

        {/* 스킬 태그 */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.25,
            justifyContent: 'center',
            mb: 5,
          }}
        >
          {SKILLS.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              sx={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.14)',
                color: 'rgba(210, 200, 240, 0.9)',
                fontWeight: 500,
                letterSpacing: 0.3,
                '&:hover': {
                  background: 'rgba(255,255,255,0.11)',
                  borderColor: 'rgba(255,255,255,0.25)',
                },
              }}
            />
          ))}
        </Box>

        {/* CTA 버튼 */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/projects')}
            sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
          >
            Projects 보기
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ChatBubbleOutlineIcon />}
            onClick={() => navigate('/guestbook')}
            sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
          >
            Guestbook
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<EmailIcon />}
            onClick={() => navigate('/contact')}
            sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
          >
            Contact
          </Button>
        </Box>

      </Box>
    </Box>
  );
};

export default Home;
