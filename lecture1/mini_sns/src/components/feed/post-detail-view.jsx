import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { formatRelativeTime } from '../../utils/format-date';
import { getFallbackImageUrl } from '../../utils/random-image';

/**
 * PostDetailView 컴포넌트 — 댓글 목록을 제외한 게시물 내용을 한 화면 가득 표시
 *
 * Props:
 * @param {object} post - 게시물 데이터 [Required]
 * @param {boolean} isLiked - 내가 좋아요를 눌렀는지 여부 [Optional, 기본값: false]
 * @param {function} onToggleLike - 좋아요 버튼 클릭 시 실행 (postId 전달) [Optional]
 * @param {function} onOpenComments - 댓글 아이콘 클릭 시 실행 (post 전달) [Optional]
 *
 * Example usage:
 * <PostDetailView post={ post } isLiked onToggleLike={ handleLike } onOpenComments={ handleOpen } />
 */
function PostDetailView({ post, isLiked = false, onToggleLike, onOpenComments }) {
  const [hasImageError, setHasImageError] = useState(false);

  const commentCount = (post.comments ?? []).length;
  const hashtagList = (post.hashtags ?? '')
    .split(/[\s,]+/)
    .filter((tag) => tag.startsWith('#') && tag.length > 1);

  return (
    <Box
      sx={ {
        flexGrow: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        overflowY: 'auto',
        overflowX: 'hidden',
      } }
    >
      { /* 상단: 프로필 이미지 · 닉네임 · 위치 정보 */ }
      <Box
        sx={ {
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        } }
      >
        <Avatar
          src={ post.author?.profile_image_url }
          alt={ post.author?.nickname }
          sx={ { width: 40, height: 40, bgcolor: 'secondary.light' } }
        />

        <Box sx={ { minWidth: 0, flexGrow: 1 } }>
          <Typography
            sx={ { fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.3, color: 'text.primary' } }
          >
            { post.author?.nickname ?? '알 수 없음' }
          </Typography>

          { post.location && (
            <Box sx={ { display: 'flex', alignItems: 'center', gap: 0.25, color: 'text.secondary' } }>
              <PlaceOutlinedIcon sx={ { fontSize: 13 } } />
              <Box component="span" sx={ { fontSize: '0.75rem' } }>{ post.location }</Box>
            </Box>
          ) }
        </Box>

        <Box sx={ { fontSize: '0.72rem', color: 'text.secondary', flexShrink: 0 } }>
          { formatRelativeTime(post.created_at) }
        </Box>
      </Box>

      { /* 중단: 이미지 (최대 40vh) */ }
      <Box sx={ { flexShrink: 0, maxHeight: '40vh', bgcolor: '#1B1310' } }>
        <Box
          component="img"
          src={ hasImageError ? getFallbackImageUrl(post.id) : post.image_url }
          alt={ post.caption }
          onError={ () => setHasImageError(true) }
          sx={ { width: '100%', height: '100%', maxHeight: '40vh', objectFit: 'cover', display: 'block' } }
        />
      </Box>

      { /* 하단: 게시물 내용 · 해시태그 */ }
      <Box
        sx={ {
          flexGrow: 1,
          overflowY: 'auto',
          px: 2,
          pt: 2,
          pb: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        } }
      >
        <Typography
          sx={ {
            fontSize: { xs: '0.9rem', md: '0.95rem' },
            lineHeight: 1.55,
            color: 'text.primary',
            whiteSpace: 'pre-wrap',
          } }
        >
          { post.caption }
        </Typography>

        { hashtagList.length > 0 && (
          <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.5 } }>
            { hashtagList.map((tag) => (
              <Chip
                key={ tag }
                label={ tag }
                size="small"
                sx={ {
                  bgcolor: 'secondary.light',
                  color: 'primary.dark',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  height: 24,
                  borderRadius: 0,
                } }
              />
            )) }
          </Box>
        ) }
      </Box>

      { /* 하단: 반응 박스 (좋아요 · 댓글 수) */ }
      <Box
        sx={ {
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 0.75,
          bgcolor: 'secondary.light',
          borderTop: '1px solid',
          borderColor: 'divider',
        } }
      >
        <IconButton
          aria-label="좋아요"
          onClick={ () => onToggleLike?.(post.id) }
          sx={ { color: isLiked ? 'primary.main' : 'text.secondary' } }
        >
          { isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" /> }
        </IconButton>
        <Box component="span" sx={ { fontSize: '0.82rem', fontWeight: 700, color: 'text.primary' } }>
          { post.likes_count }
        </Box>

        <IconButton
          aria-label="댓글 보기"
          onClick={ () => onOpenComments?.(post) }
          sx={ { color: 'text.secondary', ml: 1 } }
        >
          <ChatBubbleOutlineIcon fontSize="small" />
        </IconButton>
        <Box component="span" sx={ { fontSize: '0.82rem', fontWeight: 700, color: 'text.primary' } }>
          { commentCount }
        </Box>
      </Box>
    </Box>
  );
}

export default PostDetailView;
