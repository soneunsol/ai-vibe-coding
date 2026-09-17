import { supabase } from './supabase';

/** 게시물 목록/상세에서 공통으로 사용하는 조회 컬럼 */
const POST_COLUMNS = `
  id,
  title,
  content,
  image_url,
  tags,
  view_count,
  created_at,
  updated_at,
  author:users ( id, username, nickname ),
  post_likes ( user_id ),
  comments ( id )
`;

/**
 * 조회 결과를 화면에서 쓰기 좋은 형태로 가공한다.
 *
 * @param {object} row - Supabase 조회 결과 한 줄
 * @param {string|null} currentUserId - 현재 로그인 사용자 id (uuid)
 * @returns {object} 좋아요/댓글 수가 계산된 게시물 객체
 */
function mapPost(row, currentUserId) {
  const likes = row.post_likes ?? [];

  return {
    id: row.id,
    title: row.title,
    content: row.content,
    imageUrl: row.image_url,
    tags: row.tags ?? [],
    viewCount: row.view_count ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    author: row.author,
    likeCount: likes.length,
    commentCount: (row.comments ?? []).length,
    isLikedByMe: likes.some((like) => like.user_id === currentUserId),
  };
}

/**
 * 게시물 목록을 최신순으로 조회한다.
 *
 * @param {{ currentUserId: string|null, keyword: string }} options - 조회 옵션
 * @returns {Promise<object[]>} 게시물 목록
 */
export async function fetchPosts({ currentUserId = null, keyword = '' } = {}) {
  let query = supabase.from('posts').select(POST_COLUMNS).order('created_at', { ascending: false });

  if (keyword) {
    query = query.or(`title.ilike.%${ keyword }%,content.ilike.%${ keyword }%`);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data ?? []).map((row) => mapPost(row, currentUserId));
}

/**
 * 게시물 1건을 조회한다.
 *
 * @param {{ postId: string, currentUserId: string|null }} options - 조회 옵션
 * @returns {Promise<object>} 게시물 상세
 */
export async function fetchPost({ postId, currentUserId = null }) {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_COLUMNS)
    .eq('id', postId)
    .single();

  if (error) throw error;

  return mapPost(data, currentUserId);
}

/**
 * 게시물을 등록한다.
 *
 * @param {{ title: string, content: string, authorId: string, imageUrl: string|null, tags: string[] }} payload - 등록 정보
 * @returns {Promise<object>} 생성된 게시물의 id (uuid)
 */
export async function createPost({ title, content, authorId, imageUrl = null, tags = [] }) {
  const { data, error } = await supabase
    .from('posts')
    .insert({ title, content, author_id: authorId, image_url: imageUrl, tags })
    .select('id')
    .single();

  if (error) throw error;

  return data;
}

/**
 * 게시물을 삭제한다. (본인 글만 UI 에서 노출)
 *
 * @param {string} postId - 삭제할 게시물 id (uuid)
 * @returns {Promise<void>}
 */
export async function deletePost(postId) {
  const { error } = await supabase.from('posts').delete().eq('id', postId);

  if (error) throw error;
}

/**
 * 게시물 조회수를 1 증가시킨다.
 *
 * @param {string} postId - 대상 게시물 id (uuid)
 * @returns {Promise<void>}
 */
export async function increaseViewCount(postId) {
  const { error } = await supabase.rpc('increase_post_view_count', { target_post_id: postId });

  if (error) throw error;
}

/**
 * 좋아요를 토글한다. (이미 눌렀으면 취소)
 *
 * @param {{ postId: string, userId: string, isLiked: boolean }} payload - 토글 정보
 * @returns {Promise<void>}
 */
export async function togglePostLike({ postId, userId, isLiked }) {
  if (isLiked) {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) throw error;

    return;
  }

  const { error } = await supabase.from('post_likes').insert({ post_id: postId, user_id: userId });

  if (error) throw error;
}

/**
 * 특정 게시물의 댓글을 오래된 순으로 조회한다.
 *
 * @param {string} postId - 대상 게시물 id (uuid)
 * @returns {Promise<object[]>} 댓글 목록
 */
export async function fetchComments(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select('id, content, created_at, author:users ( id, username, nickname )')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data ?? [];
}

/**
 * 댓글을 등록한다.
 *
 * @param {{ postId: string, authorId: string, content: string }} payload - 등록 정보
 * @returns {Promise<void>}
 */
export async function createComment({ postId, authorId, content }) {
  const { error } = await supabase
    .from('comments')
    .insert({ post_id: postId, author_id: authorId, content });

  if (error) throw error;
}

/**
 * 댓글을 삭제한다.
 *
 * @param {string} commentId - 삭제할 댓글 id (uuid)
 * @returns {Promise<void>}
 */
export async function deleteComment(commentId) {
  const { error } = await supabase.from('comments').delete().eq('id', commentId);

  if (error) throw error;
}

/**
 * 게시물 이미지를 Supabase Storage 에 업로드하고 공개 URL 을 반환한다.
 *
 * @param {File} file - 업로드할 이미지 파일
 * @returns {Promise<string>} 업로드된 이미지의 공개 URL
 */
export async function uploadPostImage(file) {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'png';
  const filePath = `posts/${ Date.now() }-${ Math.random().toString(36).slice(2, 10) }.${ extension }`;

  const { error } = await supabase.storage
    .from('post-images')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from('post-images').getPublicUrl(filePath);

  return data.publicUrl;
}
