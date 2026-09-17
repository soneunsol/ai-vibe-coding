import { supabase } from './supabase';

/** 방명록 입력 제한 (supabase/guestbook.sql 의 check 제약과 같은 값) */
export const NICKNAME_MAX_LENGTH = 20;
export const MESSAGE_MAX_LENGTH = 200;

/**
 * 방명록 목록을 최신순으로 조회한다.
 *
 * @returns {Promise<object[]>} 방명록 목록
 */
export const fetchGuestbookEntries = async () => {
  const { data, error } = await supabase
    .from('guestbook')
    .select('id, nickname, message, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data || [];
};

/**
 * 방명록을 등록하고 생성된 글을 돌려준다.
 *
 * @param {{ nickname: string, message: string }} payload - 등록 정보
 * @returns {Promise<object>} 생성된 방명록 한 건
 */
export const createGuestbookEntry = async ({ nickname, message }) => {
  const { data, error } = await supabase
    .from('guestbook')
    .insert({ nickname: nickname.trim(), message: message.trim() })
    .select('id, nickname, message, created_at')
    .single();

  if (error) throw error;

  return data;
};
