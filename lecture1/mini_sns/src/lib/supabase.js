import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** 환경변수 누락 시 빌드는 통과하되 런타임에서 원인을 알 수 있도록 경고 */
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 환경변수가 설정되지 않았습니다.');
}

/** 맛스타그램 Supabase 클라이언트 (anon 키 사용, RLS 정책으로 보호) */
export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');

/** 테이블 이름 상수 (한 Supabase 프로젝트를 공유하므로 sns_ 접두사 사용) */
export const TABLE = {
  users: 'sns_users',
  posts: 'sns_posts',
  comments: 'sns_comments',
};
