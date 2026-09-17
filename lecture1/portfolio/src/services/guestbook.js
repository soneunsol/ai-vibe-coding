import { supabase } from './supabase';

/**
 * 방명록 데이터
 *
 * Supabase guestbook 테이블을 우선 사용하고, 테이블이 아직 없거나 조회에
 * 실패하면 코드에 둔 시드 데이터로 폴백한다.
 *
 * 이렇게 둔 이유:
 *   테이블 생성(DDL)은 anon 키로 할 수 없어 대시보드에서 따로 실행해야 한다.
 *   폴백이 없으면 그 전까지 페이지가 404 로 깨지고, 실행한 뒤에는 재배포가
 *   필요하다. 폴백을 두면 배포 시점과 무관하게 항상 동작하고,
 *   supabase/guestbook.sql 을 실행하는 순간 자동으로 DB 모드로 넘어간다.
 *
 * 어느 쪽으로 동작 중인지는 조회 결과의 source 로 알 수 있고,
 * 화면은 'seed' 일 때만 임시 데이터 안내를 보여준다.
 */

/** 방명록 입력 제한 (supabase/guestbook.sql 의 check 제약과 같은 값) */
export const NICKNAME_MAX_LENGTH = 20;
export const MESSAGE_MAX_LENGTH = 200;

/** 조회 결과가 어디서 왔는지 */
export const SOURCE = { DB: 'db', SEED: 'seed' };

const ENTRY_COLUMNS = 'id, nickname, message, created_at';

const hoursAgo = (hours) => new Date(Date.now() - hours * 3600 * 1000).toISOString();

/**
 * 폴백용 시드 방명록 (최신순)
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
 * DB 조회가 실패하면 시드로 폴백하므로 예외를 던지지 않는다.
 *
 * @returns {Promise<{ entries: object[], source: string }>} 목록과 출처
 */
export const fetchGuestbookEntries = async () => {
  try {
    const { data, error } = await supabase
      .from('guestbook')
      .select(ENTRY_COLUMNS)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { entries: data || [], source: SOURCE.DB };
  } catch {
    /** 테이블 미생성(PGRST205) 등 — 페이지가 깨지지 않도록 시드로 보여준다 */
    return { entries: [...SEED_ENTRIES], source: SOURCE.SEED };
  }
};

/**
 * 방명록을 등록하고 생성된 글을 돌려준다.
 * seed 모드에서는 서버에 저장하지 않고 화면에 붙일 객체만 만든다.
 *
 * @param {{ nickname: string, message: string, source: string }} payload - 등록 정보와 현재 출처
 * @returns {Promise<object>} 생성된 방명록 한 건
 */
export const createGuestbookEntry = async ({ nickname, message, source }) => {
  const trimmed = { nickname: nickname.trim(), message: message.trim() };

  if (source === SOURCE.SEED) {
    return { id: `local-${Date.now()}`, ...trimmed, created_at: new Date().toISOString() };
  }

  const { data, error } = await supabase
    .from('guestbook')
    .insert(trimmed)
    .select(ENTRY_COLUMNS)
    .single();

  if (error) throw error;

  return data;
};
