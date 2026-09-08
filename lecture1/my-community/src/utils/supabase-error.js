/**
 * Supabase 오류를 원인별 한국어 메시지로 변환한다.
 *
 * "로그인 중 오류가 발생했습니다" 처럼 뭉뚱그리면 비밀번호 오류와
 * 서버 장애를 구분할 수 없어 원인 파악이 어렵기 때문에 분기한다.
 *
 * @param {object|Error|null} error - Supabase 가 반환하거나 throw 한 오류 [Required]
 * @param {string} fallbackMessage - 분류되지 않은 경우 사용할 기본 문구 [Required]
 * @returns {string} 사용자에게 보여줄 메시지
 *
 * Example usage:
 * if (error) return { error: toUserMessage(error, '로그인 중 오류가 발생했습니다.') };
 */
export function toUserMessage(error, fallbackMessage) {
  if (!error) return fallbackMessage;

  const rawMessage = String(error.message ?? error);
  const code = error.code ?? '';

  // fetch 자체가 실패 — 프로젝트 일시정지/삭제, DNS 실패, 오프라인
  if (/failed to fetch|fetch failed|networkerror|load failed|err_name_not_resolved/i.test(rawMessage)) {
    return '서버에 연결할 수 없습니다. 네트워크 상태와 Supabase 프로젝트가 활성 상태인지 확인해주세요.';
  }

  // API 키 문제
  if (/invalid api key|no api key/i.test(rawMessage)) {
    return 'Supabase API 키가 올바르지 않습니다. VITE_SUPABASE_ANON_KEY 값을 확인해주세요.';
  }

  // 테이블/함수 없음 — 스키마 미생성
  if (code === '42P01' || code === 'PGRST205' || /does not exist/i.test(rawMessage)) {
    return '데이터베이스 테이블을 찾을 수 없습니다. supabase/schema.sql 을 실행했는지 확인해주세요.';
  }

  // RLS 정책에 막힘
  if (code === '42501' || code === 'PGRST301' || /row-level security/i.test(rawMessage)) {
    return '데이터 접근 권한이 없습니다. Supabase RLS 정책을 확인해주세요.';
  }

  return `${ fallbackMessage } (${ rawMessage || '알 수 없는 오류' })`;
}
