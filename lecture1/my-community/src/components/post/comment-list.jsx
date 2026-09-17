import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

import { formatRelativeTime } from '../../utils/format-date';

/**
 * CommentList 컴포넌트
 * 댓글 작성자 / 작성 시간 / 내용을 나열한다.
 *
 * Props:
 * @param {array} comments - 표시할 댓글 목록 [Required]
 * @param {string} currentUserId - 현재 로그인 사용자 id (uuid) (본인 댓글 삭제 버튼 노출용) [Optional, 기본값: null]
 * @param {function} onDelete - 댓글 삭제 시 실행할 함수(commentId 전달) [Optional]
 *
 * Example usage:
 * <CommentList comments={ comments } currentUserId={ user.id } onDelete={ handleDelete } />
 */
function CommentList({ comments, currentUserId = null, onDelete }) {
  if (!comments || comments.length === 0) {
    return (
      <Typography
        component="p"
        sx={ { py: 4, textAlign: 'center', fontSize: '0.875rem', color: 'text.secondary' } }
      >
        아직 댓글이 없어요. 첫 댓글의 주인공이 되어보세요!
      </Typography>
    );
  }

  return (
    <Box>
      { comments.map((comment, index) => (
        <Box key={ comment.id }>
          { index > 0 && <Divider /> }

          <Box sx={ { display: 'flex', gap: { xs: 1.25, md: 1.75 }, py: 2 } }>
            <Avatar
              sx={ {
                width: 36,
                height: 36,
                fontSize: '0.875rem',
                fontWeight: 700,
                bgcolor: 'primary.light',
              } }
            >
              { comment.author?.nickname?.slice(0, 1) ?? 'U' }
            </Avatar>

            <Box sx={ { flexGrow: 1, minWidth: 0 } }>
              <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
                <Box component="span" sx={ { fontSize: '0.875rem', fontWeight: 700 } }>
                  { comment.author?.nickname ?? '알 수 없음' }
                </Box>
                <Box component="span" sx={ { fontSize: '0.75rem', color: 'text.secondary' } }>
                  { formatRelativeTime(comment.created_at) }
                </Box>

                <Box sx={ { flexGrow: 1 } } />

                { onDelete && comment.author?.id === currentUserId && (
                  <IconButton
                    size="small"
                    aria-label="댓글 삭제"
                    onClick={ () => onDelete(comment.id) }
                    sx={ { color: 'text.secondary' } }
                  >
                    <DeleteOutlineRoundedIcon sx={ { fontSize: 18 } } />
                  </IconButton>
                ) }
              </Box>

              <Box
                sx={ {
                  mt: 0.5,
                  fontSize: { xs: '0.875rem', md: '0.9375rem' },
                  lineHeight: 1.6,
                  color: 'text.primary',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                } }
              >
                { comment.content }
              </Box>
            </Box>
          </Box>
        </Box>
      )) }
    </Box>
  );
}

export default CommentList;
