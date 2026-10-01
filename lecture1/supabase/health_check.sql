-- ============================================================
-- Supabase Keep Alive 용 health_check 테이블
-- .github/workflows/supabase-keep-alive.yml 이 이 테이블을 조회한다.
-- Supabase 대시보드 > SQL Editor 에서 한 번 실행한다.
-- ============================================================

create table if not exists public.health_check (
  id         int         primary key,
  checked_at timestamptz not null default now()
);

insert into public.health_check (id) values (1)
on conflict (id) do nothing;

-- 2026-10-30 부터 public 스키마의 새 테이블은 Data API 권한이 자동 부여되지 않으므로 명시한다.
grant select on public.health_check to anon, authenticated;
grant select, insert, update, delete on public.health_check to service_role;

alter table public.health_check enable row level security;

drop policy if exists "health_check 조회 허용" on public.health_check;
create policy "health_check 조회 허용"
  on public.health_check for select to anon, authenticated using (true);
