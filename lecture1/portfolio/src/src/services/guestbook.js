/**
 * 방명록 데이터 (시드 전용)
 *
 * Supabase guestbook 테이블을 아직 만들지 않아, 코드에 둔 시드로만 동작한다.
 * 여기서 DB 를 조회하지 않으므로 콘솔에 404 가 찍히지 않는다.
 * (브라우저는 실패한 네트워크 요청을 try/catch 와 무관하게 콘솔에 남기므로,
 *  테이블이 없는 동안 404 를 없애려면 요청 자체를 하지 않아야 한다)
 *
 * 나중에 supabase/guestbook.sql 을 실행한 뒤에는 이 파일만 DB 버전으로
 * 바꾸면 된다. 화면(Guestbook.jsx)은 아래 인터페이스만 사용하므로 그대로 둔다.
 *   - fetchGuestbookEntries() -> { entries, source }
 *   - createGuestbookEntry({ nickname, message, source }) -> entry
 * DB 우선 + 폴백 구현은 git 커밋 7cf961d 에 있다.
 */

/** 방명록 입력 제한 (supabase/guestbook.sql 의 check 제약과 같은 값) */
export const NICKNAME_MAX_LENGTH = 20;
export const MESSAGE_MAX_LENGTH = 200;

/** 조회 결과가 어디서 왔는지 (지금은 항상 SEED) */
export const SOURCE = { DB: 'db', SEED: 'seed' };

const hoursAgo = (hours) => new Date(Date.now() - hours * 3600 * 1000).toISOString();

/**
 * 시드 방명록 (최신순)
 * 작성 시각을 현재 기준으로 계산해, 언제 열어도 상대 시간이 자연스럽게 보인다.
 */
const SEED_ENTRIES = [
  {
    id: 'seed-3',
    nickname: '같은 반 수강생',
    message: 'MUI 테마를 이렇게 쓰는 거였군요. 코드 구조 참고 많이 하고 갑니다!',
    created_at: hoursAgo(6),
  },
  {
    id: 'seed-2',
    nickname: '디자인 수강생',
    message: '커뮤니티랑 미니 SNS 둘 다 잘 봤습니다. 다음 프로젝트도 기대할게요 :)',
    created_at: hoursAgo(24 * 2),
  },
  {
    id: 'seed-1',
    nickname: '지나가던 개발자',
    message: '아우로라 배경이랑 보라-시안 그라데이션 조합이 인상적이네요.\n프로젝트 카드 호버 효과도 부드럽고 좋습니다!',
    created_at: hoursAgo(24 * 5),
  },
];

/**
 * 방명록 목록을 최신순으로 조회한다.
 *
 * @returns {Promise<{ entries: object[], source: string }>} 목록과 출처
 */
export const fetchGuestbookEntries = async () => ({
  entries: [...SEED_ENTRIES],
  source: SOURCE.SEED,
});

/**
 * 방명록을 등록하고 생성된 글을 돌려준다.
 * 시드 모드라 서버에 저장되지 않으며, 새로고침하면 사라진다.
 *
 * @param {{ nickname: string, message: string }} payload - 등록 정보
 * @returns {Promise<object>} 생성된 방명록 한 건
 */
export const createGuestbookEntry = async ({ nickname, message }) => ({
  id: `local-${Date.now()}`,
  nickname: nickname.trim(),
  message: message.trim(),
  created_at: new Date().toISOString(),
});
