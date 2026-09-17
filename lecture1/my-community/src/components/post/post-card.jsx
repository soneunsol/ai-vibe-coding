import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import HashtagList from '../ui/hashtag-list';
import { formatRelativeTime } from '../../utils/format-date';

/**
 * PostCard 컴포넌트
 * 게시물 목록에서 한 건을 요약해 보여주는 카드.
 *
 * Props:
 * @param {object} post - 게시물 정보(제목, 작성자, 작성시간, 좋아요수, 조회수, 댓글수) [Required]
 * @param {function} onClick - 카드 클릭 시 실행할 함수 [Required]
 *
 * Example usage:
 * <PostCard post={ post } onClick={ () => navigate(`/posts/${ post.id }`) } />
 */
function PostCard({ post, onClick }) {
  const metaItems = [
    { key: 'like', icon: <FavoriteRoundedIcon sx={ { fontSize: 16 } } />, value: post.likeCount },
    { key: 'view', icon: <VisibilityOutlinedIcon sx={ { fontSize: 16 } } />, value: post.viewCount },
    { key: 'comment', icon: <ChatBubbleOutlineRoundedIcon sx={ { fontSize: 16 } } />, value: post.commentCount },
  ];

  return (
    <Card
      elevation={ 0 }
      sx={ {
        border: '1px solid',
        borderColor: 'divider',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: 'primary.light',
          boxShadow: '0 12px 28px rgba(91, 75, 232, 0.12)',
        },
      } }
    >
      <CardActionArea onClick={ onClick } sx={ { p: { xs: 2, md: 2.5 } } }>
        <Box sx={ { display: 'flex', gap: { xs: 1.5, md: 2 } } }>
          { post.imageUrl && (
            <Box
              component="img"
              src={ post.imageUrl }
              alt=""
              loading="lazy"
              sx={ {
                width: { xs: 120, md: 150 },
                maxWidth: '100%',
                minHeight: { xs: 120, md: 150 },
                alignSelf: 'stretch',
                flexShrink: 0,
                objectFit: 'cover',
                /** 이미지를 받아오는 동안 흰 여백이 깜빡이지 않도록 자리를 채운다 */
                bgcolor: 'action.hover',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              } }
            />
          ) }

          <Box sx={ { flexGrow: 1, minWidth: 0 } }>
            <Typography
              component="h3"
              sx={ {
                fontSize: { xs: '1rem', md: '1.125rem' },
                fontWeight: 700,
                lineHeight: 1.4,
                color: 'text.primary',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              } }
            >
              { post.title }
            </Typography>

            <Box
              sx={ {
                mt: 0.75,
                fontSize: { xs: '0.8125rem', md: '0.875rem' },
                color: 'text.secondary',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                whiteSpace: 'pre-wrap',
              } }
            >
              { post.content }
            </Box>

            { post.tags.length > 0 && (
              <Box sx={ { mt: 1.25 } }>
                <HashtagList tags={ post.tags } />
              </Box>
            ) }

            <Box
              sx={ {
                mt: 1.5,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: { xs: 1, md: 1.5 },
                fontSize: '0.8125rem',
                color: 'text.secondary',
              } }
            >
              <Box component="span" sx={ { fontWeight: 700, color: 'primary.main' } }>
                { post.author?.nickname ?? '알 수 없음' }
              </Box>
              <Box component="span">{ formatRelativeTime(post.createdAt) }</Box>

              <Box sx={ { flexGrow: 1 } } />

              { metaItems.map((item) => (
                <Box key={ item.key } sx={ { display: 'flex', alignItems: 'center', gap: 0.5 } }>
                  { item.icon }
                  { item.value }
                </Box>
              )) }
            </Box>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}

export default PostCard;
