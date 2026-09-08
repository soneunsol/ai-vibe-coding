import { useCallback, useEffect, useMemo, useState } from 'react';
import { AUTH_STORAGE_KEY, AuthContext } from '../../lib/auth-context';
import { supabase, TABLE } from '../../lib/supabase';
import { getProfileImageUrl } from '../../utils/random-image';
import { toUserMessage } from '../../utils/supabase-error';

/**
 * AuthProvider 컴포넌트 — 로그인 상태를 하위 화면에 제공
 *
 * Props:
 * @param {node} children - 하위 컴포넌트 [Required]
 *
 * Example usage:
 * <AuthProvider><App /></AuthProvider>
 */
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    setIsReady(true);
  }, []);

  /** 로그인 — 성공 시 { user }, 실패 시 { error } 반환 */
  const login = useCallback(async (username, password) => {
    let result;

    try {
      result = await supabase
        .from(TABLE.users)
        .select('id, username, nickname, profile_image_url')
        .eq('username', username.trim())
        .eq('password', password)
        .maybeSingle();
    } catch (thrown) {
      return { error: toUserMessage(thrown, '로그인 중 오류가 발생했습니다.') };
    }

    const { data, error } = result;

    // 서버/DB 장애와 "비밀번호 틀림" 을 구분해서 안내
    if (error) return { error: toUserMessage(error, '로그인 중 오류가 발생했습니다.') };
    if (!data) return { error: '아이디 또는 비밀번호가 올바르지 않습니다.' };

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    setUser(data);
    return { user: data };
  }, []);

  /** 회원가입 — 아이디 중복 확인 후 생성하고 자동 로그인 */
  const signup = useCallback(async (username, password, nickname) => {
    const trimmedId = username.trim();

    // 중복 확인 단계의 오류를 무시하면 뒤이은 insert 실패의 원인을 알 수 없어 함께 확인
    const { data: exists, error: checkError } = await supabase
      .from(TABLE.users)
      .select('id')
      .eq('username', trimmedId)
      .maybeSingle();

    if (checkError) return { error: toUserMessage(checkError, '아이디 확인 중 오류가 발생했습니다.') };
    if (exists) return { error: '이미 사용 중인 아이디입니다.' };

    const { data, error } = await supabase
      .from(TABLE.users)
      .insert({
        username: trimmedId,
        password,
        nickname: nickname.trim() || trimmedId,
        profile_image_url: getProfileImageUrl(trimmedId),
      })
      .select('id, username, nickname, profile_image_url')
      .single();

    if (error) return { error: toUserMessage(error, '회원가입 중 오류가 발생했습니다.') };

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    setUser(data);
    return { user: data };
  }, []);

  /** 로그아웃 */
  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isReady, isLoggedIn: Boolean(user), login, signup, logout }),
    [user, isReady, login, signup, logout],
  );

  return <AuthContext.Provider value={ value }>{ children }</AuthContext.Provider>;
}

export default AuthProvider;
