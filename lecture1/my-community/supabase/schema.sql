-- ============================================================
-- DEVIGN (my-community) 데이터베이스 스키마
--
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 실행하세요.
-- 실행 순서: mini_sns/supabase/schema.sql → 이 파일
--
-- ⚠️ 주의: 아래 DROP 구문이 기존 users/posts/comments 테이블과 데이터를 삭제합니다.
--         (구버전 스키마가 현재 코드와 맞지 않아 재생성합니다.
--          기존 데이터는 lecture1/_supabase_backup_20260908/ 에 백업되어 있습니다)
--
-- id 는 기존 프로젝트 관례에 맞춰 uuid 를 사용합니다.
--
-- 💡 SQL Editor 는 스크립트 전체를 한 트랜잭션으로 실행합니다.
--    중간에 한 줄이라도 실패하면 전부 롤백되어 "아무 변화가 없는" 것처럼 보입니다.
--    실행 후 결과 패널에 빨간 에러가 뜨는지 반드시 확인하세요.
--    마지막 select 로 건수(사용자 1 / 게시물 3)가 나오면 성공입니다.
-- ============================================================

-- ------------------------------------------------------------
-- 0. 구버전 테이블/함수 제거
-- ------------------------------------------------------------

drop table if exists public.post_likes cascade;
drop table if exists public.comments   cascade;
drop table if exists public.posts      cascade;
drop table if exists public.users      cascade;

-- 구버전 조회수 함수 (현재 코드는 increase_post_view_count 를 호출합니다)
drop function if exists public.increment_post_views(uuid);
drop function if exists public.increment_post_views(bigint);

-- ------------------------------------------------------------
-- 1. 테이블
-- ------------------------------------------------------------

-- 사용자 (SHA-256 해시 저장, utils/hash-password.js 규칙과 일치)
create table public.users (
  id            uuid        primary key default gen_random_uuid(),
  username      text        not null unique,
  nickname      text        not null,
  password_hash text        not null,
  created_at    timestamptz not null default now()
);

