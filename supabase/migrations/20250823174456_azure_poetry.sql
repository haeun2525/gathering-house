/*
  # 후기 시스템 테이블 생성

  1. 새로운 테이블
    - `reviews`
      - `id` (uuid, primary key)
      - `event_id` (text, 이벤트 ID 참조)
      - `user_id` (uuid, 사용자 ID)
      - `rating` (integer, 1-5점)
      - `content` (text, 후기 내용)
      - `created_at` (timestamp)

  2. 보안
    - RLS 활성화
    - 사용자는 자신의 후기만 작성/조회 가능
    - 관리자는 모든 후기 조회 가능
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL,
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 후기만 작성 가능
CREATE POLICY "Users can create own reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 사용자는 자신의 후기만 조회 가능
CREATE POLICY "Users can read own reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 관리자는 모든 후기 조회 가능
CREATE POLICY "Admins can read all reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );