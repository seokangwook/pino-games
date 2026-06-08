-- pino-games: 비로그인 게스트 점수 지원
-- Supabase SQL 에디터에서 수동 실행 필요

-- 1. guest_nickname 컬럼 추가 (이미 있으면 무시)
ALTER TABLE public.game_scores
  ADD COLUMN IF NOT EXISTS guest_nickname text;

-- 2. 게스트 INSERT 허용: user_id null + guest_nickname 있는 경우
--    service role key 사용 시 RLS bypass되므로 추가 정책 불필요.
--    기존 RLS 정책은 그대로 유지.

-- 3. 기존 game_scores에 null user_id 허용 확인 (이미 nullable)
-- user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE  ← nullable이므로 OK
