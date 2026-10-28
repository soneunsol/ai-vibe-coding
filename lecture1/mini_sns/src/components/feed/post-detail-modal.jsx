import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import PostDetailView from './post-detail-view';

/**
 * PostDetailModal 컴포넌트 — 게시물 상세를 전체화면 모달로 표시
 *
 * Props:
 * @param {boolean} isOpen - 모달 표시 여부 [Required]
 * @param {object} post - 게시물 데이터 [Optional, 기본값: null]
 * @param {boolean} isLiked - 내가 좋아요를 눌렀는지 여부 [Optional, 기본값: false]
 * @param {function} onClose - 닫기(X) 또는 배경 클릭 시 실행 [Required]
 * @param {function} onToggleLike - 좋아요 버튼 클릭 시 실행 (postId 전달) [Optional]
 * @param {function} onOpenComments - 댓글 아이콘 클릭 시 실행 (post 전달) [Optional]
 *
 * Example usage:
 * <PostDetailModal isOpen={ Boolean(post) } post={ post } onClose={ handleClose } />
 */
function PostDetailModal({
  isOpen,
  post = null,
  isLiked = false,
  onClose,
  onToggleLike,
  onOpenComments,
}) {
  return (
    <Modal
      open={ isOpen }
      onClose={ onClose }
      slotProps={ {
        backdrop: {
          sx: {
            bgcolor: 'rgba(20, 12, 6, 0.55)',
            backdropFilter: 'blur(6px)',
          },
        },
      } }
    >
      <Box
        sx={ {
          position: 'absolute',
          inset: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 480,
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          outline: 'none',
        } }
      >
        { /* 모달 헤더 — 제목과 닫기(X) 버튼 */ }
        <Box
          sx={ {
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.25,
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          } }
        >
          <Typography sx={ { fontWeight: 700, fontSize: '0.95rem' } }>게시물</Typography>
          <IconButton
            aria-label="닫기"
            onClick={ onClose }
            sx={ {
              color: 'text.primary',
              '&:hover': { bgcolor: 'secondary.light', color: 'primary.main' },
            } }
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        { /* 본문 — 남은 공간을 꽉 채우는 게시물 카드 UI */ }
        { post && (
          <PostDetailView
            post={ post }
            isLiked={ isLiked }
            onToggleLike={ onToggleLike }
            onOpenComments={ onOpenComments }
          />
        ) }
      </Box>
    </Modal>
  );
}

export default PostDetailModal;
