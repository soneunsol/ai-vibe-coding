import React from 'react';
import { Box, Typography, Divider, Card, CardContent } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';

const SECTIONS = [
  {
    icon: <PersonIcon sx={{ color: '#c084fc', fontSize: 28 }} />,
    title: '자기소개',
    gradient: 'rgba(123, 47, 247, 0.15)',
    content:
      'AI 바이브코딩 방식으로 웹을 개발하는 개발자입니다. 프롬프트 엔지니어링과 최신 프론트엔드 기술을 결합해 퀄리티 높은 웹 서비스를 빠르게 구현합니다. 사용자 중심의 인터페이스 설계와 아름다운 UI/UX를 추구합니다.',
  },
  {
    icon: <CodeIcon sx={{ color: '#00c8ff', fontSize: 28 }} />,
    title: '기술 스택',
    gradient: 'rgba(0, 200, 255, 0.12)',
    content:
      'React, Vite, MUI(Material UI) 를 주력 스택으로 사용합니다. JavaScript(ES6+), HTML5/CSS3, Git 버전 관리에 능숙하며, AI 도구(Claude, ChatGPT)를 활용한 바이브코딩 워크플로우를 실천합니다.',
  },
  {
    icon: <SchoolIcon sx={{ color: '#00ff87', fontSize: 28 }} />,
    title: '학력 / 교육',
    gradient: 'rgba(0, 255, 135, 0.10)',
    content:
      '프론트엔드 개발 교육 과정 수료. React, JavaScript, MUI를 활용한 웹 개발 실습 위주의 커리큘럼을 통해 실전 개발 역량을 키웠습니다. AI 바이브코딩 방법론을 습득하여 생산성 높은 개발 방식을 익혔습니다.',
  },
  {
    icon: <WorkIcon sx={{ color: '#ff3cac', fontSize: 28 }} />,
    title: '프로젝트 경험',
    gradient: 'rgba(255, 60, 172, 0.12)',
    content:
      'GitHub Pages 배포 자동화 포트폴리오 사이트 구축, React + MUI 기반 반응형 웹 앱 개발, GitHub Actions CI/CD 파이프라인 설정. 각 프로젝트에서 오로라 UI 디자인과 글래스모피즘 스타일을 직접 구현했습니다.',
  },
];

const About = () => (
  <Box
    sx={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      justifyContent: 'center',
      px: 2,
      py: 6,
    }}
  >
    <Box sx={{ maxWidth: 720, width: '100%' }}>

      {/* 헤더 */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="caption"
          sx={{ letterSpacing: 4, color: '#00c8ff', display: 'block', mb: 1, textTransform: 'uppercase' }}
        >
          Who Am I
        </Typography>
        <Typography
          variant="h1"
          sx={{
            color: '#fff',
            fontWeight: 700,
            fontSize: { xs: '1.75rem', md: '2.125rem' },
            textShadow: '0 0 20px rgba(123,47,247,0.5)',
            mb: 2,
          }}
        >
          About Me
        </Typography>
        <Box
          sx={{
            width: 56,
            height: 2,
            background: 'linear-gradient(90deg, #7b2ff7, #00c8ff)',
            borderRadius: 1,
            mx: 'auto',
          }}
        />
      </Box>

      {/* 섹션 카드들 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {SECTIONS.map(({ icon, title, content, gradient }) => (
          <Card key={title}>
            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 2,
                  p: 1.5,
                  borderRadius: 2,
                  background: gradient,
                  width: 'fit-content',
                }}
              >
                {icon}
                <Typography variant="h3" sx={{ color: '#fff', fontWeight: 600 }}>
                  {title}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ color: 'rgba(220,215,255,0.85)', lineHeight: 1.9 }}>
                {content}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  </Box>
);

export default About;
