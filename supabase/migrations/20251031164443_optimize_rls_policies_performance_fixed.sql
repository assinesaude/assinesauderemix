/*
  # Optimize RLS Policies for Performance

  1. Performance Optimization
    - Replace direct auth.uid() calls with (select auth.uid()) pattern
    - This prevents re-evaluation of auth functions for each row
    - Significantly improves query performance at scale

  2. Tables Affected
    - profiles
    - professionals
    - specialties
    - benefit_plans
    - patients
    - subscriptions
    - payments
    - medical_records
    - appointments
    - reviews
    - coupons
    - messages
    - testimonials

  3. Important Notes
    - Drop existing policies and recreate with optimized pattern
    - Maintain same security rules, only optimize execution
*/

-- Profiles table policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- Professionals table policies
DROP POLICY IF EXISTS "Professionals can view own data" ON professionals;
DROP POLICY IF EXISTS "Professionals can update own data" ON professionals;

CREATE POLICY "Professionals can view own data"
  ON professionals FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Professionals can update own data"
  ON professionals FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Specialties table policies
DROP POLICY IF EXISTS "Professionals can manage own specialties" ON specialties;

CREATE POLICY "Professionals can manage own specialties"
  ON specialties FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM professionals
      WHERE professionals.id = specialties.professional_id
      AND professionals.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM professionals
      WHERE professionals.id = specialties.professional_id
      AND professionals.user_id = (select auth.uid())
    )
  );

-- Benefit plans table policies
DROP POLICY IF EXISTS "Anyone can view published plans" ON benefit_plans;
DROP POLICY IF EXISTS "Professionals can manage own plans" ON benefit_plans;

CREATE POLICY "Anyone can view published plans"
  ON benefit_plans FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Professionals can manage own plans"
  ON benefit_plans FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM professionals
      WHERE professionals.id = benefit_plans.professional_id
      AND professionals.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM professionals
      WHERE professionals.id = benefit_plans.professional_id
      AND professionals.user_id = (select auth.uid())
    )
  );

-- Patients table policies
DROP POLICY IF EXISTS "Patients can view own data" ON patients;
DROP POLICY IF EXISTS "Patients can update own data" ON patients;

CREATE POLICY "Patients can view own data"
  ON patients FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Patients can update own data"
  ON patients FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Subscriptions table policies
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Patients can manage own subscriptions" ON subscriptions;

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = subscriptions.patient_id
      AND patients.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Patients can manage own subscriptions"
  ON subscriptions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = subscriptions.patient_id
      AND patients.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = subscriptions.patient_id
      AND patients.user_id = (select auth.uid())
    )
  );

-- Payments table policies
DROP POLICY IF EXISTS "Users can view related payments" ON payments;

CREATE POLICY "Users can view related payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions
      JOIN patients ON patients.id = subscriptions.patient_id
      WHERE subscriptions.id = payments.subscription_id
      AND patients.user_id = (select auth.uid())
    )
  );

-- Medical records table policies
DROP POLICY IF EXISTS "Professionals can manage records for their patients" ON medical_records;
DROP POLICY IF EXISTS "Patients can view own medical records" ON medical_records;

CREATE POLICY "Professionals can manage records for their patients"
  ON medical_records FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM professionals
      WHERE professionals.id = medical_records.professional_id
      AND professionals.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM professionals
      WHERE professionals.id = medical_records.professional_id
      AND professionals.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Patients can view own medical records"
  ON medical_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = medical_records.patient_id
      AND patients.user_id = (select auth.uid())
    )
  );

-- Appointments table policies
DROP POLICY IF EXISTS "Users can view related appointments" ON appointments;
DROP POLICY IF EXISTS "Professionals can manage appointments" ON appointments;

CREATE POLICY "Users can view related appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions
      JOIN patients ON patients.id = subscriptions.patient_id
      WHERE subscriptions.id = appointments.subscription_id
      AND patients.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Professionals can manage appointments"
  ON appointments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions
      WHERE subscriptions.id = appointments.subscription_id
      AND subscriptions.professional_id IN (
        SELECT id FROM professionals WHERE user_id = (select auth.uid())
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM subscriptions
      WHERE subscriptions.id = appointments.subscription_id
      AND subscriptions.professional_id IN (
        SELECT id FROM professionals WHERE user_id = (select auth.uid())
      )
    )
  );

-- Reviews table policies
DROP POLICY IF EXISTS "Patients can create reviews" ON reviews;

CREATE POLICY "Patients can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = reviews.patient_id
      AND patients.user_id = (select auth.uid())
    )
  );

-- Coupons table policies
DROP POLICY IF EXISTS "Professionals can manage own coupons" ON coupons;

CREATE POLICY "Professionals can manage own coupons"
  ON coupons FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM professionals
      WHERE professionals.id = coupons.professional_id
      AND professionals.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM professionals
      WHERE professionals.id = coupons.professional_id
      AND professionals.user_id = (select auth.uid())
    )
  );

-- Messages table policies
DROP POLICY IF EXISTS "Users can view messages sent to them" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;

CREATE POLICY "Users can view messages sent to them"
  ON messages FOR SELECT
  TO authenticated
  USING (recipient_id = (select auth.uid()) OR sender_id = (select auth.uid()));

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = (select auth.uid()));

-- Testimonials table policies
DROP POLICY IF EXISTS "Users can manage own testimonials" ON testimonials;

CREATE POLICY "Users can manage own testimonials"
  ON testimonials FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));
