import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import AppFrame from '../components/common/app-frame';
import PageHeader from '../components/common/page-header';
import CommentModal from '../components/feed/comment-modal';
import PostDetailView from '../components/feed/post-detail-view';
import { fetchPostById } from '../lib/sns-api';
import { usePostList } from '../hooks/use-post-list';
import { useAuth } from '../hooks/use-auth';

/**
 * PostDetailPage — 댓글을 제외한 게시물 내용을 한 화면 가득 보여주는 상세 화면
 *
 * Example usage:
 * <Route path="/post/:postId" element={ <PostDetailPage /> } />
 */
function PostDetailPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user } = useAuth();

  const loadPost = useCallback(async () => [await fetchPostById(postId)], [postId]);
  const { posts, isLoading, errorMessage, likedIds, toggleLike, addComment, removeComment } =
    usePostList(loadPost);
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const post = posts[0] ?? null;

  return (
    <AppFrame
      isBottomNavVisible={ false }
      isFullHeight
      header={ <PageHeader title="게시물" onBack={ () => navigate(-1) } /> }
    >
      { errorMessage && (
        <Alert severity="error" sx={ { m: 2, borderRadius: 0 } }>{ errorMessage }</Alert>
      ) }

      { isLoading && (
        <Box sx={ { flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' } }>
          <CircularProgress color="primary" />
        </Box>
      ) }

      { post && (
        <PostDetailView
          post={ post }
          isLiked={ likedIds.has(post.id) }
          onToggleLike={ toggleLike }
          onOpenComments={ () => setIsCommentOpen(true) }
        />
      ) }

      <CommentModal
        isOpen={ isCommentOpen && Boolean(post) }
        post={ post }
        currentUserId={ user?.id ?? null }
        onClose={ () => setIsCommentOpen(false) }
        onSubmit={ (content) => addComment(post.id, user.id, content) }
        onDelete={ (commentId) => removeComment(post.id, commentId) }
      />
    </AppFrame>
  );
}

export default PostDetailPage;