-- 게시물 (tags 는 text 배열 — parse-hashtags.js 가 배열을 반환)
create table public.posts (
  id         uuid        primary key default gen_random_uuid(),
  title      text        not null,
  content    text        not null,
  image_url  text,
  tags       text[]      not null default '{}',
  view_count integer     not null default 0,
  author_id  uuid        not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 댓글 (community-api.js 는 author_id 를 사용합니다)
create table public.comments (
  id         uuid        primary key default gen_random_uuid(),
  post_id    uuid        not null references public.posts(id) on delete cascade,
  author_id  uuid        not null references public.users(id) on delete cascade,
  content    text        not null,
  created_at timestamptz not null default now()
);

-- 좋아요 (게시물당 1인 1회 — unique 제약으로 보장)
create table public.post_likes (
  id         uuid        primary key default gen_random_uuid(),
  post_id    uuid        not null references public.posts(id) on delete cascade,
  user_id    uuid        not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create index idx_posts_created_at   on public.posts (created_at desc);
create index idx_posts_author_id    on public.posts (author_id);
create index idx_comments_post_id   on public.comments (post_id);
create index idx_post_likes_post_id on public.post_likes (post_id);

-- ------------------------------------------------------------
-- 2. 조회수 증가 RPC
--    community-api.js 의 supabase.rpc('increase_post_view_count', ...) 대응.
--    RLS 로 update 를 막아두더라도 조회수는 올릴 수 있도록 security definer 사용.
-- ------------------------------------------------------------

create or replace function public.increase_post_view_count(target_post_id uuid)
returns void
language sql
security definer
set search_path = public
as $function$
  update public.posts
     set view_count = view_count + 1
   where id = target_post_id;
$function$;

grant execute on function public.increase_post_view_count(uuid) to anon, authenticated;

-- ------------------------------------------------------------
-- 3. RLS 정책
--    프론트엔드가 publishable(anon) 키로 직접 접근하는 학습용 구조입니다.
--    (실서비스에서는 Supabase Auth + auth.uid() 기반 정책으로 전환 권장)
-- ------------------------------------------------------------

alter table public.users      enable row level security;
alter table public.posts      enable row level security;
alter table public.comments   enable row level security;
alter table public.post_likes enable row level security;

-- users: 로그인/중복확인 조회 + 회원가입 삽입
create policy "users 조회 허용"
  on public.users for select to anon, authenticated using (true);

create policy "users 가입 허용"
  on public.users for insert to anon, authenticated with check (true);

-- posts: 조회 + 작성 + 수정 + 삭제
create policy "posts 조회 허용"
  on public.posts for select to anon, authenticated using (true);

create policy "posts 작성 허용"
  on public.posts for insert to anon, authenticated with check (true);

create policy "posts 수정 허용"
  on public.posts for update to anon, authenticated using (true) with check (true);

create policy "posts 삭제 허용"
  on public.posts for delete to anon, authenticated using (true);

-- comments: 조회 + 작성 + 삭제
create policy "comments 조회 허용"
  on public.comments for select to anon, authenticated using (true);

create policy "comments 작성 허용"
  on public.comments for insert to anon, authenticated with check (true);

create policy "comments 삭제 허용"
  on public.comments for delete to anon, authenticated using (true);

-- post_likes: 조회 + 등록 + 취소
create policy "post_likes 조회 허용"
  on public.post_likes for select to anon, authenticated using (true);

create policy "post_likes 등록 허용"
  on public.post_likes for insert to anon, authenticated with check (true);

create policy "post_likes 취소 허용"
  on public.post_likes for delete to anon, authenticated using (true);

-- ------------------------------------------------------------
-- 4. Storage 버킷 (이미지 업로드)
--    community-api.js 의 uploadPostImage() 가 'post-images' 버킷을 사용합니다.
-- ------------------------------------------------------------

-- storage.objects 는 SQL Editor 역할에 소유권이 없는 경우가 있어
-- 정책 생성이 42501(insufficient_privilege) 로 실패할 수 있다.
-- SQL Editor 는 스크립트 전체를 한 트랜잭션으로 실행하므로, 이 한 줄이 실패하면
-- 위에서 만든 테이블까지 전부 롤백된다. 예외를 잡아 나머지가 살아남도록 한다.
do $storage$
begin
  insert into storage.buckets (id, name, public)
  values ('post-images', 'post-images', true)
  on conflict (id) do update set public = true;

  execute 'drop policy if exists "post-images 공개 조회" on storage.objects';
  execute 'create policy "post-images 공개 조회"
             on storage.objects for select to anon, authenticated
             using (bucket_id = ''post-images'')';

  execute 'drop policy if exists "post-images 업로드 허용" on storage.objects';
  execute 'create policy "post-images 업로드 허용"
             on storage.objects for insert to anon, authenticated
             with check (bucket_id = ''post-images'')';

  raise notice 'Storage: post-images 버킷과 정책을 설정했습니다.';
exception
  when insufficient_privilege then
    raise notice 'Storage: 권한이 없어 건너뛰었습니다. 대시보드 Storage 화면에서 post-images 버킷을 Public 으로 직접 만들어 주세요. (이미지 업로드 외 기능은 정상 동작합니다)';
end
$storage$;

-- ------------------------------------------------------------
-- 5. 테스트 계정 시드
--    아이디: guest / 비밀번호: guest123!
--    해시값 = SHA-256('devign::guest123!') — utils/hash-password.js 와 동일한 규칙
--    (비밀번호 규칙: 8자 이상 + 영문 + 숫자 + 특수문자 모두 충족)
-- ------------------------------------------------------------

insert into public.users (username, nickname, password_hash)
values (
  'guest',
  '둘러보는개발자',
  '90a9c0a9bbd2fd4789cce55c0a9927f87331d3f348d09d738ef43b6ae0b4aee3'
);

-- ------------------------------------------------------------
-- 6. 샘플 게시물 (목록이 비어 보이지 않도록)
-- ------------------------------------------------------------

insert into public.posts (title, content, tags, author_id)
select v.title, v.content, v.tags, u.id
from public.users u
cross join (values
  (
    'React 19 로 넘어오면서 좋았던 점 3가지',
    E'use() 훅과 Actions 덕분에 폼 처리 코드가 확 줄었습니다.\n특히 useOptimistic 은 좋아요 버튼 같은 UI 에 딱이더군요.',
    array['react', 'frontend']
  ),
  (
    'MUI sx prop, 언제 styled() 로 바꿔야 할까?',
    E'sx 는 빠르지만 반복되면 관리가 어려워집니다.\n같은 스타일이 3번 이상 등장하면 styled() 로 추출하는 기준을 쓰고 있어요.',
    array['mui', 'design']
  ),
  (
    '디자인 시스템 도입 후기',
    E'색상과 간격을 토큰으로 정리하니 리뷰에서 스타일 얘기가 사라졌습니다.\n무엇보다 신규 화면 만드는 속도가 확실히 빨라졌어요.',
    array['design', 'designsystem']
  )
) as v(title, content, tags)
where u.username = 'guest';

-- ------------------------------------------------------------
-- 7. 확인
-- ------------------------------------------------------------

select
  (select count(*) from public.users)      as 사용자수,
  (select count(*) from public.posts)      as 게시물수,
  (select count(*) from public.comments)   as 댓글수,
  (select count(*) from public.post_likes) as 좋아요수;
