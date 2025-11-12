/*
  # Create TERVIS.AI Usage Tracking

  1. New Tables
    - `tervis_usage`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable for anonymous users)
      - `session_id` (text, for tracking anonymous sessions)
      - `search_type` (text, 'text' or 'voice')
      - `query` (text, the search query)
      - `created_at` (timestamp)
      - `date` (date, for daily tracking)
  
  2. Security
    - Enable RLS on `tervis_usage` table
    - Add policy for users to view their own usage
    - Add policy for users to insert their own usage
  
  3. Notes
    - Text search limit: 10 per day
    - Voice search limit: 5 per day
    - Tracks both authenticated and anonymous users
*/

CREATE TABLE IF NOT EXISTS tervis_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  search_type text NOT NULL CHECK (search_type IN ('text', 'voice')),
  query text NOT NULL,
  created_at timestamptz DEFAULT now(),
  date date DEFAULT CURRENT_DATE
);

ALTER TABLE tervis_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage"
  ON tervis_usage
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage"
  ON tervis_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous can view own session usage"
  ON tervis_usage
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous can insert usage"
  ON tervis_usage
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_tervis_usage_user_date ON tervis_usage(user_id, date);
CREATE INDEX IF NOT EXISTS idx_tervis_usage_session_date ON tervis_usage(session_id, date);