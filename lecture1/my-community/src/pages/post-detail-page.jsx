import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import AppHeader from '../components/common/app-header';
import CommentForm from '../components/post/comment-form';
import CommentList from '../components/post/comment-list';
import HashtagList from '../components/ui/hashtag-list';
import LikeButton from '../components/post/like-button';
import PageShell from '../components/ui/page-shell';
import ShareButton from '../components/post/share-button';
import {
  createComment,
  deleteComment,
  deletePost,
  fetchComments,
  fetchPost,
  increaseViewCount,
  togglePostLike,
} from '../lib/community-api';
import { formatFullDate } from '../utils/format-date';
import { useAuth } from '../hooks/auth-context';

/**
 * PostDetailPage 컴포넌트
 * 게시물 상세 내용과 좋아요·댓글 기능을 제공하는 화면.
 *
 * Example usage:
 * <Route path="/posts/:postId" element={ <PostDetailPage /> } />
 */
function PostDetailPage() {
  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLikePending, setIsLikePending] = useState(false);
  const hasCountedViewRef = useRef(false);

  /** 게시물과 댓글을 함께 불러온다. */
  const loadDetail = useCallback(async () => {
    setErrorMessage('');

    try {
      const [nextPost, nextComments] = await Promise.all([
        fetchPost({ postId, currentUserId: user?.id ?? null }),
        fetchComments(postId),
      ]);

      setPost(nextPost);
      setComments(nextComments);
    } catch (error) {
      setErrorMessage(`게시물을 불러오지 못했어요. (${ error.message })`);
    } finally {
      setIsLoading(false);
    }
  }, [postId, user?.id]);

  useEffect(() => {
    /** 같은 게시물에서 조회수가 중복 증가하지 않도록 한 번만 호출한다. */
    const countView = async () => {
      if (hasCountedViewRef.current) return;

      hasCountedViewRef.current = true;

      try {
        await increaseViewCount(postId);
      } catch {
        /** 조회수 증가 실패는 화면 이용에 영향을 주지 않으므로 무시한다. */
      }
    };

    countView().then(loadDetail);
  }, [postId, loadDetail]);

  /** 좋아요를 누르거나 취소한다. */
  const handleToggleLike = async () => {
    if (!post || isLikePending) return;

    setIsLikePending(true);

    /** 응답을 기다리지 않고 먼저 화면에 반영한다. */
    setPost((previous) => ({
      ...previous,
      isLikedByMe: !previous.isLikedByMe,
      likeCount: previous.likeCount + (previous.isLikedByMe ? -1 : 1),
    }));

    try {
      await togglePostLike({ postId: post.id, userId: user.id, isLiked: post.isLikedByMe });
    } catch (error) {
      setErrorMessage(`좋아요 처리에 실패했어요. (${ error.message })`);
      await loadDetail();
    } finally {
      setIsLikePending(false);
    }
  };

  const handleCreateComment = async (content) => {
    try {
      await createComment({ postId, authorId: user.id, content });
      setComments(await fetchComments(postId));
    } catch (error) {
      setErrorMessage(`댓글 등록에 실패했어요. (${ error.message })`);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(await fetchComments(postId));
    } catch (error) {
      setErrorMessage(`댓글 삭제에 실패했어요. (${ error.message })`);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('이 게시물을 삭제할까요?')) return;

    try {
      await deletePost(postId);
      navigate('/posts', { replace: true });
    } catch (error) {
      setErrorMessage(`게시물 삭제에 실패했어요. (${ error.message })`);
    }
  };

  if (isLoading) {
    return (
      <>
        <AppHeader />
        <PageShell maxWidth="md">
          <Box sx={ { display: 'flex', justifyContent: 'center', py: { xs: 6, md: 10 } } }>
            <CircularProgress />
          </Box>
        </PageShell>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <AppHeader />
        <PageShell maxWidth="md">
          <Alert severity="error" sx={ { mb: 2 } }>
            { errorMessage || '게시물을 찾을 수 없어요.' }
          </Alert>
          <Button startIcon={ <ArrowBackRoundedIcon /> } onClick={ () => navigate('/posts') }>
            목록으로 돌아가기
          </Button>
        </PageShell>
      </>
    );
  }

  const isMyPost = post.author?.id === user?.id;

  return (
    <>
      <AppHeader />

      <PageShell maxWidth="md">
        <Button
          color="inherit"
          startIcon={ <ArrowBackRoundedIcon /> }
          onClick={ () => navigate('/posts') }
          sx={ { mb: { xs: 1.5, md: 2 }, color: 'text.secondary' } }
        >
          뒤로가기
        </Button>

        { errorMessage && (
          <Alert severity="error" sx={ { mb: 2 } }>
            { errorMessage }
          </Alert>
        ) }

        <Paper
          elevation={ 0 }
          sx={ { p: { xs: 2.5, md: 4 }, border: '1px solid', borderColor: 'divider' } }
        >
          <Typography
            component="h1"
            sx={ {
              fontSize: { xs: '1.375rem', md: '1.875rem' },
              fontWeight: 800,
              lineHeight: 1.35,
              wordBreak: 'break-word',
            } }
          >
            { post.title }
          </Typography>

          <Box
            sx={ {
              mt: { xs: 2, md: 2.5 },
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, md: 1.5 },
              flexWrap: 'wrap',
            } }
          >
            <Avatar sx={ { width: 40, height: 40, fontWeight: 700, bgcolor: 'primary.main' } }>
              { post.author?.nickname?.slice(0, 1) ?? 'U' }
            </Avatar>

            <Box>
              <Box sx={ { fontSize: '0.9375rem', fontWeight: 700 } }>
                { post.author?.nickname ?? '알 수 없음' }
              </Box>
              <Box sx={ { fontSize: '0.8125rem', color: 'text.secondary' } }>
                { formatFullDate(post.createdAt) }
              </Box>
            </Box>

            <Box sx={ { flexGrow: 1 } } />

            <Box
              sx={ {
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '0.8125rem',
                color: 'text.secondary',
              } }
            >
              <VisibilityOutlinedIcon sx={ { fontSize: 16 } } />
              { post.viewCount }
            </Box>

            { isMyPost && (
              <Button
                size="small"
                color="inherit"
                startIcon={ <DeleteOutlineRoundedIcon /> }
                onClick={ handleDeletePost }
                sx={ { color: 'text.secondary' } }
              >
                삭제
              </Button>
            ) }
          </Box>

          <Divider sx={ { my: { xs: 2, md: 3 } } } />

          { post.imageUrl && (
            <Box
              component="img"
              src={ post.imageUrl }
              alt=""
              sx={ {
                width: '100%',
                mb: { xs: 2, md: 3 },
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              } }
            />
          ) }

          <Box
            sx={ {
              fontSize: { xs: '0.9375rem', md: '1.0625rem' },
              lineHeight: 1.8,
              color: 'text.primary',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            } }
          >
            { post.content }
          </Box>

          { post.tags.length > 0 && (
            <Box sx={ { mt: { xs: 2.5, md: 3 } } }>
              <HashtagList tags={ post.tags } />
            </Box>
          ) }

          <Box
            sx={ {
              mt: { xs: 3, md: 4 },
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: { xs: 1, md: 1.5 },
            } }
          >
            <LikeButton
              likeCount={ post.likeCount }
              isLiked={ post.isLikedByMe }
              onToggle={ handleToggleLike }
              isDisabled={ isLikePending }
            />

            <ShareButton title={ post.title } />
          </Box>
        </Paper>

        <Paper
          elevation={ 0 }
          sx={ {
            mt: { xs: 2, md: 3 },
            p: { xs: 2.5, md: 4 },
            border: '1px solid',
            borderColor: 'divider',
          } }
        >
          <Typography
            component="h2"
            sx={ { fontSize: { xs: '1rem', md: '1.125rem' }, fontWeight: 800, mb: 2 } }
          >
            댓글 { comments.length }
          </Typography>

          <CommentForm onSubmit={ handleCreateComment } />

          <Box sx={ { mt: 1 } }>
            <CommentList
              comments={ comments }
              currentUserId={ user?.id ?? null }
              onDelete={ handleDeleteComment }
            />
          </Box>
        </Paper>
      </PageShell>
    </>
  );
}

export default PostDetailPage;
