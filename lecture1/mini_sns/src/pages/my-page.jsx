import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import AppFrame from '../components/common/app-frame';
import TopBar from '../components/common/top-bar';
import CommentModal from '../components/feed/comment-modal';
import PostDetailModal from '../components/feed/post-detail-modal';
import EmptyState from '../components/ui/empty-state';
import SquareImage from '../components/ui/square-image';
import { fetchUserPosts } from '../lib/sns-api';
import { usePostList } from '../hooks/use-post-list';
import { useAuth } from '../hooks/use-auth';
import { NOTIFICATIONS } from '../data/mock-data';

/** 팔로우/팔로워 수는 DB 스키마에 없으므로 고정 목업 값으로 표시 */
function getFollowCounts() {
  return { followers: 328, following: 156 };
}

/**
 * MyPage — 프로필 정보와 내가 올린 게시물 3열 그리드
 *
 * Example usage:
 * <Route path="/profile" element={ <MyPage /> } />
 */
function MyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const loadMyPosts = useCallback(() => fetchUserPosts(user.id), [user.id]);
  const { posts, isLoading, errorMessage, likedIds, toggleLike, addComment, removeComment } =
    usePostList(loadMyPosts);

  const [detailPostId, setDetailPostId] = useState(null);
  const [commentPostId, setCommentPostId] = useState(null);

  const detailPost = posts.find((post) => post.id === detailPostId) ?? null;
  const commentPost = posts.find((post) => post.id === commentPostId) ?? null;
  const followCounts = getFollowCounts(user?.id);

  /** 로그아웃 후 로그인 화면으로 이동 */
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <AppFrame header={ <TopBar notificationCount={ NOTIFICATIONS.length } /> }>
      { /* 프로필 영역 */ }
      <Box sx={ { px: { xs: 2, md: 3 }, py: { xs: 3, md: 4 } } }>
        <Box sx={ { display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3 } } }>
          <Avatar
            src={ user?.profile_image_url }
            alt={ user?.nickname }
            sx={ {
              width: { xs: 76, md: 88 },
              height: { xs: 76, md: 88 },
              bgcolor: 'secondary.light',
              border: '3px solid',
              borderColor: 'secondary.main',
            } }
          />

          <Box sx={ { flexGrow: 1 } }>
            <Typography sx={ { fontSize: { xs: '1.1rem', md: '1.25rem' }, fontWeight: 800 } }>
              { user?.nickname }
            </Typography>
            <Typography sx={ { fontSize: '0.8rem', color: 'text.secondary', mb: 1.5 } }>
              @{ user?.username }
            </Typography>

            <Box sx={ { display: 'flex', gap: 2.5 } }>
              { [
                { label: '게시물', value: posts.length },
                { label: '팔로워', value: followCounts.followers },
                { label: '팔로우', value: followCounts.following },
              ].map((item) => (
                <Box key={ item.label } sx={ { textAlign: 'center' } }>
                  <Box sx={ { fontSize: '0.95rem', fontWeight: 800, color: 'text.primary' } }>
                    { item.value }
                  </Box>
                  <Box sx={ { fontSize: '0.72rem', color: 'text.secondary' } }>{ item.label }</Box>
                </Box>
              )) }
            </Box>
          </Box>
        </Box>

        <Button
          variant="outlined"
          color="primary"
          fullWidth
          startIcon={ <LogoutIcon /> }
          onClick={ handleLogout }
          sx={ {
            mt: { xs: 2.5, md: 3 },
            py: 1,
            borderRadius: 2,
            fontWeight: 700,
            textTransform: 'none',
            fontSize: { xs: '0.9rem', md: '0.95rem' },
          } }
        >
          로그아웃
        </Button>
      </Box>

      { /* 내 게시물 3열 그리드 */ }
      <Box sx={ { px: { xs: 0.5, md: 1 }, pb: 3 } }>
        { errorMessage && (
          <Alert severity="error" sx={ { mx: 1.5, mb: 2, borderRadius: 2 } }>{ errorMessage }</Alert>
        ) }

        { isLoading && (
          <Box sx={ { py: 8, display: 'flex', justifyContent: 'center' } }>
            <CircularProgress color="primary" />
          </Box>
        ) }

        { !isLoading && posts.length === 0 && (
          <EmptyState
            icon={ <PhotoLibraryOutlinedIcon sx={ { fontSize: 48, color: 'secondary.dark' } } /> }
            title="업로드한 게시물이 없어요"
            description="첫 맛집 사진을 공유해보세요!"
          />
        ) }

        <Grid container spacing={ 0.5 }>
          { posts.map((post) => (
            <Grid key={ post.id } size={ { xs: 4 } }>
              <Box
                onClick={ () => setDetailPostId(post.id) }
                sx={ { cursor: 'pointer', '&:hover': { opacity: 0.85 } } }
              >
                <SquareImage src={ post.image_url } alt={ post.caption } fallbackSeed={ post.id } />
              </Box>
            </Grid>
          )) }
        </Grid>
      </Box>

      { /* 게시물 상세 전체화면 모달 (하단바 제외 영역) */ }
      <PostDetailModal
        isOpen={ Boolean(detailPost) }
        post={ detailPost }
        isLiked={ detailPost ? likedIds.has(detailPost.id) : false }
        onClose={ () => setDetailPostId(null) }
        onToggleLike={ toggleLike }
        onOpenComments={ (target) => setCommentPostId(target.id) }
      />

      <CommentModal
        isOpen={ Boolean(commentPost) }
        post={ commentPost }
        currentUserId={ user?.id ?? null }
        onClose={ () => setCommentPostId(null) }
        onSubmit={ (content) => addComment(commentPostId, user.id, content) }
        onDelete={ (commentId) => removeComment(commentPostId, commentId) }
      />
    </AppFrame>
  );
}

export default MyPage;
