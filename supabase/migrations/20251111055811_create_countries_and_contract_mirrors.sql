/*
  # Create Countries and Contract Mirrors Tables

  1. New Tables
    - `countries`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Country name
      - `code` (text, unique) - ISO country code (e.g., IT, BR, ES)
      - `language_code` (text) - Language code (e.g., it, pt, es)
      - `domain` (text) - Website domain (e.g., benetuo.it)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `contract_mirrors`
      - `id` (uuid, primary key)
      - `country_id` (uuid, foreign key to countries)
      - `contract_type` (text) - Type of contract (professional, patient)
      - `contract_content` (text) - HTML/text content of contract
      - `version` (text) - Contract version
      - `effective_date` (timestamptz) - When contract becomes effective
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - Admin-only access for managing contracts and countries
    - Public read access for contract_mirrors
*/

-- Create countries table
CREATE TABLE IF NOT EXISTS countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  code text UNIQUE NOT NULL,
  language_code text NOT NULL,
  domain text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contract_mirrors table
CREATE TABLE IF NOT EXISTS contract_mirrors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id uuid NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  contract_type text NOT NULL CHECK (contract_type IN ('professional', 'patient')),
  contract_content text NOT NULL,
  version text NOT NULL,
  effective_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contract_mirrors_country_id ON contract_mirrors(country_id);
CREATE INDEX IF NOT EXISTS idx_contract_mirrors_contract_type ON contract_mirrors(contract_type);

-- Enable RLS
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_mirrors ENABLE ROW LEVEL SECURITY;

-- Countries policies
CREATE POLICY "Anyone can view countries"
  ON countries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert countries"
  ON countries FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Admins can update countries"
  ON countries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Admins can delete countries"
  ON countries FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Contract mirrors policies
CREATE POLICY "Anyone can view contract mirrors"
  ON contract_mirrors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert contract mirrors"
  ON contract_mirrors FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Admins can update contract mirrors"
  ON contract_mirrors FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Admins can delete contract mirrors"
  ON contract_mirrors FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Insert default countries
INSERT INTO countries (name, code, language_code, domain) VALUES
  ('Brasil', 'BR', 'pt', 'assinesaude.com.br'),
  ('Italia', 'IT', 'it', 'benetuo.it'),
  ('España', 'ES', 'es', 'sumatesalud.es'),
  ('United States', 'US', 'en', 'medlyou.com')
ON CONFLICT (code) DO NOTHING;