import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import BrandLogo from './brand-logo';

/** 상단바 오른쪽 아이콘 버튼 공통 스타일 */
const ICON_BUTTON_SX = {
  width: 40,
  height: 40,
  color: 'text.primary',
  borderRadius: '50%',
  '&:hover': { bgcolor: 'secondary.light', color: 'primary.main' },
};

/**
 * TopBar 컴포넌트 — 왼쪽 로고, 오른쪽 알림 아이콘
 *
 * Props:
 * @param {number} notificationCount - 알림 배지 숫자 [Optional, 기본값: 0]
 *
 * Example usage:
 * <TopBar notificationCount={ 3 } />
 */
function TopBar({ notificationCount = 0 }) {
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      elevation={ 0 }
      sx={ {
        top: 0,
        bgcolor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      } }
    >
      <Toolbar sx={ { minHeight: 56, px: { xs: 2, md: 3 }, justifyContent: 'space-between' } }>
        <ButtonBase
          aria-label="홈으로 이동"
          onClick={ () => navigate('/') }
          disableRipple
          disableTouchRipple
          sx={ {
            borderRadius: 2,
            px: 0.5,
            py: 0.25,
            bgcolor: 'transparent',
            '&:hover': { bgcolor: 'transparent' },
            '&:active': { bgcolor: 'transparent' },
            '&:focus-visible': { bgcolor: 'transparent' },
          } }
        >
          <BrandLogo size={ 32 } />
        </ButtonBase>

        <Box sx={ { display: 'flex', alignItems: 'center', gap: 0.5 } }>
          <Tooltip title="알림">
            <IconButton aria-label="알림" onClick={ () => navigate('/notifications') } sx={ ICON_BUTTON_SX }>
              <Badge
                badgeContent={ notificationCount }
                color="primary"
                sx={ { '& .MuiBadge-badge': { fontSize: '0.62rem', minWidth: 16, height: 16 } } }
              >
                <NotificationsNoneIcon sx={ { fontSize: 24 } } />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
