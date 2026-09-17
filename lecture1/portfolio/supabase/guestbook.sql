-- ============================================================
-- 포트폴리오 방명록 (guestbook) 테이블
--
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 Run 하세요.
--
-- 이 스크립트는 기존 테이블을 건드리지 않습니다.
-- guestbook 만 새로 만들며, drop 은 guestbook 에만 적용됩니다.
-- ============================================================

drop table if exists public.guestbook cascade;

-- ------------------------------------------------------------
-- 1. 테이블
--    id 는 다른 테이블 관례에 맞춰 uuid 를 사용합니다.
--    anon 키로 직접 insert 하는 구조라, 길이 제한을 DB 에서 걸어둡니다.
--    (프론트 검증만 두면 REST 를 직접 호출해 우회할 수 있습니다)
-- ------------------------------------------------------------

create table public.guestbook (
  id         uuid        primary key default gen_random_uuid(),
  nickname   text        not null check (char_length(trim(nickname)) between 1 and 20),
  message    text        not null check (char_length(trim(message))  between 1 and 200),
  created_at timestamptz not null default now()
);

-- 최신순 정렬용
create index idx_guestbook_created_at on public.guestbook (created_at desc);

-- ------------------------------------------------------------
-- 2. RLS 정책
--    조회와 작성만 허용합니다.
--    update / delete 정책은 일부러 만들지 않습니다 —
--    anon 에게 열어주면 방문객이 남의 글을 고치거나 지울 수 있습니다.
--    (정책이 없으면 RLS 가 기본 거부하므로 별도 조치가 필요 없습니다)
-- ------------------------------------------------------------

alter table public.guestbook enable row level security;

create policy "guestbook 조회 허용"
  on public.guestbook for select to anon, authenticated using (true);

create policy "guestbook 작성 허용"
  on public.guestbook for insert to anon, authenticated with check (true);

-- ------------------------------------------------------------
-- 3. 샘플 방명록 (페이지가 비어 보이지 않도록)
--    created_at 을 다르게 줘서 최신순 정렬이 눈에 보이도록 합니다.
-- ------------------------------------------------------------

insert into public.guestbook (nickname, message, created_at)
values
  ('지나가던 개발자',
   E'아우로라 배경이랑 보라-시안 그라데이션 조합이 인상적이네요.\n프로젝트 카드 호버 효과도 부드럽고 좋습니다!',
   now() - interval '5 days'),
  ('디자인 수강생',
   '커뮤니티랑 미니 SNS 둘 다 잘 봤습니다. 다음 프로젝트도 기대할게요 :)',
   now() - interval '2 days'),
  ('같은 반 수강생',
   'MUI 테마를 이렇게 쓰는 거였군요. 코드 구조 참고 많이 하고 갑니다!',
   now() - interval '6 hours');

-- ------------------------------------------------------------
-- 4. 확인 — 3행이 최신순으로 나오면 성공입니다.
-- ------------------------------------------------------------

select nickname, message, created_at
from public.guestbook
order by created_at desc;
