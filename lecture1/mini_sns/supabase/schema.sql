-- ============================================================
-- 맛스타그램 (mini_sns) 데이터베이스 스키마
--
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 실행하세요.
-- 실행 순서: 이 파일 → my-community/supabase/schema.sql
--
-- ⚠️ 주의: 아래 DROP 구문이 기존 sns_* 테이블과 데이터를 삭제합니다.
--         (구버전 스키마가 현재 코드와 맞지 않아 재생성합니다.
--          기존 데이터는 lecture1/_supabase_backup_20260908/ 에 백업되어 있습니다)
--
-- id 는 기존 프로젝트 관례에 맞춰 uuid 를 사용합니다.
-- ============================================================

-- ------------------------------------------------------------
-- 0. 구버전 테이블 제거
--    sns_likes: 구버전 전용 테이블. 현재 코드는 sns_posts.likes_count 로 처리합니다.
-- ------------------------------------------------------------

drop table if exists public.sns_likes    cascade;
drop table if exists public.sns_comments cascade;
drop table if exists public.sns_posts    cascade;
drop table if exists public.sns_users    cascade;

-- ------------------------------------------------------------
-- 1. 테이블
-- ------------------------------------------------------------

-- 사용자 (Supabase Auth 를 쓰지 않는 학습용 자체 테이블)
-- auth-provider.jsx 가 password 를 평문 그대로 비교하므로 password 컬럼을 사용합니다.
create table public.sns_users (
  id                uuid        primary key default gen_random_uuid(),
  username          text        not null unique,
  password          text        not null,
  nickname          text        not null,
  profile_image_url text,
  created_at        timestamptz not null default now()
);

-- 게시물
-- hashtags 는 '#맛집 #파스타' 형태의 공백 구분 문자열입니다
-- (post-card.jsx:38 에서 split 후 '#' 으로 시작하는 항목만 사용).
create table public.sns_posts (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.sns_users(id) on delete cascade,
  caption     text        not null default '',
  hashtags    text        not null default '',
  location    text        not null default '',
  image_url   text,
  likes_count integer     not null default 0,
  created_at  timestamptz not null default now()
);

-- 댓글
create table public.sns_comments (
  id         uuid        primary key default gen_random_uuid(),
  post_id    uuid        not null references public.sns_posts(id) on delete cascade,
  user_id    uuid        not null references public.sns_users(id) on delete cascade,
  content    text        not null,
  created_at timestamptz not null default now()
);

-- 목록 정렬/필터 성능용 인덱스
create index idx_sns_posts_created_at on public.sns_posts (created_at desc);
create index idx_sns_posts_user_id    on public.sns_posts (user_id);
create index idx_sns_comments_post_id on public.sns_comments (post_id);

-- ------------------------------------------------------------
-- 2. RLS 정책
--    프론트엔드가 publishable(anon) 키로 직접 접근하는 학습용 구조이므로
--    anon 역할에 필요한 동작을 열어둡니다.
--    (실서비스에서는 Supabase Auth + auth.uid() 기반 정책으로 전환 권장)
-- ------------------------------------------------------------

alter table public.sns_users    enable row level security;
alter table public.sns_posts    enable row level security;
alter table public.sns_comments enable row level security;

-- sns_users: 로그인 조회 + 회원가입 삽입
create policy "sns_users 조회 허용"
  on public.sns_users for select to anon, authenticated using (true);

create policy "sns_users 가입 허용"
  on public.sns_users for insert to anon, authenticated with check (true);

-- sns_posts: 피드 조회 + 작성 + 좋아요 수 갱신
create policy "sns_posts 조회 허용"
  on public.sns_posts for select to anon, authenticated using (true);

create policy "sns_posts 작성 허용"
  on public.sns_posts for insert to anon, authenticated with check (true);

create policy "sns_posts 수정 허용"
  on public.sns_posts for update to anon, authenticated using (true) with check (true);

-- sns_comments: 조회 + 작성 + 삭제
create policy "sns_comments 조회 허용"
  on public.sns_comments for select to anon, authenticated using (true);

create policy "sns_comments 작성 허용"
  on public.sns_comments for insert to anon, authenticated with check (true);

create policy "sns_comments 삭제 허용"
  on public.sns_comments for delete to anon, authenticated using (true);

-- ------------------------------------------------------------
-- 3. 테스트 계정 시드
--    README 기준: 아이디 guest / 비밀번호 guest1234
--    (mini_sns 는 평문 비밀번호를 그대로 비교하는 학습용 구조입니다)
-- ------------------------------------------------------------

insert into public.sns_users (username, password, nickname, profile_image_url)
values (
  'guest',
  'guest1234',
  '맛집탐험가',
  'https://api.dicebear.com/9.x/adventurer/svg?seed=guest&backgroundColor=ffd8a8'
);

-- ------------------------------------------------------------
-- 4. 샘플 게시물 (피드가 비어 보이지 않도록)
-- ------------------------------------------------------------

insert into public.sns_posts (user_id, caption, hashtags, location, image_url, likes_count)
select u.id, v.caption, v.hashtags, v.location, v.image_url, v.likes_count
from public.sns_users u
cross join (values
  (
    '퇴근길에 들른 파스타집. 크림소스가 진짜 진했어요!',
    '#파스타 #크림파스타 #퇴근후',
    '서울 마포구',
    'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80',
    12
  ),
  (
    '주말 브런치는 역시 팬케이크 🥞',
    '#브런치 #팬케이크 #주말',
    '서울 성수동',
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80',
    27
  ),
  (
    '비 오는 날엔 뜨끈한 국물이 최고죠.',
    '#국밥 #혼밥 #비오는날',
    '서울 종로구',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
    8
  )
) as v(caption, hashtags, location, image_url, likes_count)
where u.username = 'guest';

-- ------------------------------------------------------------
-- 5. 확인
-- ------------------------------------------------------------

select
  (select count(*) from public.sns_users)    as 사용자수,
  (select count(*) from public.sns_posts)    as 게시물수,
  (select count(*) from public.sns_comments) as 댓글수;
