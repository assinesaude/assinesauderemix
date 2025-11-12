/*
  # Add RLS Policies for subscription_dependents Table

  1. Security
    - Enable Row Level Security (already enabled)
    - Add policies to allow patients to manage their dependents
    - Ensure only subscription owners can add/view/modify their dependents

  2. Policies
    - SELECT: Users can view dependents of their own subscriptions
    - INSERT: Users can add dependents to their own subscriptions
    - UPDATE: Users can update dependents of their own subscriptions
    - DELETE: Users can remove dependents from their own subscriptions

  3. Performance
    - Use optimized (select auth.uid()) pattern
*/

-- Allow patients to view dependents of their own subscriptions
CREATE POLICY "Patients can view own subscription dependents"
  ON subscription_dependents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions
      JOIN patients ON patients.id = subscriptions.patient_id
      WHERE subscriptions.id = subscription_dependents.subscription_id
      AND patients.user_id = (select auth.uid())
    )
  );

-- Allow patients to add dependents to their own subscriptions
CREATE POLICY "Patients can add dependents to own subscriptions"
  ON subscription_dependents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM subscriptions
      JOIN patients ON patients.id = subscriptions.patient_id
      WHERE subscriptions.id = subscription_dependents.subscription_id
      AND patients.user_id = (select auth.uid())
    )
  );

-- Allow patients to update dependents of their own subscriptions
CREATE POLICY "Patients can update own subscription dependents"
  ON subscription_dependents FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions
      JOIN patients ON patients.id = subscriptions.patient_id
      WHERE subscriptions.id = subscription_dependents.subscription_id
      AND patients.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM subscriptions
      JOIN patients ON patients.id = subscriptions.patient_id
      WHERE subscriptions.id = subscription_dependents.subscription_id
      AND patients.user_id = (select auth.uid())
    )
  );

-- Allow patients to remove dependents from their own subscriptions
CREATE POLICY "Patients can delete own subscription dependents"
  ON subscription_dependents FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions
      JOIN patients ON patients.id = subscriptions.patient_id
      WHERE subscriptions.id = subscription_dependents.subscription_id
      AND patients.user_id = (select auth.uid())
    )
  );
