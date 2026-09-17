import { supabase, TABLE } from './supabase';

/** 게시물 + 작성자 + 댓글(작성자 포함) 을 한 번에 가져오는 select 구문 */
const POST_SELECT = `
  id,
  caption,
  hashtags,
  location,
  image_url,
  likes_count,
  created_at,
  author:${TABLE.users} ( id, nickname, profile_image_url ),
  comments:${TABLE.comments} (
    id,
    content,
    created_at,
    author:${TABLE.users} ( id, nickname, profile_image_url )
  )
`;

/** 댓글을 오래된 순으로 정렬 */
function sortComments(post) {
  return {
    ...post,
    comments: [...(post.comments ?? [])].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at),
    ),
  };
}

/**
 * 전체 피드 게시물 조회 (최신순)
 * @returns {Promise<Array>} 게시물 목록
 */
export async function fetchFeedPosts() {
  const { data, error } = await supabase
    .from(TABLE.posts)
    .select(POST_SELECT)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(sortComments);
}

/**
 * 특정 사용자의 게시물 조회 (최신순)
 * @param {string} userId - 사용자 id (uuid) [Required]
 * @returns {Promise<Array>} 게시물 목록
 */
export async function fetchUserPosts(userId) {
  const { data, error } = await supabase
    .from(TABLE.posts)
    .select(POST_SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(sortComments);
}

/**
 * 게시물 등록
 * @param {object} payload - { userId, caption, hashtags, location, imageUrl } [Required]
 * @returns {Promise<object>} 생성된 게시물
 */
export async function createPost({ userId, caption, hashtags, location, imageUrl }) {
  const { data, error } = await supabase
    .from(TABLE.posts)
    .insert({
      user_id: userId,
      caption,
      hashtags,
      location,
      image_url: imageUrl,
    })
    .select(POST_SELECT)
    .single();

  if (error) throw error;
  return sortComments(data);
}

/**
 * 좋아요 수 변경
 * @param {string} postId - 게시물 id (uuid) [Required]
 * @param {number} nextCount - 변경할 좋아요 수 [Required]
 * @returns {Promise<void>}
 */
export async function updateLikesCount(postId, nextCount) {
  const { error } = await supabase
    .from(TABLE.posts)
    .update({ likes_count: Math.max(0, nextCount) })
    .eq('id', postId);

  if (error) throw error;
}

/**
 * 댓글 등록
 * @param {object} payload - { postId, userId, content } [Required]
 * @returns {Promise<object>} 생성된 댓글
 */
export async function createComment({ postId, userId, content }) {
  const { data, error } = await supabase
    .from(TABLE.comments)
    .insert({ post_id: postId, user_id: userId, content })
    .select(`id, content, created_at, author:${TABLE.users} ( id, nickname, profile_image_url )`)
    .single();

  if (error) throw error;
  return data;
}

/**
 * 댓글 삭제
 * @param {string} commentId - 댓글 id (uuid) [Required]
 * @returns {Promise<void>}
 */
export async function deleteComment(commentId) {
  const { error } = await supabase.from(TABLE.comments).delete().eq('id', commentId);
  if (error) throw error;
}

/**
 * 게시물 1건 조회
 * @param {string} postId - 게시물 id (uuid) [Required]
 * @returns {Promise<object>} 게시물
 */
export async function fetchPostById(postId) {
  const { data, error } = await supabase
    .from(TABLE.posts)
    .select(POST_SELECT)
    .eq('id', postId)
    .single();

  if (error) throw error;
  return sortComments(data);
}
