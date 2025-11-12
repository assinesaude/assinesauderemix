-- Create Locations Table
-- 
-- 1. New Tables
--    - locations: Stores country, state/province, and city data for autocomplete
-- 
-- 2. Columns
--    - id: Unique identifier
--    - country: Country name (Angola, Cabo Verde, etc.)
--    - state: State/Province (for Brazil)
--    - city: City name
--    - full_location: Searchable text combining all location data
-- 
-- 3. Security
--    - Enable RLS
--    - Public read access (locations are reference data)
-- 
-- 4. Performance
--    - GIN index for fast text search
--    - Index on country for filtering

CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country text NOT NULL,
  state text,
  city text NOT NULL,
  full_location text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read locations"
  ON locations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_locations_full_location ON locations USING gin(to_tsvector('simple', full_location));
CREATE INDEX IF NOT EXISTS idx_locations_country ON locations (country);
