/*
  # Add Missing Indexes for Foreign Keys

  1. Performance Optimization
    - Add indexes for all unindexed foreign keys to improve query performance
    - Indexes will speed up JOIN operations and foreign key constraint checks

  2. Tables Affected
    - appointments: subscription_id
    - coupons: professional_id
    - medical_records: patient_id, professional_id, subscription_id
    - reviews: patient_id, professional_id
    - subscription_dependents: subscription_id
    - subscriptions: plan_id
    - testimonials: user_id
*/

-- Add index for appointments.subscription_id
CREATE INDEX IF NOT EXISTS idx_appointments_subscription_id 
ON appointments(subscription_id);

-- Add index for coupons.professional_id
CREATE INDEX IF NOT EXISTS idx_coupons_professional_id 
ON coupons(professional_id);

-- Add indexes for medical_records foreign keys
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id 
ON medical_records(patient_id);

CREATE INDEX IF NOT EXISTS idx_medical_records_professional_id 
ON medical_records(professional_id);

CREATE INDEX IF NOT EXISTS idx_medical_records_subscription_id 
ON medical_records(subscription_id);

-- Add indexes for reviews foreign keys
CREATE INDEX IF NOT EXISTS idx_reviews_patient_id 
ON reviews(patient_id);

CREATE INDEX IF NOT EXISTS idx_reviews_professional_id 
ON reviews(professional_id);

-- Add index for subscription_dependents.subscription_id
CREATE INDEX IF NOT EXISTS idx_subscription_dependents_subscription_id 
ON subscription_dependents(subscription_id);

-- Add index for subscriptions.plan_id
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id 
ON subscriptions(plan_id);

-- Add index for testimonials.user_id
CREATE INDEX IF NOT EXISTS idx_testimonials_user_id 
ON testimonials(user_id);
