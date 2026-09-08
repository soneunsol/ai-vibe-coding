import { supabase } from './supabase';
import { hashPassword } from '../utils/hash-password';
import { toUserMessage } from '../utils/supabase-error';

/** 로그인 없이 둘러보기용 테스트 계정 아이디 */
export const GUEST_USERNAME = 'guest';

/** 회원 조회 시 공통으로 가져올 컬럼 */
const USER_COLUMNS = 'id, username, nickname, created_at';

/**
 * 아이디 중복 여부를 확인한다.
 *
 * @param {string} username - 확인할 아이디
 * @returns {Promise<boolean>} 사용 가능하면 true
 */
export async function checkUsernameAvailable(username) {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (error) throw new Error(toUserMessage(error, '아이디 확인 중 오류가 발생했습니다.'));

  return !data;
}

/**
 * 회원가입을 수행한다.
 *
 * @param {{ username: string, nickname: string, password: string }} payload - 가입 정보
 * @returns {Promise<object>} 생성된 사용자 정보
 */
export async function signUpUser({ username, nickname, password }) {
  const isAvailable = await checkUsernameAvailable(username);

  if (!isAvailable) {
    throw new Error('이미 사용 중인 아이디입니다.');
  }

  const passwordHash = await hashPassword(password);
  const { data, error } = await supabase
    .from('users')
    .insert({ username, nickname: nickname || username, password_hash: passwordHash })
    .select(USER_COLUMNS)
    .single();

  if (error) throw new Error(toUserMessage(error, '회원가입 중 오류가 발생했습니다.'));

  return data;
}

/**
 * 아이디/비밀번호로 로그인한다.
 *
 * @param {{ username: string, password: string }} payload - 로그인 정보
 * @returns {Promise<object>} 로그인한 사용자 정보
 */
export async function signInUser({ username, password }) {
  const passwordHash = await hashPassword(password);
  const { data, error } = await supabase
    .from('users')
    .select(USER_COLUMNS)
    .eq('username', username)
    .eq('password_hash', passwordHash)
    .maybeSingle();

  // 서버/DB 장애와 "비밀번호 틀림" 을 구분해서 안내
  if (error) throw new Error(toUserMessage(error, '로그인 중 오류가 발생했습니다.'));
  if (!data) {
    throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
  }

  return data;
}

/**
 * 테스트 계정(guest)으로 로그인한다.
 *
 * @returns {Promise<object>} 게스트 사용자 정보
 */
export async function signInAsGuestUser() {
  const { data, error } = await supabase
    .from('users')
    .select(USER_COLUMNS)
    .eq('username', GUEST_USERNAME)
    .maybeSingle();

  if (error) throw new Error(toUserMessage(error, '테스트 계정 로그인 중 오류가 발생했습니다.'));
  if (!data) {
    throw new Error('테스트 계정을 찾을 수 없습니다. 관리자에게 문의해 주세요.');
  }

  return data;
}
