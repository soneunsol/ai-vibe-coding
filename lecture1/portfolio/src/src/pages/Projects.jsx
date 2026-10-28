import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  Button,
  Skeleton,
  Grid,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { supabase } from '../services/supabase';

const ProjectCard = ({ project }) => {
  const thumbnailUrl = project.thumbnail_url || `https://image.thum.io/get/${project.detail_url}`;
  const [imgError, setImgError] = useState(false);

  const formattedDate = new Date(project.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 12px 40px rgba(123,47,247,0.45)',
        },
      }}
    >
      {/* 썸네일 */}
      <Box sx={{
        width: '100%', height: 180, overflow: 'hidden', flexShrink: 0,
        position: 'relative', bgcolor: 'rgba(10,8,30,0.8)',
      }}>
        {imgError ? (
          <Box sx={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography variant="body2" sx={{ color: 'rgba(220,215,255,0.5)' }}>
              미리보기 준비 중
            </Typography>
          </Box>
        ) : (
          <img
            src={thumbnailUrl}
            alt={project.title}
            onError={() => setImgError(true)}
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              objectPosition: project.thumbnail_position || 'center top',
              display: 'block',
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flex: 1, p: 2.5 }}>
        {/* 프로젝트 이름 */}
        <Typography
          variant="h3"
          sx={{ color: '#fff', fontWeight: 600, mb: 1, fontSize: '1.05rem', lineHeight: 1.4 }}
        >
          {project.title}
        </Typography>

        {/* 한 줄 설명 */}
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(220,215,255,0.7)',
            mb: 2,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description}
        </Typography>

        {/* 기술 스택 아이콘형 칩 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
          {project.tech_stack?.map((tech) => (
            <Chip
              key={tech}
              label={tech}
              size="small"
              sx={{
                background: 'rgba(123,47,247,0.18)',
                border: '1px solid rgba(123,47,247,0.4)',
                color: '#c084fc',
                fontSize: '0.72rem',
                height: 22,
              }}
            />
          ))}
        </Box>

        {/* 작업 날짜 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CalendarTodayIcon sx={{ fontSize: 13, color: 'rgba(220,215,255,0.4)' }} />
          <Typography variant="caption" sx={{ color: 'rgba(220,215,255,0.45)' }}>
            {formattedDate}
          </Typography>
        </Box>
      </CardContent>

      {/* View Details 버튼 */}
      <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
        <Button
          variant="outlined"
          size="small"
          endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
          href={project.detail_url}
          target="_blank"
          rel="noopener noreferrer"
          fullWidth
          sx={{
            borderColor: 'rgba(0,200,255,0.4)',
            color: '#00c8ff',
            fontSize: '0.8rem',
            '&:hover': {
              borderColor: '#00c8ff',
              background: 'rgba(0,200,255,0.08)',
            },
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

const ProjectSkeleton = () => (
  <Card sx={{ height: '100%' }}>
    <Skeleton variant="rectangular" sx={{ aspectRatio: '16/9', width: '100%' }} />
    <CardContent sx={{ p: 2.5 }}>
      <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 0.75 }}>
        <Skeleton variant="rounded" width={60} height={22} />
        <Skeleton variant="rounded" width={70} height={22} />
        <Skeleton variant="rounded" width={50} height={22} />
      </Box>
    </CardContent>
  </Card>
);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('projects')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true });

        if (supabaseError) throw supabaseError;
        const fixed = (data || []).map(p => ({
          ...p,
          detail_url: p.detail_url?.replace('/AI_Vibe_Coding/', '/ai-vibe-coding/'),
          thumbnail_url: p.thumbnail_url?.replace('/AI_Vibe_Coding/', '/ai-vibe-coding/'),
        }));
        setProjects(fixed);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        px: 2,
        py: 6,
      }}
    >
      <Box sx={{ maxWidth: 1200, width: '100%' }}>

        {/* 헤더 */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="caption"
            sx={{ letterSpacing: 4, color: '#00c8ff', display: 'block', mb: 1, textTransform: 'uppercase' }}
          >
            What I've Built
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
            Projects
          </Typography>
          <Box
            sx={{
              width: 56,
              height: 2,
              background: 'linear-gradient(90deg, #7b2ff7, #00c8ff)',
              borderRadius: 1,
              mx: 'auto',
              mb: 2,
            }}
          />
          <Typography variant="body1" sx={{ color: 'rgba(220,215,255,0.7)' }}>
            AI 바이브코딩으로 완성한 프로젝트들을 소개합니다.
          </Typography>
        </Box>

        {/* 에러 */}
        {error && (
          <Typography sx={{ color: 'error.main', textAlign: 'center', mb: 3 }}>
            프로젝트를 불러오는 중 오류가 발생했습니다: {error}
          </Typography>
        )}

        {/* 카드 그리드: 데스크탑 4열 / 태블릿 2열 / 모바일 1열 */}
        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                  <ProjectSkeleton />
                </Grid>
              ))
            : projects.map((project) => (
                <Grid key={project.id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <ProjectCard project={project} />
                </Grid>
              ))}
        </Grid>

      </Box>
    </Box>
  );
};

export default Projects;
