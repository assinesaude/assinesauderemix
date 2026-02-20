
-- 1. countries
CREATE TABLE IF NOT EXISTS public.countries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  language_code TEXT NOT NULL DEFAULT 'pt',
  domain TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view countries" ON public.countries FOR SELECT USING (true);
CREATE POLICY "Admins can manage countries" ON public.countries FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. profiles (generic profiles linked to auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_type TEXT NOT NULL DEFAULT 'patient',
  content TEXT NOT NULL,
  photo_url TEXT,
  rating INTEGER DEFAULT 5,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view approved testimonials" ON public.testimonials FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can insert own testimonial" ON public.testimonials FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. carousel_items
CREATE TABLE IF NOT EXISTS public.carousel_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  link_url TEXT,
  order_position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.carousel_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active carousel items" ON public.carousel_items FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage carousel items" ON public.carousel_items FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. vector_icons
CREATE TABLE IF NOT EXISTS public.vector_icons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT NOT NULL,
  specialty TEXT,
  order_position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vector_icons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active vector icons" ON public.vector_icons FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage vector icons" ON public.vector_icons FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. messages (simple messages table)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own received messages" ON public.messages FOR UPDATE USING (auth.uid() = recipient_id);
CREATE POLICY "Admins can manage all messages" ON public.messages FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 7. professionals (simplified professionals reference)
CREATE TABLE IF NOT EXISTS public.professionals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  specialty TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active professionals" ON public.professionals FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage professionals" ON public.professionals FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 8. benefit_plans
CREATE TABLE IF NOT EXISTS public.benefit_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.benefit_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active benefit plans" ON public.benefit_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage benefit plans" ON public.benefit_plans FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 9. subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_id UUID REFERENCES public.benefit_plans(id),
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage subscriptions" ON public.subscriptions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 10. tervis_usage
CREATE TABLE IF NOT EXISTS public.tervis_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  query TEXT NOT NULL,
  response TEXT,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tervis_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own usage" ON public.tervis_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own usage" ON public.tervis_usage FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all usage" ON public.tervis_usage FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 11. contract_mirrors
CREATE TABLE IF NOT EXISTS public.contract_mirrors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  contract_type TEXT NOT NULL DEFAULT 'professional',
  contract_content TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0',
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contract_mirrors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active contract mirrors" ON public.contract_mirrors FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage contract mirrors" ON public.contract_mirrors FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON public.countries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_carousel_items_updated_at BEFORE UPDATE ON public.carousel_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vector_icons_updated_at BEFORE UPDATE ON public.vector_icons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON public.professionals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_benefit_plans_updated_at BEFORE UPDATE ON public.benefit_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contract_mirrors_updated_at BEFORE UPDATE ON public.contract_mirrors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for public uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('public', 'public', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Anyone can view public files" ON storage.objects FOR SELECT USING (bucket_id = 'public');
CREATE POLICY "Authenticated users can upload public files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'public' AND auth.role() = 'authenticated');
