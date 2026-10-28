import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';

/** 하단바 좌우 메뉴 정의 (중앙 작성 버튼은 별도 렌더링) */
const NAV_ITEMS = [
  { path: '/', label: '홈', Icon: HomeOutlinedIcon, ActiveIcon: HomeRoundedIcon },
  { path: '/meetup', label: '모임', Icon: GroupsOutlinedIcon, ActiveIcon: GroupsOutlinedIcon },
  { path: '/chat', label: '채팅', Icon: ChatBubbleOutlineIcon, ActiveIcon: ChatBubbleOutlineIcon },
  { path: '/profile', label: '마이', Icon: PersonOutlineIcon, ActiveIcon: PersonOutlineIcon },
];

/**
 * BottomNav 컴포넌트 — 홈/모임/작성(중앙)/채팅/마이페이지 하단 내비게이션
 * body에 Portal로 렌더링하여 MUI Modal(z-index 1300) 위에 표시
 */
function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path) => (path === '/' ? pathname === '/' : pathname.startsWith(path));

  const renderItem = ({ path, label, Icon, ActiveIcon }) => {
    const active = isActive(path);
    const IconComponent = active ? ActiveIcon : Icon;

    return (
      <IconButton
        key={ path }
        aria-label={ label }
        onClick={ () => navigate(path) }
        disableRipple
        sx={ {
          flex: 1,
          flexDirection: 'column',
          gap: 0.25,
          borderRadius: 2,
          color: active ? 'primary.main' : 'text.secondary',
          py: 0.75,
        } }
      >
        <IconComponent sx={ { fontSize: 24 } } />
        <Typography component="span" sx={ { fontSize: '0.68rem', fontWeight: active ? 700 : 500 } }>
          { label }
        </Typography>
      </IconButton>
    );
  };

  return createPortal(
    <Paper
      elevation={ 0 }
      sx={ {
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        zIndex: 1400,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderRadius: 0,
        pb: 'env(safe-area-inset-bottom)',
      } }
    >
      <Box sx={ { display: 'flex', alignItems: 'center', px: 1, minHeight: 62 } }>
        { NAV_ITEMS.slice(0, 2).map(renderItem) }

        <Box sx={ { flex: 1, display: 'flex', justifyContent: 'center' } }>
          <Fab
            color="primary"
            aria-label="게시물 작성"
            onClick={ () => navigate('/create') }
            sx={ {
              width: 52,
              height: 52,
              mt: -3,
              boxShadow: '0 8px 20px rgba(255, 107, 53, 0.4)',
              background: 'linear-gradient(135deg, #FF8A3D 0%, #FF5722 100%)',
            } }
          >
            <AddIcon />
          </Fab>
        </Box>

        { NAV_ITEMS.slice(2).map(renderItem) }
      </Box>
    </Paper>,
    document.body,
  );
}

export default BottomNav;
