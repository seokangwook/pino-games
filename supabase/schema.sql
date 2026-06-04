-- pino-games Supabase schema
-- Phase E: Auth + 랭킹

-- 게임 점수 테이블
CREATE TABLE IF NOT EXISTS public.game_scores (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  game_type   text NOT NULL CHECK (game_type IN ('cards', 'mahjong')),
  grid_size   text,                       -- cards 전용: '4x4' | '4x6' | '6x6'
  moves       int NOT NULL,
  time_ms     int NOT NULL,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read scores" ON public.game_scores
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users insert own score" ON public.game_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Phase D: 멀티플레이어 방 (나중에 사용)
CREATE TABLE IF NOT EXISTS public.game_rooms (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code    text UNIQUE NOT NULL,      -- 6자리 코드
  host_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  game_type    text NOT NULL CHECK (game_type IN ('cards', 'mahjong')),
  grid_size    text,
  status       text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'done')),
  board_state  jsonb,
  winner_id    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read rooms" ON public.game_rooms
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users manage own rooms" ON public.game_rooms
  FOR ALL USING (auth.uid() IN (host_id, guest_id));

-- 랭킹 뷰 (카드 최단시간 TOP 20)
CREATE OR REPLACE VIEW public.cards_ranking AS
SELECT
  ROW_NUMBER() OVER (PARTITION BY grid_size ORDER BY time_ms ASC) AS rank,
  u.email,
  s.grid_size,
  s.moves,
  s.time_ms,
  s.created_at
FROM public.game_scores s
JOIN auth.users u ON u.id = s.user_id
WHERE s.game_type = 'cards'
ORDER BY s.grid_size, s.time_ms;

-- 마작 랭킹 뷰
CREATE OR REPLACE VIEW public.mahjong_ranking AS
SELECT
  ROW_NUMBER() OVER (ORDER BY time_ms ASC) AS rank,
  u.email,
  s.moves,
  s.time_ms,
  s.created_at
FROM public.game_scores s
JOIN auth.users u ON u.id = s.user_id
WHERE s.game_type = 'mahjong'
ORDER BY s.time_ms;
