import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import BottomNav from './bottom-nav';

/**
 * AppFrame 컴포넌트 — 모바일 퍼스트 화면 셸 (데스크톱에서는 중앙 정렬된 폰 프레임)
 *
 * Props:
 * @param {node} header - 상단바 요소 [Optional, 기본값: null]
 * @param {node} children - 페이지 본문 [Required]
 * @param {boolean} isBottomNavVisible - 하단바 표시 여부 [Optional, 기본값: true]
 * @param {node} footer - 하단바 대신 표시할 요소 [Optional, 기본값: null]
 * @param {boolean} isFullHeight - 화면 높이에 딱 맞춰 스크롤 없이 표시할지 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <AppFrame header={ <TopBar /> }>{ content }</AppFrame>
 */
function AppFrame({
  header = null,
  children,
  isBottomNavVisible = true,
  footer = null,
  isFullHeight = false,
}) {
  return (
    <Box
      sx={ {
        width: '100%',
        minHeight: '100vh',
        height: isFullHeight ? '100vh' : 'auto',
        display: 'flex',
        justifyContent: 'center',
        bgcolor: '#F5EFE9',
        overflow: isFullHeight ? 'hidden' : 'visible',
      } }
    >
      <Paper
        elevation={ 0 }
        sx={ {
          width: '100%',
          maxWidth: 480,
          minHeight: '100vh',
          height: isFullHeight ? '100vh' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          borderLeft: { xs: 'none', sm: '1px solid' },
          borderRight: { xs: 'none', sm: '1px solid' },
          borderColor: { sm: 'divider' },
          borderRadius: 0,
          position: 'relative',
          overflow: isFullHeight ? 'hidden' : 'visible',
        } }
      >
        { header }

        <Box
          component="main"
          sx={ {
            flexGrow: 1,
            minHeight: isFullHeight ? 0 : 'auto',
            display: 'flex',
            flexDirection: 'column',
            pb: isBottomNavVisible ? '62px' : 0,
          } }
        >
          { children }
        </Box>

        { footer }
        { isBottomNavVisible && <BottomNav /> }
      </Paper>
    </Box>
  );
}

export default AppFrame;
