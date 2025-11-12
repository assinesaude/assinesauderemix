/*
  # Add specialty field to vector_icons table

  1. Changes
    - Add `specialty` column to `vector_icons` table to store professional specialty information
    - Update RLS policies if needed
  
  2. Notes
    - The specialty field will store additional information about the professional category
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vector_icons' AND column_name = 'specialty'
  ) THEN
    ALTER TABLE vector_icons ADD COLUMN specialty text;
  END IF;
END $$;
